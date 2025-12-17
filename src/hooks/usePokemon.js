// src/hooks/usePokemon.js
import { useEffect, useMemo, useState, useRef } from "react";

/**
 * usePokemon(idOrName)
 * - returns core pokemon + species + images + evoChain etc.
 * - adds:
 *   - forms: p.forms array (each { name, url }) so UI can iterate /pokemon-form endpoints
 *   - clear: function to abort/clear hook state
 *   - heldItemsDetails: [{ name, sprite, raw }]
 *   - galleryImages, galleryIndex, nextGallery, prevGallery
 *   - gen5Gif, gen5GifShiny (constructed URLs)
 *   - cryUrl (if any audio URL found or discovered)
 */

const API = "https://pokeapi.co/api/v2";

const simpleCache = {
  pokemon: new Map(),
  species: new Map(),
  ability: new Map(),
  move: new Map(),
  form: new Map(),
  item: new Map(),
};

const overrideApiBase = (() => {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_OVERRIDE_API_URL) {
    return process.env.NEXT_PUBLIC_OVERRIDE_API_URL.trim().replace(/\/$/, "");
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_OVERRIDE_API_URL) {
    return (import.meta.env.VITE_OVERRIDE_API_URL || "").replace(/\/$/, "");
  }
  return "";
})();

