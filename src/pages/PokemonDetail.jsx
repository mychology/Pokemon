// src/pages/PokemonDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePokemon from "../hooks/usePokemon";
import PokedexShell from "../components/PokedexShell";

export default function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { data, loading } = usePokemon(name);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return (
    <div className="p-6">
      <div>Pokemon not found.</div>
      <button className="mt-3 px-3 py-2 bg-gray-200 rounded" onClick={() => navigate(-1)}>Back</button>
    </div>
  );

  return (
    <div className="p-6">
      <PokedexShell pokemon={data} onClose={() => navigate(-1)} />
    </div>
  );
}
