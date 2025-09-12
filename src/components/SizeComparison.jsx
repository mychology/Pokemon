import React from "react";

/**
 * SizeComparison: left — pokemon silhouette (solid black), right — human_comp.png
 * Props:
 *  - silhouetteSrc (string)  // black silhouette URL or artwork (filter: brightness(0))
 *  - humanSrc (string)
 *  - pokemonHeightMeters (number)
 *  - pokemonWeightKg (number)
 */
export default function SizeComparison({ silhouetteSrc, humanSrc, pokemonHeightMeters, pokemonWeightKg }) {
  return (
    <div className="panel-inner rounded-lg p-3 border border-gray-200">
      <div className="font-bold mb-2">Size comp.</div>

      <div className="flex items-end gap-4">
        <div className="flex-1 flex items-end justify-center">
          <div className="relative w-24 h-36">
            {silhouetteSrc ? (
              <img
                src={silhouetteSrc}
                alt="pokemon silhouette"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto object-contain"
                style={{ filter: "brightness(0)" }}
              />
            ) : (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-black" />
            )}
          </div>
        </div>

        <div className="flex-1 flex items-end justify-center">
          <div className="relative w-20 h-36">
            <img
              src={humanSrc}
              alt="human comparison"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 border-t pt-2 text-sm text-gray-700">
        <div>Ht: {pokemonHeightMeters ? `${pokemonHeightMeters} m` : "N/A"}</div>
        <div>Wt: {pokemonWeightKg ? `${pokemonWeightKg} kg` : "N/A"}</div>
      </div>
    </div>
  );
}
