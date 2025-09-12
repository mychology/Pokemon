// src/components/PokedexShell.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import usePokemon from "../hooks/usePokemon";

/**
 * PokedexShell component
 * - Left LEDs: loading indicator (simultaneous blink when loading)
 * - Right LEDs: idle ping-pong blink (0->1->2->1...) and chevrons trigger temporary fast blink
 * - Small sprite clipped to orb and sized relative to lens radius
 * - Blue info box split into two columns: ability (left) and stat bars (right)
 * - Two tiny red LEDs on left screen always blink alternately
 * - Uses src/assets/background.png as component background if present
 */

export default function PokedexShell({ initial = 1 }) {
  const [currentId, setCurrentId] = useState(initial);

  const {
    loading,
    error,
    pokemon,
    species,
    images,
    currentImageIndex,
    setCurrentImageIndex,
    types,
    ability,
    stats,
    pagedMoves,
    movesPage,
    setMovesPage,
    totalMovesPages,
    evoChain,
  } = usePokemon(currentId);

  // optional horizontal offset to move chevrons; change to shift left/right
  const CHEVRON_X_OFFSET = 0;

  // assetMap loading
  const [assetMap, setAssetMap] = useState({});
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const modules = import.meta.glob("../assets/*.png");
        const paths = Object.keys(modules);
        const entries = await Promise.all(
          paths.map(async (p) => {
            try {
              const mod = await modules[p]();
              const fname = p.split("/").pop();
              const key = fname.replace(/\.png$/i, "").toLowerCase();
              return [key, mod?.default || mod];
            } catch (err) {
              void err;
              return null;
            }
          })
        );
        const map = {};
        for (const e of entries) if (e && e[0]) map[e[0]] = e[1];
        if (mounted) setAssetMap(map);
      } catch (err) {
        void err;
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const currentImageUrl = useMemo(
    () => (images && images.length ? images[currentImageIndex].url : null),
    [images, currentImageIndex]
  );
  const pokeNumber = pokemon?.id ?? currentId;

  const typeIconUrl = (typeName) => (typeName ? assetMap[typeName.toLowerCase()] : null);

  // small in-game sprite: prefer shiny when current image indicates shiny
  const smallSpriteUrl = useMemo(() => {
    if (!pokemon) return assetMap["placeholder-64"] || "";
    const currKey = images?.[currentImageIndex]?.key || "";
    const wantsShiny = currKey && currKey.toLowerCase().includes("shiny");
    const small = wantsShiny
      ? pokemon.sprites?.front_shiny || pokemon.sprites?.front_default
      : pokemon.sprites?.front_default || pokemon.sprites?.front_shiny;
    return small || images?.[currentImageIndex]?.url || assetMap["placeholder-64"] || "";
  }, [pokemon, images, currentImageIndex, assetMap]);

  // audio placeholder (simple oscillator)
  const audioCtxRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  function playPlaceholderCry() {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.value = 220 + (pokemon?.id || 0) % 200;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setPlaying(true);
    g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    g.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.9);
    setTimeout(() => {
      try {
        o.stop();
      } catch (err) {
        void err;
      }
      setPlaying(false);
    }, 1000);
  }

  // navigation / image interactions
  function gotoPrev() {
    setCurrentId((v) => Math.max(1, v - 1));
  }
  function gotoNext() {
    setCurrentId((v) => v + 1);
  }
  function cycleImage() {
    if (!images || !images.length) return;
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  }

  // D-pad visual press
  const [dpadPressed, setDpadPressed] = useState(false);

