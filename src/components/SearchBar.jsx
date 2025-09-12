// src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ query, setQuery, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 w-full">
      <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full">
        <svg
          className="w-5 h-5 text-gray-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="6" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
      >
        Go
      </button>
    </form>
  );
}
