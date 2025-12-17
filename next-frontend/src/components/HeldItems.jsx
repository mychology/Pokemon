import React from "react";

/**
 * HeldItems
 *  - heldItems: [{ name, sprite }]
 * Renders a small header "HELD ITEMS" and icons (scaled to container).
 * If none, displays "No held items".
 */
export default function HeldItems({ heldItems = [] }) {
  const hasItems = Array.isArray(heldItems) && heldItems.length > 0;

  return (
    <div
      className="gameboy-font"
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 6,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          textAlign: "center",
          width: "100%",
        }}
      >
        HELD ITEMS
      </div>

      {/* Content area */}
      {!hasItems ? (
        <div
          style={{
            fontSize: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flex: 1,
          }}
        >
          No held items
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flex: 1,
            padding: "0 4px",
            boxSizing: "border-box",
          }}
        >
          {heldItems.map((it) => (
            <div
              key={it.name || (it.sprite || Math.random())}
              title={it.name}
              style={{
                width: "100%",
                maxWidth: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {it.sprite ? (
                <img
                  src={it.sprite}
                  alt={it.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    imageRendering: "pixelated",
                    display: "block",
                  }}
                />
              ) : (
                <div className="gameboy-font" style={{ fontSize: 6, textAlign: "center" }}>
                  {it.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