async function fetchOverrideEntry(identifier, signal) {
  if (!overrideApiBase) return null;
  const key = String(identifier ?? "").trim();
  if (!key) return null;
  const url = `${overrideApiBase}/api/overrides/${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.override ?? null;
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    return null;
  }
}

function mapCustomHeldItems(items = []) {
  return items.map((item) => ({
    name: item.itemName,
    sprite: item.itemSprite ?? null,
    raw: item,
  }));
}

function idFromUrl(url) {
  if (!url) return null;
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

/** Recursively collect sprite/audio urls (png/gif/jpg/mp3/wav/ogg) */
function collectUrls(obj, out = new Set()) {
  if (!obj || typeof obj !== "object") return out;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === "string") {
      if (/\.(png|jpg|jpeg|gif|webp)$/i.test(v) || /\.(mp3|wav|ogg)$/i.test(v)) out.add(v);
    } else if (typeof v === "object") {
      collectUrls(v, out);
    }
  }
  return out;
}

export default function usePokemon(idOrName) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [images, setImages] = useState([]); // {key,label,url,sprite}
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [abilityInfo, setAbilityInfo] = useState(null);
  const [evoChain, setEvoChain] = useState([]);
  const [movesPage, setMovesPage] = useState(0);
  const [heldItemsDetails, setHeldItemsDetails] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [cryUrl, setCryUrl] = useState(null);
  const [overrideData, setOverrideData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // NEW: forms array (from p.forms)
  const [forms, setForms] = useState([]);

  // to support clearing state externally
  const abortRef = useRef(null);
  const clearedRef = useRef(false);

  useEffect(() => {
    // reset cleared flag on id change
    clearedRef.current = false;
  }, [idOrName]);

  useEffect(() => {
    if (idOrName === undefined || idOrName === null || idOrName === "") {
      // if given empty id, set to not loading and clear all data
      setLoading(false);
      setError(null);
      setPokemon(null);
      setSpecies(null);
      setImages([]);
      setCurrentImageIndex(0);
      setAbilityInfo(null);
      setEvoChain([]);
      setMovesPage(0);
      setHeldItemsDetails([]);
      setGalleryImages([]);
      setGalleryIndex(0);
      setForms([]);
      setCryUrl(null);
      return;
    }

    let active = true;
    // abort any previous
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // 1) fetch pokemon (with caching)
        let p;
        const requested = String(idOrName).toLowerCase();
        if (simpleCache.pokemon.has(requested)) {
          p = simpleCache.pokemon.get(requested);
        } else {
          const r = await fetch(`${API}/pokemon/${encodeURIComponent(requested)}`, { signal: controller.signal });
          if (!r.ok) throw new Error(`Failed to fetch pokemon ${requested}`);
          p = await r.json();
          simpleCache.pokemon.set(p.name, p);
          simpleCache.pokemon.set(String(p.id), p);
        }
        if (!active) return;
        setPokemon(p);

        // set forms array (pokemon endpoint includes p.forms which are links to /pokemon-form/:id)
        setForms(Array.isArray(p.forms) ? p.forms.slice() : []);

        // attempt to discover any audio URL in the payload (some datasets may include)
        (function findAudioUrl(obj) {
          const urls = collectUrls(obj);
          for (const u of urls) {
            if (/\.(mp3|wav|ogg)$/i.test(u)) {
              setCryUrl(u);
              return;
            }
          }
          setCryUrl(null);
        })(p);

        // 2) fetch species (cached)
        const spKey = p.species?.name;
        let sp = null;
        if (spKey) {
          if (simpleCache.species.has(spKey)) {
            sp = simpleCache.species.get(spKey);
          } else {
            const r2 = await fetch(`${API}/pokemon-species/${encodeURIComponent(spKey)}`, { signal: controller.signal });
            if (r2.ok) {
              sp = await r2.json();
              simpleCache.species.set(sp.name, sp);
            }
          }
        }
        if (!active) return;
        setSpecies(sp);

        let override = null;
        if (overrideApiBase) {
          override = await fetchOverrideEntry(p.id ?? p.name, controller.signal);
        }
        if (!active) return;
        setOverrideData(override);

        // 3) build image options: default + shiny, then try to prefetch forms / varieties
        const imgs = [];
        function pushImage(key, label, artworkUrl, spriteUrl) {
          const displayUrl = artworkUrl || spriteUrl || null;
          if (!displayUrl) return;
          imgs.push({
            key,
            label,
            url: displayUrl,
            sprite: spriteUrl || displayUrl,
          });
        }

        const baseArtwork =
          override?.artNormal || p?.sprites?.other?.["official-artwork"]?.front_default || p?.sprites?.front_default || null;
        const baseSprite = override?.spriteNormal || p?.sprites?.front_default || null;
        const baseShinyArtwork =
          override?.artShiny || p?.sprites?.other?.["official-artwork"]?.front_shiny || p?.sprites?.front_shiny || null;
        const baseShinySprite = override?.spriteShiny || p?.sprites?.front_shiny || null;

        // base (non-shiny) first
        pushImage("default", p.name, baseArtwork, baseSprite);
        // shiny counterpart
        pushImage("shiny", `${p.name} (shiny)`, baseShinyArtwork, baseShinySprite);

        // forms (distinct pokemon-form endpoints are referenced in p.forms). For each form, try to get images:
        const formNames = (p?.forms || []).map((f) => f.name).filter(Boolean);
        for (const name of formNames) {
          if (name === p.name) continue;
          try {
            let fp;
            if (simpleCache.form.has(name)) {
              fp = simpleCache.form.get(name);
            } else {
              // Fetch the pokemon representation for the form name: often form names can be used as pokemon/{name}
              const r = await fetch(`${API}/pokemon/${encodeURIComponent(name)}`, { signal: controller.signal });
              if (r.ok) {
                fp = await r.json();
                simpleCache.form.set(name, fp);
              } else {
                // If /pokemon/:name is not available, just skip gracefully
                fp = null;
              }
            }
            if (!fp) continue;
            const art = fp?.sprites?.other?.["official-artwork"]?.front_default || fp?.sprites?.front_default || null;
            const sprite = fp?.sprites?.front_default || null;
            const artShiny = fp?.sprites?.other?.["official-artwork"]?.front_shiny || fp?.sprites?.front_shiny || null;
            const spriteShiny = fp?.sprites?.front_shiny || null;
            pushImage(`form:${fp.name}`, fp.name, art, sprite);
            pushImage(`form-shiny:${fp.name}`, `${fp.name} (shiny)`, artShiny, spriteShiny);
          } catch (err) {
            // swallow but continue
            void err;
          }
        }

        // varieties from species (alolan/galarian/hisuian etc.)
        const varietyNames = (sp?.varieties || []).map((v) => v.pokemon?.name).filter(Boolean);
        for (const vname of varietyNames) {
          if (vname === p.name) continue;
          try {
            let vp;
            if (simpleCache.pokemon.has(vname)) {
              vp = simpleCache.pokemon.get(vname);
            } else {
              const r = await fetch(`${API}/pokemon/${encodeURIComponent(vname)}`, { signal: controller.signal });
              if (r.ok) {
                vp = await r.json();
                simpleCache.pokemon.set(vp.name, vp);
              }
            }
            if (!vp) continue;
            const art = vp?.sprites?.other?.["official-artwork"]?.front_default || vp?.sprites?.front_default || null;
            const sprite = vp?.sprites?.front_default || null;
            const artShiny = vp?.sprites?.other?.["official-artwork"]?.front_shiny || vp?.sprites?.front_shiny || null;
            const spriteShiny = vp?.sprites?.front_shiny || null;
            pushImage(`variety:${vp.name}`, vp.name, art, sprite);
            pushImage(`variety-shiny:${vp.name}`, `${vp.name} (shiny)`, artShiny, spriteShiny);
          } catch (err) {
            void err;
          }
        }

        // dedupe images by url (preserve order)
        const uniqueImgs = [];
        const seen = new Set();
        for (const it of imgs) {
          if (!it || !it.url) continue;
          const dedupKey = `${it.label || ""}__${it.url}`;
          if (seen.has(dedupKey)) continue;
          seen.add(dedupKey);
          uniqueImgs.push(it);
        }

        // build a quick local mapping label->index (lowercased)
        const localIndexByName = {};
        uniqueImgs.forEach((it, idx) => {
          if (!it || !it.label) return;
          const lbl = String(it.label).toLowerCase();
          localIndexByName[lbl] = idx;
          const cleaned = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
          if (cleaned) localIndexByName[cleaned] = idx;
        });

        // pick a sensible start index preferring non-shiny base variants
        const baseKey = (p.name || "").toLowerCase();
        let startIndex = -1;
        // 1) exact non-shiny label equal to pokemon.name
        startIndex = uniqueImgs.findIndex((it) => String(it.label || "").toLowerCase() === baseKey);
        // 2) match after stripping "(shiny)"
        if (startIndex === -1) {
          startIndex = uniqueImgs.findIndex((it) => {
            const lbl = String(it.label || "").toLowerCase();
            return lbl.replace(/\s*\(shiny\)\s*$/, "").trim() === baseKey;
          });
        }
        // 3) first non-shiny entry
        if (startIndex === -1) {
          startIndex = uniqueImgs.findIndex((it) => {
            const lbl = String(it.label || "").toLowerCase();
            return !lbl.includes("(shiny)");
          });
        }
        // 4) fallback to first available
        if (startIndex === -1) startIndex = 0;

        setImages(uniqueImgs);
        setCurrentImageIndex(startIndex);

        // gallery images are the artwork/url list (used by up/down gallery navigation)
        const gallery = uniqueImgs.map((i) => i.url).filter(Boolean);
        setGalleryImages(gallery);
        setGalleryIndex(0);

        // 4) primary ability details
        const abilityEntry = (p.abilities || []).find((a) => a && a.is_hidden === false) || p.abilities?.[0];
        if (abilityEntry && abilityEntry.ability) {
          const abName = abilityEntry.ability.name;
          if (simpleCache.ability.has(abName)) {
            setAbilityInfo(simpleCache.ability.get(abName));
          } else {
            try {
              const r = await fetch(`${API}/ability/${encodeURIComponent(abName)}`, { signal: controller.signal });
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

        // 5) held items: fetch item sprites if any
        async function fetchHeldItemsDetails() {
          const held = p.held_items || [];
          if (!held || !held.length) {
            setHeldItemsDetails([]);
            return;
          }
          const res = await Promise.all(
            held.map(async (hi) => {
              const itemName = hi?.item?.name;
              if (!itemName) return null;
              try {
                if (simpleCache.item.has(itemName)) {
                  const it = simpleCache.item.get(itemName);
                  const spriteUrl = it?.sprites?.default ?? it?.sprites?.["default"] ?? null;
                  return { name: itemName, sprite: spriteUrl, raw: it };
                }
                const r = await fetch(`${API}/item/${encodeURIComponent(itemName)}`, { signal: controller.signal });
                if (!r.ok) throw new Error("no");
                const it = await r.json();
                simpleCache.item.set(itemName, it);
                const spriteUrl = it?.sprites?.default ?? it?.sprites?.["default"] ?? null;
                return { name: itemName, sprite: spriteUrl, raw: it };
              } catch (err) {
                void err;
                return { name: itemName, sprite: null, raw: null };
              }
            })
          );
          setHeldItemsDetails(res.filter(Boolean));
        }
        if (override?.heldItems?.length) {
          setHeldItemsDetails(mapCustomHeldItems(override.heldItems));
        } else {
          await fetchHeldItemsDetails();
        }

        // 6) evolution chain
        const evoUrl = sp?.evolution_chain?.url;
        if (evoUrl) {
          try {
            const r = await fetch(evoUrl, { signal: controller.signal });
            if (!r.ok) throw new Error("Failed to fetch evolution chain");
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
                  const r2 = await fetch(`${API}/pokemon/${encodeURIComponent(sname)}`, { signal: controller.signal });
                  if (!r2.ok) throw new Error("no");
                  const p2 = await r2.json();
                  let overrideSprite = null;
                  try {
                    const ov = await fetchOverrideEntry(p2.id ?? sname, controller.signal);
                    // Only prefer override artwork; do not fall back to override sprites for evo tiles.
                    overrideSprite = ov?.artNormal ? ov.artNormal : null;
                  } catch (err) {
                    void err;
                  }
                  const sprite =
                    overrideSprite ||
                    p2.sprites?.other?.["official-artwork"]?.front_default ||
                    p2.sprites?.front_default ||
                    p2.sprites?.other?.home?.front_default ||
                    p2.sprites?.other?.showdown?.front_default ||
                    null;
                  return {
                    name: sname,
                    id: p2.id,
                    sprite,
                  };
                } catch (err) {
                  void err;
                  return { name: sname, id: null, sprite: null };
                }
              })
            );
            setEvoChain(chainWithSprites);
          } catch (err) {
            void err;
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
  }, [idOrName, refreshKey]);

  // convenience: types, stats arrays
  const types = useMemo(() => (pokemon?.types || []).map((t) => t.type) || [], [pokemon]);
  const stats = useMemo(() => (pokemon?.stats || []).map((s) => ({ name: s.stat.name, value: s.base_stat })) || [], [pokemon]);
  const moves = useMemo(() => (pokemon?.moves || []).map((m) => m.move) || [], [pokemon]);

  // gallery navigation (artwork images)
  const nextGallery = () => {
    if (!galleryImages || galleryImages.length <= 1) return;
    setGalleryIndex((i) => (i + 1) % galleryImages.length);
  };
  const prevGallery = () => {
    if (!galleryImages || galleryImages.length <= 1) return;
    setGalleryIndex((i) => ((i - 1 + galleryImages.length) % galleryImages.length));
  };

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
  const totalMovesPages = Math.max(1, Math.ceil(moves.length / movesPerPage));

  const pagedMoves = useMemo(() => {
    const start = movesPage * movesPerPage;
    return moves.slice(start, start + movesPerPage);
  }, [moves, movesPage]);

  // imageIndexByName (lowercased map)
  const imageIndexByName = useMemo(() => {
    const map = {};
    images.forEach((it, idx) => {
      if (!it) return;
      const label = String(it.label || "").toLowerCase();
      if (label) map[label] = idx;
      const cleaned = label.replace(/\s*\(shiny\)\s*$/, "").trim();
      if (cleaned) map[cleaned] = idx;
    });
    return map;
  }, [images]);

  // identify megaVariants and otherForms (non-shiny, non-base)
  const { megaVariants, otherForms } = useMemo(() => {
    const lowerImgs = images.map((i) => (i?.label || "").toLowerCase());
    const m = [];
    const o = [];
    const base = (pokemon?.name || "").toLowerCase();
    for (const lbl of lowerImgs) {
      if (!lbl) continue;
      if (lbl.includes("(shiny)")) continue;
      if (lbl.includes("mega")) {
        m.push(lbl);
      } else if (lbl !== base) {
        o.push(lbl);
      }
    }
    return { megaVariants: Array.from(new Set(m)), otherForms: Array.from(new Set(o)) };
  }, [images, pokemon]);

  // Gen5 BW animated front gif URLs (constructed)
  const gen5Gif = useMemo(() => {
    if (!pokemon?.id) return null;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;
  }, [pokemon?.id]);
  const gen5GifShiny = useMemo(() => {
    if (!pokemon?.id) return null;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${pokemon.id}.gif`;
  }, [pokemon?.id]);

  const defaultFlavorText = useMemo(() => {
    const text =
      species?.flavor_text_entries?.find((f) => f.language.name === "en")?.flavor_text?.replace(/\n|\f/g, " ") ?? "";
    return text || "No data.";
  }, [species]);

  const flavorText = overrideData?.description || defaultFlavorText;
  const displayName = overrideData?.displayName || pokemon?.name || "";

  // Reset/clear function to be called from component (so RESET button works)
  function clear() {
    // abort any in-flight requests
    try {
      abortRef.current?.abort?.();
    } catch (e) {
      void e;
    }
    clearedRef.current = true;
    setLoading(false);
    setError(null);
    setPokemon(null);
    setSpecies(null);
    setImages([]);
    setCurrentImageIndex(0);
    setAbilityInfo(null);
    setEvoChain([]);
    setMovesPage(0);
    setHeldItemsDetails([]);
    setGalleryImages([]);
    setGalleryIndex(0);
    setForms([]);
    setCryUrl(null);
    setOverrideData(null);
  }

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  // convenience exposures
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
    megaVariants,
    otherForms,
    imageIndexByName,
    // new / useful additions
    heldItemsDetails,
    galleryImages,
    galleryIndex,
    nextGallery,
    prevGallery,
    gen5Gif,
    gen5GifShiny,
    cryUrl,
    override: overrideData,
    displayName,
    flavorText,
    // added
    forms,
    clear,
    refresh,
  };
}
