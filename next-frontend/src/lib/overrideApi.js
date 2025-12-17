const envUrl = (process.env.NEXT_PUBLIC_OVERRIDE_API_URL || "").trim();
// If empty, use same-origin
const baseUrl = envUrl ? envUrl.replace(/\/$/, "") : "";

export const overrideApiBase = baseUrl;
export const hasOverrideApi = true;

function ensureBaseUrl() {
  return baseUrl || "";
}

function buildIdentifierValue(identifier) {
  if (identifier == null) return "";
  return String(identifier);
}

export async function fetchOverrideRecord(identifier, signal) {
  const normalized = buildIdentifierValue(identifier).trim();
  if (!normalized) return null;
  try {
    const res = await fetch(`${baseUrl || ""}/api/overrides/${encodeURIComponent(normalized)}`, { signal });
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
      ...headers,
    },
    body,
  });
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || "Override API request failed");
  }
  return res;
}

export async function uploadOverrideFile(file, adminToken) {
  ensureBaseUrl();
  const formData = new FormData();
  formData.append("file", file);
  const res = await authedFetch(`/api/uploads`, { method: "POST", body: formData }, adminToken);
  return res.json();
}

export async function saveOverrideEntry(identifier, payload, adminToken) {
  const normalized = buildIdentifierValue(identifier).trim();
  if (!normalized) throw new Error("Identifier required for override save.");
  const res = await authedFetch(
    `/api/overrides/${encodeURIComponent(normalized)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    adminToken
  );
  return res.json();
}

export async function deleteOverrideEntry(identifier, adminToken) {
  const normalized = buildIdentifierValue(identifier).trim();
  if (!normalized) return;
  await authedFetch(`/api/overrides/${encodeURIComponent(normalized)}`, { method: "DELETE" }, adminToken);
}

export async function createHeldItemOverride(identifier, payload, adminToken) {
  const normalized = buildIdentifierValue(identifier).trim();
  if (!normalized) throw new Error("Identifier required for held item creation.");
  const res = await authedFetch(
    `/api/overrides/${encodeURIComponent(normalized)}/held-items`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    adminToken
  );
  return res.json();
}

export async function deleteHeldItemOverride(identifier, itemId, adminToken) {
  const normalized = buildIdentifierValue(identifier).trim();
  if (!normalized || itemId == null) return;
  await authedFetch(
    `/api/overrides/${encodeURIComponent(normalized)}/held-items/${encodeURIComponent(itemId)}`,
    { method: "DELETE" },
    adminToken
  );
}
