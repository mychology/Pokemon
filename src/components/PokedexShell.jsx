// src/components/PokedexShell.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import usePokemon from "../hooks/usePokemon";
import SizeComparison from "./SizeComparison";
import HeldItems from "./HeldItems";

/**
 * PokedexShell component
 *
 * - Blue circular button (left lower): toggle shiny for currently displayed form
 * - Mega button: cycle mega variants (supports multiple megas; returns to base after last)
 * - Other-forms button: cycle other non-mega, non-shiny forms (returns to base)
 * - Up/Down d-pad: iterate through pokemon-form endpoints (skip shiny)
 * - Orange chevron circle (right panel): RESET / clear current entry
 *
 * NOTE: layout intentionally preserved from your original file.
 */

export default function PokedexShell({ initial = 1 }) {
  const [currentId, setCurrentId] = useState(initial);

  const {
    loading,
    error,
    pokemon,
    species,
    images = [],
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
    megaVariants,
    otherForms,
    imageIndexByName,
    heldItemsDetails,
    // NOTE: forms and clear are provided by the updated hook
    forms: formsList = [],
    clear: clearPokemonState,
    cryUrl,
  } = usePokemon(currentId);

  // chevron tweak
  const CHEVRON_X_OFFSET = 0;

  // load local assets (icons / UI images)
  const [assetMap, setAssetMap] = useState({});
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const modules = import.meta.glob("../assets/*.*");
        const paths = Object.keys(modules);
        const entries = await Promise.all(
          paths.map(async (p) => {
            try {
              const mod = await modules[p]();
              const fname = p.split("/").pop();
              const key = fname.replace(/\.[^/.]+$/, "").toLowerCase();
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

  // Frame for main artwork (clipping)
  const FRAME_X = 94;
  const FRAME_Y = 238;
  const FRAME_W = 316;
  const FRAME_H = 178;

  // lens/orb params
  const ORB_CX = 80;
  const ORB_CY = 118;
  const ORB_R = 50;
  const SPRITE_SCALE = 0.9;
  const spriteSide = ORB_R * 1.8 * SPRITE_SCALE;

  // convenience values
  const pokeNumber = pokemon?.id ?? currentId;

  // compute display number & responsive font size for the teal box
  const displayNumber = `#${String(pokeNumber).padStart(3, "0")}`;
  // keep font reasonably sized for 1-5+ characters
  const numberLength = displayNumber.length;
  let numberFontSize = 12;
  if (numberLength >= 6) numberFontSize = 10;
  else if (numberLength === 5) numberFontSize = 12;
  else if (numberLength === 4) numberFontSize = 12;


  const typeIconUrl = (typeName) => (typeName ? assetMap[typeName.toLowerCase()] : null);

  // derive current image url and small sprite (artwork) - used for main frame
  const currentImageUrl = useMemo(
    () => (images && images.length ? images[currentImageIndex]?.url || null : null),
    [images, currentImageIndex]
  );

  // previous small-sprite behavior preserved as fallback
  const smallSpriteUrl = useMemo(() => {
    if (!images || images.length === 0) return pokemon?.sprites?.front_default || assetMap["placeholder-64"] || "";
    const entry = images[currentImageIndex] || {};
    return entry.sprite || entry.url || pokemon?.sprites?.front_default || assetMap["placeholder-64"] || "";
  }, [images, currentImageIndex, pokemon, assetMap]);

  // Orb (lens) sprite — we still detect available Gen5 BW gif or showdown fallback
  const [orbUrlPrimary, setOrbUrlPrimary] = useState(null);
  const [orbUrlShiny, setOrbUrlShiny] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function findOrbUrls() {
      setOrbUrlPrimary(null);
      setOrbUrlShiny(null);
      if (!pokemon?.id) return;

      const id = String(pokemon.id);
      const candidates = [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
      ];
      const candidatesShiny = [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`,
      ];

      async function testUrl(url) {
        try {
          const r = await fetch(url, { method: "GET" });
          return r.ok;
        } catch (err) {
          void err;
          return false;
        }
      }

      for (const u of candidates) {
        const ok = await testUrl(u);
        if (!mounted) return;
        if (ok) {
          setOrbUrlPrimary(u);
          break;
        }
      }
      for (const u of candidatesShiny) {
        const ok = await testUrl(u);
        if (!mounted) return;
        if (ok) {
          setOrbUrlShiny(u);
          break;
        }
      }

      if (!orbUrlPrimary && smallSpriteUrl) {
        setOrbUrlPrimary(smallSpriteUrl);
      }
      if (!orbUrlShiny) {
        setOrbUrlShiny(null);
      }
    }
    findOrbUrls();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon?.id, smallSpriteUrl]);

  // UI: determine whether current displayed image is shiny / mega / other
  const currLabelRaw = (images?.[currentImageIndex]?.label ?? pokemon?.name ?? "").toString();
  const currLabelLower = currLabelRaw.toLowerCase();
  const currLabelClean = currLabelLower.replace(/\s*\(shiny\)\s*$/, "").trim();
  const isShiny = /\(shiny\)/.test(currLabelLower);
  const isMega = (function () {
    if (Array.isArray(megaVariants) && megaVariants.length) {
      return megaVariants.some((m) => {
        if (!m) return false;
        return m === currLabelLower || currLabelLower.includes(m);
      });
    }
    return /\bmega\b/.test(currLabelClean);
  })();
  const isOtherForm = (function () {
    if (Array.isArray(otherForms) && otherForms.length) {
      return otherForms.some((o) => o === currLabelClean);
    }
    const base = (pokemon?.name || "").toLowerCase();
    return !!(currLabelClean && currLabelClean !== base && !/\bmega\b/.test(currLabelClean));
  })();

  // audio placeholder (cry)
  const audioElRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function playCry() {
    if (audioElRef.current) {
      try {
        audioElRef.current.pause();
        audioElRef.current.currentTime = 0;
      } catch (e) {
        void e;
      }
      audioElRef.current = null;
    }

    if (cryUrl) {
      const a = new Audio(cryUrl);
      a.preload = "auto";
      a.volume = 0.9;
      audioElRef.current = a;
      setPlaying(true);
      a.play().catch((err) => {
        console.warn("Cry playback failed, falling back to oscillator:", err);
        playPlaceholderOscillator();
      });
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      return;
    }
    playPlaceholderOscillator();
  }

  const audioCtxRef = useRef(null);
  function playPlaceholderOscillator() {
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

  // --- NEW: Type filter state & helpers ---
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null); // e.g. "fairy"
  const [filteredList, setFilteredList] = useState(null); // array of pokemon names when a filter is active
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  // derive available filter types from assets (expects filter-[type].svg naming)
  const availableFilterTypes = useMemo(() => {
    return Object.keys(assetMap)
      .filter((k) => k.startsWith("filter-"))
      .map((k) => k.replace(/^filter-/, ""));
  }, [assetMap]);

  // helper to fetch pokemons for a type from PokeAPI and set filteredList
  async function applyTypeFilter(typeName) {
    if (!typeName) return;
    setFilterLoading(true);
    setFilterError(null);
    try {
      const r = await fetch(`https://pokeapi.co/api/v2/type/${typeName.toLowerCase()}`);
      if (!r.ok) throw new Error("Failed to fetch type list");
      const data = await r.json();
      const names = (data.pokemon || []).map((p) => p.pokemon.name).filter(Boolean);
      setFilteredList(names);
      setActiveFilterType(typeName.toLowerCase());
      setShowFilterPopup(false);
      // if current pokemon not in new filtered list, jump to first item
      const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
      if (!names.includes(currName) && names.length) {
        setCurrentId(names[0]);
      }
    } catch (err) {
      console.error("Type filter error:", err);
      setFilterError("Failed to load filter list");
    } finally {
      setFilterLoading(false);
    }
  }

  function clearTypeFilter() {
    setActiveFilterType(null);
    setFilteredList(null);
    setFilterError(null);
    setShowFilterPopup(false);
  }

  // navigation (prev/next pokemon) must use pokemon.id when available
  // Updated to respect active type filter: if filteredList present, move within that list by name
  function gotoPrev() {
    if (activeFilterType && Array.isArray(filteredList) && filteredList.length) {
      const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
      const idx = Math.max(0, filteredList.findIndex((n) => n === currName));
      const prevIdx = (idx - 1 + filteredList.length) % filteredList.length;
      setCurrentId(String(filteredList[prevIdx]));
      return;
    }
    const baseId = Number(pokemon?.id ?? currentId);
    const target = Number.isFinite(baseId) ? Math.max(1, baseId - 1) : 1;
    setCurrentId(String(target));
  }
  function gotoNext() {
    if (activeFilterType && Array.isArray(filteredList) && filteredList.length) {
      const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
      const idx = Math.max(0, filteredList.findIndex((n) => n === currName));
      const nextIdx = (idx + 1) % filteredList.length;
      setCurrentId(String(filteredList[nextIdx]));
      return;
    }
    const baseId = Number(pokemon?.id ?? currentId);
    const target = Number.isFinite(baseId) ? baseId + 1 : 1;
    setCurrentId(String(target));
  }

  // D-pad visual press
  const [dpadPressed, setDpadPressed] = useState(false);

  // LED logic unchanged (left/right / frame)
  const [leftLedIndex, setLeftLedIndex] = useState(0);
  const [leftAllOn, setLeftAllOn] = useState(false);
  const leftIntervalRef = useRef(null);
  useEffect(() => {
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    const IDLE_MS = 800;
    const LOADING_MS = 160;
    if (loading) {
      setLeftAllOn(true);
      leftIntervalRef.current = window.setInterval(() => setLeftAllOn((p) => !p), LOADING_MS);
    } else {
      setLeftAllOn(false);
      leftIntervalRef.current = window.setInterval(() => setLeftLedIndex((p) => (p + 1) % 3), IDLE_MS);
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
    if (loading) return leftAllOn ? 1 : 0.18;
    return leftLedIndex === i ? 1 : 0.25;
  }

  const [rightLedIndex, setRightLedIndex] = useState(0);
  const [rightForcedFast, setRightForcedFast] = useState(false);
  const rightIntervalRef = useRef(null);
  const rightBlinkRemainingRef = useRef(0);
  const rightForcedMsRef = useRef(160);
  const RIGHT_IDLE_SEQ = useRef([0, 1, 2, 1]);
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
        setRightLedIndex((prev) => {
          const next = (prev + 1) % 3;
          if (rightBlinkRemainingRef.current > 0) {
            rightBlinkRemainingRef.current -= 1;
            if (rightBlinkRemainingRef.current <= 0) setRightForcedFast(false);
          }
          return next;
        });
      } else {
        rightIdleStepRef.current = (rightIdleStepRef.current + 1) % RIGHT_IDLE_SEQ.current.length;
        const nextIndex = RIGHT_IDLE_SEQ.current[rightIdleStepRef.current];
        setRightLedIndex(nextIndex);
      }
    }, intervalMs);
    return () => {
      if (rightIntervalRef.current) {
        clearInterval(rightIntervalRef.current);
        rightIntervalRef.current = null;
      }
    };
  }, [rightForcedFast, totalMovesPages, movesPage]);
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

  // left frame tiny LEDs
  const [leftFrameTopOn, setLeftFrameTopOn] = useState(true);
  useEffect(() => {
    const FRAME_INTERVAL = 300;
    const t = window.setInterval(() => setLeftFrameTopOn((s) => !s), FRAME_INTERVAL);
    return () => clearInterval(t);
  }, []);

  // stats cap
  const statValues = useMemo(() => (stats ? stats.map((s) => s.value ?? s.base_stat ?? 0) : []), [stats]);
  const maxStat = useMemo(() => {
    const maxFound = statValues.length ? Math.max(...statValues) : 100;
    return Math.max(100, Math.min(255, maxFound));
  }, [statValues]);

  // --- Name edit / search UI ---
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  useEffect(() => {
    const label = images?.[currentImageIndex]?.label ?? pokemon?.name ?? "";
    setNameInput(label);
  }, [images, currentImageIndex, pokemon]);

  function sanitizeSearchValue(v) {
    if (v == null) return "";
    const t = String(v).trim();
    if (t === "") return "";
    if (/^\d+$/.test(t)) return t;
    return t.toLowerCase().replace(/\s+/g, "-");
  }
  function submitNameSearch(val) {
    const v = sanitizeSearchValue(val);
    setEditingName(false);
    if (!v) return;
    setCurrentId(v);
  }

  function formatDisplayName(rawLabel) {
    if (!rawLabel) return "—";
    const label = String(rawLabel);
    const cleaned = label.replace(/\s*\(shiny\)\s*$/i, "").trim();
    const tokens = cleaned.split(/[-_\s]+/).filter(Boolean);
    const lower = tokens.map((t) => t.toLowerCase());
    if (lower.includes("mega")) {
      const baseTokens = tokens.filter((t) => t.toLowerCase() !== "mega" && !["x", "y", "z"].includes(t.toLowerCase()));
      const extras = tokens.filter((t) => ["x", "y", "z"].includes(t.toLowerCase()));
      const base = baseTokens.join(" ").toUpperCase();
      if (extras.length) return `${base} - MEGA ${extras.join(" ").toUpperCase()}`;
      return `MEGA ${base}`;
    }
    if (tokens.length > 1) {
      const base = tokens[0].toUpperCase();
      const suffix = tokens.slice(1).join(" ").toUpperCase();
      const addForm = /origin|forme|altered|east|west|galar|alola|hisui/i.test(suffix) ? " FORME" : "";
      return `${base} - ${suffix}${addForm}`;
    }
    return tokens[0].toUpperCase();
  }

  // --- Helper to find image index preferring non-shiny first ---
  function findBestIndexFor(labelLower) {
    if (!labelLower || !images || !images.length) return null;
    const cleaned = String(labelLower).toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();

    // 1) find exact non-shiny image with cleaned label
    for (let i = 0; i < images.length; i++) {
      const lbl = String(images[i]?.label || "").toLowerCase();
      const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
      if (cl === cleaned && !/\(shiny\)/.test(lbl)) return i;
    }

    // 2) if mapping exists, try direct map (imageIndexByName)
    if (imageIndexByName && imageIndexByName[labelLower] != null) return imageIndexByName[labelLower];

    // 3) find any image whose cleaned label matches (could be shiny)
    for (let i = 0; i < images.length; i++) {
      const lbl = String(images[i]?.label || "").toLowerCase();
      const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
      if (cl === cleaned) return i;
    }

    return null;
  }

  // --- Form / mega / shiny handlers ---
  function toggleShiny() {
    if (!images || images.length === 0 || !imageIndexByName) return;
    const currKey = (images[currentImageIndex]?.label ?? "").toString().toLowerCase();
    const cleaned = currKey.replace(/\s*\(shiny\)\s*$/, "").trim();

    if (/\(shiny\)/.test(currKey)) {
      const nonIdx = findBestIndexFor(cleaned);
      if (nonIdx != null) setCurrentImageIndex(nonIdx);
      return;
    }

    const shinyKey = `${cleaned} (shiny)`.trim();
    if (imageIndexByName && imageIndexByName[shinyKey] != null) {
      setCurrentImageIndex(imageIndexByName[shinyKey]);
      return;
    }
    for (let i = 0; i < images.length; i++) {
      const lbl = String(images[i]?.label || "").toLowerCase();
      const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
      if (cl === cleaned && /\(shiny\)/.test(lbl)) {
        setCurrentImageIndex(i);
        return;
      }
    }

    // If no shiny image available, rely on orbUrlShiny if available (the orb will update)
  }

  function toggleMega() {
    if (!images || images.length === 0 || !imageIndexByName) return;
    if (!Array.isArray(megaVariants) || megaVariants.length === 0) return;

    const baseKey = (pokemon?.name || "").toLowerCase();
    const curr = (images?.[currentImageIndex]?.label ?? baseKey).toString().toLowerCase();
    const megas = Array.from(new Set(megaVariants.map((m) => (m || "").toLowerCase())));

    const currPos = megas.findIndex((m) => curr === m || curr.includes(m));
    if (currPos !== -1) {
      const nextPos = currPos + 1;
      if (nextPos < megas.length) {
        const target = megas[nextPos];
        const idx = findBestIndexFor(target);
        if (idx != null) {
          setCurrentImageIndex(idx);
          return;
        }
      }
      const baseIdx = findBestIndexFor(baseKey);
      setCurrentImageIndex(baseIdx != null ? baseIdx : 0);
      return;
    }

    const firstMega = megas[0];
    const firstIdx = findBestIndexFor(firstMega);
    if (firstIdx != null) setCurrentImageIndex(firstIdx);
  }

  function cycleOtherFormsUI() {
    if (!images || images.length === 0 || !imageIndexByName) return;
    const base = (pokemon?.name || "").toLowerCase();
    const others = Array.isArray(otherForms) ? otherForms.map((s) => (s || "").toLowerCase()) : [];
    const forms = [base, ...others.filter((o) => o && o !== base)];
    const curr = (images?.[currentImageIndex]?.label ?? pokemon?.name ?? "").toLowerCase();
    const cleaned = curr.replace(/\s*\(shiny\)\s*$/, "").trim();
    let pos = forms.indexOf(cleaned);
    if (pos === -1) pos = 0;
    pos = (pos + 1) % forms.length;
    const target = forms[pos];
    const idx = findBestIndexFor(target);
    if (idx != null) setCurrentImageIndex(idx);
  }

  // evolutions clickable
  function gotoEvolution(evo) {
    if (!evo) return;
    if (evo.id) setCurrentId(evo.id);
    else if (evo.name) setCurrentId(String(evo.name).toLowerCase());
  }

  // --- UP / DOWN D-PAD: iterate pokemon-form endpoints (skip shiny) ---
  const [formIndex, setFormIndex] = useState(0);
  useEffect(() => {
    if (!formsList || !formsList.length || !images || !images.length) {
      setFormIndex(0);
      return;
    }
    const curr = (images?.[currentImageIndex]?.label ?? pokemon?.name ?? "").toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();
    const idx = formsList.findIndex((f) => {
      if (!f || !f.name) return false;
      return f.name.toLowerCase() === curr || f.name.toLowerCase().replace(/-/g, " ") === curr;
    });
    setFormIndex(idx >= 0 ? idx : 0);
  }, [formsList, images, currentImageIndex, pokemon?.name]);

  async function nextForm() {
    if (!formsList || !formsList.length) return;
    const next = (formIndex + 1) % formsList.length;
    setFormIndex(next);
    const formName = String(formsList[next]?.name || "").toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();
    const idx = findBestIndexFor(formName);
    if (idx != null) {
      setCurrentImageIndex(idx);
      return;
    }
    try {
      // fetch the pokemon-form endpoint (formsList entries point to /pokemon-form/:id)
      const r = await fetch(formsList[next].url);
      if (r.ok) {
        const formData = await r.json();
        // pokemon-form resource often includes a 'pokemon' object linking to the actual pokemon variant
        const pName = formData.pokemon?.name;
        if (pName) {
          setCurrentId(String(pName));
          return;
        }
        // fallback: sometimes formData has sprites; attempt to use any sprite
        const spriteFromForm = formData.sprites?.front_default || formData.sprites?.front_shiny || null;
        if (spriteFromForm) {
          // add as temporary image or find best match - here we just attempt to set orb by switching currentImageIndex if exists
          const found = images.findIndex((it) => it.url === spriteFromForm || it.sprite === spriteFromForm);
          if (found !== -1) setCurrentImageIndex(found);
        }
      }
    } catch (err) {
      void err;
    }
  }
  async function prevForm() {
    if (!formsList || !formsList.length) return;
    const prev = (formIndex - 1 + formsList.length) % formsList.length;
    setFormIndex(prev);
    const formName = String(formsList[prev]?.name || "").toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();
    const idx = findBestIndexFor(formName);
    if (idx != null) {
      setCurrentImageIndex(idx);
      return;
    }
    try {
      const r = await fetch(formsList[prev].url);
      if (r.ok) {
        const formData = await r.json();
        const pName = formData.pokemon?.name;
        if (pName) {
          setCurrentId(String(pName));
          return;
        }
        const spriteFromForm = formData.sprites?.front_default || formData.sprites?.front_shiny || null;
        if (spriteFromForm) {
          const found = images.findIndex((it) => it.url === spriteFromForm || it.sprite === spriteFromForm);
          if (found !== -1) setCurrentImageIndex(found);
        }
      }
    } catch (err) {
      void err;
    }
  }

  // Reset / clear pokedex entry (orange circle): call clear() from hook and clear currentId
  function handleResetClick() {
    setCurrentId("");
    clearPokemonState && clearPokemonState();
  }

  // assets
  const megaAsset = assetMap["mega"];
  const otherAsset = assetMap["other-forms"] || assetMap["other-forms.png"] || assetMap["other-forms.jpg"];
  const filterAsset = assetMap["pokemon-filter"]; // expected name pokemon-filter.png in assets

  // clickable style
  const clickableStyle = { cursor: "pointer" };

  // orb image chosen depending on shiny state
  const orbDisplayedUrl = useMemo(() => {
    if (isShiny) {
      if (orbUrlShiny) return orbUrlShiny;
      const cleaned = currLabelClean;
      const shinyKey = `${cleaned} (shiny)`.trim();
      if (imageIndexByName && imageIndexByName[shinyKey] != null) {
        const idx = imageIndexByName[shinyKey];
        return images[idx]?.sprite || images[idx]?.url || null;
      }
    } else {
      if (orbUrlPrimary) return orbUrlPrimary;
    }
    return smallSpriteUrl;
  }, [isShiny, orbUrlPrimary, orbUrlShiny, currLabelClean, imageIndexByName, images, smallSpriteUrl]);

  // --- EVOS: sliding window / pyramid state + helpers ---
  const [evoWindowStart, setEvoWindowStart] = useState(0);
  const evoCount = Array.isArray(evoChain) ? evoChain.length : 0;

  useEffect(() => {
    // reset window start whenever evoChain changes (e.g., when loading a new pokemon)
    setEvoWindowStart(0);
  }, [evoChain]);

  function getEvoWindow(start) {
    if (!Array.isArray(evoChain) || evoCount === 0) return [null, null, null];
    if (evoCount <= 3) {
      // return available evos padded with nulls so UI still renders 3 slots
      const padded = evoChain.slice(0, 3).concat(Array(Math.max(0, 3 - evoCount)).fill(null));
      return padded.slice(0, 3);
    }
    const out = [];
    for (let k = 0; k < 3; k++) {
      out.push(evoChain[(start + k) % evoCount]);
    }
    return out;
  }

  return (
    <div
      className="w-[1015px] h-[1000px] select-none"
      style={{
        fontFamily: "'Gameboy', monospace",
        position: "relative",
        overflow: "visible",
      }}
    >
      <svg viewBox="0 0 1015 700" width="1015" height="960" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* gradients / filters */}
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

          <filter id="shadowBig" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
          </filter>

          <clipPath id="orbClip">
            <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} />
          </clipPath>

          <clipPath id="mainFrameClip">
            <rect x={FRAME_X} y={FRAME_Y} width={FRAME_W} height={FRAME_H} rx="4" ry="4" />
          </clipPath>
        </defs>

        {/* Outer shell (kept intact visually) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="775">
          <defs>
            <linearGradient id="gradStroke" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b0000" />
              <stop offset="100%" stopColor="#390101" />
            </linearGradient>
          </defs>

          <path d="M32,40 Q6,40 6,66 L6,672 Q6,700 32,700 L486,700 L486,40 Z" fill="#8b0000" stroke="none" />
          <path
            d="M32,40 Q6,40 6,66 L6,672 Q6,700 32,700 L486,700 L486,40 L32,40"
            fill="none"
            stroke="url(#gradStroke)"
            strokeWidth="8"
            strokeLinejoin="miter"
          />
        </svg>

        {/* Inner panels */}
        <g>
          <path
            d="
  M488,106
  L348,106
  C311,106 291,114 255,146
  C231,166 181,188 151,188

  L11,188
  L11,676

  Q11,700 37,700

  L488,700
  Z
"
            fill="url(#gRedB)"
            stroke="#4d0000"
            strokeWidth="3"
          />
          <path d="M489,106 L348,106 C311,106 291,114 255,146 C231,166 181,188 151,188 L9.5,188" fill="none" stroke="#4d0000" strokeWidth="8" />
        </g>

        <g>
          <path
            d="
    M542,114
    L685,114
    C722,114 742,120 778,152
    C802,172 852,194 882,194
    L948,194
    Q988,194 988,242      
    L988,660                 
    Q988,700 948,700         
    L542,700                 
    L542,114
    Z
  "
            fill="url(#gRedB)"
            stroke="#4d0000"
            strokeWidth="3"
          />
          <path
            d="
  M541,114
  L685,114
  C722,114 742,120 778,152
  C802,172 852,194 882,194
  L948,194
  Q988,194 988,242      
  L988,660
  Q988,702 948,702        
  L541,702
"
            fill="none"
            stroke="#4d0000"
            strokeWidth="4"
          />
        </g>

        {/* hinge */}
        <g>
          <rect x="490" y="37" width="50" height="666" fill="#8b0000" stroke="#3f0000" strokeWidth="2" />
          <rect x="491.5" y="116" width="47" height="54" fill="#ce1b1b" />
          <rect x="491.5" y="228" width="47" height="364" fill="#ce1b1b" />
          <rect x="491.5" y="648" width="47" height="54" fill="#ce1b1b" />
        </g>

        {/* LEFT orb + LEDs */}
        <g>
          <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} fill="url(#orbGrad)" stroke="#46bfe1" strokeWidth="3" filter="url(#shadowBig)" />
          <circle cx="140" cy="75" r="8" fill="#ff6b6b" stroke="#8a0000" strokeWidth="0.8" style={{ opacity: leftLedOpacity(0), transition: "opacity 120ms linear" }} />
          <circle cx="172" cy="75" r="8" fill="#ffd86b" stroke="#8a0000" strokeWidth="0.8" style={{ opacity: leftLedOpacity(1), transition: "opacity 120ms linear" }} />
          <circle cx="202" cy="75" r="8" fill="#06a346" stroke="#044a22" strokeWidth="0.8" style={{ opacity: leftLedOpacity(2), transition: "opacity 120ms linear" }} />
        </g>

        {/* LEFT screen frame */}
        <g>
          <rect x="72" y="215" rx="80" ry="18" width="360" height="254" fill="#bdbdbd" stroke="#8a8a8a" strokeWidth="3" />
          <rect x={FRAME_X} y={FRAME_Y} rx="14" ry="14" width={FRAME_W} height={FRAME_H} fill="url(#screenGrad)" stroke="#111" strokeWidth="3" />
          <circle cx="236" cy="227" r="5" fill="#ff9b9b" stroke="#8b0000" style={{ opacity: leftFrameTopOn ? 1 : 0.2, transition: "opacity 60ms linear" }} />
          <circle cx="262" cy="227" r="5" fill="#ff9b9b" stroke="#8b0000" style={{ opacity: leftFrameTopOn ? 0.2 : 1, transition: "opacity 60ms linear" }} />
          <circle cx="118" cy="440" r="12" fill="#8f1a1a" stroke="#4a0000" strokeWidth="3" />
          {/* name plate */}
          <rect x="145" y="482" rx="10" ry="3" width="214" height="30" fill="url(#screenGrad)" stroke="#111" strokeWidth="3" />
          <g transform="translate(356,318)">
            <rect x="-28" y="114" width="32" height="4" rx="2" fill="#444" />
            <rect x="-28" y="122" width="32" height="4" rx="2" fill="#444" />
            <rect x="-28" y="130" width="32" height="4" rx="2" fill="#444" />
            <rect x="10" y="114" width="32" height="4" rx="2" fill="#444" />
            <rect x="10" y="122" width="32" height="4" rx="2" fill="#444" />
            <rect x="10" y="130" width="32" height="4" rx="2" fill="#444" />
          </g>
        </g>

        {/* LEFT lower controls (visual blue button included here) */}
        <g>
          {/* Visual blue button (shows active/shine when shiny is active) */}
          <circle
            cx="108"
            cy="582"
            r="34"
            fill="#2b66ff"
            stroke={isShiny ? "#ffd550" : "#002a6a"}
            strokeWidth={3}
            style={{
              filter: isShiny ? "drop-shadow(0 6px 10px rgba(255,213,80,0.35))" : undefined,
            }}
          />
          {/* other visible controls */}
          <rect x="173" y="525" rx="3" width="74" height="26" fill="#12b23f" stroke="#0a6b1f" />
          <rect x="264" y="525" rx="3" width="74" height="26" fill="#ff8a3f" stroke="#a84a15" />
          <g transform="translate(328,420)">
            <rect x="54" y="120" width="36" height="88" rx="6" fill="#111"/>
            <text x="72"y="136" fontSize="20" fill="#333" fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">▲</text>            
            <text x="72"y="194" fontSize="20" fill="#333" fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">▼</text>            
            <rect x="28" y="146" width="88" height="36" rx="6" fill="#111" />
            <text x="33" y="171" fontSize="20" fill="#333" fontFamily="sans-serif">◀</text>
            <text x="94" y="171" fontSize="20" fill="#333" fontFamily="sans-serif">▶</text>    
          </g>
           {/* teal module */}
          <rect x="184" y="616" rx="14" width="140" height="66" fill="#046f62" />
          <rect x="207" y="627" rx="10" width="96" height="46" fill="#eef6f8" />
        </g>

        {/* RIGHT panels */}
        <g>
          <rect x="580" y="216" rx="12" width="362" height="134" fill="url(#greenBox)" stroke="#2a8f2a" strokeWidth="4" />
          <rect x="587" y="223" rx="8" width="348" height="120" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.20" />
        </g>
        <g>
          <rect x="609" y="364" rx="12" width="310" height="120" fill="url(#blueBox)" stroke="#042a8a" strokeWidth="4" filter="url(#shadowBig)" />
          <rect x="616" y="373" rx="8" width="296" height="102" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.20" />
        </g>

        {/* RIGHT small indicators, chevrons, pills, play */}
        <g>
          <circle cx="622" cy="504" r="6" fill="#06a346" style={{ opacity: rightLedOpacity(0), transition: "opacity 120ms linear" }} />
          <circle cx="646" cy="504" r="6" fill="#ffd86b" style={{ opacity: rightLedOpacity(1), transition: "opacity 120ms linear" }} />
          <circle cx="670" cy="504" r="6" fill="#ff6b6b" style={{ opacity: rightLedOpacity(2), transition: "opacity 120ms linear" }} />

          <rect x="764" y="494" rx="12" width="74" height="20" fill="#16a34a" />
          <rect x="848" y="494" rx="12" width="74" height="20" fill="#ff8a3f" />

          <rect x={696 + CHEVRON_X_OFFSET} y="496" rx="2" width="22" height="16" fill="#cfcfcf" stroke="#6a6a6a" />
          <text x={702 + CHEVRON_X_OFFSET} y="507.5" fontSize="10" fill="#6a2a2a" fontFamily="sans-serif">◀</text>

          <rect x={723 + CHEVRON_X_OFFSET} y="496" rx="2" width="22" height="16" fill="#cfcfcf" stroke="#6a6a6a" />
          <text x={730 + CHEVRON_X_OFFSET} y="507.5" fontSize="10" fill="#6a2a2a" fontFamily="sans-serif">▶</text>
          </g>

          {/* held items — replaced by foreignObject below */}
          <rect x="611.5" y="530" rx="6" ry="2" width="90" height="50" fill="url(#screenGrad)" stroke="#111" strokeWidth="1" />

        {/* SIZE COMPARISON (foreignObject) */}
        <foreignObject x="600" y="590" width="110" height="100" >
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
            <SizeComparison
              silhouetteSrc={currentImageUrl || assetMap["placeholder-200"] || ""}
              humanSrc={assetMap["human_comp"] || assetMap["human_comp.png"] || "/src/assets/human_comp.png"}
              pokemonHeightMeters={pokemon?.height != null ? pokemon.height * 0.1 : null}
              pokemonWeightKg={pokemon?.weight != null ? pokemon.weight * 0.1 : null}
            />
          </div>
        </foreignObject>
        {/* HELD ITEMS (foreignObject) */}
        <foreignObject x="615" y="536" width="85" height="42">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
            {/* Prefer heldItemsDetails (contains sprites) but keep backwards compatibility */}
            <HeldItems heldItems={heldItemsDetails?.length ? heldItemsDetails : (pokemon?.held_items || [])} />
          </div>
        </foreignObject>

        {/* small sprite inside orb lens — now uses orbDisplayedUrl */}
        <image
          href={orbDisplayedUrl || smallSpriteUrl}
          x={ORB_CX - spriteSide / 2}
          y={ORB_CY - spriteSide / 2}
          width={spriteSide}
          height={spriteSide}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#orbClip)"
          style={{ imageRendering: "pixelated" }}
        />

        {/* main artwork clipped to frame */}
        <g clipPath="url(#mainFrameClip)">
          <image
            href={currentImageUrl || assetMap["placeholder-200"] || ""}
            x={FRAME_X}
            y={FRAME_Y}
            width={FRAME_W}
            height={FRAME_H}
            preserveAspectRatio="xMidYMid meet"
            style={{ pointerEvents: "none" }}
          />
        </g>

        {/* cry button (transparent) */}
        <g>
          <circle
            cx="118"
            cy="440"
            r="12"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              playCry();
            }}
            style={clickableStyle}
          />
        </g>

        {/* speaker bars while playing */}
        <g transform="translate(330,318)" pointerEvents="none" aria-hidden>
          {playing ? (
            <g>
              <rect x="-2" y="114" width="32" height="4" rx="2" fill="#111" />
              <rect x="-2" y="122" width="32" height="4" rx="2" fill="#111" />
              <rect x="-2" y="130" width="32" height="4" rx="2" fill="#111" />
              <rect x="36" y="114" width="32" height="4" rx="2" fill="#111" />
              <rect x="36" y="122" width="32" height="4" rx="2" fill="#111" />
              <rect x="36" y="130" width="32" height="4" rx="2" fill="#111" />
            </g>
          ) : null}
        </g>

        {/* NAME DISPLAY / SEARCH UI overlay */}
        <foreignObject x="150" y="486" width="206" height="24">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!editingName ? (
              <div
                className="gameboy-font"
                style={{ width: "100%", textAlign: "center", fontSize: 9, textTransform: "capitalize", color: "#000", cursor: "text" }}
                onClick={() => {
                  setEditingName(true);
                  setNameInput(images?.[currentImageIndex]?.label ?? pokemon?.name ?? "");
                  setTimeout(() => {
                    const el = document.getElementById("pokedex-name-input");
                    if (el) el.focus();
                  }, 0);
                }}
              >
                {formatDisplayName(images?.[currentImageIndex]?.label ?? pokemon?.name ?? "")}
              </div>
            ) : (
              <input
                id="pokedex-name-input"
                className="gameboy-font"
                style={{
                  width: "96%",
                  fontSize: 12,
                  padding: "2px 6px",
                }}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={() => submitNameSearch(nameInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitNameSearch(nameInput);
                  else if (e.key === "Escape") setEditingName(false);
                }}
              />
            )}
          </div>
        </foreignObject>

        {/* transparent interactive blue circle — this is the clickable control for SHINY */}
        <g>
          <circle
            cx="108"
            cy="582"
            r="34"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              toggleShiny();
            }}
            style={clickableStyle}
          />
          <title>Toggle shiny</title>
        </g>

        {/* Type icons */}
        <foreignObject x="176" y="522" width="200" height="32">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: "flex", gap: 23, alignItems: "center", height: "100%" }}>
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
          {/* LEFT */}
          <rect
            x="28"
            y="146"
            width="30"
            height="36"
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
          {/* visual center graphic */}
          <g transform={`translate(-8,0) scale(${dpadPressed ? 0.95 : 1})`}>
            <rect x="67.5" y="151.5" width="25" height="25" rx="14" fill="#00000088" />
            <rect x="72.5" y="156.5" width="15" height="15" rx="8" fill="#222" />
          </g>
          {/* RIGHT */}
          <rect
            x="86"
            y="146"
            width="30"
            height="36"
            rx="6"
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

          {/* UP (new invisible zone) */}
          <rect
            x="54"
            y="120"
            width="36"
            height="30"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              nextForm(); // up -> next form
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />

          {/* DOWN (new invisible zone) */}
          <rect
            x="54"
            y="178"
            width="36"
            height="30"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              prevForm(); // down -> previous form
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />
        </g>

        {/* OTHER-FORMS button (under D-pad). show active glow when viewing an other form */}
        <g transform="translate(328,520)">
          {otherAsset ? (
            <image
              href={otherAsset}
              x={-90}
              y={42}
              width={36}
              height={36}
              preserveAspectRatio="xMidYMid meet"
              style={{
                cursor: otherForms && otherForms.length ? "pointer" : "not-allowed",
                opacity: otherForms && otherForms.length ? 1 : 0.45,
                filter: isOtherForm ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : otherForms && otherForms.length ? "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (otherForms && otherForms.length) cycleOtherFormsUI();
              }}
            />
          ) : (
            <rect
              x={-20}
              y={-8}
              width={44}
              height={44}
              rx={6}
              fill="#666"
              stroke="#222"
              style={{
                cursor: otherForms && otherForms.length ? "pointer" : "not-allowed",
                opacity: otherForms && otherForms.length ? 1 : 0.45,
                filter: isOtherForm ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (otherForms && otherForms.length) cycleOtherFormsUI();
              }}
            />
          )}
        </g>

        {/* RESET / orange chevron circle (interactive) */}
          <g
            transform={`translate(0,0)`}
            onClick={(e) => {
              e.stopPropagation();
              handleResetClick();
            }}
            style={clickableStyle}
          >
            <circle cx="740" cy="556" r="14" fill="#ffc43b" stroke="#a86a00" strokeWidth="3" />
            <text x={734 + CHEVRON_X_OFFSET} y="560.5" fontSize="12" fill="#6a2a2a" fontFamily="sans-serif">◀</text>
          </g>



        {/* MEGA button (under left controls). show active glow when viewing a mega */}
        <g transform="translate(210,560)">
          {megaAsset ? (
            <image
              href={megaAsset}
              x={-32}
              y={8}
              width={44}
              height={44}
              preserveAspectRatio="xMidYMid meet"
              style={{
                cursor: megaVariants && megaVariants.length ? "pointer" : "not-allowed",
                opacity: megaVariants && megaVariants.length ? 1 : 0.45,
                filter: isMega ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : megaVariants && megaVariants.length ? "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (megaVariants && megaVariants.length) toggleMega();
              }}
            />
          ) : (
            <rect
              x={-22}
              y={-8}
              width={44}
              height={44}
              rx={6}
              fill="#444"
              stroke="#222"
              style={{
                cursor: megaVariants && megaVariants.length ? "pointer" : "not-allowed",
                opacity: megaVariants && megaVariants.length ? 1 : 0.45,
                filter: isMega ? "drop-shadow(0 8px 12px rgba(255,140,140,0.28))" : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (megaVariants && megaVariants.length) toggleMega();
              }}
            />
          )}
        </g>

        {/* TEAL MODULE TEXT (registered number) - centered in the white area */}
        {/* white rect is at x=207, y=627, width=96, height=46 -> center at (255,650) */}
        <g aria-hidden>
          <text
            x={207 + 96 / 2}
            y={627 + 46 / 2}
            className="gameboy-font"
            style={{ fontSize: numberFontSize }}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {displayNumber}
          </text>
        </g>

          <g>
  {/* Filter icon — always subtle drop-shadow; stronger glow when a filter is active */}
  {filterAsset ? (
    <image
      href={filterAsset}
      x={282}
      y={561.5}
      width={55}
      height={55}
      preserveAspectRatio="xMidYMid meet"
      style={{
        cursor: "pointer",
        filter: activeFilterType
          ? "drop-shadow(0 12px 22px rgba(0,160,255,0.30)) drop-shadow(0 6px 10px rgba(0,0,0,0.30))"
          : "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
        opacity: 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setShowFilterPopup((s) => !s);
      }}
    />
  ) : (
    /* fallback simple rect if asset missing */
    <g transform="translate(282,560)">
      <rect
        x={0}
        y={0}
        width={55}
        height={55}
        rx={8}
        fill="#444"
        stroke="#222"
        style={{
          cursor: "pointer",
          filter: activeFilterType ? "drop-shadow(0 10px 18px rgba(0,160,255,0.25))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowFilterPopup((s) => !s);
        }}
      />
      <text x={27.5} y={34} fontSize="16" textAnchor="middle" fill="#fff" fontFamily="sans-serif" pointerEvents="none">F</text>
    </g>
  )}

  {/* Popup: only render when open */}
  {showFilterPopup ? (
    <foreignObject x="126" y="520" width="252" height="168">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="gameboy-font"
        style={{
          width: "100%",
          height: "100%",
          background: "#fff",
          border: "3px solid #222",
          padding: 6,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
        onClick={(e) => e.stopPropagation()}
      >
       {/* Header row (all fontSize: 6). Title left, RESET & CLOSE right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 6, fontWeight: 700, letterSpacing: "0.5px" }}>FILTER BY TYPE</div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!activeFilterType || filterLoading) return;
                clearTypeFilter();
              }}
              disabled={!activeFilterType || filterLoading}
              aria-disabled={!activeFilterType || filterLoading}
              style={{
                fontFamily: "'Gameboy', monospace",
                fontSize: 6,
                cursor: !activeFilterType || filterLoading ? "not-allowed" : "pointer",
                opacity: !activeFilterType || filterLoading ? 0.45 : 1,
                color: "#111",
                borderRadius: 3,
              }}
              title={!activeFilterType ? "No active filter" : "Reset filter"}
            >
              RESET
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterPopup(false);
              }}
              style={{
                fontFamily: "'Gameboy', monospace",
                fontSize: 6,
                cursor: "pointer",
                color: "#111",
                borderRadius: 3,
              }}
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Second header row: filtering status (fontSize: 6) */}
        <div style={{ fontSize: 6, color: filterError ? "#b91c1c" : "#374151", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ textTransform: "capitalize", minWidth: 120 }}>
            {filterLoading ? "Loading…" : filterError ? filterError : activeFilterType ? `Filtering: ${activeFilterType}` : "No filter"}
          </div>
        </div>
        {/* grid of type icons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, alignItems: "center", justifyItems: "center", flex: 1 }}>
          {availableFilterTypes.length ? (
            availableFilterTypes.map((t) => {
              const key = `filter-${t}`;
              const url = assetMap[key];
              const isActive = activeFilterType === t;
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    // toggle off if clicking same active type
                    if (isActive) {
                      clearTypeFilter();
                    } else {
                      applyTypeFilter(t);
                    }
                  }}
                  title={t}
                  style={{
                    width: 34,
                    height: 34,
                    padding: 0,
                    border: isActive ? "2px solid #0ea5a9" : "2px solid transparent",
                    borderRadius: 8,
                    background: isActive ? "#e6f7ff" : "#f3f3f3",
                    cursor: filterLoading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isActive ? "0 8px 18px rgba(0,160,255,0.24)" : "0 4px 10px rgba(0,0,0,0.12)",
                  }}
                >
                  {url ? (
                    <img src={url} alt={t} style={{ width: 28, height: 28, imageRendering: "pixelated", pointerEvents: "none" }} />
                  ) : (
                    <span style={{ fontSize: 10, textTransform: "capitalize" }}>{t}</span>
                  )}
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: 10 }}>No type icons found in assets</div>
          )}
        </div>

        {/* footer intentionally removed — header contains Reset + Close and inline status */}
      </div>
    </foreignObject>
  ) : null}
</g>
/* ---------- end FILTER UI ---------- */

        {/* RIGHT green species box */}
        <foreignObject x="593.5" y="232" width="336" height="112">
          <div xmlns="http://www.w3.org/1999/xhtml" className="gameboy-font" style={{ color: "#000", fontSize: 10, padding: 6 }}>
            <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
              {species?.genera?.find((g) => g.language.name === "en")?.genus ?? species?.name ?? ""}
            </div>
            <div style={{ marginTop: 8, fontSize: 8.5, lineHeight: 1.5, textAlign: "justify" }}>
              {species?.flavor_text_entries?.find((f) => f.language.name === "en")?.flavor_text?.replace(/\n|\f/g, " ") ?? "No data."}
            </div>
          </div>
        </foreignObject>

        {/* RIGHT blue box: ability & stats */}
        <foreignObject x="616" y="372" width="296" height="102">
          <div xmlns="http://www.w3.org/1999/xhtml" className="gameboy-font" style={{ color: "#fff", fontSize: 6, padding: 8, display: "flex", gap: 8 }}>
            <div style={{ width: "52%", display: "flex", flexDirection: "column", gap: 6 }}>
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

            <div style={{ width: "48%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontWeight: 700, textAlign: "center" }}>STATS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {stats?.map((s) => {
                  const value = s.value ?? s.base_stat ?? 0;
                  const pct = Math.round((value / maxStat) * 100);
                  return (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <div style={{ width: 48, fontSize: 5, textTransform: "capitalize" }}>{s.name}</div>
                      <div style={{ flex: 1, height: 10, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "60%", borderRadius: 6, background: "#7ff971", boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }} />
                      </div>
                      <div style={{ width: 28, textAlign: "right", fontSize: 6 }}>{value}</div>
                    </div>
                  );
                }) ?? <div style={{ fontSize: 6 }}>—</div>}
              </div>
            </div>
          </div>
        </foreignObject>

        {/* move pills */}
        <foreignObject x="768" y="501" width="150" height="56">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: "flex", flexDirection: "row", gap: 20 }}>
            {(pagedMoves && pagedMoves.length > 0) ? pagedMoves.map((m) => (
              <div key={m.name} className="gameboy-font" style={{ fontWeight: 700, width: 140, whiteSpace: "nowrap", fontSize: 5, display: "flex", alignItems: "center", justifyContent: "center" }} title={m.name.replace("-", " ")}>
                {m.name.replace("-", " ")}
              </div>
            )) : <div className="gameboy-font">—</div>}
          </div>
        </foreignObject>

        {/* invisible chevrons (click zones) */}
        <rect x={696 + CHEVRON_X_OFFSET} y="496" rx="3" width="22" height="16" fill="transparent" onClick={(e) => { e.stopPropagation(); handlePrevMoves(); }} style={clickableStyle} />
        <rect x={723 + CHEVRON_X_OFFSET} y="496" rx="3" width="22" height="16" fill="transparent" onClick={(e) => { e.stopPropagation(); handleNextMoves(); }} style={clickableStyle} />


       {/* EVOLUTIONS (pyramid + sliding window) */}
