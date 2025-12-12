require('dotenv/config');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'DEV_ADMIN_TOKEN';

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadDir));

function normalizeSlug(value) {
  if (!value) return undefined;
  return String(value).trim().toLowerCase();
}

function requireAdmin(req, res, next) {
  const token = req.header('x-admin-token');
  if (!ADMIN_TOKEN) {
    return res.status(500).json({ error: 'Server missing ADMIN_TOKEN configuration' });
  }
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid admin token' });
  }
  next();
}

async function findOverride(identifier) {
  const normalized = normalizeSlug(identifier);
  if (!normalized) return null;
  if (/^\d+$/.test(normalized)) {
    return prisma.pokemonOverride.findFirst({
      where: { pokemonId: parseInt(normalized, 10) },
      include: { heldItems: true },
    });
  }
  return prisma.pokemonOverride.findUnique({
    where: { slug: normalized },
    include: { heldItems: true },
  });
}

function buildWhere(identifier) {
  const normalized = normalizeSlug(identifier);
  if (/^\d+$/.test(normalized)) {
    return { pokemonId: parseInt(normalized, 10) };
  }
  return { slug: normalized };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/overrides/:identifier', async (req, res) => {
  try {
    const override = await findOverride(req.params.identifier);
    if (!override) {
      return res.status(404).json({ override: null });
    }
    res.json({ override });
  } catch (err) {
    console.error('GET override failed:', err);
    res.status(500).json({ error: 'Failed to fetch override' });
  }
});

app.put('/api/overrides/:identifier', requireAdmin, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const normalizedSlug = normalizeSlug(req.body.slug || identifier);
    const pokemonId = req.body.pokemonId ?? (/^\d+$/.test(identifier) ? parseInt(identifier, 10) : null);
    if (!pokemonId && !normalizedSlug) {
      return res.status(400).json({ error: 'pokemonId or slug required' });
    }

    const data = {
      pokemonId: pokemonId ?? req.body.pokemonId,
      slug: normalizedSlug,
      displayName: req.body.displayName ?? null,
      description: req.body.description ?? null,
      spriteNormal: req.body.spriteNormal ?? null,
      spriteShiny: req.body.spriteShiny ?? null,
      artNormal: req.body.artNormal ?? null,
      artShiny: req.body.artShiny ?? null,
      metadataJson: req.body.metadataJson ?? null,
    };

    const existing = await findOverride(identifier);
    const result = existing
      ? await prisma.pokemonOverride.update({ where: { id: existing.id }, data })
      : await prisma.pokemonOverride.create({ data });

    const withItems = await prisma.pokemonOverride.findUnique({
      where: { id: result.id },
      include: { heldItems: true },
    });

    res.json({ override: withItems });
  } catch (err) {
    console.error('PUT override failed:', err);
    res.status(500).json({ error: 'Failed to save override' });
  }
});

app.delete('/api/overrides/:identifier', requireAdmin, async (req, res) => {
  try {
    const existing = await findOverride(req.params.identifier);
    if (!existing) return res.status(204).end();
    await prisma.pokemonHeldItemOverride.deleteMany({ where: { overrideId: existing.id } });
    await prisma.pokemonOverride.delete({ where: { id: existing.id } });
    res.status(204).end();
  } catch (err) {
    console.error('DELETE override failed:', err);
    res.status(500).json({ error: 'Failed to delete override' });
  }
});

app.post('/api/overrides/:identifier/held-items', requireAdmin, async (req, res) => {
  try {
    const { itemName, itemSprite, notes } = req.body;
    if (!itemName) return res.status(400).json({ error: 'itemName required' });
    const existing = await findOverride(req.params.identifier);
    if (!existing) {
      return res.status(404).json({ error: 'Override does not exist yet. Save override first.' });
    }
    const item = await prisma.pokemonHeldItemOverride.create({
      data: {
        pokemonId: existing.pokemonId,
        itemName,
        itemSprite: itemSprite ?? null,
        notes: notes ?? null,
        overrideId: existing.id,
      },
    });
    res.status(201).json({ heldItem: item });
  } catch (err) {
    console.error('POST held item failed:', err);
    res.status(500).json({ error: 'Failed to create held item' });
  }
});

app.delete('/api/overrides/:identifier/held-items/:itemId', requireAdmin, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    if (Number.isNaN(itemId)) return res.status(400).json({ error: 'Invalid item id' });
    await prisma.pokemonHeldItemOverride.delete({ where: { id: itemId } });
    res.status(204).end();
  } catch (err) {
    console.error('DELETE held item failed:', err);
    res.status(500).json({ error: 'Failed to delete held item' });
  }
});

app.post('/api/uploads', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const relativePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: relativePath });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Override server running on http://localhost:${PORT}`);
});

