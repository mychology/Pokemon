// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import PokedexShell from '../components/PokedexShell';

const DEFAULT_NAME = 'pikachu'; // change this to any pokemon name, e.g. 'charizard', 'bulbasaur'

export default function Home() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDefault() {
      setLoading(true);
      try {
        // fetch pokemon basic data
        const pResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${DEFAULT_NAME}`);
        if (!pResp.ok) throw new Error('pokemon fetch failed');
        const p = await pResp.json();

        // species (flavor text + evolution chain url)
        const sResp = await fetch(p.species.url);
        const s = await sResp.json();
        const flavor = (s.flavor_text_entries || []).find(e => e.language.name === 'en')?.flavor_text?.replace(/\n|\f/g,' ') || '';

        // evolution chain
        const evResp = await fetch(s.evolution_chain.url);
        const evJson = await evResp.json();
        const evoNames = [];
        function traverse(chain) {
          evoNames.push(chain.species.name);
          (chain.evolves_to || []).forEach(child => traverse(child));
        }
        traverse(evJson.chain);

        // fetch sprites for evolution items (small)
        const evolutionChain = await Promise.all(evoNames.map(async nm => {
          try {
            const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${nm}`);
            const d = await r.json();
            return { name: nm, sprite: d.sprites?.front_default || null };
          } catch {
            return { name: nm, sprite: null };
          }
        }));

        const composed = {
          ...p,
          flavorText: flavor,
          evolutionChain,
        };

        if (mounted) {
          setPokemon(composed);
          setLoading(false);
        }
      } catch (err) {
        console.error('Home loadDefault error', err);
        if (mounted) {
          setPokemon(null);
          setLoading(false);
        }
      }
    }
    loadDefault();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading Pokedex...</div>;
  if (!pokemon) return <div style={{ padding: 32 }}>Failed to load default Pokémon.</div>;

  return (
    <div style={{ padding: 20 }}>
      <PokedexShell pokemon={pokemon} onClose={() => { /* optionally navigate somewhere */ }} />
    </div>
  );
}
