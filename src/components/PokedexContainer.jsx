import React, { useEffect, useState } from "react";
import usePokemon from "../hooks/usePokemon";
import PokedexShell from "./PokedexShell";

const GEN_LIMIT = 493;

export default function PokedexContainer({ initialPokemon = "pikachu", onClose }) {
  const [query, setQuery] = useState(initialPokemon);
  const { data, loading, error } = usePokemon(query);

  useEffect(() => {
    setQuery(initialPokemon);
  }, [initialPokemon]);

  const handleSearch = (q) => {
    const val = q.trim().toLowerCase();
    if (!val) return;
    const numeric = Number(val);
    if (numeric && numeric > GEN_LIMIT) {
      alert("Only Pokémon from Gen 1–4 (IDs 1–493) are allowed.");
      return;
    }
    setQuery(val);
  };

  const handleSelectPokemon = (name) => setQuery(name);
  const handlePrev = () => { if (data?.id && data.id > 1) setQuery(String(data.id - 1)); };
  const handleNext = () => { if (data?.id) setQuery(String(data.id + 1)); };

  return (
    <>
      {loading && <div className="text-center p-8">Loading Pokedex...</div>}
      {!loading && data && (
        <PokedexShell
          pokemon={data}
          onClose={onClose}
          onSearch={handleSearch}
          onSelectPokemon={handleSelectPokemon}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
      {error && <div className="p-6 text-red-600">Error loading Pokémon.</div>}
    </>
  );
}
