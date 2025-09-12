// src/pages/Home.jsx
import React from "react";
import PokedexContainer from "../components/PokedexContainer";

export default function Home() {
  return (
    <div className="p-6">
      <PokedexContainer initialPokemon="pikachu" />
    </div>
  );
}
