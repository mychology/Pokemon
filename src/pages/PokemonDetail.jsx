// src/pages/PokemonDetail.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PokedexShell from '../components/PokedexShell';

/**
 * PokemonDetail fetches a pokemon, its species/flavor text, and evolution chain.
 * Uses cacheRef (useRef) to store previously-fetched data — stable across renders, not part of deps.
 * The effect depends only on `name`, which is correct and avoids ESLint warnings.
 */

export default function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  // stable in-memory cache, stored in a ref so it's not a dependency for useEffect
  const cacheRef = useRef(PokemonDetail._cache || (PokemonDetail._cache = {}));

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);

      try {
        // return from cache if available
        if (cacheRef.current[name]) {
          if (mounted) {
            setPokemon(cacheRef.current[name]);
            setLoading(false);
          }
          return;
        }

        // fetch basic pokemon data
        const pResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!pResp.ok) throw new Error('Pokemon not found');
        const p = await pResp.json();

        // fetch species for flavor text and evolution chain url
        const sResp = await fetch(p.species.url);
        const s = await sResp.json();
        const flavor = (s.flavor_text_entries || []).find(e => e.language.name === 'en')?.flavor_text?.replace(/\n|\f/g, ' ') || '';

        // fetch evolution chain
        const evResp = await fetch(s.evolution_chain.url);
        const evJson = await evResp.json();

        // flatten the chain into names
        const evoNames = [];
        function traverse(chain) {
          evoNames.push(chain.species.name);
          (chain.evolves_to || []).forEach(child => traverse(child));
        }
        traverse(evJson.chain);

        // fetch small sprite for each evolution entry
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

        // store in cacheRef
        cacheRef.current[name] = composed;

        if (mounted) {
          setPokemon(composed);
          setLoading(false);
        }
      } catch (err) {
        console.error('PokemonDetail load error', err);
        if (mounted) {
          setPokemon(null);
          setLoading(false);
        }
      }
    }

    load();

    return () => { mounted = false; };
  }, [name]); // only depends on name

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!pokemon) return (
    <div style={{ padding: 24 }}>
      <div>Pokemon not found.</div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 12 }}>Back</button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <PokedexShell pokemon={pokemon} onClose={() => navigate(-1)} />
    </div>
  );
}
