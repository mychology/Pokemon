// src/hooks/usePokemon.js
import { useEffect, useMemo, useState, useRef } from "react";

/**
 * usePokemon(idOrName)
 * Returns:
 * {
 *  loading, error,
 *  pokemon, species,
 *  images: [{ key, label, url }], // image options (default, shiny, forms)
 *  currentImageIndex, setCurrentImageIndex, nextImage(), prevImage()
 *  types: [{name, url}],
 *  ability: { name, effect_entries[], short_effect } or null,
 *  stats: [{ name, value }],
 *  moves: [ { name, url } ],
 *  pagedMoves, movesPage, setMovesPage, totalMovesPages,
 *  evoChain: [ { name, id, sprite } ] up to full chain,
 * }
 */

const API = "https://pokeapi.co/api/v2";

const simpleCache = {
  pokemon: new Map(),
  species: new Map(),
  ability: new Map(),
  move: new Map(),
  evo: new Map(),
  form: new Map(),
};

function idFromUrl(url) {
  if (!url) return null;
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export default function usePokemon(idOrName) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [images, setImages] = useState([]); // {key,label,url}
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [abilityInfo, setAbilityInfo] = useState(null);
  const [evoChain, setEvoChain] = useState([]);
  const [movesPage, setMovesPage] = useState(0); // UI paging for moves
  const abortRef = useRef(null);

  useEffect(() => {
    if (!idOrName) {
      setLoading(false);
      return;
    }
    let active = true;
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // 1) fetch pokemon
        let p;
        if (simpleCache.pokemon.has(idOrName)) {
          p = simpleCache.pokemon.get(idOrName);
        } else {
          const r = await fetch(`${API}/pokemon/${idOrName}`, { signal: controller.signal });
          if (!r.ok) throw new Error(`Failed to fetch pokemon ${idOrName}`);
          p = await r.json();
          simpleCache.pokemon.set(p.name, p);
          simpleCache.pokemon.set(String(p.id), p);
        }
        if (!active) return;

        setPokemon(p);

        // 2) fetch species
        const spKey = p.species.name;
        let sp;
        if (simpleCache.species.has(spKey)) {
          sp = simpleCache.species.get(spKey);
        } else {
          const r2 = await fetch(`${API}/pokemon-species/${spKey}`, { signal: controller.signal });
          if (!r2.ok) throw new Error("Failed to fetch species");
          sp = await r2.json();
          simpleCache.species.set(sp.name, sp);
        }
        if (!active) return;
        setSpecies(sp);

        // 3) build image options: default + shiny, then try to prefetch forms as separate pokemon endpoints (if different)
        const imgs = [];
        const officialArtworkDefault = p?.sprites?.other?.["official-artwork"]?.front_default;
        const officialArtworkShiny = p?.sprites?.other?.["official-artwork"]?.front_shiny;
        imgs.push({
          key: "default",
          label: "default",
          url: officialArtworkDefault || p?.sprites?.front_default || null,
        });
        imgs.push({
          key: "shiny",
          label: "shiny",
          url: officialArtworkShiny || p?.sprites?.front_shiny || null,
        });

        const formNames = (p?.forms || []).map((f) => f.name).filter(Boolean);
        for (const name of formNames) {
          if (name === p.name) continue;
          if (simpleCache.form.has(name)) {
            const fp = simpleCache.form.get(name);
            imgs.push({
              key: `form:${name}`,
              label: name,
              url:
                fp?.sprites?.other?.["official-artwork"]?.front_default ||
                fp?.sprites?.front_default ||
                null,
            });
          } else {
            try {
              const r = await fetch(`${API}/pokemon/${name}`, { signal: controller.signal });
              if (r.ok) {
                const fp = await r.json();
                simpleCache.form.set(name, fp);
                imgs.push({
                  key: `form:${name}`,
                  label: name,
                  url:
                    fp?.sprites?.other?.["official-artwork"]?.front_default ||
                    fp?.sprites?.front_default ||
                    null,
                });
              }
            } catch (err) {
              void err;
            }
          }
        }

        const uniqueImgs = [];
        const seen = new Set();
        for (const it of imgs) {
          if (!it.url) continue;
          if (seen.has(it.url)) continue;
          seen.add(it.url);
          uniqueImgs.push(it);
        }

        setImages(uniqueImgs);
        setCurrentImageIndex(0);

        // 4) get primary ability details (first non-hidden ability)
        const abilityEntry = (p.abilities || []).find((a) => a && a.is_hidden === false) || p.abilities?.[0];
        if (abilityEntry && abilityEntry.ability) {
          const abName = abilityEntry.ability.name;
          if (simpleCache.ability.has(abName)) {
            setAbilityInfo(simpleCache.ability.get(abName));
          } else {
            try {
              const r = await fetch(`${API}/ability/${abName}`, { signal: controller.signal });
              if (r.ok) {
                const ab = await r.json();
                const englishEffect = (ab.effect_entries || []).find((e) => e.language.name === "en");
                const data = { name: ab.name, effect_entries: ab.effect_entries, short_effect: englishEffect?.short_effect || englishEffect?.effect || "" };
                simpleCache.ability.set(ab.name, data);
                setAbilityInfo(data);
              }
            } catch (err) {
              void err;
            }
          }
        } else {
          setAbilityInfo(null);
        }

        // 5) evolution chain (via species.evolution_chain.url)
        const evoUrl = sp?.evolution_chain?.url;
        if (evoUrl) {
          const evoId = idFromUrl(evoUrl);
          if (simpleCache.evo.has(evoId)) {
            setEvoChain(simpleCache.evo.get(evoId));
          } else {
            try {
              const r = await fetch(evoUrl, { signal: controller.signal });
              if (r.ok) {
                const evoData = await r.json();
                const chain = [];
                function traverse(node) {
                  if (!node) return;
                  const name = node.species?.name;
                  if (name) chain.push(name);
                  if (node.evolves_to && node.evolves_to.length) {
                    for (const child of node.evolves_to) traverse(child);
                  }
                }
                traverse(evoData.chain);
                const chainWithSprites = await Promise.all(
                  chain.slice(0, 6).map(async (sname) => {
                    try {
                      const r2 = await fetch(`${API}/pokemon/${sname}`, { signal: controller.signal });
                      if (!r2.ok) throw new Error("no");
                      const p2 = await r2.json();
                      return {
                        name: sname,
                        id: p2.id,
                        sprite:
                          p2.sprites?.other?.["official-artwork"]?.front_default ||
                          p2.sprites?.front_default ||
                          null,
                      };
                    } catch (err) {
                      void err;
                      return { name: sname, id: null, sprite: null };
                    }
                  })
                );
                simpleCache.evo.set(evoId, chainWithSprites);
                setEvoChain(chainWithSprites);
              }
            } catch (err) {
              void err;
            }
          }
        } else {
          setEvoChain([]);
        }

        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [idOrName]);

  // convenience: types, stats arrays
  const types = useMemo(() => (pokemon?.types || []).map((t) => t.type) || [], [pokemon]);
  const stats = useMemo(() => (pokemon?.stats || []).map((s) => ({ name: s.stat.name, value: s.base_stat })) || [], [pokemon]);
  const moves = useMemo(() => (pokemon?.moves || []).map((m) => m.move) || [], [pokemon]);

  const setImageIndexSafe = (idx) => {
    if (!images || images.length === 0) {
      setCurrentImageIndex(0);
      return;
    }
    const newIdx = ((idx % images.length) + images.length) % images.length;
    setCurrentImageIndex(newIdx);
  };

  function nextImage() {
    setImageIndexSafe(currentImageIndex + 1);
  }
  function prevImage() {
    setImageIndexSafe(currentImageIndex - 1);
  }

  // simple moves paging (2 per page)
  const movesPerPage = 2;
  const totalMovesPages = Math.ceil(moves.length / movesPerPage);

  const pagedMoves = useMemo(() => {
    const start = movesPage * movesPerPage;
    return moves.slice(start, start + movesPerPage);
  }, [moves, movesPage]);

  return {
    loading,
    error,
    pokemon,
    species,
    images,
    currentImageIndex,
    setCurrentImageIndex: setImageIndexSafe,
    nextImage,
    prevImage,
    types,
    ability: abilityInfo,
    stats,
    moves,
    pagedMoves,
    movesPage,
    setMovesPage,
    totalMovesPages,
    evoChain,
  };
}
