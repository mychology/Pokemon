(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/Pokemon/poke-app/src/hooks/usePokemon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/hooks/usePokemon.js
__turbopack_context__.s([
    "default",
    ()=>usePokemon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Documents/Pokemon/poke-app/src/hooks/usePokemon.js")}`;
    }
};
var _s = __turbopack_context__.k.signature();
;
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
 */ const API = "https://pokeapi.co/api/v2";
const simpleCache = {
    pokemon: new Map(),
    species: new Map(),
    ability: new Map(),
    move: new Map(),
    form: new Map(),
    item: new Map()
};
const overrideApiBase = (()=>{
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && ("TURBOPACK compile-time value", "http://localhost:4000")) {
        return ("TURBOPACK compile-time value", "http://localhost:4000").trim().replace(/\/$/, "");
    }
    if (("TURBOPACK compile-time value", "object") !== "undefined" && __TURBOPACK__import$2e$meta__.env?.VITE_OVERRIDE_API_URL) {
        return (__TURBOPACK__import$2e$meta__.env.VITE_OVERRIDE_API_URL || "").replace(/\/$/, "");
    }
    return "";
})();
async function fetchOverrideEntry(identifier, signal) {
    if (!overrideApiBase) return null;
    const key = String(identifier ?? "").trim();
    if (!key) return null;
    const url = `${overrideApiBase}/api/overrides/${encodeURIComponent(key)}`;
    try {
        const res = await fetch(url, {
            signal
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.override ?? null;
    } catch (err) {
        if (err?.name === "AbortError") throw err;
        return null;
    }
}
function mapCustomHeldItems(items = []) {
    return items.map((item)=>({
            name: item.itemName,
            sprite: item.itemSprite ?? null,
            raw: item
        }));
}
function idFromUrl(url) {
    if (!url) return null;
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
}
/** Recursively collect sprite/audio urls (png/gif/jpg/mp3/wav/ogg) */ function collectUrls(obj, out = new Set()) {
    if (!obj || typeof obj !== "object") return out;
    for (const k of Object.keys(obj)){
        const v = obj[k];
        if (typeof v === "string") {
            if (/\.(png|jpg|jpeg|gif|webp)$/i.test(v) || /\.(mp3|wav|ogg)$/i.test(v)) out.add(v);
        } else if (typeof v === "object") {
            collectUrls(v, out);
        }
    }
    return out;
}
function usePokemon(idOrName) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pokemon, setPokemon] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [species, setSpecies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // {key,label,url,sprite}
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [abilityInfo, setAbilityInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [evoChain, setEvoChain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [movesPage, setMovesPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [heldItemsDetails, setHeldItemsDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [galleryIndex, setGalleryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [galleryImages, setGalleryImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cryUrl, setCryUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [overrideData, setOverrideData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // NEW: forms array (from p.forms)
    const [forms, setForms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // to support clearing state externally
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePokemon.useEffect": ()=>{
            // reset cleared flag on id change
            clearedRef.current = false;
        }
    }["usePokemon.useEffect"], [
        idOrName
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePokemon.useEffect": ()=>{
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
            ({
                "usePokemon.useEffect": async ()=>{
                    try {
                        // 1) fetch pokemon (with caching)
                        let p;
                        const requested = String(idOrName).toLowerCase();
                        if (simpleCache.pokemon.has(requested)) {
                            p = simpleCache.pokemon.get(requested);
                        } else {
                            const r = await fetch(`${API}/pokemon/${encodeURIComponent(requested)}`, {
                                signal: controller.signal
                            });
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
                            for (const u of urls){
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
                                const r2 = await fetch(`${API}/pokemon-species/${encodeURIComponent(spKey)}`, {
                                    signal: controller.signal
                                });
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
                                sprite: spriteUrl || displayUrl
                            });
                        }
                        const baseArtwork = override?.artNormal || p?.sprites?.other?.["official-artwork"]?.front_default || p?.sprites?.front_default || null;
                        const baseSprite = override?.spriteNormal || p?.sprites?.front_default || null;
                        const baseShinyArtwork = override?.artShiny || p?.sprites?.other?.["official-artwork"]?.front_shiny || p?.sprites?.front_shiny || null;
                        const baseShinySprite = override?.spriteShiny || p?.sprites?.front_shiny || null;
                        // base (non-shiny) first
                        pushImage("default", p.name, baseArtwork, baseSprite);
                        // shiny counterpart
                        pushImage("shiny", `${p.name} (shiny)`, baseShinyArtwork, baseShinySprite);
                        // forms (distinct pokemon-form endpoints are referenced in p.forms). For each form, try to get images:
                        const formNames = (p?.forms || []).map({
                            "usePokemon.useEffect.formNames": (f)=>f.name
                        }["usePokemon.useEffect.formNames"]).filter(Boolean);
                        for (const name of formNames){
                            if (name === p.name) continue;
                            try {
                                let fp;
                                if (simpleCache.form.has(name)) {
                                    fp = simpleCache.form.get(name);
                                } else {
                                    // Fetch the pokemon representation for the form name: often form names can be used as pokemon/{name}
                                    const r = await fetch(`${API}/pokemon/${encodeURIComponent(name)}`, {
                                        signal: controller.signal
                                    });
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
                        const varietyNames = (sp?.varieties || []).map({
                            "usePokemon.useEffect.varietyNames": (v)=>v.pokemon?.name
                        }["usePokemon.useEffect.varietyNames"]).filter(Boolean);
                        for (const vname of varietyNames){
                            if (vname === p.name) continue;
                            try {
                                let vp;
                                if (simpleCache.pokemon.has(vname)) {
                                    vp = simpleCache.pokemon.get(vname);
                                } else {
                                    const r = await fetch(`${API}/pokemon/${encodeURIComponent(vname)}`, {
                                        signal: controller.signal
                                    });
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
                        for (const it of imgs){
                            if (!it || !it.url) continue;
                            const dedupKey = `${it.label || ""}__${it.url}`;
                            if (seen.has(dedupKey)) continue;
                            seen.add(dedupKey);
                            uniqueImgs.push(it);
                        }
                        // build a quick local mapping label->index (lowercased)
                        const localIndexByName = {};
                        uniqueImgs.forEach({
                            "usePokemon.useEffect": (it, idx)=>{
                                if (!it || !it.label) return;
                                const lbl = String(it.label).toLowerCase();
                                localIndexByName[lbl] = idx;
                                const cleaned = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
                                if (cleaned) localIndexByName[cleaned] = idx;
                            }
                        }["usePokemon.useEffect"]);
                        // pick a sensible start index preferring non-shiny base variants
                        const baseKey = (p.name || "").toLowerCase();
                        let startIndex = -1;
                        // 1) exact non-shiny label equal to pokemon.name
                        startIndex = uniqueImgs.findIndex({
                            "usePokemon.useEffect": (it)=>String(it.label || "").toLowerCase() === baseKey
                        }["usePokemon.useEffect"]);
                        // 2) match after stripping "(shiny)"
                        if (startIndex === -1) {
                            startIndex = uniqueImgs.findIndex({
                                "usePokemon.useEffect": (it)=>{
                                    const lbl = String(it.label || "").toLowerCase();
                                    return lbl.replace(/\s*\(shiny\)\s*$/, "").trim() === baseKey;
                                }
                            }["usePokemon.useEffect"]);
                        }
                        // 3) first non-shiny entry
                        if (startIndex === -1) {
                            startIndex = uniqueImgs.findIndex({
                                "usePokemon.useEffect": (it)=>{
                                    const lbl = String(it.label || "").toLowerCase();
                                    return !lbl.includes("(shiny)");
                                }
                            }["usePokemon.useEffect"]);
                        }
                        // 4) fallback to first available
                        if (startIndex === -1) startIndex = 0;
                        setImages(uniqueImgs);
                        setCurrentImageIndex(startIndex);
                        // gallery images are the artwork/url list (used by up/down gallery navigation)
                        const gallery = uniqueImgs.map({
                            "usePokemon.useEffect.gallery": (i)=>i.url
                        }["usePokemon.useEffect.gallery"]).filter(Boolean);
                        setGalleryImages(gallery);
                        setGalleryIndex(0);
                        // 4) primary ability details
                        const abilityEntry = (p.abilities || []).find({
                            "usePokemon.useEffect": (a)=>a && a.is_hidden === false
                        }["usePokemon.useEffect"]) || p.abilities?.[0];
                        if (abilityEntry && abilityEntry.ability) {
                            const abName = abilityEntry.ability.name;
                            if (simpleCache.ability.has(abName)) {
                                setAbilityInfo(simpleCache.ability.get(abName));
                            } else {
                                try {
                                    const r = await fetch(`${API}/ability/${encodeURIComponent(abName)}`, {
                                        signal: controller.signal
                                    });
                                    if (r.ok) {
                                        const ab = await r.json();
                                        const englishEffect = (ab.effect_entries || []).find({
                                            "usePokemon.useEffect.englishEffect": (e)=>e.language.name === "en"
                                        }["usePokemon.useEffect.englishEffect"]);
                                        const data = {
                                            name: ab.name,
                                            effect_entries: ab.effect_entries,
                                            short_effect: englishEffect?.short_effect || englishEffect?.effect || ""
                                        };
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
                            const res = await Promise.all(held.map({
                                "usePokemon.useEffect.fetchHeldItemsDetails": async (hi)=>{
                                    const itemName = hi?.item?.name;
                                    if (!itemName) return null;
                                    try {
                                        if (simpleCache.item.has(itemName)) {
                                            const it = simpleCache.item.get(itemName);
                                            const spriteUrl = it?.sprites?.default ?? it?.sprites?.["default"] ?? null;
                                            return {
                                                name: itemName,
                                                sprite: spriteUrl,
                                                raw: it
                                            };
                                        }
                                        const r = await fetch(`${API}/item/${encodeURIComponent(itemName)}`, {
                                            signal: controller.signal
                                        });
                                        if (!r.ok) throw new Error("no");
                                        const it = await r.json();
                                        simpleCache.item.set(itemName, it);
                                        const spriteUrl = it?.sprites?.default ?? it?.sprites?.["default"] ?? null;
                                        return {
                                            name: itemName,
                                            sprite: spriteUrl,
                                            raw: it
                                        };
                                    } catch (err) {
                                        void err;
                                        return {
                                            name: itemName,
                                            sprite: null,
                                            raw: null
                                        };
                                    }
                                }
                            }["usePokemon.useEffect.fetchHeldItemsDetails"]));
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
                                const r = await fetch(evoUrl, {
                                    signal: controller.signal
                                });
                                if (!r.ok) throw new Error("Failed to fetch evolution chain");
                                const evoData = await r.json();
                                const chain = [];
                                function traverse(node) {
                                    if (!node) return;
                                    const name = node.species?.name;
                                    if (name) chain.push(name);
                                    if (node.evolves_to && node.evolves_to.length) {
                                        for (const child of node.evolves_to)traverse(child);
                                    }
                                }
                                traverse(evoData.chain);
                                const chainWithSprites = await Promise.all(chain.slice(0, 6).map({
                                    "usePokemon.useEffect": async (sname)=>{
                                        try {
                                            const r2 = await fetch(`${API}/pokemon/${encodeURIComponent(sname)}`, {
                                                signal: controller.signal
                                            });
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
                                            const sprite = overrideSprite || p2.sprites?.other?.["official-artwork"]?.front_default || p2.sprites?.front_default || p2.sprites?.other?.home?.front_default || p2.sprites?.other?.showdown?.front_default || null;
                                            return {
                                                name: sname,
                                                id: p2.id,
                                                sprite
                                            };
                                        } catch (err) {
                                            void err;
                                            return {
                                                name: sname,
                                                id: null,
                                                sprite: null
                                            };
                                        }
                                    }
                                }["usePokemon.useEffect"]));
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
                }
            })["usePokemon.useEffect"]();
            return ({
                "usePokemon.useEffect": ()=>{
                    active = false;
                    controller.abort();
                }
            })["usePokemon.useEffect"];
        }
    }["usePokemon.useEffect"], [
        idOrName,
        refreshKey
    ]);
    // convenience: types, stats arrays
    const types = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[types]": ()=>(pokemon?.types || []).map({
                "usePokemon.useMemo[types]": (t)=>t.type
            }["usePokemon.useMemo[types]"]) || []
    }["usePokemon.useMemo[types]"], [
        pokemon
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[stats]": ()=>(pokemon?.stats || []).map({
                "usePokemon.useMemo[stats]": (s)=>({
                        name: s.stat.name,
                        value: s.base_stat
                    })
            }["usePokemon.useMemo[stats]"]) || []
    }["usePokemon.useMemo[stats]"], [
        pokemon
    ]);
    const moves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[moves]": ()=>(pokemon?.moves || []).map({
                "usePokemon.useMemo[moves]": (m)=>m.move
            }["usePokemon.useMemo[moves]"]) || []
    }["usePokemon.useMemo[moves]"], [
        pokemon
    ]);
    // gallery navigation (artwork images)
    const nextGallery = ()=>{
        if (!galleryImages || galleryImages.length <= 1) return;
        setGalleryIndex((i)=>(i + 1) % galleryImages.length);
    };
    const prevGallery = ()=>{
        if (!galleryImages || galleryImages.length <= 1) return;
        setGalleryIndex((i)=>(i - 1 + galleryImages.length) % galleryImages.length);
    };
    const setImageIndexSafe = (idx)=>{
        if (!images || images.length === 0) {
            setCurrentImageIndex(0);
            return;
        }
        const newIdx = (idx % images.length + images.length) % images.length;
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
    const pagedMoves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[pagedMoves]": ()=>{
            const start = movesPage * movesPerPage;
            return moves.slice(start, start + movesPerPage);
        }
    }["usePokemon.useMemo[pagedMoves]"], [
        moves,
        movesPage
    ]);
    // imageIndexByName (lowercased map)
    const imageIndexByName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[imageIndexByName]": ()=>{
            const map = {};
            images.forEach({
                "usePokemon.useMemo[imageIndexByName]": (it, idx)=>{
                    if (!it) return;
                    const label = String(it.label || "").toLowerCase();
                    if (label) map[label] = idx;
                    const cleaned = label.replace(/\s*\(shiny\)\s*$/, "").trim();
                    if (cleaned) map[cleaned] = idx;
                }
            }["usePokemon.useMemo[imageIndexByName]"]);
            return map;
        }
    }["usePokemon.useMemo[imageIndexByName]"], [
        images
    ]);
    // identify megaVariants and otherForms (non-shiny, non-base)
    const { megaVariants, otherForms } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo": ()=>{
            const lowerImgs = images.map({
                "usePokemon.useMemo.lowerImgs": (i)=>(i?.label || "").toLowerCase()
            }["usePokemon.useMemo.lowerImgs"]);
            const m = [];
            const o = [];
            const base = (pokemon?.name || "").toLowerCase();
            for (const lbl of lowerImgs){
                if (!lbl) continue;
                if (lbl.includes("(shiny)")) continue;
                if (lbl.includes("mega")) {
                    m.push(lbl);
                } else if (lbl !== base) {
                    o.push(lbl);
                }
            }
            return {
                megaVariants: Array.from(new Set(m)),
                otherForms: Array.from(new Set(o))
            };
        }
    }["usePokemon.useMemo"], [
        images,
        pokemon
    ]);
    // Gen5 BW animated front gif URLs (constructed)
    const gen5Gif = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[gen5Gif]": ()=>{
            if (!pokemon?.id) return null;
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;
        }
    }["usePokemon.useMemo[gen5Gif]"], [
        pokemon?.id
    ]);
    const gen5GifShiny = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[gen5GifShiny]": ()=>{
            if (!pokemon?.id) return null;
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${pokemon.id}.gif`;
        }
    }["usePokemon.useMemo[gen5GifShiny]"], [
        pokemon?.id
    ]);
    const defaultFlavorText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePokemon.useMemo[defaultFlavorText]": ()=>{
            const text = species?.flavor_text_entries?.find({
                "usePokemon.useMemo[defaultFlavorText]": (f)=>f.language.name === "en"
            }["usePokemon.useMemo[defaultFlavorText]"])?.flavor_text?.replace(/\n|\f/g, " ") ?? "";
            return text || "No data.";
        }
    }["usePokemon.useMemo[defaultFlavorText]"], [
        species
    ]);
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
        setRefreshKey((k)=>k + 1);
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
        refresh
    };
}
_s(usePokemon, "Oc/1fjhU60KKreqNPEt8AKtdNfg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/SizeComparison.jsx
__turbopack_context__.s([
    "default",
    ()=>SizeComparison
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function SizeComparison({ silhouetteSrc, humanSrc, pokemonHeightMeters, pokemonWeightKg }) {
    _s();
    const visualRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [visualH, setVisualH] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // canonical human height (4'9") in meters
    const HUMAN_METERS = 1.4478;
    // measure available visual area
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SizeComparison.useEffect": ()=>{
            if (!visualRef.current) return;
            const ro = new ResizeObserver({
                "SizeComparison.useEffect": ()=>{
                    const h = visualRef.current.clientHeight;
                    setVisualH(h);
                }
            }["SizeComparison.useEffect"]);
            ro.observe(visualRef.current);
            // seed initial
            setVisualH(visualRef.current.clientHeight);
            return ({
                "SizeComparison.useEffect": ()=>ro.disconnect()
            })["SizeComparison.useEffect"];
        }
    }["SizeComparison.useEffect"], []);
    // convert helpers
    function metersToFeetAndInches(meters) {
        if (!meters && meters !== 0) return "N/A";
        const totalInches = meters * 39.3700787;
        const ft = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches - ft * 12);
        return `${ft}'${inches}"`;
    }
    function formatKg(kg) {
        if (!kg && kg !== 0) return "N/A";
        // show one decimal for kg if < 100, whole number otherwise
        return kg < 100 ? `${Math.round(kg * 10) / 10} kg` : `${Math.round(kg)} kg`;
    }
    // compute pixel heights. We'll allow up to 86% of visualRef height for figures (leave top/bottom padding)
    const maxFigurePx = Math.max(1, Math.floor(visualH * 0.86)); // avoid zero
    const pMeters = typeof pokemonHeightMeters === "number" && pokemonHeightMeters > 0 ? pokemonHeightMeters : null;
    const humanMeters = HUMAN_METERS;
    // scale so both fit and keep real-world ratio. Prefer to fill the container with the pokemon.
    let scalePxPerMeter = 1;
    if (pMeters) {
        const scaleIfPokemonMax = maxFigurePx / pMeters;
        const humanPxIfPokemonMax = humanMeters * scaleIfPokemonMax;
        if (humanPxIfPokemonMax <= maxFigurePx * 1.05) {
            scalePxPerMeter = scaleIfPokemonMax;
        } else {
            const maxMeters = Math.max(pMeters, humanMeters);
            scalePxPerMeter = maxFigurePx / maxMeters;
        }
    } else {
        scalePxPerMeter = maxFigurePx / humanMeters;
    }
    const pokemonPx = Math.max(1, Math.round((pMeters || humanMeters) * scalePxPerMeter));
    const humanPx = Math.max(1, Math.round(humanMeters * scalePxPerMeter));
    // Pull human slightly left so silhouettes are closer
    // (increase magnitude to bring them closer; decrease to separate)
    const humanPull = -10; // px; tuned to pull the human left so both look centered
    const hasSilhouette = !!silhouetteSrc; // treat empty string / null / undefined as no silhouette
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "panel-inner rounded-lg p-2 border border-gray-200",
        style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 6
                },
                children: "SIZE COMPARISON"
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: visualRef,
                style: {
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: 4,
                    flex: 1,
                    minHeight: 0
                },
                children: hasSilhouette ? // Two-column layout: pokemon silhouette (left) + human (right)
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                                width: "52%",
                                minWidth: 0
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "relative",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "flex-end"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: silhouetteSrc,
                                    alt: "pokemon silhouette",
                                    style: {
                                        height: `${pokemonPx}px`,
                                        width: "auto",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        filter: "brightness(0)",
                                        imageRendering: "pixelated",
                                        display: "block",
                                        pointerEvents: "none"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                                    lineNumber: 113,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                                lineNumber: 112,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                                width: "50%",
                                minWidth: 0,
                                marginLeft: humanPull,
                                boxSizing: "border-box"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "relative",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "flex-end"
                                },
                                children: humanSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: humanSrc,
                                    alt: "human comparison",
                                    style: {
                                        height: `${humanPx}px`,
                                        width: "auto",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        imageRendering: "pixelated",
                                        display: "block",
                                        pointerEvents: "none"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                                    lineNumber: 143,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: `${humanPx}px`,
                                        width: "36%",
                                        background: "#ddd",
                                        borderRadius: 3
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                                    lineNumber: 157,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                            lineNumber: 130,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : // No silhouette available (e.g. after reset) — center the human and do NOT show a black box
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        width: "100%",
                        minWidth: 0,
                        boxSizing: "border-box",
                        paddingLeft: 4,
                        paddingRight: 4
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end"
                        },
                        children: humanSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: humanSrc,
                            alt: "human comparison",
                            style: {
                                height: `${humanPx}px`,
                                width: "auto",
                                maxWidth: "100%",
                                objectFit: "contain",
                                imageRendering: "pixelated",
                                display: "block",
                                pointerEvents: "none"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                            lineNumber: 178,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: `${humanPx}px`,
                                width: "36%",
                                background: "#ddd",
                                borderRadius: 3
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                            lineNumber: 192,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                        lineNumber: 176,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                    lineNumber: 164,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 6,
                    paddingTop: 6,
                    fontSize: 4,
                    color: "#111",
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    alignItems: "baseline"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Ht: ",
                            pMeters ? metersToFeetAndInches(pMeters) : "N/A"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Wt: ",
                            typeof pokemonWeightKg === "number" ? formatKg(pokemonWeightKg) : "N/A"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
                lineNumber: 199,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(SizeComparison, "K4sCJRtFol1hJ9pnsPDmXUjxQ4E=");
_c = SizeComparison;
var _c;
__turbopack_context__.k.register(_c, "SizeComparison");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeldItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
function HeldItems({ heldItems = [] }) {
    const hasItems = Array.isArray(heldItems) && heldItems.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "gameboy-font",
        style: {
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 6,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    textAlign: "center",
                    width: "100%"
                },
                children: "HELD ITEMS"
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            !hasItems ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    flex: 1
                },
                children: "No held items"
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
                lineNumber: 43,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    flex: 1,
                    padding: "0 4px",
                    boxSizing: "border-box"
                },
                children: heldItems.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        title: it.name,
                        style: {
                            width: "100%",
                            maxWidth: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        },
                        children: it.sprite ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: it.sprite,
                            alt: it.name,
                            style: {
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                imageRendering: "pixelated",
                                display: "block"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
                            lineNumber: 82,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "gameboy-font",
                            style: {
                                fontSize: 6,
                                textAlign: "center"
                            },
                            children: it.name
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
                            lineNumber: 94,
                            columnNumber: 17
                        }, this)
                    }, it.name || it.sprite || Math.random(), false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = HeldItems;
