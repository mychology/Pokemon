import React, { useEffect, useState } from 'react';
import PokedexShell from './PokedexShell.jsx';

const GEN_LIMIT = 493;
const API_BASE = 'https://pokeapi.co/api/v2';

export default function PokedexContainer({ initialPokemon = 'pikachu', onClose }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPokemon = async (nameOrId) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/pokemon/${nameOrId}`);
      if (!res.ok) throw new Error('Pokémon not found');
      const pokeData = await res.json();

      const speciesRes = await fetch(pokeData.species.url);
      const speciesData = await speciesRes.json();

      const flavorText =
        speciesData.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text
          ?.replace(/\f/g, ' ') || '';

      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      const evoChain = [];
      const walkChain = (node) => {
        if (!node) return;
        evoChain.push(node.species.name);
        node.evolves_to.forEach(walkChain);
      };
      walkChain(evoData.chain);

      const evoWithSprites = await Promise.all(
        evoChain.map(async (name) => {
          try {
            const r = await fetch(`${API_BASE}/pokemon/${name}`);
            if (!r.ok) return { name };
            const d = await r.json();
            return { name, sprite: d.sprites.front_default };
          } catch {
            return { name };
          }
        })
      );

      setPokemon({
        name: pokeData.name,
        sprites: pokeData.sprites,
        types: pokeData.types,
        stats: pokeData.stats,
        abilities: pokeData.abilities,
        height: pokeData.height,
        weight: pokeData.weight,
        flavorText,
        evolutionChain: evoWithSprites,
        id: pokeData.id,
      });
    } catch (err) {
      console.error(err);
      alert('Could not fetch that Pokémon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(initialPokemon);
  }, [initialPokemon]);

  const handleSearch = async (query) => {
    try {
      const res = await fetch(`${API_BASE}/pokemon/${query.toLowerCase()}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      if (data.id > GEN_LIMIT) {
        alert('Only Pokémon from Gen 1–4 (IDs 1–493) are allowed.');
        return;
      }
      await fetchPokemon(query);
    } catch {
      alert('Pokémon not found.');
    }
  };

  const handleSelectPokemon = (name) => fetchPokemon(name);
  const handlePrev = () => { if (pokemon.id > 1) fetchPokemon(pokemon.id - 1); };
  const handleNext = () => { if (pokemon.id < GEN_LIMIT) fetchPokemon(pokemon.id + 1); };

  return (
    <>
      {loading && <div style={{ textAlign: 'center', margin: 20 }}>Loading...</div>}
      {!loading && pokemon && (
        <PokedexShell
          pokemon={pokemon}
          onClose={onClose}
          onSearch={handleSearch}
          onSelectPokemon={handleSelectPokemon}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
