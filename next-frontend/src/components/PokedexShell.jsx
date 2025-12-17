"use client";
// src/components/PokedexShell.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import usePokemon from "../hooks/usePokemon";
import SizeComparison from "./SizeComparison";
import HeldItems from "./HeldItems";
import {
  createHeldItemOverride,
  deleteHeldItemOverride,
  deleteOverrideEntry,
  fetchOverrideRecord,
  hasOverrideApi,
  overrideApiBase,
  saveOverrideEntry,
  uploadOverrideFile,
} from "../lib/overrideApi";
import assetMap from "../lib/assetMap";

const TYPE_FILTER_CACHE = new Map();
const ADMIN_TOKEN_KEY = "pokedex-admin-token";

/**
 * PokedexShell component
 *
 * - Blue circular button (left lower): toggle shiny for currently displayed form
 * - Mega button: cycle mega variants (supports multiple megas; returns to base after last)
 * - Other-forms button: cycle other non-mega, non-shiny forms (returns to base)
 * - Up/Down d-pad: iterate through pokemon-form endpoints (skip shiny)
 * - Orange chevron circle (right panel): RESET / clear current entry
 *
 * NOTE: layout intentionally preserved from your original file.
 */

export default function PokedexShell({ initial = 1 }) {
  const [currentId, setCurrentId] = useState(initial);

  const {
    loading,
    error,
    pokemon,
    species,
    images = [],
    currentImageIndex,
    setCurrentImageIndex,
    types,
    ability,
    stats,
    pagedMoves,
    movesPage,
    setMovesPage,
    totalMovesPages,
    evoChain,
    megaVariants,
    otherForms,
    imageIndexByName,
    heldItemsDetails,
    // NOTE: forms and clear are provided by the updated hook
    forms: formsList = [],
    clear: clearPokemonState,
    cryUrl,
    displayName,
    flavorText,
    override: overrideInfo,
    refresh: refreshPokemonData,
  } = usePokemon(currentId);

  // chevron tweak
  const CHEVRON_X_OFFSET = 0;

  // load local assets (icons / UI images)
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

  const [editMode, setEditMode] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [overrideDraft, setOverrideDraft] = useState({
    slug: "",
    pokemonId: null,
    displayName: "",
    description: "",
    spriteNormal: null,
    spriteShiny: null,
    artNormal: null,
    artShiny: null,
    metadataJson: null,
  });
  const [draftDirty, setDraftDirty] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);
  const [overrideBusy, setOverrideBusy] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(null);
  const fileInputRef = useRef(null);
  const [newHeldItem, setNewHeldItem] = useState({ name: "", sprite: "", notes: "" });
  const [heldItemBusy, setHeldItemBusy] = useState(false);
  const [showOverridePanel, setShowOverridePanel] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (adminToken) {
      window.localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
    } else {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  }, [adminToken]);

  useEffect(() => {
    setOverrideDraft({
      slug: (overrideInfo?.slug ?? pokemon?.name?.toLowerCase() ?? "").trim(),
      pokemonId: overrideInfo?.pokemonId ?? pokemon?.id ?? null,
      displayName: overrideInfo?.displayName ?? "",
      description: overrideInfo?.description ?? "",
      spriteNormal: overrideInfo?.spriteNormal ?? null,
      spriteShiny: overrideInfo?.spriteShiny ?? null,
      artNormal: overrideInfo?.artNormal ?? null,
      artShiny: overrideInfo?.artShiny ?? null,
      metadataJson: overrideInfo?.metadataJson ?? null,
    });
    setDraftDirty(false);
  }, [
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
    overrideInfo?.slug,
  ]);

  useEffect(() => {
    if (!operationStatus) return;
    const timer = setTimeout(() => setOperationStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [operationStatus]);

  const canEdit = editMode && hasOverrideApi;
  const identifierForOverride = pokemon?.id ?? overrideDraft?.slug ?? overrideInfo?.slug ?? currentId ?? "";
  const overrideHeldItems = overrideInfo?.heldItems ?? [];

  function setStatusMessage(type, message) {
    if (!message) return;
    setOperationStatus({ type, message, at: Date.now() });
  }

  function ensureAdminAccess() {
    if (!hasOverrideApi) {
      setStatusMessage("error", "Set VITE_OVERRIDE_API_URL to enable overrides.");
      return null;
    }
    if (adminToken) return adminToken;
    if (typeof window === "undefined") return null;
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
    const normalizedDisplay = displayProvided
      ? normalizeOptionalText(patch.displayName)
      : normalizeOptionalText(overrideDraft?.displayName ?? overrideInfo?.displayName ?? null);
    const normalizedDescription = descriptionProvided
      ? normalizeOptionalText(patch.description)
      : normalizeOptionalText(overrideDraft?.description ?? overrideInfo?.description ?? null);

    const slugCandidates = [
      patch.slug ? sanitizeSearchValue(patch.slug) : null,
      normalizedDisplay && displayProvided ? sanitizeSearchValue(patch.displayName ?? normalizedDisplay) : null,
      !displayProvided && overrideDraft?.displayName ? sanitizeSearchValue(overrideDraft.displayName) : null,
      overrideDraft?.slug ? sanitizeSearchValue(overrideDraft.slug) : null,
      overrideInfo?.slug ? sanitizeSearchValue(overrideInfo.slug) : null,
      pokemon?.name ? sanitizeSearchValue(pokemon.name) : null,
      typeof pokemon?.id === "number" ? sanitizeSearchValue(pokemon.id) : null,
      currentId ? sanitizeSearchValue(currentId) : null,
    ].filter((val) => val && String(val).trim().length > 0);
    const normalizedSlug = slugCandidates.length ? String(slugCandidates[0]).trim().toLowerCase() : "";

    const pokemonIdValue = (() => {
      const direct =
        patch.pokemonId ??
        overrideDraft?.pokemonId ??
        overrideInfo?.pokemonId ??
        pokemon?.id ??
        (Number.isFinite(Number(currentId)) ? Number(currentId) : null);
      return direct ?? null;
    })();

    return {
      slug: normalizedSlug,
      pokemonId: pokemonIdValue,
      displayName: normalizedDisplay,
      description: normalizedDescription,
      spriteNormal:
        patch.spriteNormal !== undefined ? patch.spriteNormal : overrideDraft?.spriteNormal ?? null,
      spriteShiny:
        patch.spriteShiny !== undefined ? patch.spriteShiny : overrideDraft?.spriteShiny ?? null,
      artNormal: patch.artNormal !== undefined ? patch.artNormal : overrideDraft?.artNormal ?? null,
      artShiny: patch.artShiny !== undefined ? patch.artShiny : overrideDraft?.artShiny ?? null,
      metadataJson:
        patch.metadataJson !== undefined ? patch.metadataJson : overrideDraft?.metadataJson ?? null,
    };
  }

  async function persistOverridePatch(patch, successMessage, providedToken) {
    if (!hasOverrideApi) {
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
      const res = await saveOverrideEntry(identifierForOverride, payload, token);
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
        metadataJson: saved.metadataJson ?? null,
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
    } finally {
      setOverrideBusy(false);
    }
  }

  function beginUpload(target) {
    const token = ensureAdminAccess();
    if (!token) return;
    setPendingUpload({ target, token });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  function resolveUploadUrl(url) {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    if (!overrideApiBase) return url;
    if (url.startsWith("/")) return `${overrideApiBase}${url}`;
    return `${overrideApiBase}/${url}`;
  }

  async function handleFileSelection(event) {
    const file = event.target?.files?.[0];
    if (!file || !pendingUpload) return;
    try {
      const response = await uploadOverrideFile(file, pendingUpload.token);
      const normalizedUrl = resolveUploadUrl(response?.url);
      if (!normalizedUrl) throw new Error("Upload did not return a file URL.");
      if (pendingUpload.target === "newHeldItemSprite") {
        setNewHeldItem((prev) => ({ ...prev, sprite: normalizedUrl }));
        setStatusMessage("success", "Held item image uploaded. Save to attach.");
      } else {
        const label = pendingUpload.target.includes("sprite") ? "Sprite updated." : "Artwork updated.";
        await persistOverridePatch({ [pendingUpload.target]: normalizedUrl }, label, pendingUpload.token);
      }
    } catch (err) {
      setStatusMessage("error", err?.message || "File upload failed.");
    } finally {
      if (event.target) event.target.value = "";
      setPendingUpload(null);
    }
  }

  function handleDraftChange(field, value) {
    setOverrideDraft((prev) => ({ ...prev, [field]: value }));
    setDraftDirty(true);
  }

  async function handleSaveTextFields() {
    const res = await persistOverridePatch(
      {
        displayName: overrideDraft?.displayName ?? "",
        description: overrideDraft?.description ?? "",
      },
      "Name and description saved."
    );
    if (res) {
      setDraftDirty(false);
      refreshPokemonData && refreshPokemonData();
    }
  }

  async function handleResetText() {
    const token = ensureAdminAccess();
    if (!token) return;
    const canonicalSlugSource =
      pokemon?.name ??
      (typeof pokemon?.id === "number" ? String(pokemon.id) : null) ??
      (overrideInfo?.slug || overrideInfo?.pokemonId) ??
      currentId ??
      "";
    const canonicalSlug = sanitizeSearchValue(canonicalSlugSource) || undefined;
    try {
      const res = await persistOverridePatch(
        { displayName: null, description: null, slug: canonicalSlug },
        "Text reset to API default.",
        token
      );
      if (res) {
        setDraftDirty(false);
        refreshPokemonData && refreshPokemonData();
        setOverrideDraft((prev) => ({
          ...prev,
          displayName: "",
          description: "",
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
          metadataJson: overrideDraft?.metadataJson ?? null,
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
    if (typeof window !== "undefined" && !window.confirm("Remove all overrides for this Pokemon?")) return;
    const token = ensureAdminAccess();
    if (!token) return;
    setOverrideBusy(true);
    try {
      await deleteOverrideEntry(identifierForOverride, token);
      setOverrideDraft({
        slug: pokemon?.name?.toLowerCase() ?? "",
        pokemonId: pokemon?.id ?? null,
        displayName: "",
        description: "",
        spriteNormal: null,
        spriteShiny: null,
        artNormal: null,
        artShiny: null,
        metadataJson: null,
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
    } finally {
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
      await createHeldItemOverride(identifierForOverride, {
        itemName: trimmedName,
        itemSprite: newHeldItem.sprite?.trim() || null,
        notes: newHeldItem.notes?.trim() || null,
      }, token);
      setNewHeldItem({ name: "", sprite: "", notes: "" });
      setStatusMessage("success", "Held item override saved.");
      refreshPokemonData && refreshPokemonData();
    } catch (err) {
      setStatusMessage("error", err?.message || "Failed to save held item.");
    } finally {
      setHeldItemBusy(false);
    }
  }

  async function handleDeleteHeldItem(itemId) {
    if (!canEdit || !itemId) return;
    if (typeof window !== "undefined" && !window.confirm("Delete this held item override?")) return;
    const token = ensureAdminAccess();
    if (!token) return;
    setHeldItemBusy(true);
    try {
      await deleteHeldItemOverride(identifierForOverride, itemId, token);
      setStatusMessage("success", "Held item removed.");
      refreshPokemonData && refreshPokemonData();
    } catch (err) {
      setStatusMessage("error", err?.message || "Failed to delete held item.");
    } finally {
      setHeldItemBusy(false);
    }
  }

  function toggleEditMode() {
    if (!hasOverrideApi) {
      setStatusMessage("error", "Configure the override server URL first.");
      return;
    }
    if (!editMode) {
      const token = ensureAdminAccess();
      if (!token) return;
    }
    setEditMode((prev) => !prev);
  }

  function promptForAdminToken() {
    if (typeof window === "undefined") return;
    const next = window.prompt("Enter admin token", adminToken || "");
    if (next === null) return;
    setAdminToken(next.trim());
  }

  function clearAdminToken() {
    setAdminToken("");
    setEditMode(false);
  }

  const handleOrbOverrideClick = (event) => {
    if (!canEdit) return;
    event.stopPropagation();
    beginUpload(event.shiftKey ? "spriteShiny" : "spriteNormal");
  };

  const handleArtOverrideClick = (event) => {
    if (!canEdit) return;
    event.stopPropagation();
    beginUpload(event.shiftKey ? "artShiny" : "artNormal");
  };

  const handleHeldItemUploadClick = () => {
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


  const typeIconUrl = (typeName) => (typeName ? assetMap[typeName.toLowerCase()] : null);

  // derive current image url and small sprite (artwork) - used for main frame
  const currentImageUrl = useMemo(
    () => (images && images.length ? images[currentImageIndex]?.url || null : null),
    [images, currentImageIndex]
  );

  // previous small-sprite behavior preserved as fallback
  const smallSpriteUrl = useMemo(() => {
    if (!images || images.length === 0) return pokemon?.sprites?.front_default || assetMap["placeholder-64"] || null;
    const entry = images[currentImageIndex] || {};
    return entry.sprite || entry.url || pokemon?.sprites?.front_default || assetMap["placeholder-64"] || null;
  }, [images, currentImageIndex, pokemon, assetMap]);

  const canonicalName = useMemo(() => {
    return images?.[currentImageIndex]?.label ?? pokemon?._formInfo?.name ?? pokemon?.name ?? "";
  }, [images, currentImageIndex, pokemon?._formInfo?.name, pokemon?.name]);

  const resolvedDisplayName = useMemo(() => {
    const trimmed = (displayName || "").trim();
    return trimmed || canonicalName || "";
  }, [displayName, canonicalName]);

  // Orb (lens) sprite - we still detect available Gen5 BW gif or showdown fallback
  const [orbUrlPrimary, setOrbUrlPrimary] = useState(null);
  const [orbUrlShiny, setOrbUrlShiny] = useState(null);

  useEffect(() => {
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
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
      ];
      const candidatesShiny = [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`,
      ];

      async function testUrl(url) {
        try {
          const r = await fetch(url, { method: "GET" });
          return r.ok;
        } catch (err) {
          void err;
          return false;
        }
      }

      let primarySet = Boolean(overrideInfo?.spriteNormal);
      if (!primarySet) {
        for (const u of candidates) {
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
        for (const u of candidatesShiny) {
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
    return () => {
      mounted = false;
    };
  }, [pokemon?._formInfo?.id, pokemon?.id, smallSpriteUrl, overrideInfo?.spriteNormal, overrideInfo?.spriteShiny]);

  // UI: determine whether current displayed image is shiny / mega / other
  const currLabelRaw = (images?.[currentImageIndex]?.label ?? pokemon?.name ?? "").toString();
  const currLabelLower = currLabelRaw.toLowerCase();
  const currLabelClean = currLabelLower.replace(/\s*\(shiny\)\s*$/, "").trim();
  const isShiny = /\(shiny\)/.test(currLabelLower);
  const isMega = (function () {
    if (Array.isArray(megaVariants) && megaVariants.length) {
      return megaVariants.some((m) => {
        if (!m) return false;
        return m === currLabelLower || currLabelLower.includes(m);
      });
    }
    return /\bmega\b/.test(currLabelClean);
  })();
  const isOtherForm = (function () {
    if (Array.isArray(otherForms) && otherForms.length) {
      return otherForms.some((o) => o === currLabelClean);
    }
    const base = (pokemon?.name || "").toLowerCase();
    return !!(currLabelClean && currLabelClean !== base && !/\bmega\b/.test(currLabelClean));
  })();

  // audio placeholder (cry)
  const audioElRef = useRef(null);
  const [playing, setPlaying] = useState(false);

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
      a.play().catch((err) => {
        console.warn("Cry playback failed, falling back to oscillator:", err);
        playPlaceholderOscillator();
      });
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      return;
    }
    playPlaceholderOscillator();
  }

  const audioCtxRef = useRef(null);
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
    setTimeout(() => {
      try {
        o.stop();
      } catch (err) {
        void err;
      }
      setPlaying(false);
    }, 1000);
  }

  // --- NEW: Type filter state & helpers ---
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null); // e.g. "fairy"
  const [filteredList, setFilteredList] = useState(null); // array of pokemon names when a filter is active
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const filterRequestIdRef = useRef(0);

  // derive available filter types from assets (expects filter-[type].svg naming)
  const availableFilterTypes = useMemo(() => {
    return Object.keys(assetMap)
      .filter((k) => k.startsWith("filter-"))
      .map((k) => k.replace(/^filter-/, ""));
  }, [assetMap]);

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
      const names = (data.pokemon || []).map((p) => p.pokemon.name).filter(Boolean);
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
    } finally {
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
      const idx = Math.max(0, filteredList.findIndex((n) => n === currName));
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
      const idx = Math.max(0, filteredList.findIndex((n) => n === currName));
      const nextIdx = (idx + 1) % filteredList.length;
      setCurrentId(String(filteredList[nextIdx]));
      return;
    }
    const baseId = Number(pokemon?.id ?? currentId);
    const target = Number.isFinite(baseId) ? baseId + 1 : 1;
    setCurrentId(String(target));
  }

  // D-pad visual press
  const [dpadPressed, setDpadPressed] = useState(false);

  // LED logic unchanged (left/right / frame)
  const [leftLedIndex, setLeftLedIndex] = useState(0);
  const [leftAllOn, setLeftAllOn] = useState(false);
  const leftIntervalRef = useRef(null);
  useEffect(() => {
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    const IDLE_MS = 800;
    const LOADING_MS = 160;
    if (loading) {
      setLeftAllOn(true);
      leftIntervalRef.current = window.setInterval(() => setLeftAllOn((p) => !p), LOADING_MS);
    } else {
      setLeftAllOn(false);
      leftIntervalRef.current = window.setInterval(() => setLeftLedIndex((p) => (p + 1) % 3), IDLE_MS);
    }
    return () => {
      if (leftIntervalRef.current) {
        clearInterval(leftIntervalRef.current);
        leftIntervalRef.current = null;
      }
    };
  }, [loading]);
  useEffect(() => {
    return () => {
      if (leftIntervalRef.current) {
        clearInterval(leftIntervalRef.current);
        leftIntervalRef.current = null;
      }
    };
  }, []);
  function leftLedOpacity(i) {
    if (loading) return leftAllOn ? 1 : 0.18;
    return leftLedIndex === i ? 1 : 0.25;
  }

  const [rightLedIndex, setRightLedIndex] = useState(0);
  const [rightForcedFast, setRightForcedFast] = useState(false);
  const rightIntervalRef = useRef(null);
  const rightBlinkRemainingRef = useRef(0);
  const rightForcedMsRef = useRef(160);
  const RIGHT_IDLE_SEQ = useRef([0, 1, 2, 1]);
  const rightIdleStepRef = useRef(0);
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
  useEffect(() => {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
    const IDLE_MS = 800;
    const intervalMs = rightForcedFast ? rightForcedMsRef.current : IDLE_MS;
    rightIntervalRef.current = window.setInterval(() => {
      if (rightForcedFast) {
        setRightLedIndex((prev) => {
          const next = (prev + 1) % 3;
          if (rightBlinkRemainingRef.current > 0) {
            rightBlinkRemainingRef.current -= 1;
            if (rightBlinkRemainingRef.current <= 0) setRightForcedFast(false);
          }
          return next;
        });
      } else {
        rightIdleStepRef.current = (rightIdleStepRef.current + 1) % RIGHT_IDLE_SEQ.current.length;
        const nextIndex = RIGHT_IDLE_SEQ.current[rightIdleStepRef.current];
        setRightLedIndex(nextIndex);
      }
    }, intervalMs);
    return () => {
      if (rightIntervalRef.current) {
        clearInterval(rightIntervalRef.current);
        rightIntervalRef.current = null;
      }
    };
  }, [rightForcedFast, totalMovesPages, movesPage]);
  useEffect(() => {
    return () => {
      if (rightIntervalRef.current) {
        clearInterval(rightIntervalRef.current);
        rightIntervalRef.current = null;
      }
    };
  }, []);
  function rightLedOpacity(i) {
    return rightLedIndex === i ? 1 : 0.25;
  }

  // left frame tiny LEDs
  const [leftFrameTopOn, setLeftFrameTopOn] = useState(true);
  useEffect(() => {
    const FRAME_INTERVAL = 300;
    const t = window.setInterval(() => setLeftFrameTopOn((s) => !s), FRAME_INTERVAL);
    return () => clearInterval(t);
  }, []);

  // stats cap
  const statValues = useMemo(() => (stats ? stats.map((s) => s.value ?? s.base_stat ?? 0) : []), [stats]);
  const maxStat = useMemo(() => {
    const maxFound = statValues.length ? Math.max(...statValues) : 100;
    return Math.max(100, Math.min(255, maxFound));
  }, [statValues]);

  // --- Name edit / search UI ---
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  useEffect(() => {
    const label = images?.[currentImageIndex]?.label ?? pokemon?._formInfo?.name ?? pokemon?.name ?? "";
    setNameInput(label);
  }, [images, currentImageIndex, pokemon]);

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
    const overrideNameMatch =
      overrideInfo?.displayName && sanitizeSearchValue(overrideInfo.displayName) === v && pokemon?.id;
    if (overrideNameMatch) {
      setCurrentId(pokemon.id);
      return;
    }
    // Try override API lookup (slug/displayName) to resolve to a pokemon id
    try {
      const ov = await fetchOverrideRecord(v);
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
    const lower = tokens.map((t) => t.toLowerCase());
    if (lower.includes("mega")) {
      const baseTokens = tokens.filter((t) => t.toLowerCase() !== "mega" && !["x", "y", "z"].includes(t.toLowerCase()));
      const extras = tokens.filter((t) => ["x", "y", "z"].includes(t.toLowerCase()));
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
    for (let i = 0; i < images.length; i++) {
      const lbl = String(images[i]?.label || "").toLowerCase();
      const cl = lbl.replace(/\s*\(shiny\)\s*$/, "").trim();
      if (cl === cleaned && !/\(shiny\)/.test(lbl)) return i;
    }

    // 2) if mapping exists, try direct map (imageIndexByName)
    if (imageIndexByName && imageIndexByName[labelLower] != null) return imageIndexByName[labelLower];

    // 3) find any image whose cleaned label matches (could be shiny)
    for (let i = 0; i < images.length; i++) {
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
    for (let i = 0; i < images.length; i++) {
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
    const megas = Array.from(new Set(megaVariants.map((m) => (m || "").toLowerCase())));

    const currPos = megas.findIndex((m) => curr === m || curr.includes(m));
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
    const others = Array.isArray(otherForms) ? otherForms.map((s) => (s || "").toLowerCase()) : [];
    const forms = [base, ...others.filter((o) => o && o !== base)];
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
  const [formIndex, setFormIndex] = useState(0);
  useEffect(() => {
    if (!formsList || !formsList.length) {
      setFormIndex(0);
      return;
    }
    const activeName = sanitizeSearchValue(pokemon?._formInfo?.name || pokemon?.name || formsList[0]?.name || "");
    if (!activeName) {
      setFormIndex(0);
      return;
    }
    const idx = formsList.findIndex((f) => sanitizeSearchValue(f?.name) === activeName);
    setFormIndex(idx >= 0 ? idx : 0);
  }, [formsList, pokemon?.name, pokemon?._formInfo?.name]);

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
        const found = images.findIndex((it) => it.url === spriteFromForm || it.sprite === spriteFromForm);
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
  const megaAsset = assetMap["mega"];
  const otherAsset = assetMap["other-forms"] || assetMap["other-forms.png"] || assetMap["other-forms.jpg"];
  const filterAsset = assetMap["pokemon-filter"]; // expected name pokemon-filter.png in assets
  const overrideToggleIcon = assetMap["pokedex-icon"];

  // clickable style
  const clickableStyle = { cursor: "pointer" };
  const hoverable = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.filter = "brightness(1.05)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.filter = "brightness(1)";
    },
  };

  // orb image chosen depending on shiny state
  const orbDisplayedUrl = useMemo(() => {
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
  }, [isShiny, orbUrlPrimary, orbUrlShiny, currLabelClean, imageIndexByName, images, smallSpriteUrl]);

  // --- EVOS: sliding window / pyramid state + helpers ---
  const [evoWindowStart, setEvoWindowStart] = useState(0);
  const evoCount = Array.isArray(evoChain) ? evoChain.length : 0;

  useEffect(() => {
    // reset window start whenever evoChain changes (e.g., when loading a new pokemon)
    setEvoWindowStart(0);
  }, [evoChain]);

  function getEvoWindow(start) {
    if (!Array.isArray(evoChain) || evoCount === 0) return [null, null, null];
    if (evoCount <= 3) {
      // return available evos padded with nulls so UI still renders 3 slots
      const padded = evoChain.slice(0, 3).concat(Array(Math.max(0, 3 - evoCount)).fill(null));
      return padded.slice(0, 3);
    }
    const out = [];
    for (let k = 0; k < 3; k++) {
      out.push(evoChain[(start + k) % evoCount]);
    }
    return out;
  }

  return (
    <div
      className="w-[1015px] h-[1000px] select-none"
      style={{
        fontFamily: "'Gameboy', monospace",
        position: "relative",
        overflow: "visible",
      }}
    >
      <svg viewBox="0 0 1015 700" width="1015" height="960" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* gradients / filters */}
          <linearGradient id="gRedA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#b90e0e" />
            <stop offset="40%" stopColor="#c81a1a" />
            <stop offset="100%" stopColor="#5f0000" />
          </linearGradient>
          <linearGradient id="gRedB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d11c1c" />
            <stop offset="60%" stopColor="#b31313" />
            <stop offset="100%" stopColor="#6a0202" />
          </linearGradient>
          <linearGradient id="orbGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#c8f6ff" />
            <stop offset="40%" stopColor="#74e5ff" />
            <stop offset="100%" stopColor="#2aa6df" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f3f6f8" />
            <stop offset="100%" stopColor="#e7ebee" />
          </linearGradient>
          <linearGradient id="greenBox" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7ff971" />
            <stop offset="100%" stopColor="#46ce35" />
          </linearGradient>
          <linearGradient id="blueBox" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4aa1ff" />
            <stop offset="100%" stopColor="#063fc0" />
          </linearGradient>

          <filter id="shadowBig" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
          </filter>

          <clipPath id="orbClip">
            <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} />
          </clipPath>

          <clipPath id="mainFrameClip">
            <rect x={FRAME_X} y={FRAME_Y} width={FRAME_W} height={FRAME_H} rx="4" ry="4" />
          </clipPath>
        </defs>

        {/* Outer shell (kept intact visually) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="775">
          <defs>
            <linearGradient id="gradStroke" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b0000" />
              <stop offset="100%" stopColor="#390101" />
            </linearGradient>
          </defs>

          <path d="M32,40 Q6,40 6,66 L6,672 Q6,700 32,700 L486,700 L486,40 Z" fill="#8b0000" stroke="none" />
          <path
            d="M32,40 Q6,40 6,66 L6,672 Q6,700 32,700 L486,700 L486,40 L32,40"
            fill="none"
            stroke="url(#gradStroke)"
            strokeWidth="8"
            strokeLinejoin="miter"
          />
        </svg>

        {/* Inner panels */}
        <g>
          <path
            d="
  M488,106
  L348,106
  C311,106 291,114 255,146
  C231,166 181,188 151,188

  L11,188
  L11,676

  Q11,700 37,700

  L488,700
  Z
"
            fill="url(#gRedB)"
            stroke="#4d0000"
            strokeWidth="3"
          />
          <path d="M489,106 L348,106 C311,106 291,114 255,146 C231,166 181,188 151,188 L9.5,188" fill="none" stroke="#4d0000" strokeWidth="8" />
        </g>

        <g>
          <path
            d="
    M542,114
    L685,114
    C722,114 742,120 778,152
    C802,172 852,194 882,194
    L948,194
    Q988,194 988,242      
    L988,660                 
    Q988,700 948,700         
    L542,700                 
    L542,114
    Z
  "
            fill="url(#gRedB)"
            stroke="#4d0000"
            strokeWidth="3"
          />
          <path
            d="
  M541,114
  L685,114
  C722,114 742,120 778,152
  C802,172 852,194 882,194
  L948,194
  Q988,194 988,242      
  L988,660
  Q988,702 948,702        
  L541,702
"
            fill="none"
            stroke="#4d0000"
            strokeWidth="4"
          />
        </g>

        {/* hinge */}
        <g>
          <rect x="490" y="37" width="50" height="666" fill="#8b0000" stroke="#3f0000" strokeWidth="2" />
          <rect x="491.5" y="116" width="47" height="54" fill="#ce1b1b" />
          <rect x="491.5" y="228" width="47" height="364" fill="#ce1b1b" />
          <rect x="491.5" y="648" width="47" height="54" fill="#ce1b1b" />
        </g>

        {/* LEFT orb + LEDs */}
        <g>
          <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} fill="url(#orbGrad)" stroke="#46bfe1" strokeWidth="3" filter="url(#shadowBig)" />
          <circle cx="140" cy="75" r="8" fill="#ff6b6b" stroke="#8a0000" strokeWidth="0.8" style={{ opacity: leftLedOpacity(0), transition: "opacity 120ms linear" }} />
          <circle cx="172" cy="75" r="8" fill="#ffd86b" stroke="#8a0000" strokeWidth="0.8" style={{ opacity: leftLedOpacity(1), transition: "opacity 120ms linear" }} />
          <circle cx="202" cy="75" r="8" fill="#06a346" stroke="#044a22" strokeWidth="0.8" style={{ opacity: leftLedOpacity(2), transition: "opacity 120ms linear" }} />
        </g>

        {/* LEFT screen frame */}
        <g>
          <rect x="72" y="215" rx="80" ry="18" width="360" height="254" fill="#bdbdbd" stroke="#8a8a8a" strokeWidth="3" />
          <rect x={FRAME_X} y={FRAME_Y} rx="14" ry="14" width={FRAME_W} height={FRAME_H} fill="url(#screenGrad)" stroke="#111" strokeWidth="3" />
          <circle cx="236" cy="227" r="5" fill="#ff9b9b" stroke="#8b0000" style={{ opacity: leftFrameTopOn ? 1 : 0.2, transition: "opacity 60ms linear" }} />
          <circle cx="262" cy="227" r="5" fill="#ff9b9b" stroke="#8b0000" style={{ opacity: leftFrameTopOn ? 0.2 : 1, transition: "opacity 60ms linear" }} />
          <circle cx="118" cy="440" r="12" fill="#8f1a1a" stroke="#4a0000" strokeWidth="3" />
          {/* name plate */}
          <rect x="145" y="482" rx="10" ry="3" width="214" height="30" fill="url(#screenGrad)" stroke="#111" strokeWidth="3" />
          <g transform="translate(356,318)">
            <rect x="-28" y="114" width="32" height="4" rx="2" fill="#444" />
            <rect x="-28" y="122" width="32" height="4" rx="2" fill="#444" />
            <rect x="-28" y="130" width="32" height="4" rx="2" fill="#444" />
            <rect x="10" y="114" width="32" height="4" rx="2" fill="#444" />
            <rect x="10" y="122" width="32" height="4" rx="2" fill="#444" />
            <rect x="10" y="130" width="32" height="4" rx="2" fill="#444" />
          </g>
        </g>

        {/* LEFT lower controls (visual blue button included here) */}
        <g>
          {/* Visual blue button (shows active/shine when shiny is active) */}
          <circle
            cx="108"
            cy="582"
            r="34"
            fill="#2b66ff"
            stroke={isShiny ? "#ffd550" : "#002a6a"}
            strokeWidth={3}
            style={{
              filter: isShiny ? "drop-shadow(0 6px 10px rgba(255,213,80,0.35))" : undefined,
            }}
          />
          {/* other visible controls */}
          <rect x="173" y="525" rx="3" width="74" height="26" fill="#12b23f" stroke="#0a6b1f" />
          <rect x="264" y="525" rx="3" width="74" height="26" fill="#ff8a3f" stroke="#a84a15" />
          <g transform="translate(328,420)">
            <rect x="54" y="120" width="36" height="88" rx="6" fill="#111" />
            <text x="72" y="136" fontSize="20" fill="#333" fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">^</text>
            <text x="72" y="194" fontSize="20" fill="#333" fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">v</text>
            <rect x="28" y="146" width="88" height="36" rx="6" fill="#111" />
            <text x="43" y="171" fontSize="20" fill="#333" fontFamily="sans-serif">&lt;</text>
            <text x="104" y="171" fontSize="20" fill="#333" fontFamily="sans-serif">&gt;</text>
          </g>
           {/* teal module */}
          <rect x="184" y="616" rx="14" width="140" height="66" fill="#046f62" />
          <rect x="207" y="627" rx="10" width="96" height="46" fill="#eef6f8" />
        </g>

        {/* RIGHT panels */}
        <g>
          <rect x="580" y="216" rx="12" width="362" height="134" fill="url(#greenBox)" stroke="#2a8f2a" strokeWidth="4" />
          <rect x="587" y="223" rx="8" width="348" height="120" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.20" />
        </g>
        <g>
          <rect x="609" y="364" rx="12" width="310" height="120" fill="url(#blueBox)" stroke="#042a8a" strokeWidth="4" filter="url(#shadowBig)" />
          <rect x="616" y="373" rx="8" width="296" height="102" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.20" />
        </g>

        {/* RIGHT small indicators, chevrons, pills, play */}
        <g>
          <circle cx="622" cy="504" r="6" fill="#06a346" style={{ opacity: rightLedOpacity(0), transition: "opacity 120ms linear" }} />
          <circle cx="646" cy="504" r="6" fill="#ffd86b" style={{ opacity: rightLedOpacity(1), transition: "opacity 120ms linear" }} />
          <circle cx="670" cy="504" r="6" fill="#ff6b6b" style={{ opacity: rightLedOpacity(2), transition: "opacity 120ms linear" }} />

          <rect x="764" y="494" rx="12" width="74" height="20" fill="#16a34a" />
          <rect x="848" y="494" rx="12" width="74" height="20" fill="#ff8a3f" />

          <rect x={696 + CHEVRON_X_OFFSET} y="496" rx="2" width="22" height="16" fill="#cfcfcf" stroke="#6a6a6a" />
          <text x={702 + CHEVRON_X_OFFSET} y="507.5" fontSize="10" fill="#6a2a2a" fontFamily="sans-serif">&lt;</text>

          <rect x={723 + CHEVRON_X_OFFSET} y="496" rx="2" width="22" height="16" fill="#cfcfcf" stroke="#6a6a6a" />
          <text x={730 + CHEVRON_X_OFFSET} y="507.5" fontSize="10" fill="#6a2a2a" fontFamily="sans-serif">&gt;</text>
        </g>

          {/* held items - replaced by foreignObject below */}
          <rect x="611.5" y="530" rx="6" ry="2" width="90" height="50" fill="url(#screenGrad)" stroke="#111" strokeWidth="1" />

        {/* SIZE COMPARISON (foreignObject) */}
        <foreignObject x="600" y="590" width="110" height="100" >
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
            <SizeComparison
              silhouetteSrc={currentImageUrl || assetMap["placeholder-200"] || ""}
              humanSrc={assetMap["human_comp"] || assetMap["human_comp.png"] || "/src/assets/human_comp.png"}
              pokemonHeightMeters={pokemon?.height != null ? pokemon.height * 0.1 : null}
              pokemonWeightKg={pokemon?.weight != null ? pokemon.weight * 0.1 : null}
            />
          </div>
        </foreignObject>
          {/* held items - replaced by foreignObject below */}
        <foreignObject x="615" y="536" width="85" height="42">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
            {/* Prefer heldItemsDetails (contains sprites) but keep backwards compatibility */}
            <HeldItems heldItems={heldItemsDetails?.length ? heldItemsDetails : (pokemon?.held_items || [])} />
          </div>
        </foreignObject>

        {/* small sprite inside orb lens - now uses orbDisplayedUrl */}
        <image
          href={orbDisplayedUrl || smallSpriteUrl || null}
          x={ORB_CX - spriteSide / 2}
          y={ORB_CY - spriteSide / 2}
          width={spriteSide}
          height={spriteSide}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#orbClip)"
          style={{ imageRendering: "pixelated" }}
        />
        {canEdit ? (
          <circle
            cx={ORB_CX}
            cy={ORB_CY}
            r={ORB_R}
            fill="rgba(255,255,255,0.02)"
            stroke="transparent"
            onClick={handleOrbOverrideClick}
            style={{ cursor: "copy" }}
          >
            <title>Click to replace orb sprite (hold Shift for shiny).</title>
          </circle>
        ) : null}

        {/* main artwork clipped to frame */}
        <g clipPath="url(#mainFrameClip)">
          <image
            href={currentImageUrl || assetMap["placeholder-200"] || null}
            x={FRAME_X}
            y={FRAME_Y}
            width={FRAME_W}
            height={FRAME_H}
            preserveAspectRatio="xMidYMid meet"
            style={{ pointerEvents: "none" }}
          />
        </g>
        {canEdit ? (
          <rect
            x={FRAME_X}
            y={FRAME_Y}
            width={FRAME_W}
            height={FRAME_H}
            fill="rgba(255,255,255,0.02)"
            stroke="transparent"
            onClick={handleArtOverrideClick}
            style={{ cursor: "copy" }}
          >
            <title>Click to replace artwork (hold Shift for shiny artwork).</title>
          </rect>
        ) : null}

        {/* cry button (transparent) */}
        <g>
          <circle
            cx="118"
            cy="440"
            r="12"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              playCry();
            }}
            style={clickableStyle}
          />
        </g>

        {/* speaker bars while playing */}
        <g transform="translate(330,318)" pointerEvents="none" aria-hidden>
          {playing ? (
            <g>
              <rect x="-2" y="114" width="32" height="4" rx="2" fill="#111" />
              <rect x="-2" y="122" width="32" height="4" rx="2" fill="#111" />
              <rect x="-2" y="130" width="32" height="4" rx="2" fill="#111" />
              <rect x="36" y="114" width="32" height="4" rx="2" fill="#111" />
              <rect x="36" y="122" width="32" height="4" rx="2" fill="#111" />
              <rect x="36" y="130" width="32" height="4" rx="2" fill="#111" />
            </g>
          ) : null}
        </g>

        {/* NAME DISPLAY / SEARCH UI overlay */}
        <foreignObject x="150" y="486" width="206" height="24">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!editingName ? (
              <div
                className="gameboy-font"
                style={{ width: "100%", textAlign: "center", fontSize: 9, textTransform: "capitalize", color: "#000", cursor: "text" }}
                onClick={() => {
                  setEditingName(true);
                  setNameInput(canonicalName);
                  setTimeout(() => {
                    const el = document.getElementById("pokedex-name-input");
                    if (el) el.focus();
                  }, 0);
                }}
              >
                {formatDisplayName(resolvedDisplayName)}
            </div>
            ) : (
              <input
                id="pokedex-name-input"
                className="gameboy-font"
                style={{
                  width: "96%",
                  fontSize: 12,
                  padding: "2px 6px",
                }}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={() => submitNameSearch(nameInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitNameSearch(nameInput);
                  else if (e.key === "Escape") setEditingName(false);
                }}
              />
            )}
          </div>
        </foreignObject>

        {/* transparent interactive blue circle - this is the clickable control for SHINY */}
        <g>
          <circle
            cx="108"
            cy="582"
            r="34"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              toggleShiny();
            }}
            style={clickableStyle}
          />
          <title>Toggle shiny</title>
        </g>

        {/* Type icons */}
        <foreignObject x="176" y="522" width="200" height="32">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: "flex", gap: 23, alignItems: "center", height: "100%" }}>
            {types?.slice(0, 2).map((t) => {
              const url = typeIconUrl(t.name);
              return url ? (
                <img
                  key={t.name}
                  src={url}
                  alt={t.name}
                  title={t.name}
                  style={{
                    display: "block",
                    width: 68,
                    height: 22,
                    imageRendering: "pixelated",
                  }}
                />
              ) : (
                <div key={t.name} className="gameboy-font" style={{ fontSize: 12, textTransform: "capitalize" }}>
                  {t.name}
                </div>
              );
            }) ?? null}
          </div>
        </foreignObject>

        {/* D-pad interactive rects */}
        <g transform="translate(328,420)">
          {/* LEFT */}
          <rect
            x="28"
            y="146"
            width="30"
            height="36"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              gotoPrev();
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />
          {/* visual center graphic */}
          <g transform={`translate(-8,0) scale(${dpadPressed ? 0.95 : 1})`}>
            <rect x="67.5" y="151.5" width="25" height="25" rx="14" fill="#00000088" />
            <rect x="72.5" y="156.5" width="15" height="15" rx="8" fill="#222" />
          </g>
          {/* RIGHT */}
          <rect
            x="86"
            y="146"
            width="30"
            height="36"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              gotoNext();
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />

          {/* UP (new invisible zone) */}
          <rect
            x="54"
            y="120"
            width="36"
            height="30"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              nextForm(); // up -> next form
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />

          {/* DOWN (new invisible zone) */}
          <rect
            x="54"
            y="178"
            width="36"
            height="30"
            rx="6"
            fill="transparent"
            stroke="transparent"
            onClick={(e) => {
              e.stopPropagation();
              setDpadPressed(true);
              prevForm(); // down -> previous form
              setTimeout(() => setDpadPressed(false), 120);
            }}
            style={clickableStyle}
          />
        </g>

        {/* OTHER-FORMS button (under D-pad). show active glow when viewing an other form */}
        <g transform="translate(328,520)">
          {otherAsset ? (
            <image
              href={otherAsset}
              x={-90}
              y={42}
              width={36}
              height={36}
              preserveAspectRatio="xMidYMid meet"
              style={{
                cursor: otherForms && otherForms.length ? "pointer" : "not-allowed",
                opacity: otherForms && otherForms.length ? 1 : 0.45,
                filter: isOtherForm ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : otherForms && otherForms.length ? "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (otherForms && otherForms.length) cycleOtherFormsUI();
              }}
            />
          ) : (
            <rect
              x={-20}
              y={-8}
              width={44}
              height={44}
              rx={6}
              fill="#666"
              stroke="#222"
              style={{
                cursor: otherForms && otherForms.length ? "pointer" : "not-allowed",
                opacity: otherForms && otherForms.length ? 1 : 0.45,
                filter: isOtherForm ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (otherForms && otherForms.length) cycleOtherFormsUI();
              }}
            />
          )}
        </g>

        {/* RESET / orange chevron circle (interactive) */}
          <g
            transform={`translate(0,0)`}
            onClick={(e) => {
              e.stopPropagation();
              handleResetClick();
            }}
            style={clickableStyle}
          >
            <circle cx="740" cy="556" r="14" fill="#ffc43b" stroke="#a86a00" strokeWidth="3" />
                                    <text x={734 + CHEVRON_X_OFFSET} y="560.5" fontSize="12" fill="#6a2a2a" fontFamily="sans-serif">&lt;</text>
          </g>



        {/* MEGA button (under left controls). show active glow when viewing a mega */}
        <g transform="translate(210,560)">
          {megaAsset ? (
            <image
              href={megaAsset}
              x={-32}
              y={8}
              width={44}
              height={44}
              preserveAspectRatio="xMidYMid meet"
              style={{
                cursor: megaVariants && megaVariants.length ? "pointer" : "not-allowed",
                opacity: megaVariants && megaVariants.length ? 1 : 0.45,
                filter: isMega ? "drop-shadow(0 8px 12px rgba(90,170,255,0.25))" : megaVariants && megaVariants.length ? "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (megaVariants && megaVariants.length) toggleMega();
              }}
            />
          ) : (
            <rect
              x={-22}
              y={-8}
              width={44}
              height={44}
              rx={6}
              fill="#444"
              stroke="#222"
              style={{
                cursor: megaVariants && megaVariants.length ? "pointer" : "not-allowed",
                opacity: megaVariants && megaVariants.length ? 1 : 0.45,
                filter: isMega ? "drop-shadow(0 8px 12px rgba(255,140,140,0.28))" : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (megaVariants && megaVariants.length) toggleMega();
              }}
            />
          )}
        </g>

        {/* TEAL MODULE TEXT (registered number) - centered in the white area */}
        {/* white rect is at x=207, y=627, width=96, height=46 -> center at (255,650) */}
        <g aria-hidden>
          <text
            x={207 + 96 / 2}
            y={627 + 46 / 2}
            className="gameboy-font"
            style={{ fontSize: numberFontSize }}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {displayNumber}
          </text>
        </g>

          <g>
  {/* Filter icon - always subtle drop-shadow; stronger glow when a filter is active */}
  {filterAsset ? (
    <image
      href={filterAsset}
      x={282}
      y={561.5}
      width={55}
      height={55}
      preserveAspectRatio="xMidYMid meet"
      style={{
        cursor: "pointer",
        filter: activeFilterType
          ? "drop-shadow(0 12px 22px rgba(0,160,255,0.30)) drop-shadow(0 6px 10px rgba(0,0,0,0.30))"
          : "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
        opacity: 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setShowFilterPopup((s) => !s);
      }}
    />
  ) : (
    /* fallback simple rect if asset missing */
    <g transform="translate(282,560)">
      <rect
        x={0}
        y={0}
        width={55}
        height={55}
        rx={8}
        fill="#444"
        stroke="#222"
        style={{
          cursor: "pointer",
          filter: activeFilterType ? "drop-shadow(0 10px 18px rgba(0,160,255,0.25))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowFilterPopup((s) => !s);
        }}
      />
      <text x={27.5} y={34} fontSize="16" textAnchor="middle" fill="#fff" fontFamily="sans-serif" pointerEvents="none">F</text>
    </g>
  )}

  {/* Popup: only render when open */}
  {showFilterPopup ? (
    <foreignObject x="126" y="520" width="252" height="168">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="gameboy-font"
        style={{
          width: "100%",
          height: "100%",
          background: "#fff",
          border: "3px solid #222",
          padding: 6,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
        onClick={(e) => e.stopPropagation()}
      >
       {/* Header row (all fontSize: 6). Title left, RESET & CLOSE right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 6, fontWeight: 700, letterSpacing: "0.5px" }}>FILTER BY TYPE</div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!activeFilterType || filterLoading) return;
                clearTypeFilter();
              }}
              disabled={!activeFilterType || filterLoading}
              aria-disabled={!activeFilterType || filterLoading}
              style={{
                fontFamily: "'Gameboy', monospace",
                fontSize: 6,
                cursor: !activeFilterType || filterLoading ? "not-allowed" : "pointer",
                opacity: !activeFilterType || filterLoading ? 0.45 : 1,
                color: "#111",
                borderRadius: 3,
              }}
              title={!activeFilterType ? "No active filter" : "Reset filter"}
            >
              RESET
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterPopup(false);
              }}
              style={{
                fontFamily: "'Gameboy', monospace",
                fontSize: 6,
                cursor: "pointer",
                color: "#111",
                borderRadius: 3,
              }}
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Second header row: filtering status (fontSize: 6) */}
        <div style={{ fontSize: 6, color: filterError ? "#b91c1c" : "#374151", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ textTransform: "capitalize", minWidth: 120 }}>
            {filterLoading ? "Loading..." : filterError ? filterError : activeFilterType ? `Filtering: ${activeFilterType}` : "No filter"}
          </div>
        </div>
        {/* grid of type icons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, alignItems: "center", justifyItems: "center", flex: 1 }}>
          {availableFilterTypes.length ? (
            availableFilterTypes.map((t) => {
              const key = `filter-${t}`;
              const url = assetMap[key];
              const isActive = activeFilterType === t;
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    // toggle off if clicking same active type
                    if (isActive) {
                      clearTypeFilter();
                    } else {
                      applyTypeFilter(t);
                    }
                  }}
                  title={t}
                  style={{
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
                    boxShadow: isActive ? "0 8px 18px rgba(0,160,255,0.24)" : "0 4px 10px rgba(0,0,0,0.12)",
                  }}
                >
                  {url ? (
                    <img src={url} alt={t} style={{ width: 28, height: 28, imageRendering: "pixelated", pointerEvents: "none" }} />
                  ) : (
                    <span style={{ fontSize: 10, textTransform: "capitalize" }}>{t}</span>
                  )}
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: 10 }}>No type icons found in assets</div>
          )}
        </div>

        {/* footer intentionally removed - header contains Reset + Close and inline status */}
      </div>
    </foreignObject>
  ) : null}
</g>
/* ---------- end FILTER UI ---------- */

        {/* RIGHT green species box */}
        <foreignObject x="593.5" y="232" width="336" height="112">
          <div xmlns="http://www.w3.org/1999/xhtml" className="gameboy-font" style={{ color: "#000", fontSize: 10, padding: 6 }}>
            <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
              {species?.genera?.find((g) => g.language.name === "en")?.genus ?? species?.name ?? ""}
            </div>
            <div style={{ marginTop: 8, fontSize: 8.5, lineHeight: 1.5, textAlign: "justify" }}>
              {flavorText}
            </div>
          </div>
        </foreignObject>

        {/* RIGHT blue box: ability & stats */}
        <foreignObject x="616" y="372" width="296" height="102">
          <div xmlns="http://www.w3.org/1999/xhtml" className="gameboy-font" style={{ color: "#fff", fontSize: 6, padding: 8, display: "flex", gap: 8 }}>
            <div style={{ width: "52%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontWeight: 700, textAlign: "center" }}>ABILITY</div>
              <div style={{ textTransform: "capitalize", fontWeight: 700 }}>
                {ability?.name ?? (pokemon?.abilities?.[0]?.ability?.name ?? "???")}
              </div>
              <div style={{ fontSize: 6, lineHeight: 1.2 }}>
                {ability?.short_effect ??
                  ability?.effect_entries?.find((e) => e.language.name === "en")?.short_effect ??
                  pokemon?.abilities?.[0]?.ability?.name ??
                  "No description."}
              </div>
            </div>

            <div style={{ width: "48%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontWeight: 700, textAlign: "center" }}>STATS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Array.isArray(stats) && stats.length > 0 ? (
                  stats.map((s) => {
                    const value = s.value ?? s.base_stat ?? 0;
                    const pct = Math.round((value / maxStat) * 100);
                    return (
                      <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <div style={{ width: 48, fontSize: 5, textTransform: "capitalize" }}>{s.name}</div>
                        <div style={{ flex: 1, height: 10, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "60%", borderRadius: 6, background: "#7ff971", boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }} />
                        </div>
                        <div style={{ width: 28, textAlign: "right", fontSize: 6 }}>{value}</div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: 6 }}>???</div>
                )}
              </div>
            </div>
          </div>
        </foreignObject>

        {/* move pills */}
        <foreignObject x="768" y="501" width="150" height="56">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: "flex", flexDirection: "row", gap: 20 }}>
            {pagedMoves && pagedMoves.length > 0 ? (
              pagedMoves.map((m) => (
                <div
                  key={m.name}
                  className="gameboy-font"
                  style={{ fontWeight: 700, width: 140, whiteSpace: "nowrap", fontSize: 5, display: "flex", alignItems: "center", justifyContent: "center" }}
                  title={m.name.replace("-", " ")}
                >
                  {m.name.replace("-", " ")}
                </div>
              ))
            ) : (
              <div className="gameboy-font">???</div>
            )}
          </div>
        </foreignObject>

        {/* invisible chevrons (click zones) */}
        <rect x={696 + CHEVRON_X_OFFSET} y="496" rx="3" width="22" height="16" fill="transparent" onClick={(e) => { e.stopPropagation(); handlePrevMoves(); }} style={clickableStyle} />
        <rect x={723 + CHEVRON_X_OFFSET} y="496" rx="3" width="22" height="16" fill="transparent" onClick={(e) => { e.stopPropagation(); handleNextMoves(); }} style={clickableStyle} />


       {/* EVOLUTIONS (pyramid + sliding window) */}
<g transform="translate(645,490)">
  {(() => {
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

    return (
      <g>
        {/* TOP evolution */}
        <g>
          <rect
            x={topX}
            y={topY}
            width={rectW}
            height={rectH}
            rx="8"
            fill="#f5c400"
            stroke="#b78e00"
            style={{ cursor: e0 ? "pointer" : "default" }}
            onClick={(e) => {
              e.stopPropagation();
              if (e0) gotoEvolution(e0);
            }}
          />
          {e0 ? (
            <>
              <image
                href={e0.sprite || assetMap["placeholder-64"] || ""}
                x={topX + spriteInsetX}
                y={topY + spriteInsetY}
                width={spriteW}
                height={spriteH}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={topX + rectW / 2}
                y={topY + rectH - 10}
                fontSize="8"
                textAnchor="middle"
                className="gameboy-font"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  gotoEvolution(e0);
                }}
              >
                {e0.name}
              </text>
            </>
          ) : (
            <text x={topX + rectW / 2} y={topY + rectH / 1.8} fontSize="8" textAnchor="middle" className="gameboy-font">
              No Evo
            </text>
          )}
        </g>

        {/* LOWER LEFT evolution */}
        <g>
          <rect
            x={leftX}
            y={leftY}
            width={rectW}
            height={rectH}
            rx="8"
            fill="#f5c400"
            stroke="#b78e00"
            style={{ cursor: e1 ? "pointer" : "default" }}
            onClick={(e) => {
              e.stopPropagation();
              if (e1) gotoEvolution(e1);
            }}
          />
          {e1 ? (
            <>
              <image
                href={e1.sprite || assetMap["placeholder-64"] || ""}
                x={leftX + spriteInsetX}
                y={leftY + spriteInsetY}
                width={spriteW}
                height={spriteH}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={leftX + rectW / 2}
                y={leftY + rectH - 10}
                fontSize="8"
                textAnchor="middle"
                className="gameboy-font"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  gotoEvolution(e1);
                }}
              >
                {e1.name}
              </text>
            </>
          ) : (
            <text x={leftX + rectW / 2} y={leftY + rectH / 1.8} fontSize="8" textAnchor="middle" className="gameboy-font">
              No Evo
            </text>
          )}
        </g>

        {/* LOWER RIGHT evolution */}
        <g>
          <rect
            x={rightX}
            y={rightY}
            width={rectW}
            height={rectH}
            rx="8"
            fill="#f5c400"
            stroke="#b78e00"
            style={{ cursor: e2 ? "pointer" : "default" }}
            onClick={(e) => {
              e.stopPropagation();
              if (e2) gotoEvolution(e2);
            }}
          />
          {e2 ? (
            <>
              <image
                href={e2.sprite || assetMap["placeholder-64"] || ""}
                x={rightX + spriteInsetX}
                y={rightY + spriteInsetY}
                width={spriteW}
                height={spriteH}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={rightX + rectW / 2}
                y={rightY + rectH - 10}
                fontSize="8"
                textAnchor="middle"
                className="gameboy-font"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  gotoEvolution(e2);
                }}
              >
                {e2.name}
              </text>
            </>
          ) : (
            <text x={rightX + rectW / 2} y={rightY + rectH / 1.8} fontSize="8" textAnchor="middle" className="gameboy-font">
              No Evo
            </text>
          )}
        </g>

        {/* Prev chevron (left) - shown only when there are >3 evolutions */}
        {showChevrons ? (
          <g
            transform={`translate(${leftX - 20}, ${leftY + rectH / 2 - 10})`}
            onClick={(e) => {
              e.stopPropagation();
              if (!prevAllowed) return;
              // slide window backward by 1 (no wrap)
              setEvoWindowStart((s) => Math.max(0, s - 1));
            }}
            style={{ cursor: prevAllowed ? "pointer" : "not-allowed", opacity: prevAllowed ? 1 : 0.35 }}
            aria-hidden={false}
          >
            <rect x={42} y={-88} width={18} height={20} rx={4} fill="#cfcfcf" stroke="#6a6a6a" />
                      <text x={50} y={-74} fontSize="12" fill="#6a2a2a" fontFamily="sans-serif" textAnchor="middle">&lt;</text>
          </g>
        ) : null}

        {/* Next chevron (right) - shown only when there are >3 evolutions */}
        {showChevrons ? (
          <g
            transform={`translate(${rightX + rectW + 6}, ${rightY + rectH / 2 - 10})`}
            onClick={(e) => {
              e.stopPropagation();
              if (!nextAllowed) return;
              // slide window forward by 1 (no wrap)
              setEvoWindowStart((s) => Math.min(evoCount - 3, s + 1));
            }}
            style={{ cursor: nextAllowed ? "pointer" : "not-allowed", opacity: nextAllowed ? 1 : 0.35 }}
            aria-hidden={false}
          >
            <rect x={0} y={0} width={18} height={20} rx={4} fill="#cfcfcf" stroke="#6a6a6a" />
                      <text x={9.5} y={14} fontSize="12" fill="#6a2a2a" fontFamily="sans-serif" textAnchor="middle">&gt;</text>
          </g>
        ) : null}
      </g>
    );
  })()}
</g>


        {/* bottom status */}
        <text x="507.5" y="716" textAnchor="middle" fontSize="12" className="gameboy-font">
          {loading ? "LOADING POKEMON..." : error ? "ERROR LOADING POKEMON!" : ""}
        </text>
      </svg>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelection}
      />
      {overrideToggleIcon ? (
        <button
          type="button"
          onClick={() => setShowOverridePanel((v) => !v)}
          onMouseEnter={hoverable.onMouseEnter}
          onMouseLeave={hoverable.onMouseLeave}
          style={{
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
            transform: "rotate(-4deg)",
          }}
          title={showOverridePanel ? "Hide override controls" : "Show override controls"}
        >
          <img
            src={overrideToggleIcon}
            alt="Override controls"
            style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
          />
        </button>
      ) : null}

      {showOverridePanel ? (
        <div
          id="override-panel"
          style={{
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
            fontSize: 11,
            zIndex: 5,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`div#override-panel::-webkit-scrollbar{display:none;}`}</style>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                flex: 1,
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                textAlign: "left",
              }}
            >
              Override Console
            </div>
            <button
              type="button"
              onClick={() => setShowOverridePanel(false)}
              {...hoverable}
              style={{
                fontSize: 10,
                color: "white",
                cursor: "pointer",
                fontFamily: "'Gameboy'",
                textAlign: "center",
              }}
            >X</button>
          </div>
          <div style={{ marginTop: 6, color: hasOverrideApi ? "#bafacb" : "#ffe0e0" }}>
            API: {hasOverrideApi ? "Connected" : "Not configured"}
          </div>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              onClick={toggleEditMode}
              disabled={!hasOverrideApi || !pokemon?.id}
              onMouseEnter={hoverable.onMouseEnter}
              onMouseLeave={hoverable.onMouseLeave}
              style={{
                padding: "4px 8px",
                background: canEdit ? "#5ac85a" : "#fff27c",
                color: "#3a0a0a",
                border: "2px solid #7a0c0c",
                borderRadius: 10,
                cursor: hasOverrideApi && pokemon?.id ? "pointer" : "not-allowed",
                fontFamily: "'Gameboy', monospace",
              }}
            >
              {canEdit ? "Exit edit mode" : "Enter edit mode"}
            </button>
            <button
              type="button"
              onClick={promptForAdminToken}
              disabled={!hasOverrideApi}
              onMouseEnter={hoverable.onMouseEnter}
              onMouseLeave={hoverable.onMouseLeave}
              style={{
                padding: "4px 8px",
                background: "#fff27c",
                color: "#3a0a0a",
                border: "2px solid #7a0c0c",
                borderRadius: 10,
                cursor: hasOverrideApi ? "pointer" : "not-allowed",
                fontFamily: "'Gameboy', monospace",
              }}
            >
              Set token
            </button>
            {adminToken ? (
              <button
                type="button"
                onClick={clearAdminToken}
                onMouseEnter={hoverable.onMouseEnter}
                onMouseLeave={hoverable.onMouseLeave}
                style={{
                  padding: "4px 8px",
                  background: "#ffb3b3",
                  color: "#3a0a0a",
                  border: "2px solid #7a0c0c",
                  borderRadius: 10,
                  fontFamily: "'Gameboy', monospace",
                }}
              >
                Clear token
              </button>
            ) : null}
          </div>
          {operationStatus ? (
            <div
              style={{
                marginTop: 8,
                padding: "6px 8px",
                borderRadius: 10,
                background: operationStatus.type === "error" ? "#5e0b0b" : "#0f6130",
                color: "#fff",
                lineHeight: 1.4,
                border: "2px solid rgba(0,0,0,0.25)",
              }}
            >
              {operationStatus.message}
            </div>
          ) : null}
          {canEdit ? (
            <>
              <div style={{ marginTop: 10, fontWeight: 700, borderTop: "2px solid #a01818", paddingTop: 8 }}>
                Name & Description ({pokemon?.name ?? "??"})
              </div>
              <label style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 700 }}>Display name</label>
              <input
                type="text"
                value={overrideDraft?.displayName ?? ""}
                onChange={(e) => handleDraftChange("displayName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 6px",
                  borderRadius: 8,
                  border: "2px solid #7a0c0c",
                  background: "#fff7d1",
                  color: "#2a0a0a",
                  fontFamily: "'Gameboy', monospace",
                }}
                maxLength={60}
              />
              <label style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 700 }}>Description</label>
              <textarea
                value={overrideDraft?.description ?? ""}
                onChange={(e) => handleDraftChange("description", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 6px",
                  borderRadius: 8,
                  border: "2px solid #7a0c0c",
                  background: "#fff7d1",
                  color: "#2a0a0a",
                  fontFamily: "'Gameboy', monospace",
                  minHeight: 80,
                  resize: "vertical",
                }}
              />
              <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                <button
                type="button"
                onClick={handleSaveTextFields}
                disabled={!draftDirty || overrideBusy}
                onMouseEnter={hoverable.onMouseEnter}
                onMouseLeave={hoverable.onMouseLeave}
                style={{
                  flex: 1,
                  background: "#5ac85a",
                    color: "#1f3a1f",
                    border: "2px solid #2f7a2f",
                    borderRadius: 10,
                    padding: "6px 8px",
                    cursor: draftDirty && !overrideBusy ? "pointer" : "not-allowed",
                    fontFamily: "'Gameboy', monospace",
                  }}
                >
                  Save text
                </button>
              <button
                type="button"
                onClick={handleResetText}
                disabled={overrideBusy}
                onMouseEnter={hoverable.onMouseEnter}
                onMouseLeave={hoverable.onMouseLeave}
                style={{
                  flex: 1,
                  background: "#ffb3b3",
                  color: "#3a0a0a",
                  border: "2px solid #7a0c0c",
                  borderRadius: 10,
                  padding: "6px 8px",
                  cursor: overrideBusy ? "not-allowed" : "pointer",
                  fontFamily: "'Gameboy', monospace",
                }}
              >
                Reset text
              </button>
              </div>

              <div style={{ marginTop: 12, fontWeight: 700, borderTop: "2px solid #a01818", paddingTop: 8, textAlign: "center" }}>
                Artwork & Sprites
              </div>
              <p style={{ fontSize: 10, lineHeight: 1.4, marginTop: 4, textAlign: "left" }}>
                Click the orb for sprites (Shift = shiny).
              </p>
              <p style={{ fontSize: 10, lineHeight: 1.4, marginTop: 4, textAlign: "left" }}>
                Click the artwork window for main art (Shift = shiny).</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => beginUpload("spriteNormal")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Upload orb sprite
                </button>
                <button
                  type="button"
                  onClick={() => persistOverridePatch({ spriteNormal: null }, "Orb sprite reset.")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Reset orb sprite
                </button>
                <button
                  type="button"
                  onClick={() => beginUpload("spriteShiny")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Upload shiny sprite
                </button>
                <button
                  type="button"
                  onClick={() => persistOverridePatch({ spriteShiny: null }, "Shiny sprite reset.")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Reset shiny sprite
                </button>
                <button
                  type="button"
                  onClick={() => beginUpload("artNormal")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Upload artwork
                </button>
                <button
                  type="button"
                  onClick={() => persistOverridePatch({ artNormal: null }, "Artwork reset.")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Reset artwork
                </button>
                <button
                  type="button"
                  onClick={() => beginUpload("artShiny")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Upload shiny art
                </button>
                <button
                  type="button"
                  onClick={() => persistOverridePatch({ artShiny: null }, "Shiny artwork reset.")}
                  disabled={overrideBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{ fontFamily: "'Gameboy', monospace" }}
                >
                  Reset shiny art
                </button>
              </div>

              <div style={{ marginTop: 12, fontWeight: 700, borderTop: "2px solid #a01818", paddingTop: 8, textAlign: "center" }}>
                Held Item Overrides
              </div>
              {overrideHeldItems.length ? (
                <ul style={{ marginTop: 6, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 4 }}>
                  {overrideHeldItems.map((item) => (
                    <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700 }}>{item.itemName}</span>
                        {item.itemSprite ? (
                          <a href={item.itemSprite} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#fff7d1" }}>
                            sprite
                          </a>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteHeldItem(item.id)}
                        disabled={heldItemBusy}
                        onMouseEnter={hoverable.onMouseEnter}
                        onMouseLeave={hoverable.onMouseLeave}
                        style={{
                          padding: "2px 6px",
                          background: "#ffb3b3",
                          color: "#3a0a0a",
                          border: "2px solid #7a0c0c",
                          borderRadius: 8,
                          cursor: heldItemBusy ? "not-allowed" : "pointer",
                          fontFamily: "'Gameboy', monospace",
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ marginTop: 4, fontSize: 11 }}>No held item overrides yet.</div>
              )}
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 10,
                  background: "#b30f0f",
                  border: "2px solid #7a0c0c",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <input
                  type="text"
                  placeholder="Held item name"
                  value={newHeldItem.name}
                  onChange={(e) => setNewHeldItem((prev) => ({ ...prev, name: e.target.value }))}
                  style={{
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "2px solid #7a0c0c",
                    background: "#fff7d1",
                    color: "#2a0a0a",
                    fontFamily: "'Gameboy', monospace",
                  }}
                />
                <input
                  type="text"
                  placeholder="Sprite URL (optional)"
                  value={newHeldItem.sprite}
                  onChange={(e) => setNewHeldItem((prev) => ({ ...prev, sprite: e.target.value }))}
                  style={{
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "2px solid #7a0c0c",
                    background: "#fff7d1",
                    color: "#2a0a0a",
                    fontFamily: "'Gameboy', monospace",
                  }}
                />
                <button
                  type="button"
                  onClick={handleHeldItemUploadClick}
                  disabled={heldItemBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{
                    alignSelf: "flex-start",
                    padding: "2px 6px",
                    background: "#fff27c",
                    color: "#3a0a0a",
                    border: "2px solid #7a0c0c",
                    borderRadius: 8,
                    cursor: heldItemBusy ? "not-allowed" : "pointer",
                    fontFamily: "'Gameboy', monospace",
                  }}
                >
                  Upload icon
                </button>
                <textarea
                  placeholder="Notes (optional)"
                  value={newHeldItem.notes}
                  onChange={(e) => setNewHeldItem((prev) => ({ ...prev, notes: e.target.value }))}
                  style={{
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "2px solid #7a0c0c",
                    background: "#fff7d1",
                    color: "#2a0a0a",
                    fontFamily: "'Gameboy', monospace",
                    minHeight: 60,
                    resize: "vertical",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddHeldItem}
                  disabled={heldItemBusy}
                  onMouseEnter={hoverable.onMouseEnter}
                  onMouseLeave={hoverable.onMouseLeave}
                  style={{
                    padding: "6px 8px",
                    background: "#5ac85a",
                    color: "#1f3a1f",
                    border: "2px solid #2f7a2f",
                    borderRadius: 10,
                    cursor: heldItemBusy ? "not-allowed" : "pointer",
                    fontFamily: "'Gameboy', monospace",
                  }}
                >
                  Save held item
                </button>
              </div>

              <button
                type="button"
                onClick={handleOverrideReset}
                disabled={overrideBusy || heldItemBusy}
                onMouseEnter={hoverable.onMouseEnter}
                onMouseLeave={hoverable.onMouseLeave}
                style={{
                  marginTop: 12,
                  width: "100%",
                  background: "#5e0b0b",
                  color: "#fff7d1",
                  border: "2px solid #a01818",
                  padding: "8px 10px",
                  borderRadius: 12,
                  cursor: overrideBusy || heldItemBusy ? "not-allowed" : "pointer",
                  fontFamily: "'Gameboy', monospace",
                }}
              >
                Delete override entry
              </button>
            </>
          ) : (
            <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5 }}>
              {hasOverrideApi
                ? "Enter edit mode to customize this PokAcmon. Hold Shift on orb/art to update shiny versions."
                : "Set VITE_OVERRIDE_API_URL in your Vite env and restart the client to enable override editing."}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
