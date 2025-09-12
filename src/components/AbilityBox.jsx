import React from "react";

export default function AbilityBox({ abilities = [] }) {
  return (
    <div className="panel-inner rounded-lg p-4 border border-gray-200">
      <h3 className="font-bold text-lg mb-2">Ability</h3>
      <div className="space-y-1">
        {abilities.map((a) => (
          <div key={a.name} className="capitalize text-sm">
            {a.name.replace("-", " ")} {a.is_hidden ? <span className="text-xs text-gray-500">(hidden)</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
