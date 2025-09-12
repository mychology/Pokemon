import React from "react";

export default function DexEntry({ genus, flavorText }) {
  return (
    <div className="panel-inner rounded-lg p-4 h-full overflow-auto border border-gray-200">
      <h4 className="text-lg font-bold">Dex entry</h4>
      {genus ? <div className="text-sm text-gray-600 mb-2">{genus}</div> : null}
      <p className="text-sm leading-relaxed text-gray-700">{flavorText || "No dex entry available."}</p>
    </div>
  );
}
