// src/components/StatBar.jsx
import React from "react";

export default function StatBar({ label, value }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20">{label}</span>
      <div className="flex-1 bg-gray-300 rounded h-2">
        <div
          className="bg-red-500 h-2 rounded"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-8 text-right">{value}</span>
    </div>
  );
}