var _c;
__turbopack_context__.k.register(_c, "HeldItems");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Pokemon/poke-app/src/lib/overrideApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHeldItemOverride",
    ()=>createHeldItemOverride,
    "deleteHeldItemOverride",
    ()=>deleteHeldItemOverride,
    "deleteOverrideEntry",
    ()=>deleteOverrideEntry,
    "fetchOverrideRecord",
    ()=>fetchOverrideRecord,
    "hasOverrideApi",
    ()=>hasOverrideApi,
    "overrideApiBase",
    ()=>overrideApiBase,
    "saveOverrideEntry",
    ()=>saveOverrideEntry,
    "uploadOverrideFile",
    ()=>uploadOverrideFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Documents/Pokemon/poke-app/src/lib/overrideApi.js")}`;
    }
};
const envUrl = (()=>{
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && ("TURBOPACK compile-time value", "http://localhost:4000")) {
        return "TURBOPACK compile-time value", "http://localhost:4000";
    }
    if (("TURBOPACK compile-time value", "object") !== "undefined" && __TURBOPACK__import$2e$meta__.env?.VITE_OVERRIDE_API_URL) {
        return __TURBOPACK__import$2e$meta__.env.VITE_OVERRIDE_API_URL;
    }
    return "";
})();
const baseUrl = envUrl ? envUrl.replace(/\/$/, "") : "";
const overrideApiBase = baseUrl;
const hasOverrideApi = true;
function ensureBaseUrl() {
    return baseUrl || "";
}
function buildIdentifierValue(identifier) {
    if (identifier == null) return "";
    return String(identifier);
}
async function fetchOverrideRecord(identifier, signal) {
    const normalized = buildIdentifierValue(identifier).trim();
    if (!normalized) return null;
    try {
        const res = await fetch(`${baseUrl || ""}/api/overrides/${encodeURIComponent(normalized)}`, {
            signal
        });
        if (res.status === 404) return null;
        if (!res.ok) return null;
        const data = await res.json();
        return data?.override ?? null;
    } catch (err) {
        if (err?.name === "AbortError") throw err;
        return null;
    }
}
async function authedFetch(path, { method = "GET", headers = {}, body } = {}, adminToken) {
    ensureBaseUrl();
    if (!adminToken) {
        throw new Error("Admin token is required for override operations.");
    }
    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            "x-admin-token": adminToken,
            ...headers
        },
        body
    });
    if (!res.ok) {
        const message = await res.text().catch(()=>res.statusText);
        throw new Error(message || "Override API request failed");
    }
    return res;
}
async function uploadOverrideFile(file, adminToken) {
    ensureBaseUrl();
    const formData = new FormData();
    formData.append("file", file);
    const res = await authedFetch(`/api/uploads`, {
        method: "POST",
        body: formData
    }, adminToken);
    return res.json();
}
async function saveOverrideEntry(identifier, payload, adminToken) {
    const normalized = buildIdentifierValue(identifier).trim();
    if (!normalized) throw new Error("Identifier required for override save.");
    const res = await authedFetch(`/api/overrides/${encodeURIComponent(normalized)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }, adminToken);
    return res.json();
}
async function deleteOverrideEntry(identifier, adminToken) {
    const normalized = buildIdentifierValue(identifier).trim();
    if (!normalized) return;
    await authedFetch(`/api/overrides/${encodeURIComponent(normalized)}`, {
        method: "DELETE"
    }, adminToken);
}
async function createHeldItemOverride(identifier, payload, adminToken) {
    const normalized = buildIdentifierValue(identifier).trim();
    if (!normalized) throw new Error("Identifier required for held item creation.");
    const res = await authedFetch(`/api/overrides/${encodeURIComponent(normalized)}/held-items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }, adminToken);
    return res.json();
}
async function deleteHeldItemOverride(identifier, itemId, adminToken) {
    const normalized = buildIdentifierValue(identifier).trim();
    if (!normalized || itemId == null) return;
    await authedFetch(`/api/overrides/${encodeURIComponent(normalized)}/held-items/${encodeURIComponent(itemId)}`, {
        method: "DELETE"
    }, adminToken);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Pokemon/poke-app/src/lib/assetMap.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const base = "/assets";
const assetMap = {
    bug: `${base}/bug.png`,
    dark: `${base}/dark.png`,
    dragon: `${base}/dragon.png`,
    electric: `${base}/electric.png`,
    fairy: `${base}/fairy.png`,
    fighting: `${base}/fighting.png`,
    fire: `${base}/fire.png`,
    flying: `${base}/flying.png`,
    ghost: `${base}/ghost.png`,
    grass: `${base}/grass.png`,
    ground: `${base}/ground.png`,
    ice: `${base}/ice.png`,
    normal: `${base}/normal.png`,
    poison: `${base}/poison.png`,
    psychic: `${base}/psychic.png`,
    rock: `${base}/rock.png`,
    steel: `${base}/steel.png`,
    water: `${base}/water.png`,
    "filter-bug": `${base}/filter-bug.svg`,
    "filter-dark": `${base}/filter-dark.svg`,
    "filter-dragon": `${base}/filter-dragon.svg`,
    "filter-electric": `${base}/filter-electric.svg`,
    "filter-fairy": `${base}/filter-fairy.svg`,
    "filter-fighting": `${base}/filter-fighting.svg`,
    "filter-fire": `${base}/filter-fire.svg`,
    "filter-flying": `${base}/filter-flying.svg`,
    "filter-ghost": `${base}/filter-ghost.svg`,
    "filter-grass": `${base}/filter-grass.svg`,
    "filter-ground": `${base}/filter-ground.svg`,
    "filter-ice": `${base}/filter-ice.svg`,
    "filter-normal": `${base}/filter-normal.svg`,
    "filter-poison": `${base}/filter-poison.svg`,
    "filter-psychic": `${base}/filter-psychic.svg`,
    "filter-rock": `${base}/filter-rock.svg`,
    "filter-steel": `${base}/filter-steel.svg`,
    "filter-water": `${base}/filter-water.svg`,
    mega: `${base}/mega.png`,
    "other-forms": `${base}/other-forms.png`,
    "other-forms.jpg": `${base}/other-forms.jpg`,
    "pokemon-filter": `${base}/pokemon-filter.png`,
    "pokedex-icon": `${base}/pokedex-icon.png`,
    "pokeball-bg": `${base}/pokeball-bg.png`,
    "pokeball-bg.jpg": `${base}/pokeball-bg.jpg`,
    "pokeball-large": `${base}/pokeball-large.png`,
    "pokeball-small": `${base}/pokeball-small.png`,
    "human_comp": `${base}/human_comp.png`,
    "human_comp.png": `${base}/human_comp.png`,
    "silhouette_default": `${base}/silhouette_default.png`,
    "silhouette_default.png": `${base}/silhouette_default.png`,
    "placeholder-200": `${base}/silhouette_default.png`,
    "placeholder-64": `${base}/silhouette_default.png`
};
const __TURBOPACK__default__export__ = assetMap;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/PokedexShell.jsx
__turbopack_context__.s([
    "default",
    ()=>PokedexShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$hooks$2f$usePokemon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/src/hooks/usePokemon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$components$2f$SizeComparison$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/src/components/SizeComparison.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$components$2f$HeldItems$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/src/components/HeldItems.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/src/lib/overrideApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/src/lib/assetMap.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const TYPE_FILTER_CACHE = new Map();
const ADMIN_TOKEN_KEY = "pokedex-admin-token";
function PokedexShell({ initial = 1 }) {
    _s();
    const [currentId, setCurrentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
    const { loading, error, pokemon, species, images = [], currentImageIndex, setCurrentImageIndex, types, ability, stats, pagedMoves, movesPage, setMovesPage, totalMovesPages, evoChain, megaVariants, otherForms, imageIndexByName, heldItemsDetails, // NOTE: forms and clear are provided by the updated hook
    forms: formsList = [], clear: clearPokemonState, cryUrl, displayName, flavorText, override: overrideInfo, refresh: refreshPokemonData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$hooks$2f$usePokemon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(currentId);
    // chevron tweak
    const CHEVRON_X_OFFSET = 0;
    // Frame for main artwork (clipping)
    const FRAME_X = 94;
    const FRAME_Y = 238;
    const FRAME_W = 316;
    const FRAME_H = 178;
    // lens/orb params
    const ORB_CX = 80;
    const ORB_CY = 118;
    const ORB_R = 50;
    const SPRITE_SCALE = 0.9;
    const spriteSide = ORB_R * 1.8 * SPRITE_SCALE;
    const [editMode, setEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [adminToken, setAdminToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [overrideDraft, setOverrideDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        slug: "",
        pokemonId: null,
        displayName: "",
        description: "",
        spriteNormal: null,
        spriteShiny: null,
        artNormal: null,
        artShiny: null,
        metadataJson: null
    });
    const [draftDirty, setDraftDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [operationStatus, setOperationStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [overrideBusy, setOverrideBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingUpload, setPendingUpload] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [newHeldItem, setNewHeldItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        sprite: "",
        notes: ""
    });
    const [heldItemBusy, setHeldItemBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showOverridePanel, setShowOverridePanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem(ADMIN_TOKEN_KEY);
            if (stored) setAdminToken(stored);
        }
    }["PokedexShell.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (adminToken) {
                window.localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
            } else {
                window.localStorage.removeItem(ADMIN_TOKEN_KEY);
            }
        }
    }["PokedexShell.useEffect"], [
        adminToken
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            setOverrideDraft({
                slug: (overrideInfo?.slug ?? pokemon?.name?.toLowerCase() ?? "").trim(),
                pokemonId: overrideInfo?.pokemonId ?? pokemon?.id ?? null,
                displayName: overrideInfo?.displayName ?? "",
                description: overrideInfo?.description ?? "",
                spriteNormal: overrideInfo?.spriteNormal ?? null,
                spriteShiny: overrideInfo?.spriteShiny ?? null,
                artNormal: overrideInfo?.artNormal ?? null,
                artShiny: overrideInfo?.artShiny ?? null,
                metadataJson: overrideInfo?.metadataJson ?? null
            });
            setDraftDirty(false);
        }
    }["PokedexShell.useEffect"], [
        pokemon?.id,
        pokemon?.name,
        overrideInfo?.id,
        overrideInfo?.updatedAt,
        overrideInfo?.spriteNormal,
        overrideInfo?.spriteShiny,
        overrideInfo?.artNormal,
        overrideInfo?.artShiny,
        overrideInfo?.displayName,
        overrideInfo?.description,
        overrideInfo?.metadataJson,
        overrideInfo?.pokemonId,
        overrideInfo?.slug
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            if (!operationStatus) return;
            const timer = setTimeout({
                "PokedexShell.useEffect.timer": ()=>setOperationStatus(null)
            }["PokedexShell.useEffect.timer"], 5000);
            return ({
                "PokedexShell.useEffect": ()=>clearTimeout(timer)
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], [
        operationStatus
    ]);
    const canEdit = editMode && __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"];
    const identifierForOverride = pokemon?.id ?? overrideDraft?.slug ?? overrideInfo?.slug ?? currentId ?? "";
    const overrideHeldItems = overrideInfo?.heldItems ?? [];
    function setStatusMessage(type, message) {
        if (!message) return;
        setOperationStatus({
            type,
            message,
            at: Date.now()
        });
    }
    function ensureAdminAccess() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"]) {
            setStatusMessage("error", "Set VITE_OVERRIDE_API_URL to enable overrides.");
            return null;
        }
        if (adminToken) return adminToken;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const token = window.prompt("Enter admin token");
        if (!token) {
            setStatusMessage("error", "Admin token is required to edit overrides.");
            return null;
        }
        setAdminToken(token.trim());
        return token.trim();
    }
    function buildOverridePayload(patch = {}) {
        const displayProvided = Object.prototype.hasOwnProperty.call(patch, "displayName");
        const descriptionProvided = Object.prototype.hasOwnProperty.call(patch, "description");
        const normalizedDisplay = displayProvided ? normalizeOptionalText(patch.displayName) : normalizeOptionalText(overrideDraft?.displayName ?? overrideInfo?.displayName ?? null);
        const normalizedDescription = descriptionProvided ? normalizeOptionalText(patch.description) : normalizeOptionalText(overrideDraft?.description ?? overrideInfo?.description ?? null);
        const slugCandidates = [
            patch.slug ? sanitizeSearchValue(patch.slug) : null,
            normalizedDisplay && displayProvided ? sanitizeSearchValue(patch.displayName ?? normalizedDisplay) : null,
            !displayProvided && overrideDraft?.displayName ? sanitizeSearchValue(overrideDraft.displayName) : null,
            overrideDraft?.slug ? sanitizeSearchValue(overrideDraft.slug) : null,
            overrideInfo?.slug ? sanitizeSearchValue(overrideInfo.slug) : null,
            pokemon?.name ? sanitizeSearchValue(pokemon.name) : null,
            typeof pokemon?.id === "number" ? sanitizeSearchValue(pokemon.id) : null,
            currentId ? sanitizeSearchValue(currentId) : null
        ].filter((val)=>val && String(val).trim().length > 0);
        const normalizedSlug = slugCandidates.length ? String(slugCandidates[0]).trim().toLowerCase() : "";
        const pokemonIdValue = (()=>{
            const direct = patch.pokemonId ?? overrideDraft?.pokemonId ?? overrideInfo?.pokemonId ?? pokemon?.id ?? (Number.isFinite(Number(currentId)) ? Number(currentId) : null);
            return direct ?? null;
        })();
        return {
            slug: normalizedSlug,
            pokemonId: pokemonIdValue,
            displayName: normalizedDisplay,
            description: normalizedDescription,
            spriteNormal: patch.spriteNormal !== undefined ? patch.spriteNormal : overrideDraft?.spriteNormal ?? null,
            spriteShiny: patch.spriteShiny !== undefined ? patch.spriteShiny : overrideDraft?.spriteShiny ?? null,
            artNormal: patch.artNormal !== undefined ? patch.artNormal : overrideDraft?.artNormal ?? null,
            artShiny: patch.artShiny !== undefined ? patch.artShiny : overrideDraft?.artShiny ?? null,
            metadataJson: patch.metadataJson !== undefined ? patch.metadataJson : overrideDraft?.metadataJson ?? null
        };
    }
    async function persistOverridePatch(patch, successMessage, providedToken) {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"]) {
            setStatusMessage("error", "Override API is not configured.");
            return null;
        }
        if (!identifierForOverride) {
            setStatusMessage("error", "Pokemon is not loaded yet.");
            return null;
        }
        const token = providedToken || ensureAdminAccess();
        if (!token) return null;
        const payload = buildOverridePayload(patch);
        if (!payload.pokemonId && !payload.slug) {
            setStatusMessage("error", "Missing pokemon identifier for override.");
            return null;
        }
        setOverrideBusy(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOverrideEntry"])(identifierForOverride, payload, token);
            const saved = res?.override ?? payload;
            setOverrideDraft({
                slug: saved.slug ?? payload.slug ?? "",
                pokemonId: saved.pokemonId ?? payload.pokemonId ?? null,
                displayName: saved.displayName ?? "",
                description: saved.description ?? "",
                spriteNormal: saved.spriteNormal ?? null,
                spriteShiny: saved.spriteShiny ?? null,
                artNormal: saved.artNormal ?? null,
                artShiny: saved.artShiny ?? null,
                metadataJson: saved.metadataJson ?? null
            });
            setDraftDirty(false);
            if (successMessage) {
                setStatusMessage("success", successMessage);
            } else {
                setStatusMessage("success", "Override saved.");
            }
            refreshPokemonData && refreshPokemonData();
            return saved;
        } catch (err) {
            setStatusMessage("error", err?.message || "Failed to save override.");
            throw err;
        } finally{
            setOverrideBusy(false);
        }
    }
    function beginUpload(target) {
        const token = ensureAdminAccess();
        if (!token) return;
        setPendingUpload({
            target,
            token
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    }
    function resolveUploadUrl(url) {
        if (!url) return null;
        if (/^https?:\/\//i.test(url)) return url;
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["overrideApiBase"]) return url;
        if (url.startsWith("/")) return `${__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["overrideApiBase"]}${url}`;
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["overrideApiBase"]}/${url}`;
    }
    async function handleFileSelection(event) {
        const file = event.target?.files?.[0];
        if (!file || !pendingUpload) return;
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadOverrideFile"])(file, pendingUpload.token);
            const normalizedUrl = resolveUploadUrl(response?.url);
            if (!normalizedUrl) throw new Error("Upload did not return a file URL.");
            if (pendingUpload.target === "newHeldItemSprite") {
                setNewHeldItem((prev)=>({
                        ...prev,
                        sprite: normalizedUrl
                    }));
                setStatusMessage("success", "Held item image uploaded. Save to attach.");
            } else {
                const label = pendingUpload.target.includes("sprite") ? "Sprite updated." : "Artwork updated.";
                await persistOverridePatch({
                    [pendingUpload.target]: normalizedUrl
                }, label, pendingUpload.token);
            }
        } catch (err) {
            setStatusMessage("error", err?.message || "File upload failed.");
        } finally{
            if (event.target) event.target.value = "";
            setPendingUpload(null);
        }
    }
    function handleDraftChange(field, value) {
        setOverrideDraft((prev)=>({
                ...prev,
                [field]: value
            }));
        setDraftDirty(true);
    }
    async function handleSaveTextFields() {
        const res = await persistOverridePatch({
            displayName: overrideDraft?.displayName ?? "",
            description: overrideDraft?.description ?? ""
        }, "Name and description saved.");
        if (res) {
            setDraftDirty(false);
            refreshPokemonData && refreshPokemonData();
        }
    }
    async function handleResetText() {
        const token = ensureAdminAccess();
        if (!token) return;
        const canonicalSlugSource = pokemon?.name ?? (typeof pokemon?.id === "number" ? String(pokemon.id) : null) ?? (overrideInfo?.slug || overrideInfo?.pokemonId) ?? currentId ?? "";
        const canonicalSlug = sanitizeSearchValue(canonicalSlugSource) || undefined;
        try {
            const res = await persistOverridePatch({
                displayName: null,
                description: null,
                slug: canonicalSlug
            }, "Text reset to API default.", token);
            if (res) {
                setDraftDirty(false);
                refreshPokemonData && refreshPokemonData();
                setOverrideDraft((prev)=>({
                        ...prev,
                        displayName: "",
                        description: ""
                    }));
            }
        } catch (err) {
            if (String(err?.message || "").includes("404")) {
                setOverrideDraft({
                    slug: pokemon?.name?.toLowerCase() ?? "",
                    pokemonId: pokemon?.id ?? null,
                    displayName: "",
                    description: "",
                    spriteNormal: overrideDraft?.spriteNormal ?? null,
                    spriteShiny: overrideDraft?.spriteShiny ?? null,
                    artNormal: overrideDraft?.artNormal ?? null,
                    artShiny: overrideDraft?.artShiny ?? null,
                    metadataJson: overrideDraft?.metadataJson ?? null
                });
                setDraftDirty(false);
                refreshPokemonData && refreshPokemonData();
                setStatusMessage("success", "Text reset to API default.");
            } else {
                setStatusMessage("error", err?.message || "Failed to reset text.");
            }
        }
    }
    async function handleOverrideReset() {
        if (!canEdit || !identifierForOverride) return;
        if (("TURBOPACK compile-time value", "object") !== "undefined" && !window.confirm("Remove all overrides for this Pokemon?")) return;
        const token = ensureAdminAccess();
        if (!token) return;
        setOverrideBusy(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteOverrideEntry"])(identifierForOverride, token);
            setOverrideDraft({
                slug: pokemon?.name?.toLowerCase() ?? "",
                pokemonId: pokemon?.id ?? null,
                displayName: "",
                description: "",
                spriteNormal: null,
                spriteShiny: null,
                artNormal: null,
                artShiny: null,
                metadataJson: null
            });
            setStatusMessage("success", "Override removed. Using PokeAPI defaults.");
            refreshPokemonData && refreshPokemonData();
            setDraftDirty(false);
        } catch (err) {
            if (String(err?.message || "").includes("404")) {
                setStatusMessage("success", "Override already cleared.");
                refreshPokemonData && refreshPokemonData();
                setDraftDirty(false);
            } else {
                setStatusMessage("error", err?.message || "Failed to delete override.");
            }
        } finally{
            setOverrideBusy(false);
        }
    }
    async function handleAddHeldItem() {
        if (!canEdit || !identifierForOverride) return;
        const trimmedName = (newHeldItem.name || "").trim();
        if (!trimmedName) {
            setStatusMessage("error", "Held item name is required.");
            return;
        }
        const token = ensureAdminAccess();
        if (!token) return;
        setHeldItemBusy(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHeldItemOverride"])(identifierForOverride, {
                itemName: trimmedName,
                itemSprite: newHeldItem.sprite?.trim() || null,
                notes: newHeldItem.notes?.trim() || null
            }, token);
            setNewHeldItem({
                name: "",
                sprite: "",
                notes: ""
            });
            setStatusMessage("success", "Held item override saved.");
            refreshPokemonData && refreshPokemonData();
        } catch (err) {
            setStatusMessage("error", err?.message || "Failed to save held item.");
        } finally{
            setHeldItemBusy(false);
        }
    }
    async function handleDeleteHeldItem(itemId) {
        if (!canEdit || !itemId) return;
        if (("TURBOPACK compile-time value", "object") !== "undefined" && !window.confirm("Delete this held item override?")) return;
        const token = ensureAdminAccess();
        if (!token) return;
        setHeldItemBusy(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteHeldItemOverride"])(identifierForOverride, itemId, token);
            setStatusMessage("success", "Held item removed.");
            refreshPokemonData && refreshPokemonData();
        } catch (err) {
            setStatusMessage("error", err?.message || "Failed to delete held item.");
        } finally{
            setHeldItemBusy(false);
        }
    }
    function toggleEditMode() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"]) {
            setStatusMessage("error", "Configure the override server URL first.");
            return;
        }
        if (!editMode) {
            const token = ensureAdminAccess();
            if (!token) return;
        }
        setEditMode((prev)=>!prev);
    }
    function promptForAdminToken() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const next = window.prompt("Enter admin token", adminToken || "");
        if (next === null) return;
        setAdminToken(next.trim());
    }
    function clearAdminToken() {
        setAdminToken("");
        setEditMode(false);
    }
    const handleOrbOverrideClick = (event)=>{
        if (!canEdit) return;
        event.stopPropagation();
        beginUpload(event.shiftKey ? "spriteShiny" : "spriteNormal");
    };
    const handleArtOverrideClick = (event)=>{
        if (!canEdit) return;
        event.stopPropagation();
        beginUpload(event.shiftKey ? "artShiny" : "artNormal");
    };
    const handleHeldItemUploadClick = ()=>{
        if (!canEdit) return;
        beginUpload("newHeldItemSprite");
    };
    // convenience values
    const pokeNumber = pokemon?.id ?? currentId;
    // compute display number & responsive font size for the teal box
    const displayNumber = `#${String(pokeNumber).padStart(3, "0")}`;
    // keep font reasonably sized for 1-5+ characters
    const numberLength = displayNumber.length;
    let numberFontSize = 12;
    if (numberLength >= 6) numberFontSize = 10;
    else if (numberLength === 5) numberFontSize = 12;
    else if (numberLength === 4) numberFontSize = 12;
    const typeIconUrl = (typeName)=>typeName ? __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][typeName.toLowerCase()] : null;
    // derive current image url and small sprite (artwork) - used for main frame
    const currentImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[currentImageUrl]": ()=>images && images.length ? images[currentImageIndex]?.url || null : null
    }["PokedexShell.useMemo[currentImageUrl]"], [
        images,
        currentImageIndex
    ]);
    // previous small-sprite behavior preserved as fallback
    const smallSpriteUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[smallSpriteUrl]": ()=>{
            if (!images || images.length === 0) return pokemon?.sprites?.front_default || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-64"] || null;
            const entry = images[currentImageIndex] || {};
            return entry.sprite || entry.url || pokemon?.sprites?.front_default || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-64"] || null;
        }
    }["PokedexShell.useMemo[smallSpriteUrl]"], [
        images,
        currentImageIndex,
        pokemon,
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ]);
    const canonicalName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[canonicalName]": ()=>{
            return images?.[currentImageIndex]?.label ?? pokemon?._formInfo?.name ?? pokemon?.name ?? "";
        }
    }["PokedexShell.useMemo[canonicalName]"], [
        images,
        currentImageIndex,
        pokemon?._formInfo?.name,
        pokemon?.name
    ]);
    const resolvedDisplayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[resolvedDisplayName]": ()=>{
            const trimmed = (displayName || "").trim();
            return trimmed || canonicalName || "";
        }
    }["PokedexShell.useMemo[resolvedDisplayName]"], [
        displayName,
        canonicalName
    ]);
    // Orb (lens) sprite - we still detect available Gen5 BW gif or showdown fallback
    const [orbUrlPrimary, setOrbUrlPrimary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orbUrlShiny, setOrbUrlShiny] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            let mounted = true;
            async function findOrbUrls() {
                setOrbUrlPrimary(null);
                setOrbUrlShiny(null);
                if (overrideInfo?.spriteNormal) {
                    setOrbUrlPrimary(overrideInfo.spriteNormal);
                }
                if (overrideInfo?.spriteShiny) {
                    setOrbUrlShiny(overrideInfo.spriteShiny);
                }
                const primaryId = pokemon?._formInfo?.id ?? pokemon?.id;
                if (!primaryId) return;
                const id = String(primaryId);
                const candidates = [
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`
                ];
                const candidatesShiny = [
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
                ];
                async function testUrl(url) {
                    try {
                        const r = await fetch(url, {
                            method: "GET"
                        });
                        return r.ok;
                    } catch (err) {
                        void err;
                        return false;
                    }
                }
                let primarySet = Boolean(overrideInfo?.spriteNormal);
                if (!primarySet) {
                    for (const u of candidates){
                        const ok = await testUrl(u);
                        if (!mounted) return;
                        if (ok) {
                            setOrbUrlPrimary(u);
                            primarySet = true;
                            break;
                        }
                    }
                }
                let shinySet = Boolean(overrideInfo?.spriteShiny);
                if (!shinySet) {
                    for (const u of candidatesShiny){
                        const ok = await testUrl(u);
                        if (!mounted) return;
                        if (ok) {
                            setOrbUrlShiny(u);
                            shinySet = true;
                            break;
                        }
                    }
                }
                if (mounted && !primarySet && smallSpriteUrl) {
                    setOrbUrlPrimary(smallSpriteUrl);
                }
                if (mounted && !shinySet) {
                    setOrbUrlShiny(null);
                }
            }
            findOrbUrls();
            return ({
                "PokedexShell.useEffect": ()=>{
                    mounted = false;
                }
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], [
        pokemon?._formInfo?.id,
        pokemon?.id,
        smallSpriteUrl,
        overrideInfo?.spriteNormal,
        overrideInfo?.spriteShiny
    ]);
    // UI: determine whether current displayed image is shiny / mega / other
    const currLabelRaw = (images?.[currentImageIndex]?.label ?? pokemon?.name ?? "").toString();
    const currLabelLower = currLabelRaw.toLowerCase();
    const currLabelClean = currLabelLower.replace(/\s*\(shiny\)\s*$/, "").trim();
    const isShiny = /\(shiny\)/.test(currLabelLower);
    const isMega = function() {
        if (Array.isArray(megaVariants) && megaVariants.length) {
            return megaVariants.some((m)=>{
                if (!m) return false;
                return m === currLabelLower || currLabelLower.includes(m);
            });
        }
        return /\bmega\b/.test(currLabelClean);
    }();
    const isOtherForm = function() {
        if (Array.isArray(otherForms) && otherForms.length) {
            return otherForms.some((o)=>o === currLabelClean);
        }
        const base = (pokemon?.name || "").toLowerCase();
        return !!(currLabelClean && currLabelClean !== base && !/\bmega\b/.test(currLabelClean));
    }();
    // audio placeholder (cry)
    const audioElRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function playCry() {
        if (audioElRef.current) {
            try {
                audioElRef.current.pause();
                audioElRef.current.currentTime = 0;
            } catch (e) {
                void e;
            }
            audioElRef.current = null;
        }
        if (cryUrl) {
            const a = new Audio(cryUrl);
            a.preload = "auto";
            a.volume = 0.9;
            audioElRef.current = a;
            setPlaying(true);
            a.play().catch((err)=>{
                console.warn("Cry playback failed, falling back to oscillator:", err);
                playPlaceholderOscillator();
            });
            a.onended = ()=>setPlaying(false);
            a.onerror = ()=>setPlaying(false);
            return;
        }
        playPlaceholderOscillator();
    }
    const audioCtxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    function playPlaceholderOscillator() {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = audioCtxRef.current;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sawtooth";
        o.frequency.value = 220 + (pokemon?.id || 0) % 200;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setPlaying(true);
        g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
        g.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.9);
        setTimeout(()=>{
            try {
                o.stop();
            } catch (err) {
                void err;
            }
            setPlaying(false);
        }, 1000);
    }
    // --- NEW: Type filter state & helpers ---
    const [showFilterPopup, setShowFilterPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeFilterType, setActiveFilterType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // e.g. "fairy"
    const [filteredList, setFilteredList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // array of pokemon names when a filter is active
    const [filterLoading, setFilterLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterError, setFilterError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const filterRequestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // derive available filter types from assets (expects filter-[type].svg naming)
    const availableFilterTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[availableFilterTypes]": ()=>{
            return Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]).filter({
                "PokedexShell.useMemo[availableFilterTypes]": (k)=>k.startsWith("filter-")
            }["PokedexShell.useMemo[availableFilterTypes]"]).map({
                "PokedexShell.useMemo[availableFilterTypes]": (k)=>k.replace(/^filter-/, "")
            }["PokedexShell.useMemo[availableFilterTypes]"]);
        }
    }["PokedexShell.useMemo[availableFilterTypes]"], [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ]);
    // helper to fetch pokemons for a type from PokeAPI and set filteredList
    async function applyTypeFilter(typeName) {
        if (!typeName) return;
        const normalized = typeName.toLowerCase();
        setFilterError(null);
        if (TYPE_FILTER_CACHE.has(normalized)) {
            const requestId = filterRequestIdRef.current + 1;
            filterRequestIdRef.current = requestId;
            const names = TYPE_FILTER_CACHE.get(normalized) || [];
            setFilteredList(names);
            setActiveFilterType(normalized);
            setShowFilterPopup(false);
            const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
            if (!names.includes(currName) && names.length) {
                setCurrentId(names[0]);
            }
            setFilterLoading(false);
            return;
        }
        const requestId = filterRequestIdRef.current + 1;
        filterRequestIdRef.current = requestId;
        setFilterLoading(true);
        try {
            const r = await fetch(`https://pokeapi.co/api/v2/type/${normalized}`);
            if (!r.ok) throw new Error("Failed to fetch type list");
            const data = await r.json();
            const names = (data.pokemon || []).map((p)=>p.pokemon.name).filter(Boolean);
            TYPE_FILTER_CACHE.set(normalized, names);
            if (filterRequestIdRef.current !== requestId) {
                return;
            }
            setFilteredList(names);
            setActiveFilterType(normalized);
            setShowFilterPopup(false);
            const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
            if (!names.includes(currName) && names.length) {
                setCurrentId(names[0]);
            }
        } catch (err) {
            console.error("Type filter error:", err);
            setFilterError("Failed to load filter list");
        } finally{
            if (filterRequestIdRef.current === requestId) {
                setFilterLoading(false);
            }
        }
    }
    function clearTypeFilter() {
        filterRequestIdRef.current += 1;
        setActiveFilterType(null);
        setFilteredList(null);
        setFilterError(null);
        setFilterLoading(false);
        setShowFilterPopup(false);
    }
    // navigation (prev/next pokemon) must use pokemon.id when available
    // Updated to respect active type filter: if filteredList present, move within that list by name
    function gotoPrev() {
        if (activeFilterType && Array.isArray(filteredList) && filteredList.length) {
            const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
            const idx = Math.max(0, filteredList.findIndex((n)=>n === currName));
            const prevIdx = (idx - 1 + filteredList.length) % filteredList.length;
            setCurrentId(String(filteredList[prevIdx]));
            return;
        }
        const baseId = Number(pokemon?.id ?? currentId);
        const target = Number.isFinite(baseId) ? Math.max(1, baseId - 1) : 1;
        setCurrentId(String(target));
    }
    function gotoNext() {
        if (activeFilterType && Array.isArray(filteredList) && filteredList.length) {
            const currName = (pokemon?.name || String(currentId)).toString().toLowerCase();
            const idx = Math.max(0, filteredList.findIndex((n)=>n === currName));
            const nextIdx = (idx + 1) % filteredList.length;
            setCurrentId(String(filteredList[nextIdx]));
            return;
        }
        const baseId = Number(pokemon?.id ?? currentId);
        const target = Number.isFinite(baseId) ? baseId + 1 : 1;
        setCurrentId(String(target));
    }
    // D-pad visual press
    const [dpadPressed, setDpadPressed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // LED logic unchanged (left/right / frame)
    const [leftLedIndex, setLeftLedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [leftAllOn, setLeftAllOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const leftIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            if (leftIntervalRef.current) {
                clearInterval(leftIntervalRef.current);
                leftIntervalRef.current = null;
            }
            const IDLE_MS = 800;
            const LOADING_MS = 160;
            if (loading) {
                setLeftAllOn(true);
                leftIntervalRef.current = window.setInterval({
                    "PokedexShell.useEffect": ()=>setLeftAllOn({
                            "PokedexShell.useEffect": (p)=>!p
                        }["PokedexShell.useEffect"])
                }["PokedexShell.useEffect"], LOADING_MS);
            } else {
                setLeftAllOn(false);
                leftIntervalRef.current = window.setInterval({
                    "PokedexShell.useEffect": ()=>setLeftLedIndex({
                            "PokedexShell.useEffect": (p)=>(p + 1) % 3
                        }["PokedexShell.useEffect"])
                }["PokedexShell.useEffect"], IDLE_MS);
            }
            return ({
                "PokedexShell.useEffect": ()=>{
                    if (leftIntervalRef.current) {
                        clearInterval(leftIntervalRef.current);
                        leftIntervalRef.current = null;
                    }
                }
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], [
        loading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            return ({
                "PokedexShell.useEffect": ()=>{
                    if (leftIntervalRef.current) {
                        clearInterval(leftIntervalRef.current);
                        leftIntervalRef.current = null;
                    }
                }
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], []);
    function leftLedOpacity(i) {
        if (loading) return leftAllOn ? 1 : 0.18;
        return leftLedIndex === i ? 1 : 0.25;
    }
    const [rightLedIndex, setRightLedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [rightForcedFast, setRightForcedFast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const rightIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rightBlinkRemainingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rightForcedMsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(160);
    const RIGHT_IDLE_SEQ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([
        0,
        1,
        2,
        1
    ]);
    const rightIdleStepRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    function startRightFastBlink(times = 6, intervalMs = 160) {
        rightBlinkRemainingRef.current = times;
        rightForcedMsRef.current = intervalMs;
        setRightForcedFast(true);
    }
    function handlePrevMoves() {
        setMovesPage(Math.max(0, movesPage - 1));
        startRightFastBlink(6, 140);
    }
    function handleNextMoves() {
        setMovesPage(Math.min(Math.max(0, totalMovesPages - 1), movesPage + 1));
        startRightFastBlink(6, 140);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            if (rightIntervalRef.current) {
                clearInterval(rightIntervalRef.current);
                rightIntervalRef.current = null;
            }
            const IDLE_MS = 800;
            const intervalMs = rightForcedFast ? rightForcedMsRef.current : IDLE_MS;
            rightIntervalRef.current = window.setInterval({
                "PokedexShell.useEffect": ()=>{
                    if (rightForcedFast) {
                        setRightLedIndex({
                            "PokedexShell.useEffect": (prev)=>{
                                const next = (prev + 1) % 3;
                                if (rightBlinkRemainingRef.current > 0) {
                                    rightBlinkRemainingRef.current -= 1;
                                    if (rightBlinkRemainingRef.current <= 0) setRightForcedFast(false);
                                }
                                return next;
                            }
                        }["PokedexShell.useEffect"]);
                    } else {
                        rightIdleStepRef.current = (rightIdleStepRef.current + 1) % RIGHT_IDLE_SEQ.current.length;
                        const nextIndex = RIGHT_IDLE_SEQ.current[rightIdleStepRef.current];
                        setRightLedIndex(nextIndex);
                    }
                }
            }["PokedexShell.useEffect"], intervalMs);
            return ({
                "PokedexShell.useEffect": ()=>{
                    if (rightIntervalRef.current) {
                        clearInterval(rightIntervalRef.current);
                        rightIntervalRef.current = null;
                    }
                }
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], [
        rightForcedFast,
        totalMovesPages,
        movesPage
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            return ({
                "PokedexShell.useEffect": ()=>{
                    if (rightIntervalRef.current) {
                        clearInterval(rightIntervalRef.current);
                        rightIntervalRef.current = null;
                    }
                }
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], []);
    function rightLedOpacity(i) {
        return rightLedIndex === i ? 1 : 0.25;
    }
    // left frame tiny LEDs
    const [leftFrameTopOn, setLeftFrameTopOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            const FRAME_INTERVAL = 300;
            const t = window.setInterval({
                "PokedexShell.useEffect.t": ()=>setLeftFrameTopOn({
                        "PokedexShell.useEffect.t": (s)=>!s
                    }["PokedexShell.useEffect.t"])
            }["PokedexShell.useEffect.t"], FRAME_INTERVAL);
            return ({
                "PokedexShell.useEffect": ()=>clearInterval(t)
            })["PokedexShell.useEffect"];
        }
    }["PokedexShell.useEffect"], []);
    // stats cap
    const statValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[statValues]": ()=>stats ? stats.map({
                "PokedexShell.useMemo[statValues]": (s)=>s.value ?? s.base_stat ?? 0
            }["PokedexShell.useMemo[statValues]"]) : []
    }["PokedexShell.useMemo[statValues]"], [
        stats
    ]);
    const maxStat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[maxStat]": ()=>{
            const maxFound = statValues.length ? Math.max(...statValues) : 100;
            return Math.max(100, Math.min(255, maxFound));
        }
    }["PokedexShell.useMemo[maxStat]"], [
        statValues
    ]);
    // --- Name edit / search UI ---
    const [editingName, setEditingName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nameInput, setNameInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            const label = images?.[currentImageIndex]?.label ?? pokemon?._formInfo?.name ?? pokemon?.name ?? "";
            setNameInput(label);
        }
    }["PokedexShell.useEffect"], [
        images,
        currentImageIndex,
        pokemon
    ]);
    function sanitizeSearchValue(v) {
        if (v == null) return "";
        const t = String(v).trim();
        if (t === "") return "";
        if (/^\d+$/.test(t)) return t;
        return t.toLowerCase().replace(/\s+/g, "-");
    }
    function normalizeOptionalText(value) {
        if (value === null || value === undefined) return null;
        const trimmed = String(value).trim();
        return trimmed.length ? trimmed : null;
    }
    async function submitNameSearch(val) {
        const v = sanitizeSearchValue(val);
        setEditingName(false);
        if (!v) return;
        const overrideNameMatch = overrideInfo?.displayName && sanitizeSearchValue(overrideInfo.displayName) === v && pokemon?.id;
        if (overrideNameMatch) {
            setCurrentId(pokemon.id);
            return;
        }
        // Try override API lookup (slug/displayName) to resolve to a pokemon id
        try {
            const ov = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchOverrideRecord"])(v);
            if (ov?.pokemonId) {
                setCurrentId(ov.pokemonId);
                return;
            }
        } catch (err) {
            void err;
        }
        setCurrentId(v);
    }
    function formatDisplayName(rawLabel) {
        if (!rawLabel) return "???";
        const label = String(rawLabel);
        const cleaned = label.replace(/\s*\(shiny\)\s*$/i, "").trim();
        const tokens = cleaned.split(/[-_\s]+/).filter(Boolean);
        const lower = tokens.map((t)=>t.toLowerCase());
        if (lower.includes("mega")) {
            const baseTokens = tokens.filter((t)=>t.toLowerCase() !== "mega" && ![
                    "x",
                    "y",
                    "z"
                ].includes(t.toLowerCase()));
            const extras = tokens.filter((t)=>[
                    "x",
                    "y",
                    "z"
                ].includes(t.toLowerCase()));
            const base = baseTokens.join(" ").toUpperCase();
            if (extras.length) return `${base} - MEGA ${extras.join(" ").toUpperCase()}`;
            return `MEGA ${base}`;
        }
        if (tokens.length > 1) {
            const base = tokens[0].toUpperCase();
            const suffix = tokens.slice(1).join(" ").toUpperCase();
            const addForm = /origin|forme|altered|east|west|galar|alola|hisui/i.test(suffix) ? " FORME" : "";
            return `${base} - ${suffix}${addForm}`;
        }
        return tokens[0].toUpperCase();
    }
    // --- Helper to find image index preferring non-shiny first ---
    function findBestIndexFor(labelLower) {
        if (!labelLower || !images || !images.length) return null;
        const cleaned = String(labelLower).toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();
        // 1) find exact non-shiny image with cleaned label
        for(let i = 0; i < images.length; i++){
            const lbl = String(images[i]?.label || "").toLowerCase();
            const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
            if (cl === cleaned && !/\(shiny\)/.test(lbl)) return i;
        }
        // 2) if mapping exists, try direct map (imageIndexByName)
        if (imageIndexByName && imageIndexByName[labelLower] != null) return imageIndexByName[labelLower];
        // 3) find any image whose cleaned label matches (could be shiny)
        for(let i = 0; i < images.length; i++){
            const lbl = String(images[i]?.label || "").toLowerCase();
            const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
            if (cl === cleaned) return i;
        }
        return null;
    }
    function updateCurrentIdFromImage(idx, fallbackLabel) {
        if (!images || images.length === 0) return;
        if (idx == null || Number.isNaN(idx) || idx < 0 || idx >= images.length) return;
        const candidateRaw = images[idx]?.sourceName || fallbackLabel;
        if (!candidateRaw) return;
        const normalized = sanitizeSearchValue(candidateRaw);
        if (!normalized) return;
        const currentNormalized = sanitizeSearchValue(currentId);
        if (currentNormalized === normalized) return;
        setCurrentId(normalized);
    }
    // --- Form / mega / shiny handlers ---
    function toggleShiny() {
        if (!images || images.length === 0 || !imageIndexByName) return;
        const currKey = (images[currentImageIndex]?.label ?? "").toString().toLowerCase();
        const cleaned = currKey.replace(/\s*\(shiny\)\s*$/, "").trim();
        if (/\(shiny\)/.test(currKey)) {
            const nonIdx = findBestIndexFor(cleaned);
            if (nonIdx != null) setCurrentImageIndex(nonIdx);
            return;
        }
        const shinyKey = `${cleaned} (shiny)`.trim();
        if (imageIndexByName && imageIndexByName[shinyKey] != null) {
            setCurrentImageIndex(imageIndexByName[shinyKey]);
            return;
        }
        for(let i = 0; i < images.length; i++){
            const lbl = String(images[i]?.label || "").toLowerCase();
            const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
            if (cl === cleaned && /\(shiny\)/.test(lbl)) {
                setCurrentImageIndex(i);
                return;
            }
        }
    // If no shiny image available, rely on orbUrlShiny if available (the orb will update)
    }
    function toggleMega() {
        if (!images || images.length === 0 || !imageIndexByName) return;
        if (!Array.isArray(megaVariants) || megaVariants.length === 0) return;
        const baseKey = (pokemon?.name || "").toLowerCase();
        const curr = (images?.[currentImageIndex]?.label ?? baseKey).toString().toLowerCase();
        const megas = Array.from(new Set(megaVariants.map((m)=>(m || "").toLowerCase())));
        const currPos = megas.findIndex((m)=>curr === m || curr.includes(m));
        if (currPos !== -1) {
            const nextPos = currPos + 1;
            if (nextPos < megas.length) {
                const target = megas[nextPos];
                const idx = findBestIndexFor(target);
                if (idx != null) {
                    setCurrentImageIndex(idx);
                    updateCurrentIdFromImage(idx, target);
                    return;
                }
            }
            const baseIdx = findBestIndexFor(baseKey);
            const fallbackIdx = baseIdx != null ? baseIdx : 0;
            setCurrentImageIndex(fallbackIdx);
            updateCurrentIdFromImage(fallbackIdx, baseKey);
            return;
        }
        const firstMega = megas[0];
        const firstIdx = findBestIndexFor(firstMega);
        if (firstIdx != null) {
            setCurrentImageIndex(firstIdx);
            updateCurrentIdFromImage(firstIdx, firstMega);
        } else {
            const normalized = sanitizeSearchValue(firstMega);
            if (normalized) setCurrentId(normalized);
        }
    }
    function cycleOtherFormsUI() {
        if (!images || images.length === 0 || !imageIndexByName) return;
        const base = (pokemon?.name || "").toLowerCase();
        const others = Array.isArray(otherForms) ? otherForms.map((s)=>(s || "").toLowerCase()) : [];
        const forms = [
            base,
            ...others.filter((o)=>o && o !== base)
        ];
        const curr = (images?.[currentImageIndex]?.label ?? pokemon?.name ?? "").toLowerCase();
        const cleaned = curr.replace(/\s*\(shiny\)\s*$/, "").trim();
        let pos = forms.indexOf(cleaned);
        if (pos === -1) pos = 0;
        pos = (pos + 1) % forms.length;
        const target = forms[pos];
        const idx = findBestIndexFor(target);
        if (idx != null) {
            setCurrentImageIndex(idx);
            updateCurrentIdFromImage(idx, target);
        } else {
            const normalized = sanitizeSearchValue(target);
            if (normalized) setCurrentId(normalized);
        }
    }
    // evolutions clickable
    function gotoEvolution(evo) {
        if (!evo) return;
        if (evo.id) setCurrentId(evo.id);
        else if (evo.name) setCurrentId(String(evo.name).toLowerCase());
    }
    // --- UP / DOWN D-PAD: iterate pokemon-form endpoints (skip shiny) ---
    const [formIndex, setFormIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            if (!formsList || !formsList.length) {
                setFormIndex(0);
                return;
            }
            const activeName = sanitizeSearchValue(pokemon?._formInfo?.name || pokemon?.name || formsList[0]?.name || "");
            if (!activeName) {
                setFormIndex(0);
                return;
            }
            const idx = formsList.findIndex({
                "PokedexShell.useEffect.idx": (f)=>sanitizeSearchValue(f?.name) === activeName
            }["PokedexShell.useEffect.idx"]);
            setFormIndex(idx >= 0 ? idx : 0);
        }
    }["PokedexShell.useEffect"], [
        formsList,
        pokemon?.name,
        pokemon?._formInfo?.name
    ]);
    async function loadFormEntry(entry) {
        if (!entry || !entry.url) return;
        try {
            const r = await fetch(entry.url);
            if (!r.ok) return;
            const formData = await r.json();
            const targetName = formData?.name || entry.name || formData?.pokemon?.name;
            const normalized = sanitizeSearchValue(targetName);
            if (normalized) {
                setCurrentId(normalized);
                return;
            }
            const spriteFromForm = formData.sprites?.front_default || formData.sprites?.front_shiny || null;
            if (spriteFromForm) {
                const found = images.findIndex((it)=>it.url === spriteFromForm || it.sprite === spriteFromForm);
                if (found !== -1) setCurrentImageIndex(found);
            }
        } catch (err) {
            void err;
        }
    }
    async function nextForm() {
        if (!formsList || !formsList.length) return;
        const next = (formIndex + 1) % formsList.length;
        setFormIndex(next);
        const entry = formsList[next];
        if (!entry) return;
        const formName = String(entry.name || "").toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();
        const idx = formName ? findBestIndexFor(formName) : null;
        if (idx != null) {
            setCurrentImageIndex(idx);
            updateCurrentIdFromImage(idx, entry.name || formName);
            return;
        }
        const normalized = sanitizeSearchValue(entry.name);
        if (normalized) {
            setCurrentId(normalized);
            return;
        }
        await loadFormEntry(entry);
    }
    async function prevForm() {
        if (!formsList || !formsList.length) return;
        const prev = (formIndex - 1 + formsList.length) % formsList.length;
        setFormIndex(prev);
        const entry = formsList[prev];
        if (!entry) return;
        const formName = String(entry.name || "").toLowerCase().replace(/\s*\(shiny\)\s*$/, "").trim();
        const idx = formName ? findBestIndexFor(formName) : null;
        if (idx != null) {
            setCurrentImageIndex(idx);
            updateCurrentIdFromImage(idx, entry.name || formName);
            return;
        }
        const normalized = sanitizeSearchValue(entry.name);
        if (normalized) {
            setCurrentId(normalized);
            return;
        }
        await loadFormEntry(entry);
    }
    // Reset / clear pokedex entry (orange circle): call clear() from hook and clear currentId
    function handleResetClick() {
        setCurrentId("");
        clearPokemonState && clearPokemonState();
    }
    // assets
    const megaAsset = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["mega"];
    const otherAsset = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["other-forms"] || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["other-forms.png"] || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["other-forms.jpg"];
    const filterAsset = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["pokemon-filter"]; // expected name pokemon-filter.png in assets
    const overrideToggleIcon = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["pokedex-icon"];
    // clickable style
    const clickableStyle = {
        cursor: "pointer"
    };
    const hoverable = {
        onMouseEnter: (e)=>{
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.filter = "brightness(1.05)";
        },
        onMouseLeave: (e)=>{
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.filter = "brightness(1)";
        }
    };
    // orb image chosen depending on shiny state
    const orbDisplayedUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PokedexShell.useMemo[orbDisplayedUrl]": ()=>{
            if (isShiny) {
                if (orbUrlShiny) return orbUrlShiny;
                const cleaned = currLabelClean;
                const shinyKey = `${cleaned} (shiny)`.trim();
                if (imageIndexByName && imageIndexByName[shinyKey] != null) {
                    const idx = imageIndexByName[shinyKey];
                    return images[idx]?.sprite || images[idx]?.url || null;
                }
            } else {
                if (orbUrlPrimary) return orbUrlPrimary;
            }
            return smallSpriteUrl;
        }
    }["PokedexShell.useMemo[orbDisplayedUrl]"], [
        isShiny,
        orbUrlPrimary,
        orbUrlShiny,
        currLabelClean,
        imageIndexByName,
        images,
        smallSpriteUrl
    ]);
    // --- EVOS: sliding window / pyramid state + helpers ---
    const [evoWindowStart, setEvoWindowStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const evoCount = Array.isArray(evoChain) ? evoChain.length : 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PokedexShell.useEffect": ()=>{
            // reset window start whenever evoChain changes (e.g., when loading a new pokemon)
            setEvoWindowStart(0);
        }
    }["PokedexShell.useEffect"], [
        evoChain
    ]);
    function getEvoWindow(start) {
        if (!Array.isArray(evoChain) || evoCount === 0) return [
            null,
            null,
            null
        ];
        if (evoCount <= 3) {
            // return available evos padded with nulls so UI still renders 3 slots
            const padded = evoChain.slice(0, 3).concat(Array(Math.max(0, 3 - evoCount)).fill(null));
            return padded.slice(0, 3);
        }
        const out = [];
        for(let k = 0; k < 3; k++){
            out.push(evoChain[(start + k) % evoCount]);
        }
        return out;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-[1015px] h-[1000px] select-none",
        style: {
            fontFamily: "'Gameboy', monospace",
            position: "relative",
            overflow: "visible"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 1015 700",
                width: "1015",
                height: "960",
                preserveAspectRatio: "xMidYMid meet",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "gRedA",
                                x1: "0",
                                x2: "0",
                                y1: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#b90e0e"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1253,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "40%",
                                        stopColor: "#c81a1a"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1254,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#5f0000"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1255,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "gRedB",
                                x1: "0",
                                x2: "0",
                                y1: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#d11c1c"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "60%",
                                        stopColor: "#b31313"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#6a0202"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1260,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "orbGrad",
                                x1: "0",
                                x2: "1",
                                y1: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#c8f6ff"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "40%",
                                        stopColor: "#74e5ff"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#2aa6df"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1265,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1262,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "screenGrad",
                                x1: "0",
                                x2: "0",
                                y1: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#f3f6f8"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1268,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#e7ebee"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1269,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "greenBox",
                                x1: "0",
                                x2: "0",
                                y1: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#7ff971"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1272,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#46ce35"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1273,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "blueBox",
                                x1: "0",
                                x2: "0",
                                y1: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#4aa1ff"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1276,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#063fc0"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1277,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1275,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                id: "shadowBig",
                                x: "-60%",
                                y: "-60%",
                                width: "220%",
                                height: "220%",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feDropShadow", {
                                    dx: "0",
                                    dy: "8",
                                    stdDeviation: "12",
                                    floodColor: "#000",
                                    floodOpacity: "0.45"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1281,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1280,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                id: "orbClip",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: ORB_CX,
                                    cy: ORB_CY,
                                    r: ORB_R
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1285,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1284,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                id: "mainFrameClip",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: FRAME_X,
                                    y: FRAME_Y,
                                    width: FRAME_W,
                                    height: FRAME_H,
                                    rx: "4",
                                    ry: "4"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1289,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1288,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "500",
                        height: "775",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                    id: "gradStroke",
                                    x1: "0%",
                                    y1: "0%",
                                    x2: "0%",
                                    y2: "100%",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "0%",
                                            stopColor: "#8b0000"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 1297,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "100%",
                                            stopColor: "#390101"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 1298,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1296,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M32,40 Q6,40 6,66 L6,672 Q6,700 32,700 L486,700 L486,40 Z",
                                fill: "#8b0000",
                                stroke: "none"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1302,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M32,40 Q6,40 6,66 L6,672 Q6,700 32,700 L486,700 L486,40 L32,40",
                                fill: "none",
                                stroke: "url(#gradStroke)",
                                strokeWidth: "8",
                                strokeLinejoin: "miter"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: " M488,106 L348,106 C311,106 291,114 255,146 C231,166 181,188 151,188  L11,188 L11,676  Q11,700 37,700  L488,700 Z ",
                                fill: "url(#gRedB)",
                                stroke: "#4d0000",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1314,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M489,106 L348,106 C311,106 291,114 255,146 C231,166 181,188 151,188 L9.5,188",
                                fill: "none",
                                stroke: "#4d0000",
                                strokeWidth: "8"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1313,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: " M542,114 L685,114 C722,114 742,120 778,152 C802,172 852,194 882,194 L948,194 Q988,194 988,242       L988,660                  Q988,700 948,700          L542,700                  L542,114 Z ",
                                fill: "url(#gRedB)",
                                stroke: "#4d0000",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1337,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: " M541,114 L685,114 C722,114 742,120 778,152 C802,172 852,194 882,194 L948,194 Q988,194 988,242       L988,660 Q988,702 948,702         L541,702 ",
                                fill: "none",
                                stroke: "#4d0000",
                                strokeWidth: "4"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1355,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1336,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "490",
                                y: "37",
                                width: "50",
                                height: "666",
                                fill: "#8b0000",
                                stroke: "#3f0000",
                                strokeWidth: "2"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1375,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "491.5",
                                y: "116",
                                width: "47",
                                height: "54",
                                fill: "#ce1b1b"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1376,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "491.5",
                                y: "228",
                                width: "47",
                                height: "364",
                                fill: "#ce1b1b"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "491.5",
                                y: "648",
                                width: "47",
                                height: "54",
                                fill: "#ce1b1b"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1378,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1374,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: ORB_CX,
                                cy: ORB_CY,
                                r: ORB_R,
                                fill: "url(#orbGrad)",
                                stroke: "#46bfe1",
                                strokeWidth: "3",
                                filter: "url(#shadowBig)"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1383,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "140",
                                cy: "75",
                                r: "8",
                                fill: "#ff6b6b",
                                stroke: "#8a0000",
                                strokeWidth: "0.8",
                                style: {
                                    opacity: leftLedOpacity(0),
                                    transition: "opacity 120ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1384,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "172",
                                cy: "75",
                                r: "8",
                                fill: "#ffd86b",
                                stroke: "#8a0000",
                                strokeWidth: "0.8",
                                style: {
                                    opacity: leftLedOpacity(1),
                                    transition: "opacity 120ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1385,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "202",
                                cy: "75",
                                r: "8",
                                fill: "#06a346",
                                stroke: "#044a22",
                                strokeWidth: "0.8",
                                style: {
                                    opacity: leftLedOpacity(2),
                                    transition: "opacity 120ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1386,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1382,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "72",
                                y: "215",
                                rx: "80",
                                ry: "18",
                                width: "360",
                                height: "254",
                                fill: "#bdbdbd",
                                stroke: "#8a8a8a",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: FRAME_X,
                                y: FRAME_Y,
                                rx: "14",
                                ry: "14",
                                width: FRAME_W,
                                height: FRAME_H,
                                fill: "url(#screenGrad)",
                                stroke: "#111",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1392,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "236",
                                cy: "227",
                                r: "5",
                                fill: "#ff9b9b",
                                stroke: "#8b0000",
                                style: {
                                    opacity: leftFrameTopOn ? 1 : 0.2,
                                    transition: "opacity 60ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1393,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "262",
                                cy: "227",
                                r: "5",
                                fill: "#ff9b9b",
                                stroke: "#8b0000",
                                style: {
                                    opacity: leftFrameTopOn ? 0.2 : 1,
                                    transition: "opacity 60ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1394,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "118",
                                cy: "440",
                                r: "12",
                                fill: "#8f1a1a",
                                stroke: "#4a0000",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1395,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "145",
                                y: "482",
                                rx: "10",
                                ry: "3",
                                width: "214",
                                height: "30",
                                fill: "url(#screenGrad)",
                                stroke: "#111",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1397,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(356,318)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "-28",
                                        y: "114",
                                        width: "32",
                                        height: "4",
                                        rx: "2",
                                        fill: "#444"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1399,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "-28",
                                        y: "122",
                                        width: "32",
                                        height: "4",
                                        rx: "2",
                                        fill: "#444"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "-28",
                                        y: "130",
                                        width: "32",
                                        height: "4",
                                        rx: "2",
                                        fill: "#444"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "10",
                                        y: "114",
                                        width: "32",
                                        height: "4",
                                        rx: "2",
                                        fill: "#444"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1402,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "10",
                                        y: "122",
                                        width: "32",
                                        height: "4",
                                        rx: "2",
                                        fill: "#444"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1403,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "10",
                                        y: "130",
                                        width: "32",
                                        height: "4",
                                        rx: "2",
                                        fill: "#444"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1404,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1398,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1390,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "108",
                                cy: "582",
                                r: "34",
                                fill: "#2b66ff",
                                stroke: isShiny ? "#ffd550" : "#002a6a",
                                strokeWidth: 3,
                                style: {
                                    filter: isShiny ? "drop-shadow(0 6px 10px rgba(255,213,80,0.35))" : undefined
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1411,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "173",
                                y: "525",
                                rx: "3",
                                width: "74",
                                height: "26",
                                fill: "#12b23f",
                                stroke: "#0a6b1f"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1423,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "264",
                                y: "525",
                                rx: "3",
                                width: "74",
                                height: "26",
                                fill: "#ff8a3f",
                                stroke: "#a84a15"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1424,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(328,420)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "54",
                                        y: "120",
                                        width: "36",
                                        height: "88",
                                        rx: "6",
                                        fill: "#111"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1426,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "72",
                                        y: "139",
                                        fontSize: "20",
                                        fill: "#333",
                                        fontFamily: "sans-serif",
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        children: "^"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1427,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "72",
                                        y: "194",
                                        fontSize: "20",
                                        fill: "#333",
                                        fontFamily: "sans-serif",
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        children: "v"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1428,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "28",
                                        y: "146",
                                        width: "88",
                                        height: "36",
                                        rx: "6",
                                        fill: "#111"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1429,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "36",
                                        y: "171",
                                        fontSize: "20",
                                        fill: "#333",
                                        fontFamily: "sans-serif",
                                        children: "<"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1430,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "96",
                                        y: "171",
                                        fontSize: "20",
                                        fill: "#333",
                                        fontFamily: "sans-serif",
                                        children: ">"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1431,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1425,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "184",
                                y: "616",
                                rx: "14",
                                width: "140",
                                height: "66",
                                fill: "#046f62"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1434,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "207",
                                y: "627",
                                rx: "10",
                                width: "96",
                                height: "46",
                                fill: "#eef6f8"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1435,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1409,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "580",
                                y: "216",
                                rx: "12",
                                width: "362",
                                height: "134",
                                fill: "url(#greenBox)",
                                stroke: "#2a8f2a",
                                strokeWidth: "4"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1440,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "587",
                                y: "223",
                                rx: "8",
                                width: "348",
                                height: "120",
                                fill: "none",
                                stroke: "#000",
                                strokeWidth: "0.8",
                                opacity: "0.20"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1441,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1439,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "609",
                                y: "364",
                                rx: "12",
                                width: "310",
                                height: "120",
                                fill: "url(#blueBox)",
                                stroke: "#042a8a",
                                strokeWidth: "4",
                                filter: "url(#shadowBig)"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1444,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "616",
                                y: "373",
                                rx: "8",
                                width: "296",
                                height: "102",
                                fill: "none",
                                stroke: "#000",
                                strokeWidth: "0.6",
                                opacity: "0.20"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1445,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1443,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "622",
                                cy: "504",
                                r: "6",
                                fill: "#06a346",
                                style: {
                                    opacity: rightLedOpacity(0),
                                    transition: "opacity 120ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1450,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "646",
                                cy: "504",
                                r: "6",
                                fill: "#ffd86b",
                                style: {
                                    opacity: rightLedOpacity(1),
                                    transition: "opacity 120ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1451,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "670",
                                cy: "504",
                                r: "6",
                                fill: "#ff6b6b",
                                style: {
                                    opacity: rightLedOpacity(2),
                                    transition: "opacity 120ms linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1452,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "764",
                                y: "494",
                                rx: "12",
                                width: "74",
                                height: "20",
                                fill: "#16a34a"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1454,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "848",
                                y: "494",
                                rx: "12",
                                width: "74",
                                height: "20",
                                fill: "#ff8a3f"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1455,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: 696 + CHEVRON_X_OFFSET,
                                y: "496",
                                rx: "2",
                                width: "22",
                                height: "16",
                                fill: "#cfcfcf",
                                stroke: "#6a6a6a"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1457,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                x: 704 + CHEVRON_X_OFFSET,
                                y: "507.5",
                                fontSize: "10",
                                fill: "#6a2a2a",
                                fontFamily: "sans-serif",
                                children: "<"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1458,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: 723 + CHEVRON_X_OFFSET,
                                y: "496",
                                rx: "2",
                                width: "22",
                                height: "16",
                                fill: "#cfcfcf",
                                stroke: "#6a6a6a"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1460,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                x: 730 + CHEVRON_X_OFFSET,
                                y: "507.5",
                                fontSize: "10",
                                fill: "#6a2a2a",
                                fontFamily: "sans-serif",
                                children: ">"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1461,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1449,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "611.5",
                        y: "530",
                        rx: "6",
                        ry: "2",
                        width: "90",
                        height: "50",
                        fill: "url(#screenGrad)",
                        stroke: "#111",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1465,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "600",
                        y: "590",
                        width: "110",
                        height: "100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            style: {
                                width: "100%",
                                height: "100%"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$components$2f$SizeComparison$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                silhouetteSrc: currentImageUrl || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-200"] || "",
                                humanSrc: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["human_comp"] || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["human_comp.png"] || "/assets/human_comp.png",
                                pokemonHeightMeters: pokemon?.height != null ? pokemon.height * 0.1 : null,
                                pokemonWeightKg: pokemon?.weight != null ? pokemon.weight * 0.1 : null
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1470,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1469,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1468,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "615",
                        y: "536",
                        width: "85",
                        height: "42",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            style: {
                                width: "100%",
                                height: "100%"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$components$2f$HeldItems$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                heldItems: heldItemsDetails?.length ? heldItemsDetails : pokemon?.held_items || []
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1482,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1480,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                        href: orbDisplayedUrl || smallSpriteUrl || null,
                        x: ORB_CX - spriteSide / 2,
                        y: ORB_CY - spriteSide / 2,
                        width: spriteSide,
                        height: spriteSide,
                        preserveAspectRatio: "xMidYMid meet",
                        clipPath: "url(#orbClip)",
                        style: {
                            imageRendering: "pixelated"
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1487,
                        columnNumber: 9
                    }, this),
                    canEdit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: ORB_CX,
                        cy: ORB_CY,
                        r: ORB_R,
                        fill: "rgba(255,255,255,0.02)",
                        stroke: "transparent",
                        onClick: handleOrbOverrideClick,
                        style: {
                            cursor: "copy"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                            children: "Click to replace orb sprite (hold Shift for shiny)."
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1507,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1498,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        clipPath: "url(#mainFrameClip)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                            href: currentImageUrl || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-200"] || null,
                            x: FRAME_X,
                            y: FRAME_Y,
                            width: FRAME_W,
                            height: FRAME_H,
                            preserveAspectRatio: "xMidYMid meet",
                            style: {
                                pointerEvents: "none"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1513,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1512,
                        columnNumber: 9
                    }, this),
                    canEdit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: FRAME_X,
                        y: FRAME_Y,
                        width: FRAME_W,
                        height: FRAME_H,
                        fill: "rgba(255,255,255,0.02)",
                        stroke: "transparent",
                        onClick: handleArtOverrideClick,
                        style: {
                            cursor: "copy"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                            children: "Click to replace artwork (hold Shift for shiny artwork)."
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1534,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1524,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "118",
                            cy: "440",
                            r: "12",
                            fill: "transparent",
                            stroke: "transparent",
                            onClick: (e)=>{
                                e.stopPropagation();
                                playCry();
                            },
                            style: clickableStyle
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1540,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1539,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: "translate(330,318)",
                        pointerEvents: "none",
                        "aria-hidden": true,
                        children: playing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "-2",
                                    y: "114",
                                    width: "32",
                                    height: "4",
                                    rx: "2",
                                    fill: "#111"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1558,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "-2",
                                    y: "122",
                                    width: "32",
                                    height: "4",
                                    rx: "2",
                                    fill: "#111"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1559,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "-2",
                                    y: "130",
                                    width: "32",
                                    height: "4",
                                    rx: "2",
                                    fill: "#111"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1560,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "36",
                                    y: "114",
                                    width: "32",
                                    height: "4",
                                    rx: "2",
                                    fill: "#111"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1561,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "36",
                                    y: "122",
                                    width: "32",
                                    height: "4",
                                    rx: "2",
                                    fill: "#111"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1562,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "36",
                                    y: "130",
                                    width: "32",
                                    height: "4",
                                    rx: "2",
                                    fill: "#111"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1563,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1557,
                            columnNumber: 13
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1555,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "150",
                        y: "486",
                        width: "206",
                        height: "24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            style: {
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            },
                            children: !editingName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "gameboy-font",
                                style: {
                                    width: "100%",
                                    textAlign: "center",
                                    fontSize: 9,
                                    textTransform: "capitalize",
                                    color: "#000",
                                    cursor: "text"
                                },
                                onClick: ()=>{
                                    setEditingName(true);
                                    setNameInput(canonicalName);
                                    setTimeout(()=>{
                                        const el = document.getElementById("pokedex-name-input");
                                        if (el) el.focus();
                                    }, 0);
                                },
                                children: formatDisplayName(resolvedDisplayName)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1572,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "pokedex-name-input",
                                className: "gameboy-font",
                                style: {
                                    width: "96%",
                                    fontSize: 12,
                                    padding: "2px 6px"
                                },
                                value: nameInput,
                                onChange: (e)=>setNameInput(e.target.value),
                                onBlur: ()=>submitNameSearch(nameInput),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") submitNameSearch(nameInput);
                                    else if (e.key === "Escape") setEditingName(false);
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1587,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1570,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1569,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "108",
                                cy: "582",
                                r: "34",
                                fill: "transparent",
                                stroke: "transparent",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    toggleShiny();
                                },
                                style: clickableStyle
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1609,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                                children: "Toggle shiny"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1621,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1608,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "176",
                        y: "522",
                        width: "200",
                        height: "32",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            style: {
                                display: "flex",
                                gap: 23,
                                alignItems: "center",
                                height: "100%"
                            },
                            children: types?.slice(0, 2).map((t)=>{
                                const url = typeIconUrl(t.name);
                                return url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: url,
                                    alt: t.name,
                                    title: t.name,
                                    style: {
                                        display: "block",
                                        width: 68,
                                        height: 22,
                                        imageRendering: "pixelated"
                                    }
                                }, t.name, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1630,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "gameboy-font",
                                    style: {
                                        fontSize: 12,
                                        textTransform: "capitalize"
                                    },
                                    children: t.name
                                }, t.name, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1643,
                                    columnNumber: 17
                                }, this);
                            }) ?? null
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1626,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1625,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: "translate(328,420)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "28",
                                y: "146",
                                width: "30",
                                height: "36",
                                rx: "6",
                                fill: "transparent",
                                stroke: "transparent",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setDpadPressed(true);
                                    gotoPrev();
                                    setTimeout(()=>setDpadPressed(false), 120);
                                },
                                style: clickableStyle
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1654,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: `translate(-8,0) scale(${dpadPressed ? 0.95 : 1})`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "67.5",
                                        y: "151.5",
                                        width: "25",
                                        height: "25",
                                        rx: "14",
                                        fill: "#00000088"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1672,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "72.5",
                                        y: "156.5",
                                        width: "15",
                                        height: "15",
                                        rx: "8",
                                        fill: "#222"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1673,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1671,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "86",
                                y: "146",
                                width: "30",
                                height: "36",
                                rx: "6",
                                fill: "transparent",
                                stroke: "transparent",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setDpadPressed(true);
                                    gotoNext();
                                    setTimeout(()=>setDpadPressed(false), 120);
                                },
                                style: clickableStyle
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1676,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "54",
                                y: "120",
                                width: "36",
                                height: "30",
                                rx: "6",
                                fill: "transparent",
                                stroke: "transparent",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setDpadPressed(true);
                                    nextForm();
                                    setTimeout(()=>setDpadPressed(false), 120);
                                },
                                style: clickableStyle
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1693,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "54",
                                y: "178",
                                width: "36",
                                height: "30",
                                rx: "6",
                                fill: "transparent",
                                stroke: "transparent",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setDpadPressed(true);
                                    prevForm();
                                    setTimeout(()=>setDpadPressed(false), 120);
                                },
                                style: clickableStyle
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1710,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1652,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: "translate(328,520)",
                        children: otherAsset ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                            href: otherAsset,
                            x: -90,
                            y: 42,
                            width: 36,
                            height: 36,
                            preserveAspectRatio: "xMidYMid meet",
                            style: {
                                cursor: otherForms && otherForms.length ? "pointer" : "not-allowed",
                                opacity: otherForms && otherForms.length ? 1 : 0.45,
                                filter: isOtherForm ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : otherForms && otherForms.length ? "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" : "none"
                            },
                            onClick: (e)=>{
                                e.stopPropagation();
                                if (otherForms && otherForms.length) cycleOtherFormsUI();
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1730,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: -20,
                            y: -8,
                            width: 44,
                            height: 44,
                            rx: 6,
                            fill: "#666",
                            stroke: "#222",
                            style: {
                                cursor: otherForms && otherForms.length ? "pointer" : "not-allowed",
                                opacity: otherForms && otherForms.length ? 1 : 0.45,
                                filter: isOtherForm ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : undefined
                            },
                            onClick: (e)=>{
                                e.stopPropagation();
                                if (otherForms && otherForms.length) cycleOtherFormsUI();
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1748,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1728,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: `translate(0,0)`,
                        onClick: (e)=>{
                            e.stopPropagation();
                            handleResetClick();
                        },
                        style: clickableStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "740",
                                cy: "556",
                                r: "14",
                                fill: "#ffc43b",
                                stroke: "#a86a00",
                                strokeWidth: "3"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1778,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                x: 736 + CHEVRON_X_OFFSET,
                                y: "560.5",
                                fontSize: "12",
                                fontWeight: "550",
                                fill: "#6a2a2a",
                                fontFamily: "sans-serif",
                                children: "<"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1779,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1770,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: "translate(210,560)",
                        children: megaAsset ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                            href: megaAsset,
                            x: -32,
                            y: 8,
                            width: 44,
                            height: 44,
                            preserveAspectRatio: "xMidYMid meet",
                            style: {
                                cursor: megaVariants && megaVariants.length ? "pointer" : "not-allowed",
                                opacity: megaVariants && megaVariants.length ? 1 : 0.45,
                                filter: isMega ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : megaVariants && megaVariants.length ? "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" : "none"
                            },
                            onClick: (e)=>{
                                e.stopPropagation();
                                if (megaVariants && megaVariants.length) toggleMega();
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1787,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: -22,
                            y: -8,
                            width: 44,
                            height: 44,
                            rx: 6,
                            fill: "#444",
                            stroke: "#222",
                            style: {
                                cursor: megaVariants && megaVariants.length ? "pointer" : "not-allowed",
                                opacity: megaVariants && megaVariants.length ? 1 : 0.45,
                                filter: isMega ? "drop-shadow(0 8px 12px rgba(255,140,140,0.28))" : undefined
                            },
                            onClick: (e)=>{
                                e.stopPropagation();
                                if (megaVariants && megaVariants.length) toggleMega();
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1805,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1785,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        "aria-hidden": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: 207 + 96 / 2,
                            y: 627 + 46 / 2,
                            className: "gameboy-font",
                            style: {
                                fontSize: numberFontSize
                            },
                            textAnchor: "middle",
                            dominantBaseline: "middle",
                            children: displayNumber
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 1829,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1828,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            filterAsset ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                                href: filterAsset,
                                x: 282,
                                y: 561.5,
                                width: 55,
                                height: 55,
                                preserveAspectRatio: "xMidYMid meet",
                                style: {
                                    cursor: "pointer",
                                    filter: activeFilterType ? "drop-shadow(0 12px 22px rgba(0,160,255,0.30)) drop-shadow(0 6px 10px rgba(0,0,0,0.30))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                                    opacity: 1
                                },
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setShowFilterPopup((s)=>!s);
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1844,
                                columnNumber: 5
                            }, this) : /* fallback simple rect if asset missing */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(282,560)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: 0,
                                        y: 0,
                                        width: 55,
                                        height: 55,
                                        rx: 8,
                                        fill: "#444",
                                        stroke: "#222",
                                        style: {
                                            cursor: "pointer",
                                            filter: activeFilterType ? "drop-shadow(0 10px 18px rgba(0,160,255,0.25))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.25))"
                                        },
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setShowFilterPopup((s)=>!s);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1866,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: 27.5,
                                        y: 34,
                                        fontSize: "16",
                                        textAnchor: "middle",
                                        fill: "#fff",
                                        fontFamily: "sans-serif",
                                        pointerEvents: "none",
                                        children: "F"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 1883,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1865,
                                columnNumber: 5
                            }, this),
                            showFilterPopup ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                                x: "126",
                                y: "520",
                                width: "252",
                                height: "168",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    xmlns: "http://www.w3.org/1999/xhtml",
                                    className: "gameboy-font",
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        background: "#fff",
                                        border: "3px solid #222",
                                        padding: 6,
                                        boxSizing: "border-box",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6
                                    },
                                    onClick: (e)=>e.stopPropagation(),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 6,
                                                        fontWeight: 700,
                                                        letterSpacing: "0.5px"
                                                    },
                                                    children: "FILTER BY TYPE"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                    lineNumber: 1908,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        gap: 8,
                                                        alignItems: "center"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                if (!activeFilterType || filterLoading) return;
                                                                clearTypeFilter();
                                                            },
                                                            disabled: !activeFilterType || filterLoading,
                                                            "aria-disabled": !activeFilterType || filterLoading,
                                                            style: {
                                                                fontFamily: "'Gameboy', monospace",
                                                                fontSize: 6,
                                                                cursor: !activeFilterType || filterLoading ? "not-allowed" : "pointer",
                                                                opacity: !activeFilterType || filterLoading ? 0.45 : 1,
                                                                color: "#111",
                                                                borderRadius: 3
                                                            },
                                                            title: !activeFilterType ? "No active filter" : "Reset filter",
                                                            children: "RESET"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                            lineNumber: 1911,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                setShowFilterPopup(false);
                                                            },
                                                            style: {
                                                                fontFamily: "'Gameboy', monospace",
                                                                fontSize: 6,
                                                                cursor: "pointer",
                                                                color: "#111",
                                                                borderRadius: 3
                                                            },
                                                            children: "CLOSE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                            lineNumber: 1932,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                    lineNumber: 1910,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 1907,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 6,
                                                color: filterError ? "#b91c1c" : "#374151",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    textTransform: "capitalize",
                                                    minWidth: 120
                                                },
                                                children: filterLoading ? "Loading..." : filterError ? filterError : activeFilterType ? `Filtering: ${activeFilterType}` : "No filter"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 1952,
                                                columnNumber: 11
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 1951,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "repeat(6, 1fr)",
                                                gap: 6,
                                                alignItems: "center",
                                                justifyItems: "center",
                                                flex: 1
                                            },
                                            children: availableFilterTypes.length ? availableFilterTypes.map((t)=>{
                                                const key = `filter-${t}`;
                                                const url = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][key];
                                                const isActive = activeFilterType === t;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        // toggle off if clicking same active type
                                                        if (isActive) {
                                                            clearTypeFilter();
                                                        } else {
                                                            applyTypeFilter(t);
                                                        }
                                                    },
                                                    title: t,
                                                    style: {
                                                        width: 34,
                                                        height: 34,
                                                        padding: 0,
                                                        border: isActive ? "2px solid #0ea5a9" : "2px solid transparent",
                                                        borderRadius: 8,
                                                        background: isActive ? "#e6f7ff" : "#f3f3f3",
                                                        cursor: filterLoading ? "wait" : "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        boxShadow: isActive ? "0 8px 18px rgba(0,160,255,0.24)" : "0 4px 10px rgba(0,0,0,0.12)"
                                                    },
                                                    children: url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: url,
                                                        alt: t,
                                                        style: {
                                                            width: 28,
                                                            height: 28,
                                                            imageRendering: "pixelated",
                                                            pointerEvents: "none"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 1991,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 10,
                                                            textTransform: "capitalize"
                                                        },
                                                        children: t
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 1993,
                                                        columnNumber: 21
                                                    }, this)
                                                }, t, false, {
                                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                    lineNumber: 1964,
                                                    columnNumber: 17
                                                }, this);
                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    gridColumn: "1 / -1",
                                                    textAlign: "center",
                                                    fontSize: 10
                                                },
                                                children: "No type icons found in assets"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 1999,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 1957,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 1890,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 1889,
                                columnNumber: 5
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 1841,
                        columnNumber: 11
                    }, this),
                    "/* ---------- end FILTER UI ---------- */",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "593.5",
                        y: "232",
                        width: "336",
                        height: "112",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            className: "gameboy-font",
                            style: {
                                color: "#000",
                                fontSize: 10,
                                padding: 6
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontWeight: 700,
                                        textTransform: "capitalize"
                                    },
                                    children: species?.genera?.find((g)=>g.language.name === "en")?.genus ?? species?.name ?? ""
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 2013,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: 8,
                                        fontSize: 8.5,
                                        lineHeight: 1.5,
                                        textAlign: "justify"
                                    },
                                    children: flavorText
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 2016,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 2012,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2011,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "616",
                        y: "372",
                        width: "296",
                        height: "102",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            className: "gameboy-font",
                            style: {
                                color: "#fff",
                                fontSize: 6,
                                padding: 8,
                                display: "flex",
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "52%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 700,
                                                textAlign: "center"
                                            },
                                            children: "ABILITY"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 2026,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textTransform: "capitalize",
                                                fontWeight: 700
                                            },
                                            children: ability?.name ?? pokemon?.abilities?.[0]?.ability?.name ?? "???"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 2027,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 6,
                                                lineHeight: 1.2
                                            },
                                            children: ability?.short_effect ?? ability?.effect_entries?.find((e)=>e.language.name === "en")?.short_effect ?? pokemon?.abilities?.[0]?.ability?.name ?? "No description."
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 2030,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 2025,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "48%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 700,
                                                textAlign: "center"
                                            },
                                            children: "STATS"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 2039,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1
                                            },
                                            children: Array.isArray(stats) && stats.length > 0 ? stats.map((s)=>{
                                                const value = s.value ?? s.base_stat ?? 0;
                                                const pct = Math.round(value / maxStat * 100);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: 48,
                                                                fontSize: 5,
                                                                textTransform: "capitalize"
                                                            },
                                                            children: s.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                            lineNumber: 2047,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                flex: 1,
                                                                height: 10,
                                                                overflow: "hidden"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: `${pct}%`,
                                                                    height: "60%",
                                                                    borderRadius: 6,
                                                                    background: "#7ff971",
                                                                    boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                                lineNumber: 2049,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                            lineNumber: 2048,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: 28,
                                                                textAlign: "right",
                                                                fontSize: 6
                                                            },
                                                            children: value
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                            lineNumber: 2051,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, s.name, true, {
                                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                    lineNumber: 2046,
                                                    columnNumber: 23
                                                }, this);
                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 6
                                                },
                                                children: "???"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2056,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                            lineNumber: 2040,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 2038,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 2024,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2023,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                        x: "768",
                        y: "501",
                        width: "150",
                        height: "56",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            xmlns: "http://www.w3.org/1999/xhtml",
                            style: {
                                display: "flex",
                                flexDirection: "row",
                                gap: 20
                            },
                            children: pagedMoves && pagedMoves.length > 0 ? pagedMoves.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "gameboy-font",
                                    style: {
                                        fontWeight: 700,
                                        width: 140,
                                        whiteSpace: "nowrap",
                                        fontSize: 5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    },
                                    title: m.name.replace("-", " "),
                                    children: m.name.replace("-", " ")
                                }, m.name, false, {
                                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                    lineNumber: 2068,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "gameboy-font",
                                children: "???"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2078,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                            lineNumber: 2065,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2064,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 696 + CHEVRON_X_OFFSET,
                        y: "496",
                        rx: "3",
                        width: "22",
                        height: "16",
                        fill: "transparent",
                        onClick: (e)=>{
                            e.stopPropagation();
                            handlePrevMoves();
                        },
                        style: clickableStyle
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2084,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 723 + CHEVRON_X_OFFSET,
                        y: "496",
                        rx: "3",
                        width: "22",
                        height: "16",
                        fill: "transparent",
                        onClick: (e)=>{
                            e.stopPropagation();
                            handleNextMoves();
                        },
                        style: clickableStyle
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2085,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: "translate(645,490)",
                        children: (()=>{
                            const [e0, e1, e2] = getEvoWindow(evoWindowStart);
                            // rect layout constants (kept visually similar to your original sizes)
                            const rectW = 85;
                            const rectH = 80;
                            // coordinates relative to this group's origin to form a pyramid:
                            // top: centered roughly where old middle was (centerX ~ 76)
                            // lower-left / lower-right placed below & to the sides
                            const topX = 153; // rect x for top
                            const topY = 32;
                            const leftX = 106; // rect x for lower-left
                            const leftY = 120;
                            const rightX = 200; // rect x for lower-right
                            const rightY = 120;
                            // image inset inside rect (50x50 sprite)
                            const spriteW = 50;
                            const spriteH = 50;
                            const spriteInsetX = (rectW - spriteW) / 2; // 17.5 -> ~18
                            const spriteInsetY = 10;
                            const showChevrons = evoCount > 3;
                            // new: allow prev/next only when not at endpoints (no wrap)
                            const prevAllowed = evoWindowStart > 0;
                            const nextAllowed = evoWindowStart + 3 < evoCount;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: topX,
                                                y: topY,
                                                width: rectW,
                                                height: rectH,
                                                rx: "8",
                                                fill: "#f5c400",
                                                stroke: "#b78e00",
                                                style: {
                                                    cursor: e0 ? "pointer" : "default"
                                                },
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    if (e0) gotoEvolution(e0);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2122,
                                                columnNumber: 11
                                            }, this),
                                            e0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                                                        href: e0.sprite || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-64"] || "",
                                                        x: topX + spriteInsetX,
                                                        y: topY + spriteInsetY,
                                                        width: spriteW,
                                                        height: spriteH,
                                                        preserveAspectRatio: "xMidYMid meet",
                                                        style: {
                                                            pointerEvents: "none"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2138,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        x: topX + rectW / 2,
                                                        y: topY + rectH - 10,
                                                        fontSize: "8",
                                                        textAnchor: "middle",
                                                        className: "gameboy-font",
                                                        style: {
                                                            textTransform: "capitalize",
                                                            cursor: "pointer"
                                                        },
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            gotoEvolution(e0);
                                                        },
                                                        children: e0.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2147,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: topX + rectW / 2,
                                                y: topY + rectH / 1.8,
                                                fontSize: "8",
                                                textAnchor: "middle",
                                                className: "gameboy-font",
                                                children: "No Evo"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2163,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2121,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: leftX,
                                                y: leftY,
                                                width: rectW,
                                                height: rectH,
                                                rx: "8",
                                                fill: "#f5c400",
                                                stroke: "#b78e00",
                                                style: {
                                                    cursor: e1 ? "pointer" : "default"
                                                },
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    if (e1) gotoEvolution(e1);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2171,
                                                columnNumber: 11
                                            }, this),
                                            e1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                                                        href: e1.sprite || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-64"] || "",
                                                        x: leftX + spriteInsetX,
                                                        y: leftY + spriteInsetY,
                                                        width: spriteW,
                                                        height: spriteH,
                                                        preserveAspectRatio: "xMidYMid meet",
                                                        style: {
                                                            pointerEvents: "none"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2187,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        x: leftX + rectW / 2,
                                                        y: leftY + rectH - 10,
                                                        fontSize: "8",
                                                        textAnchor: "middle",
                                                        className: "gameboy-font",
                                                        style: {
                                                            textTransform: "capitalize",
                                                            cursor: "pointer"
                                                        },
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            gotoEvolution(e1);
                                                        },
                                                        children: e1.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2196,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: leftX + rectW / 2,
                                                y: leftY + rectH / 1.8,
                                                fontSize: "8",
                                                textAnchor: "middle",
                                                className: "gameboy-font",
                                                children: "No Evo"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2212,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2170,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: rightX,
                                                y: rightY,
                                                width: rectW,
                                                height: rectH,
                                                rx: "8",
                                                fill: "#f5c400",
                                                stroke: "#b78e00",
                                                style: {
                                                    cursor: e2 ? "pointer" : "default"
                                                },
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    if (e2) gotoEvolution(e2);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2220,
                                                columnNumber: 11
                                            }, this),
                                            e2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                                                        href: e2.sprite || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$assetMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["placeholder-64"] || "",
                                                        x: rightX + spriteInsetX,
                                                        y: rightY + spriteInsetY,
                                                        width: spriteW,
                                                        height: spriteH,
                                                        preserveAspectRatio: "xMidYMid meet",
                                                        style: {
                                                            pointerEvents: "none"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2236,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        x: rightX + rectW / 2,
                                                        y: rightY + rectH - 10,
                                                        fontSize: "8",
                                                        textAnchor: "middle",
                                                        className: "gameboy-font",
                                                        style: {
                                                            textTransform: "capitalize",
                                                            cursor: "pointer"
                                                        },
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            gotoEvolution(e2);
                                                        },
                                                        children: e2.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2245,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: rightX + rectW / 2,
                                                y: rightY + rectH / 1.8,
                                                fontSize: "8",
                                                textAnchor: "middle",
                                                className: "gameboy-font",
                                                children: "No Evo"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2261,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2219,
                                        columnNumber: 9
                                    }, this),
                                    showChevrons ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: `translate(${leftX - 20}, ${leftY + rectH / 2 - 10})`,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            if (!prevAllowed) return;
                                            // slide window backward by 1 (no wrap)
                                            setEvoWindowStart((s)=>Math.max(0, s - 1));
                                        },
                                        style: {
                                            cursor: prevAllowed ? "pointer" : "not-allowed",
                                            opacity: prevAllowed ? 1 : 0.35
                                        },
                                        "aria-hidden": false,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: 42,
                                                y: -88,
                                                width: 18,
                                                height: 20,
                                                rx: 4,
                                                fill: "#cfcfcf",
                                                stroke: "#6a6a6a"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2280,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: 50,
                                                y: -74,
                                                fontSize: "12",
                                                fill: "#6a2a2a",
                                                fontFamily: "sans-serif",
                                                textAnchor: "middle",
                                                children: "<"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2281,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2269,
                                        columnNumber: 11
                                    }, this) : null,
                                    showChevrons ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: `translate(${rightX + rectW + 6}, ${rightY + rectH / 2 - 10})`,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            if (!nextAllowed) return;
                                            // slide window forward by 1 (no wrap)
                                            setEvoWindowStart((s)=>Math.min(evoCount - 3, s + 1));
                                        },
                                        style: {
                                            cursor: nextAllowed ? "pointer" : "not-allowed",
                                            opacity: nextAllowed ? 1 : 0.35
                                        },
                                        "aria-hidden": false,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: 0,
                                                y: 0,
                                                width: 18,
                                                height: 20,
                                                rx: 4,
                                                fill: "#cfcfcf",
                                                stroke: "#6a6a6a"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2298,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: 9.5,
                                                y: 14,
                                                fontSize: "12",
                                                fill: "#6a2a2a",
                                                fontFamily: "sans-serif",
                                                textAnchor: "middle",
                                                children: ">"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2299,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2287,
                                        columnNumber: 11
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2119,
                                columnNumber: 7
                            }, this);
                        })()
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2089,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "507.5",
                        y: "716",
                        textAnchor: "middle",
                        fontSize: "12",
                        className: "gameboy-font",
                        children: loading ? "LOADING POKEMON..." : error ? "ERROR LOADING POKEMON!" : ""
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2309,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                lineNumber: 1249,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                style: {
                    display: "none"
                },
                onChange: handleFileSelection
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                lineNumber: 2313,
                columnNumber: 7
            }, this),
            overrideToggleIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setShowOverridePanel((v)=>!v),
                onMouseEnter: hoverable.onMouseEnter,
                onMouseLeave: hoverable.onMouseLeave,
                style: {
                    position: "absolute",
                    left: -58,
                    top: 170,
                    width: 48,
                    height: 48,
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "transparent",
                    filter: showOverridePanel ? "drop-shadow(0 0 6px rgba(0,0,0,0.55))" : "drop-shadow(0 0 4px rgba(0,0,0,0.35))",
                    transform: "rotate(-4deg)"
                },
                title: showOverridePanel ? "Hide override controls" : "Show override controls",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: overrideToggleIcon,
                    alt: "Override controls",
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated"
                    }
                }, void 0, false, {
                    fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                    lineNumber: 2344,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                lineNumber: 2321,
                columnNumber: 9
            }, this) : null,
            showOverridePanel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "override-panel",
                style: {
                    position: "absolute",
                    left: -245,
                    top: 220,
                    width: 230,
                    maxHeight: "87vh",
                    overflowY: "auto",
                    background: "#d41414",
                    border: "3px solid #7a0c0c",
                    borderRadius: 14,
                    padding: 10,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.42)",
                    fontFamily: "'Gameboy', monospace",
                    color: "#fffbe6",
                    fontSize: 10,
                    zIndex: 5,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                        children: `div#override-panel::-webkit-scrollbar{display:none;}`
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2375,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    fontWeight: 700,
                                    fontSize: 10,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    textAlign: "left"
                                },
                                children: "Override Console"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2377,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowOverridePanel(false),
                                ...hoverable,
                                style: {
                                    fontSize: 8,
                                    color: "white",
                                    cursor: "pointer",
                                    fontFamily: "'Gameboy'",
                                    textAlign: "center",
                                    background: "transparent",
                                    border: "none",
                                    padding: 0,
                                    lineHeight: 1,
                                    minWidth: 10,
                                    minHeight: 10
                                },
                                children: "X"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2389,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2376,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 6,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"] ? "#bafacb" : "#ffe0e0"
                        },
                        children: [
                            "API: ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"] ? "Connected" : "Not configured"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2408,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 8,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: toggleEditMode,
                                disabled: !__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"] || !pokemon?.id,
                                onMouseEnter: hoverable.onMouseEnter,
                                onMouseLeave: hoverable.onMouseLeave,
                                style: {
                                    padding: "4px 8px",
                                    background: canEdit ? "#5ac85a" : "#fff27c",
                                    color: "#3a0a0a",
                                    border: "2px solid #7a0c0c",
                                    borderRadius: 10,
                                    cursor: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"] && pokemon?.id ? "pointer" : "not-allowed",
                                    fontFamily: "'Gameboy', monospace",
                                    fontSize: 10
                                },
                                children: canEdit ? "Exit edit mode" : "Enter Edit mode"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2412,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: promptForAdminToken,
                                disabled: !__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"],
                                onMouseEnter: hoverable.onMouseEnter,
                                onMouseLeave: hoverable.onMouseLeave,
                                style: {
                                    padding: "4px 8px",
                                    background: "#fff27c",
                                    color: "#3a0a0a",
                                    border: "2px solid #7a0c0c",
                                    borderRadius: 10,
                                    cursor: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"] ? "pointer" : "not-allowed",
                                    fontFamily: "'Gameboy', monospace",
                                    fontSize: 10
                                },
                                children: "Set token"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2431,
                                columnNumber: 13
                            }, this),
                            adminToken ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: clearAdminToken,
                                onMouseEnter: hoverable.onMouseEnter,
                                onMouseLeave: hoverable.onMouseLeave,
                                style: {
                                    padding: "4px 8px",
                                    background: "#ffb3b3",
                                    color: "#3a0a0a",
                                    border: "2px solid #7a0c0c",
                                    borderRadius: 10,
                                    fontFamily: "'Gameboy', monospace",
                                    fontSize: 10
                                },
                                children: "Clear token"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2451,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2411,
                        columnNumber: 11
                    }, this),
                    operationStatus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 8,
                            padding: "6px 8px",
                            borderRadius: 10,
                            background: operationStatus.type === "error" ? "#5e0b0b" : "#0f6130",
                            color: "#fff",
                            lineHeight: 1.4,
                            border: "2px solid rgba(0,0,0,0.25)"
                        },
                        children: operationStatus.message
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2471,
                        columnNumber: 13
                    }, this) : null,
                    canEdit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 10,
                                    fontWeight: 700,
                                    borderTop: "2px solid #a01818",
                                    paddingTop: 8
                                },
                                children: [
                                    "Name & Description (",
                                    pokemon?.name ?? "??",
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2487,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "block",
                                    marginTop: 6,
                                    fontSize: 11,
                                    fontWeight: 700
                                },
                                children: "Display name"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2490,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: overrideDraft?.displayName ?? "",
                                onChange: (e)=>handleDraftChange("displayName", e.target.value),
                                style: {
                                    width: "100%",
                                    padding: "6px 6px",
                                    borderRadius: 8,
                                    border: "2px solid #7a0c0c",
                                    background: "#fff7d1",
                                    color: "#2a0a0a",
                                    fontFamily: "'Gameboy', monospace"
                                },
                                maxLength: 60
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2491,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "block",
                                    marginTop: 6,
                                    fontSize: 11,
                                    fontWeight: 700
                                },
                                children: "Description"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2506,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: overrideDraft?.description ?? "",
                                onChange: (e)=>handleDraftChange("description", e.target.value),
                                style: {
                                    width: "100%",
                                    padding: "6px 6px",
                                    borderRadius: 8,
                                    border: "2px solid #7a0c0c",
                                    background: "#fff7d1",
                                    color: "#2a0a0a",
                                    fontFamily: "'Gameboy', monospace",
                                    minHeight: 80,
                                    resize: "vertical"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2507,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 6,
                                    display: "flex",
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleSaveTextFields,
                                        disabled: !draftDirty || overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            flex: 1,
                                            background: "#5ac85a",
                                            color: "#1f3a1f",
                                            border: "2px solid #2f7a2f",
                                            borderRadius: 10,
                                            padding: "6px 8px",
                                            cursor: draftDirty && !overrideBusy ? "pointer" : "not-allowed",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10
                                        },
                                        children: "Save text"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2523,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleResetText,
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            flex: 1,
                                            background: "#ffb3b3",
                                            color: "#3a0a0a",
                                            border: "2px solid #7a0c0c",
                                            borderRadius: 10,
                                            padding: "6px 8px",
                                            cursor: overrideBusy ? "not-allowed" : "pointer",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10
                                        },
                                        children: "Reset text"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2543,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2522,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12,
                                    fontWeight: 700,
                                    borderTop: "2px solid #a01818",
                                    paddingTop: 8,
                                    textAlign: "center"
                                },
                                children: "Artwork & Sprites"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2565,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 10,
                                    lineHeight: 1.4,
                                    marginTop: 4,
                                    textAlign: "left"
                                },
                                children: "Click the orb for sprites (Shift = shiny)."
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2568,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 10,
                                    lineHeight: 1.4,
                                    marginTop: 4,
                                    textAlign: "left"
                                },
                                children: "Click the artwork window for main art (Shift = shiny)."
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2571,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 6,
                                    marginTop: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>beginUpload("spriteNormal"),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Upload orb sprite"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>persistOverridePatch({
                                                spriteNormal: null
                                            }, "Orb sprite reset."),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Reset orb sprite"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2584,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>beginUpload("spriteShiny"),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Upload shiny sprite"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2594,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>persistOverridePatch({
                                                spriteShiny: null
                                            }, "Shiny sprite reset."),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Reset shiny sprite"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2604,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>beginUpload("artNormal"),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Upload artwork"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2614,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>persistOverridePatch({
                                                artNormal: null
                                            }, "Artwork reset."),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Reset artwork"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2624,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>beginUpload("artShiny"),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Upload shiny art"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2634,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>persistOverridePatch({
                                                artShiny: null
                                            }, "Shiny artwork reset."),
                                        disabled: overrideBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            color: "#fffbe6",
                                            cursor: overrideBusy ? "not-allowed" : "pointer"
                                        },
                                        children: "Reset shiny art"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2644,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2573,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12,
                                    fontWeight: 700,
                                    borderTop: "2px solid #a01818",
                                    paddingTop: 8,
                                    textAlign: "center"
                                },
                                children: "Held Item Overrides"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2656,
                                columnNumber: 15
                            }, this),
                            overrideHeldItems.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                style: {
                                    marginTop: 6,
                                    paddingLeft: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4
                                },
                                children: overrideHeldItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    flexDirection: "column"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontWeight: 700
                                                        },
                                                        children: item.itemName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2664,
                                                        columnNumber: 25
                                                    }, this),
                                                    item.itemSprite ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: item.itemSprite,
                                                        target: "_blank",
                                                        rel: "noreferrer",
                                                        style: {
                                                            fontSize: 10,
                                                            color: "#fff7d1"
                                                        },
                                                        children: "sprite"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                        lineNumber: 2666,
                                                        columnNumber: 27
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2663,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleDeleteHeldItem(item.id),
                                                disabled: heldItemBusy,
                                                onMouseEnter: hoverable.onMouseEnter,
                                                onMouseLeave: hoverable.onMouseLeave,
                                                style: {
                                                    padding: "2px 6px",
                                                    background: "#ffb3b3",
                                                    color: "#3a0a0a",
                                                    border: "2px solid #7a0c0c",
                                                    borderRadius: 8,
                                                    cursor: heldItemBusy ? "not-allowed" : "pointer",
                                                    fontFamily: "'Gameboy', monospace"
                                                },
                                                children: "Remove"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                                lineNumber: 2671,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2662,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2660,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 4,
                                    fontSize: 11
                                },
                                children: "No held item overrides yet."
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2693,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 8,
                                    padding: 8,
                                    borderRadius: 10,
                                    background: "#b30f0f",
                                    border: "2px solid #7a0c0c",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Held item name",
                                        value: newHeldItem.name,
                                        onChange: (e)=>setNewHeldItem((prev)=>({
                                                    ...prev,
                                                    name: e.target.value
                                                })),
                                        style: {
                                            padding: "4px 6px",
                                            borderRadius: 6,
                                            border: "2px solid #7a0c0c",
                                            background: "#fff7d1",
                                            color: "#2a0a0a",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2707,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Sprite URL (optional)",
                                        value: newHeldItem.sprite,
                                        onChange: (e)=>setNewHeldItem((prev)=>({
                                                    ...prev,
                                                    sprite: e.target.value
                                                })),
                                        style: {
                                            padding: "4px 6px",
                                            borderRadius: 6,
                                            border: "2px solid #7a0c0c",
                                            background: "#fff7d1",
                                            color: "#2a0a0a",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2722,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleHeldItemUploadClick,
                                        disabled: heldItemBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            alignSelf: "flex-start",
                                            padding: "2px 6px",
                                            background: "#fff27c",
                                            color: "#3a0a0a",
                                            border: "2px solid #7a0c0c",
                                            borderRadius: 8,
                                            cursor: heldItemBusy ? "not-allowed" : "pointer",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10
                                        },
                                        children: "Upload icon"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2737,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        placeholder: "Notes (optional)",
                                        value: newHeldItem.notes,
                                        onChange: (e)=>setNewHeldItem((prev)=>({
                                                    ...prev,
                                                    notes: e.target.value
                                                })),
                                        style: {
                                            padding: "4px 6px",
                                            borderRadius: 6,
                                            border: "2px solid #7a0c0c",
                                            background: "#fff7d1",
                                            color: "#2a0a0a",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10,
                                            minHeight: 60,
                                            resize: "vertical"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2757,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleAddHeldItem,
                                        disabled: heldItemBusy,
                                        onMouseEnter: hoverable.onMouseEnter,
                                        onMouseLeave: hoverable.onMouseLeave,
                                        style: {
                                            padding: "6px 8px",
                                            background: "#5ac85a",
                                            color: "#1f3a1f",
                                            border: "2px solid #2f7a2f",
                                            borderRadius: 10,
                                            cursor: heldItemBusy ? "not-allowed" : "pointer",
                                            fontFamily: "'Gameboy', monospace",
                                            fontSize: 10
                                        },
                                        children: "Save held item"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                        lineNumber: 2773,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2695,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleOverrideReset,
                                disabled: overrideBusy || heldItemBusy,
                                onMouseEnter: hoverable.onMouseEnter,
                                onMouseLeave: hoverable.onMouseLeave,
                                style: {
                                    marginTop: 12,
                                    width: "100%",
                                    background: "#5e0b0b",
                                    color: "#fff7d1",
                                    border: "2px solid #a01818",
                                    padding: "8px 10px",
                                    borderRadius: 12,
                                    cursor: overrideBusy || heldItemBusy ? "not-allowed" : "pointer",
                                    fontFamily: "'Gameboy', monospace",
                                    fontSize: 9,
                                    fontWeight: 700
                                },
                                children: "Delete override entry"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                                lineNumber: 2794,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 8,
                            fontSize: 11,
                            lineHeight: 1.5
                        },
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$lib$2f$overrideApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOverrideApi"] ? "Enter edit mode to customize this Pokémon. Hold Shift on orb/art to update shiny versions." : "Set VITE_OVERRIDE_API_URL in your Vite env and restart the client to enable override editing."
                    }, void 0, false, {
                        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                        lineNumber: 2818,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
                lineNumber: 2353,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx",
        lineNumber: 1241,
        columnNumber: 5
    }, this);
}
_s(PokedexShell, "Mzv9jCcfZ+UAJ1FTt+PN07jssus=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$hooks$2f$usePokemon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = PokedexShell;
var _c;
__turbopack_context__.k.register(_c, "PokedexShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Pokemon/poke-app/next-frontend/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/next-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$components$2f$PokedexShell$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Pokemon/poke-app/src/components/PokedexShell.jsx [app-client] (ecmascript)");
"use client";
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen justify-center items-start",
        style: {
            paddingTop: 0,
            marginTop: -150,
            marginLeft: 320
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$next$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Pokemon$2f$poke$2d$app$2f$src$2f$components$2f$PokedexShell$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            initial: 1
        }, void 0, false, {
            fileName: "[project]/Documents/Pokemon/poke-app/next-frontend/app/page.js",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/Pokemon/poke-app/next-frontend/app/page.js",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_Pokemon_poke-app_01fccc58._.js.map