// ----------------------------------------------------------------------------
  // LEFT LEDs: idle = rotating slow; loading = simultaneous fast blink
  // ----------------------------------------------------------------------------
  const [leftLedIndex, setLeftLedIndex] = useState(0); // 0..2 rotating for idle
  const [leftAllOn, setLeftAllOn] = useState(false); // toggled during loading
  const leftIntervalRef = useRef(null);

  useEffect(() => {
    // clear previous
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }

    const IDLE_MS = 800;
    const LOADING_MS = 160;

    if (loading) {
      // during loading: toggle all-on state at LOADING_MS (simultaneous blink)
      setLeftAllOn(true); // immediate on to indicate start
      leftIntervalRef.current = window.setInterval(() => {
        setLeftAllOn((prev) => !prev);
      }, LOADING_MS);
    } else {
      // not loading: ensure allOn false and rotate slowly
      setLeftAllOn(false);
      leftIntervalRef.current = window.setInterval(() => {
        setLeftLedIndex((prev) => (prev + 1) % 3);
      }, IDLE_MS);
    }

    return () => {
      if (leftIntervalRef.current) {
        clearInterval(leftIntervalRef.current);
        leftIntervalRef.current = null;
      }
    };
  }, [loading]);

  useEffect(() => {
    return () => {
      if (leftIntervalRef.current) {
        clearInterval(leftIntervalRef.current);
        leftIntervalRef.current = null;
      }
    };
  }, []);

  function leftLedOpacity(i) {
    if (loading) {
      // simultaneous: when leftAllOn true -> fully on; else dim
      return leftAllOn ? 1 : 0.18;
    }
    // idle: only the active index is brighter
    return leftLedIndex === i ? 1 : 0.25;
  }

  // ----------------------------------------------------------------------------
  // RIGHT LEDs: idle ping-pong (0,1,2,1,...) ; chevrons trigger temporary fast blink
  // ----------------------------------------------------------------------------
  const [rightLedIndex, setRightLedIndex] = useState(0); // 0..2
  const [rightForcedFast, setRightForcedFast] = useState(false);
  const rightIntervalRef = useRef(null);
  const rightBlinkRemainingRef = useRef(0);
  const rightForcedMsRef = useRef(160);

  // idle ping-pong sequence and step ref
  const RIGHT_IDLE_SEQ = [0, 1, 2, 1];
  const rightIdleStepRef = useRef(0);

  function startRightFastBlink(times = 6, intervalMs = 160) {
    rightBlinkRemainingRef.current = times;
    rightForcedMsRef.current = intervalMs;
    setRightForcedFast(true);
  }

  function handlePrevMoves() {
    setMovesPage(Math.max(0, movesPage - 1));
    startRightFastBlink(6, 140);
  }
  function handleNextMoves() {
    setMovesPage(Math.min(Math.max(0, totalMovesPages - 1), movesPage + 1));
    startRightFastBlink(6, 140);
  }

  useEffect(() => {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }

    const IDLE_MS = 800;
    const intervalMs = rightForcedFast ? rightForcedMsRef.current : IDLE_MS;

    rightIntervalRef.current = window.setInterval(() => {
      if (rightForcedFast) {
        // forced fast behaviour (chevrons) — advance normally across 0..2
        setRightLedIndex((prev) => {
          const next = (prev + 1) % 3;

          if (rightBlinkRemainingRef.current > 0) {
            rightBlinkRemainingRef.current -= 1;
            if (rightBlinkRemainingRef.current <= 0) {
              setRightForcedFast(false);
            }
          }

          return next;
        });
      } else {
        // idle ping-pong sequence using RIGHT_IDLE_SEQ
        rightIdleStepRef.current = (rightIdleStepRef.current + 1) % RIGHT_IDLE_SEQ.length;
        const nextIndex = RIGHT_IDLE_SEQ[rightIdleStepRef.current];
        setRightLedIndex(nextIndex);
      }
    }, intervalMs);

    return () => {
      if (rightIntervalRef.current) {
        clearInterval(rightIntervalRef.current);
        rightIntervalRef.current = null;
      }
    };
  }, [rightForcedFast]);

  useEffect(() => {
    return () => {
      if (rightIntervalRef.current) {
        clearInterval(rightIntervalRef.current);
        rightIntervalRef.current = null;
      }
    };
  }, []);

  function rightLedOpacity(i) {
    return rightLedIndex === i ? 1 : 0.25;
  }

  // ----------------------------------------------------------------------------
  // left screen frame tiny LEDs (always alternate)
  // ----------------------------------------------------------------------------
  const [leftFrameTopOn, setLeftFrameTopOn] = useState(true);
  useEffect(() => {
    const FRAME_INTERVAL = 600; // ms toggle
    const t = window.setInterval(() => setLeftFrameTopOn((s) => !s), FRAME_INTERVAL);
    return () => clearInterval(t);
  }, []);

  // clickable style
  const clickableStyle = { cursor: "pointer" };

  // ----------------------------------------------------------------------------
  // Stats: compute a cap for bar scaling
  // ----------------------------------------------------------------------------
  const statValues = useMemo(() => (stats ? stats.map((s) => s.value ?? s.base_stat ?? 0) : []), [stats]);
  const maxStat = useMemo(() => {
    const maxFound = statValues.length ? Math.max(...statValues) : 100;
    // use at least 100 and at most 255 as a sensible cap
    return Math.max(100, Math.min(255, maxFound));
  }, [statValues]);

  // lens parameters (orb)
  const ORB_CX = 80;
  const ORB_CY = 118;
  const ORB_R = 50; // lens radius
  // sprite scale relative to lens (0.0..1.0 of diameter)
  const SPRITE_SCALE = 0.9;
  const spriteSide = ORB_R * 2 * SPRITE_SCALE; // width/height in px

  return (
    <div
      className="w-[1015px] h-[680px] select-none"
      style={{
        fontFamily: "'Gameboy', monospace",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <svg viewBox="0 0 1015 700" width="1015" height="700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* colors / filters */}
          <linearGradient id="gRedA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#b90e0e" />
            <stop offset="40%" stopColor="#c81a1a" />
            <stop offset="100%" stopColor="#5f0000" />
          </linearGradient>
          <linearGradient id="gRedB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d11c1c" />
            <stop offset="60%" stopColor="#b31313" />
            <stop offset="100%" stopColor="#6a0202" />
          </linearGradient>
          <linearGradient id="orbGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#c8f6ff" />
            <stop offset="40%" stopColor="#74e5ff" />
            <stop offset="100%" stopColor="#2aa6df" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f3f6f8" />
            <stop offset="100%" stopColor="#e7ebee" />
          </linearGradient>
          <linearGradient id="greenBox" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7ff971" />
            <stop offset="100%" stopColor="#46ce35" />
          </linearGradient>
          <linearGradient id="blueBox" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4aa1ff" />
            <stop offset="100%" stopColor="#063fc0" />
          </linearGradient>
          <linearGradient id="yellowBtn" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd550" />
            <stop offset="100%" stopColor="#f6a800" />
          </linearGradient>

          <filter id="shadowBig" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
          </filter>

          {/* clip path for orb lens */}
          <clipPath id="orbClip">
            <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} />
          </clipPath>
        </defs>

        {/* Outer shell */}
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="635">
  <defs>
    <linearGradient id="gradStroke" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8b0000" />
      <stop offset="100%" stop-color="#390101" />
    </linearGradient>
  </defs>

  <path 
    d="
      M32,40
      Q6,40 6,66          
      L6,584
      Q6,615 32,615       
      L486,615            
      L486,40             
      Z
    " 
    fill="#8b0000" 
    stroke="none"
  />

  <path 
    d="
      M32,40
      Q6,40 6,66        
      L6,584
      Q6,615 32,615       
      L486,615           
      L486,615           
      L486,40            
      L32,40              
    " 
    fill="none" 
    stroke="url(#gradStroke)" 
    stroke-width="8" 
    stroke-linejoin="miter"
  />
</svg>




        {/* Inner panels */}
<g>
  <path
    d="
      M488,120
      L348,120
      C311,120 291,128 255,160
      C231,180 181,202 151,202
      L11,202
      L11,588                   
      Q11,614 37,614            
      L488,614
      L488,120
      Z
    "
    fill="url(#gRedB)"
    stroke="#4d0000"
    stroke-width="3"
  />

  <path
    d="
      M488,120
      L348,120
      C311,120 291,128 255,160
      C231,180 181,202 151,202
      L11,202
    "
    fill="none"
    stroke="#4d0000"
    stroke-width="4"
  />
</g>

<g>
  <path
    d="
      M542,120
      L685,120
      C722,120 742,128 778,160
      C802,180 852,202 882,202
      L948,202
      Q988,202 988,242      
      L988,574
      Q988,614 948,614        
      L542,614
      L542,120
      Z
    "
    fill="url(#gRedB)"
    stroke="#4d0000"
    stroke-width="3"
  />

  <path
    d="
      M542,120
      L685,120
      C722,120 742,128 778,160
      C802,180 852,202 882,202
      L948,202
      Q988,202 988,242      
      L988,574
      Q988,614 948,614        
      L542,614
    "
    fill="none"
    stroke="#4d0000"
    stroke-width="4"
  />

  <path
    d="
      M948,614
      L542,614
    "
    fill="none"
    stroke="#4d0000"
    stroke-width="4"
  />
</g>


        {/* hinge */}
        <g>
          <rect x="490" y="37" width="50" height="580.5"  fill="#7b0a0a" stroke="#3f0000" strokeWidth="3" />
          <rect x="491.5" y="84" width="47" height="34" fill="#980d0d" />
          <rect x="491.5" y="170" width="47" height="34"  fill="#980d0d" />
          <rect x="491.5" y="450" width="47" height="34"  fill="#980d0d" />
          <rect x="491.5" y="536" width="47" height="34" fill="#980d0d" />
        </g>

        {/* LEFT orb + LEDs (LEDs positions preserved) */}
        <g>
          <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} fill="url(#orbGrad)" stroke="#46bfe1" strokeWidth="3" filter="url(#shadowBig)" />
          {/* left LEDs: red, yellow, green */}
          <circle
            cx="135"
            cy="58"
            r="8"
            fill="#ff6b6b"
            stroke="#8a0000"
            strokeWidth="0.8"
            style={{ opacity: leftLedOpacity(0), transition: "opacity 120ms linear" }}
          />
          <circle
            cx="168"
            cy="58"
            r="8"
            fill="#ffd86b"
            stroke="#8a0000"
            strokeWidth="0.8"
            style={{ opacity: leftLedOpacity(1), transition: "opacity 120ms linear" }}
          />
          <circle
            cx="205"
            cy="58"
            r="8"
            fill="#06a346"
            stroke="#044a22"
            strokeWidth="0.8"
            style={{ opacity: leftLedOpacity(2), transition: "opacity 120ms linear" }}
          />
        </g>

        {/* LEFT screen frame */}
        <g>
          <rect x="72" y="215" rx="80" ry="18" width="360" height="239" fill="#bdbdbd" stroke="#8a8a8a" strokeWidth="3" />
          <rect x="94" y="238" rx="14" ry="14" width="316" height="178" fill="url(#screenGrad)" stroke="#111" strokeWidth="3" />
          {/* two small red leds on the frame - always alternate */}
          <circle
            cx="236"
            cy="227"
            r="5"
            fill="#ff9b9b"
            stroke="#8b0000"
            style={{ opacity: leftFrameTopOn ? 1 : 0.2, transition: "opacity 120ms linear" }}
          />
          <circle
            cx="262"
            cy="227"
            r="5"
            fill="#ff9b9b"
            stroke="#8b0000"
            style={{ opacity: leftFrameTopOn ? 0.2 : 1, transition: "opacity 120ms linear" }}
          />
          <circle cx="110" cy="434" r="8" fill="#8f1a1a" stroke="#4a0000" strokeWidth="3" filter="url(#shadowBig)" />
          <g transform="translate(330,318)">
            <rect x="-10" y="106" width="32" height="4" rx="2" fill="#444" />
            <rect x="-10" y="114" width="32" height="4" rx="2" fill="#444" />
            <rect x="-10" y="122" width="32" height="4" rx="2" fill="#444" />
          </g>
          <g transform="translate(356,318)">
            <rect x="2" y="106" width="32" height="4" rx="2" fill="#444" />
            <rect x="2" y="114" width="32" height="4" rx="2" fill="#444" />
            <rect x="2" y="122" width="32" height="4" rx="2" fill="#444" />
          </g>
        </g>

        {/* LEFT lower controls */}
        <g>
          <circle cx="108" cy="495" r="28" fill="#2b66ff" stroke="#002a6a" strokeWidth="3" filter="url(#shadowBig)" />
          <rect x="167" y="483" rx="3" width="74" height="26" fill="#12b23f" stroke="#0a6b1f" />
          <rect x="255" y="483" rx="3" width="74" height="26" fill="#ff8a3f" stroke="#a84a15" />
          <g transform="translate(328,420)">
            <rect x="54" y="48" width="26" height="58" rx="6" fill="#111" />
            <rect x="38" y="64" width="58" height="26" rx="6" fill="#111" />
          </g>
          <rect x="172" y="530" rx="14" width="150" height="66" fill="#046f62" />
          <rect x="202" y="540" rx="10" width="96" height="46" fill="#eef6f8" />
        </g>

        {/* RIGHT top green and blue boxes */}
        <g>
          <rect x="602" y="120" rx="12" width="334" height="132" fill="url(#greenBox)" stroke="#2a8f2a" strokeWidth="4" />
          <rect x="612" y="130" rx="8" width="314" height="112" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.20" />
        </g>
        <g>
          <rect x="630" y="266" rx="12" width="280" height="120" fill="url(#blueBox)" stroke="#042a8a" strokeWidth="4" filter="url(#shadowBig)" />
          <rect x="640" y="275" rx="8" width="260" height="102" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.20" />
        </g>

        {/* RIGHT small indicators, chevrons, pills, play */}
        <g>
          <circle cx="640" cy="408" r="6" fill="#06a346" style={{ opacity: rightLedOpacity(0), transition: "opacity 120ms linear" }} />
          <circle cx="660" cy="408" r="6" fill="#ffd86b" style={{ opacity: rightLedOpacity(1), transition: "opacity 120ms linear" }} />
          <circle cx="680" cy="408" r="6" fill="#ffc43b" style={{ opacity: rightLedOpacity(2), transition: "opacity 120ms linear" }} />

          <rect x="690" y="398" rx="12" width="74" height="20" fill="#16a34a" />
          <rect x="780" y="398" rx="12" width="74" height="20" fill="#ff8a3f" />

          <rect x={605 + CHEVRON_X_OFFSET} y="436" rx="8" width="28" height="28" fill="#cfcfcf" stroke="#6a6a6a" />
          <text x={616 + CHEVRON_X_OFFSET} y="456" fontSize="16" fill="#6a2a2a" fontFamily="sans-serif">◀</text>

          <rect x={633 + CHEVRON_X_OFFSET} y="436" rx="8" width="28" height="28" fill="#cfcfcf" stroke="#6a6a6a" />
          <text x={642 + CHEVRON_X_OFFSET} y="456" fontSize="16" fill="#6a2a2a" fontFamily="sans-serif">▶</text>

          <circle cx="880" cy="448" r="14" fill="#ffc43b" stroke="#a86a00" strokeWidth="3" />
        </g>

        {/* === interactive SVG elements === */}

        {/* small sprite inside orb lens: sized relative to lens radius and clipped */}
        <image
          href={smallSpriteUrl}
          x={ORB_CX - spriteSide / 2}
          y={ORB_CY - spriteSide / 2}
          width={spriteSide}
          height={spriteSide}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#orbClip)"
          style={{ imageRendering: "pixelated" }}
        />

        {/* main artwork */}
        <image
          href={currentImageUrl || assetMap["placeholder-200"] || ""}
          x={86}
          y={212}
          width={316}
          height={206}
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: "none" }}
        />

        {/* cry button (transparent) */}
        <g>
          <circle
            cx="110"
            cy="424"
            r="16"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              playPlaceholderCry();
            }}
            style={clickableStyle}
          />
        </g>

        {/* speaker bars while playing */}
        <g transform="translate(330,318)" pointerEvents="none" aria-hidden>
          {playing ? (
            <g>
            <rect x="-10" y="106" width="32" height="4" rx="2" fill="#111" />
            <rect x="-10" y="114" width="32" height="4" rx="2" fill="#111" />
            <rect x="-10" y="122" width="32" height="4" rx="2" fill="#111" />
            <rect x="28" y="106" width="32" height="4" rx="2" fill="#111" />
            <rect x="28" y="114" width="32" height="4" rx="2" fill="#111" />
            <rect x="28" y="122" width="32" height="4" rx="2" fill="#111" />
        {/* blue button (cycle image) interactive area */}
            </g>
          ) : null}
        </g>

        <g>
          <circle
            cx="108"
            cy="495"
            r="28"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              cycleImage();
            }}
            style={clickableStyle}
          />
        </g>

        {/* Type icons (foreignObject) */}
        <foreignObject x="170" y="480" width="200" height="32">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: "flex", gap: 20, alignItems: "center", height: "100%" }}>
            {types?.slice(0, 2).map((t) => {
              const url = typeIconUrl(t.name);
              return url ? (
                <img
                  key={t.name}
                  src={url}
                  alt={t.name}
                  title={t.name}
                  style={{
                    display: "block",
                    width: 68,
                    height: 22,
                    imageRendering: "pixelated",
                  }}
                />
              ) : (
                <div key={t.name} className="gameboy-font" style={{ fontSize: 12, textTransform: "capitalize" }}>
                  {t.name}
                </div>
              );
            }) ?? null}
          </div>
        </foreignObject>

        {/* D-pad interactive rects */}
        <g transform="translate(328,420)">
          <rect
            x="38"
            y="64"
            width="18"
            height="26"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              gotoPrev();
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />
          <g transform={`translate(-8,0) scale(${dpadPressed ? 0.95 : 1})`}>
            <rect x="65" y="66.5" width="20" height="20" rx="6" fill="#00000088" />
            <rect x="68" y="69.5" width="14" height="14" rx="6" fill="#222" />
          </g>
          <rect
            x="78"
            y="64"
            width="18"
            height="26"
            rx="4"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              gotoNext();
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />
        </g>

        {/* teal module text (registered number) */}
        <g transform="translate(222,520)">
          <text x="6" y="48" className="gameboy-font" style={{ fontSize: 14 }}>
            #{String(pokeNumber).padStart(3, "0")}
          </text>
        </g>

        {/* RIGHT green species box (same as before) */}
        <foreignObject x="617" y="140" width="314" height="112">
          <div xmlns="http://www.w3.org/1999/xhtml" className="gameboy-font" style={{ color: "#000", fontSize: 12, padding: 6 }}>
            <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
              {species?.genera?.find((g) => g.language.name === "en")?.genus ?? species?.name ?? ""}
            </div>
            <div style={{ marginTop: 6, fontSize: 11, lineHeight: 1.05 }}>
              {species?.flavor_text_entries?.find((f) => f.language.name === "en")?.flavor_text?.replace(/\n|\f/g, " ") ?? "No data."}
            </div>
          </div>
        </foreignObject>

        {/* RIGHT blue box: two columns: ability (left), stat bars (right) */}
        <foreignObject x="640" y="275" width="260" height="102">
          <div xmlns="http://www.w3.org/1999/xhtml" className="gameboy-font" style={{ color: "#fff", fontSize: 6, padding: 8, display: "flex", gap: 8 }}>
            {/* left column: ability */}
            <div style={{ width: "48%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontWeight: 700, textAlign: "center" }}>ABILITY</div>
              <div style={{ textTransform: "capitalize", fontWeight: 700 }}>
                {ability?.name ?? (pokemon?.abilities?.[0]?.ability?.name ?? "—")}
              </div>
              <div style={{ fontSize: 6, lineHeight: 1.2 }}>
                {ability?.short_effect ??
                  ability?.effect_entries?.find((e) => e.language.name === "en")?.short_effect ??
                  pokemon?.abilities?.[0]?.ability?.name ??
                  "No description."}
              </div>
            </div>

            {/* right column: stats as bars */}
            <div style={{ width: "70%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontWeight: 700, textAlign: "center" }}>STATS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {stats?.map((s) => {
                  const value = s.value ?? s.base_stat ?? 0;
                  const pct = Math.round((value / maxStat) * 100);
                  return (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <div style={{ width: 52, fontSize: 5, textTransform: "capitalize" }}>{s.name}</div>
                      <div style={{ flex: 1, height: 10, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "60%",
                            borderRadius: 6,
                            background: "#7ff971",
                            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)",
                          }}
                        />
                      </div>
                      <div style={{ width: 28, textAlign: "right", fontSize: 6 }}>{value}</div>
                    </div>
                  );
                }) ?? <div style={{ fontSize: 6 }}>—</div>}
              </div>
            </div>
          </div>
        </foreignObject>

        {/* invisible clickable chevrons on top of visuals (so right LEDs fast blink is triggered by these) */}
        <rect
          x={605 + CHEVRON_X_OFFSET}
          y="436"
          rx="8"
          width="28"
          height="28"
          fill="transparent"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevMoves();
          }}
          style={clickableStyle}
        />
        <rect
          x={633 + CHEVRON_X_OFFSET}
          y="436"
          rx="8"
          width="28"
          height="28"
          fill="transparent"
          onClick={(e) => {
            e.stopPropagation();
            handleNextMoves();
          }}
          style={clickableStyle}
        />

        {/* move pills */}
        <foreignObject x="698" y="403" width="150" height="56">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: "flex", flexDirection: "row", gap: 38, padding: 2 }}>
            {(pagedMoves && pagedMoves.length > 0) ? pagedMoves.map((m) => (
              <div
                key={m.name}
                className="gameboy-font"
                style={{
                  fontWeight: 700,
                  borderRadius: 12,
                  width: 140,                    // fixed pill width
                  whiteSpace: "nowrap",
                  fontSize: 5,
                  display: "flex",            // CENTERING HAPPENS HERE
                    alignItems: "center",       // vertical center
                    justifyContent: "center",   // horizontal center
                }}
                title={m.name.replace("-", " ")}    // shows full move on hover
              >
                {m.name.replace("-", " ")}
              </div>
            )) : <div className="gameboy-font">—</div> }
          </div>
        </foreignObject>

        {/* evolutions */}
        <g transform="translate(645,490)">
          {[0, 1, 2].map((i) => {
            const evo = evoChain[i];
            return (
              <g key={i} transform={`translate(${i * 92},0)`}>
                <rect x="-4" y="0" width="85" height="80" rx="8" fill="#f5c400" stroke="#b78e00" />
                {evo ? (
                  <>
                    <image href={evo.sprite || assetMap["placeholder-64"] || ""} x="20" y="10" width="40" height="40" preserveAspectRatio="xMidYMid meet" />
                    <text x="40" y="64" fontSize="8" textAnchor="middle" className="gameboy-font" style={{ textTransform: "capitalize" }}>
                      {evo.name}
                    </text>
                  </>
                ) : (
                  <text x="40" y="44" fontSize="8" textAnchor="middle" className="gameboy-font">No Evo</text>
                )}
              </g>
            );
          })}
        </g>

        {/* bottom status */}
        <text x="507.5" y="650" textAnchor="middle" fontSize="12" className="gameboy-font">
          {loading ? "LOADING POKEMON..." : error ? "ERROR" : ""}
        </text>
      </svg>
    </div>
  );
}
