// src/App.jsx
import React, { useEffect, useState } from "react";
import PokedexShell from "./components/PokedexShell";

function App() {
  const [pokemon, setPokemon] = useState(null);

  async function fetchPokemon(name = "pikachu") {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();

      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();

      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      function getEvolutionChain(node) {
        let evo = [];
        function traverse(current) {
          const id = current.species.url.split("/").filter(Boolean).pop();
          evo.push({
            name: current.species.name,
            artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          });
          current.evolves_to.forEach(traverse);
        }
        traverse(node);
        return evo;
      }

      const evolution = getEvolutionChain(evoData.chain);

      const flavorEntry = speciesData.flavor_text_entries.find(
        (e) => e.language.name === "en"
      )?.flavor_text.replace(/\f/g, " ");

      const stats = {};
      data.stats.forEach((s) => {
        stats[s.stat.name] = s.base_stat;
      });

      setPokemon({
        name: data.name,
        artwork: data.sprites.other["official-artwork"].front_default,
        sprite: data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        abilities: data.abilities,
        stats,
        flavor_text: flavorEntry,
        height: data.height / 10,
        weight: data.weight / 10,
        evolution,
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPokemon("pikachu");
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      {pokemon ? <PokedexShell pokemon={pokemon} /> : <p>Loading...</p>}
    </div>
  );
}

export default App;
