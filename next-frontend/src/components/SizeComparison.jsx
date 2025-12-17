// src/components/SizeComparison.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * SizeComparison: left — pokemon silhouette (solid black via CSS filter), right — human_comp.png
 * Props:
 *  - silhouetteSrc (string)  // image URL (we will render with filter: brightness(0))
 *  - humanSrc (string)       // human picture URL
 *  - pokemonHeightMeters (number)  // in meters (decimal)
 *  - pokemonWeightKg (number)      // kilograms
 */
export default function SizeComparison({
  silhouetteSrc,
  humanSrc,
  pokemonHeightMeters,
  pokemonWeightKg,
}) {
  const visualRef = useRef(null);
  const [visualH, setVisualH] = useState(0);

  // canonical human height (4'9") in meters
  const HUMAN_METERS = 1.4478;

  // measure available visual area
  useEffect(() => {
    if (!visualRef.current) return;
    const ro = new ResizeObserver(() => {
      const h = visualRef.current.clientHeight;
      setVisualH(h);
    });
    ro.observe(visualRef.current);
    // seed initial
    setVisualH(visualRef.current.clientHeight);
    return () => ro.disconnect();
  }, []);

  // convert helpers
  function metersToFeetAndInches(meters) {
    if (!meters && meters !== 0) return "N/A";
    const totalInches = meters * 39.3700787;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - ft * 12);
    return `${ft}'${inches}"`;
  }
  function formatKg(kg) {
    if (!kg && kg !== 0) return "N/A";
    // show one decimal for kg if < 100, whole number otherwise
    return kg < 100 ? `${Math.round(kg * 10) / 10} kg` : `${Math.round(kg)} kg`;
  }

  // compute pixel heights. We'll allow up to 86% of visualRef height for figures (leave top/bottom padding)
  const maxFigurePx = Math.max(1, Math.floor(visualH * 0.86)); // avoid zero
  const pMeters = typeof pokemonHeightMeters === "number" && pokemonHeightMeters > 0 ? pokemonHeightMeters : null;
  const humanMeters = HUMAN_METERS;

  // scale so both fit and keep real-world ratio. Prefer to fill the container with the pokemon.
  let scalePxPerMeter = 1;
  if (pMeters) {
    const scaleIfPokemonMax = maxFigurePx / pMeters;
    const humanPxIfPokemonMax = humanMeters * scaleIfPokemonMax;
    if (humanPxIfPokemonMax <= maxFigurePx * 1.05) {
      scalePxPerMeter = scaleIfPokemonMax;
    } else {
      const maxMeters = Math.max(pMeters, humanMeters);
      scalePxPerMeter = maxFigurePx / maxMeters;
    }
  } else {
    scalePxPerMeter = maxFigurePx / humanMeters;
  }

  const pokemonPx = Math.max(1, Math.round((pMeters || humanMeters) * scalePxPerMeter));
  const humanPx = Math.max(1, Math.round(humanMeters * scalePxPerMeter));

  // Pull human slightly left so silhouettes are closer
  // (increase magnitude to bring them closer; decrease to separate)
  const humanPull = -10; // px; tuned to pull the human left so both look centered

  const hasSilhouette = !!silhouetteSrc; // treat empty string / null / undefined as no silhouette

  return (
    <div
      className="panel-inner rounded-lg p-2 border border-gray-200"
      style={{ display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}
    >
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 6 }}>
        SIZE COMPARISON
      </div>

      <div
        ref={visualRef}
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 4,
          flex: 1,
          minHeight: 0,
        }}
      >
        {hasSilhouette ? (
          // Two-column layout: pokemon silhouette (left) + human (right)
          <>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                width: "52%",
                minWidth: 0,
              }}
            >
              <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                <img
                  src={silhouetteSrc}
                  alt="pokemon silhouette"
                  style={{
                    height: `${pokemonPx}px`,
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: "brightness(0)",
                    imageRendering: "pixelated",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                width: "50%",
                minWidth: 0,
                marginLeft: humanPull,
                boxSizing: "border-box",
              }}
            >
              <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                {humanSrc ? (
                  <img
                    src={humanSrc}
                    alt="human comparison"
                    style={{
                      height: `${humanPx}px`,
                      width: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                      imageRendering: "pixelated",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />
                ) : (
                  <div style={{ height: `${humanPx}px`, width: "36%", background: "#ddd", borderRadius: 3 }} />
                )}
              </div>
            </div>
          </>
        ) : (
          // No silhouette available (e.g. after reset) — center the human and do NOT show a black box
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              paddingLeft: 4,
              paddingRight: 4,
            }}
          >
            <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
              {humanSrc ? (
                <img
                  src={humanSrc}
                  alt="human comparison"
                  style={{
                    height: `${humanPx}px`,
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    imageRendering: "pixelated",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
              ) : (
                <div style={{ height: `${humanPx}px`, width: "36%", background: "#ddd", borderRadius: 3 }} />
              )}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 6,
          paddingTop: 6,
          fontSize: 4,
          color: "#111",
          display: "flex",
          justifyContent: "center",
          gap: 12,
          alignItems: "baseline", // align text baselines
        }}
      >
        <div>Ht: {pMeters ? metersToFeetAndInches(pMeters) : "N/A"}</div>
        <div>Wt: {typeof pokemonWeightKg === "number" ? formatKg(pokemonWeightKg) : "N/A"}</div>
      </div>
    </div>
  );
}