<g transform="translate(645,490)">
  {(() => {
    const [e0, e1, e2] = getEvoWindow(evoWindowStart);

    // rect layout constants (kept visually similar to your original sizes)
    const rectW = 85;
    const rectH = 80;

    // coordinates relative to this group's origin to form a pyramid:
    // top: centered roughly where old middle was (centerX ~ 76)
    // lower-left / lower-right placed below & to the sides
    const topX = 153; // rect x for top
    const topY = 32;
    const leftX = 106; // rect x for lower-left
    const leftY = 120;
    const rightX = 200; // rect x for lower-right
    const rightY = 120;

    // image inset inside rect (50x50 sprite)
    const spriteW = 50;
    const spriteH = 50;
    const spriteInsetX = (rectW - spriteW) / 2; // 17.5 -> ~18
    const spriteInsetY = 10;

    const showChevrons = evoCount > 3;
    // new: allow prev/next only when not at endpoints (no wrap)
    const prevAllowed = evoWindowStart > 0;
    const nextAllowed = evoWindowStart + 3 < evoCount;

    return (
      <g>
        {/* TOP evolution */}
        <g>
          <rect
            x={topX}
            y={topY}
            width={rectW}
            height={rectH}
            rx="8"
            fill="#f5c400"
            stroke="#b78e00"
            style={{ cursor: e0 ? "pointer" : "default" }}
            onClick={(e) => {
              e.stopPropagation();
              if (e0) gotoEvolution(e0);
            }}
          />
          {e0 ? (
            <>
              <image
                href={e0.sprite || assetMap["placeholder-64"] || ""}
                x={topX + spriteInsetX}
                y={topY + spriteInsetY}
                width={spriteW}
                height={spriteH}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={topX + rectW / 2}
                y={topY + rectH - 10}
                fontSize="8"
                textAnchor="middle"
                className="gameboy-font"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  gotoEvolution(e0);
                }}
              >
                {e0.name}
              </text>
            </>
          ) : (
            <text x={topX + rectW / 2} y={topY + rectH / 1.8} fontSize="8" textAnchor="middle" className="gameboy-font">
              No Evo
            </text>
          )}
        </g>

        {/* LOWER LEFT evolution */}
        <g>
          <rect
            x={leftX}
            y={leftY}
            width={rectW}
            height={rectH}
            rx="8"
            fill="#f5c400"
            stroke="#b78e00"
            style={{ cursor: e1 ? "pointer" : "default" }}
            onClick={(e) => {
              e.stopPropagation();
              if (e1) gotoEvolution(e1);
            }}
          />
          {e1 ? (
            <>
              <image
                href={e1.sprite || assetMap["placeholder-64"] || ""}
                x={leftX + spriteInsetX}
                y={leftY + spriteInsetY}
                width={spriteW}
                height={spriteH}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={leftX + rectW / 2}
                y={leftY + rectH - 10}
                fontSize="8"
                textAnchor="middle"
                className="gameboy-font"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  gotoEvolution(e1);
                }}
              >
                {e1.name}
              </text>
            </>
          ) : (
            <text x={leftX + rectW / 2} y={leftY + rectH / 1.8} fontSize="8" textAnchor="middle" className="gameboy-font">
              No Evo
            </text>
          )}
        </g>

        {/* LOWER RIGHT evolution */}
        <g>
          <rect
            x={rightX}
            y={rightY}
            width={rectW}
            height={rectH}
            rx="8"
            fill="#f5c400"
            stroke="#b78e00"
            style={{ cursor: e2 ? "pointer" : "default" }}
            onClick={(e) => {
              e.stopPropagation();
              if (e2) gotoEvolution(e2);
            }}
          />
          {e2 ? (
            <>
              <image
                href={e2.sprite || assetMap["placeholder-64"] || ""}
                x={rightX + spriteInsetX}
                y={rightY + spriteInsetY}
                width={spriteW}
                height={spriteH}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={rightX + rectW / 2}
                y={rightY + rectH - 10}
                fontSize="8"
                textAnchor="middle"
                className="gameboy-font"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  gotoEvolution(e2);
                }}
              >
                {e2.name}
              </text>
            </>
          ) : (
            <text x={rightX + rectW / 2} y={rightY + rectH / 1.8} fontSize="8" textAnchor="middle" className="gameboy-font">
              No Evo
            </text>
          )}
        </g>

        {/* Prev chevron (left) — shown only when there are >3 evolutions */}
        {showChevrons ? (
          <g
            transform={`translate(${leftX - 20}, ${leftY + rectH / 2 - 10})`}
            onClick={(e) => {
              e.stopPropagation();
              if (!prevAllowed) return;
              // slide window backward by 1 (no wrap)
              setEvoWindowStart((s) => Math.max(0, s - 1));
            }}
            style={{ cursor: prevAllowed ? "pointer" : "not-allowed", opacity: prevAllowed ? 1 : 0.35 }}
            aria-hidden={false}
          >
            <rect x={42} y={-88} width={18} height={20} rx={4} fill="#cfcfcf" stroke="#6a6a6a" />
            <text x={50} y={-74} fontSize="12" fill="#6a2a2a" fontFamily="sans-serif" textAnchor="middle">◀</text>
          </g>
        ) : null}

        {/* Next chevron (right) — shown only when there are >3 evolutions */}
        {showChevrons ? (
          <g
            transform={`translate(${rightX + rectW + 6}, ${rightY + rectH / 2 - 10})`}
            onClick={(e) => {
              e.stopPropagation();
              if (!nextAllowed) return;
              // slide window forward by 1 (no wrap)
              setEvoWindowStart((s) => Math.min(evoCount - 3, s + 1));
            }}
            style={{ cursor: nextAllowed ? "pointer" : "not-allowed", opacity: nextAllowed ? 1 : 0.35 }}
            aria-hidden={false}
          >
            <rect x={0} y={0} width={18} height={20} rx={4} fill="#cfcfcf" stroke="#6a6a6a" />
            <text x={9.5} y={14} fontSize="12" fill="#6a2a2a" fontFamily="sans-serif" textAnchor="middle">▶</text>
          </g>
        ) : null}
      </g>
    );
  })()}
</g>


        {/* bottom status */}
        <text x="507.5" y="716" textAnchor="middle" fontSize="12" className="gameboy-font">
          {loading ? "LOADING POKEMON..." : error ? "ERROR LOADING POKEMON!" : ""}
        </text>
      </svg>
    </div>
  );
}
