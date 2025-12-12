-- CreateTable
CREATE TABLE "PokemonOverride" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pokemonId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT,
    "description" TEXT,
    "spriteNormal" TEXT,
    "spriteShiny" TEXT,
    "artNormal" TEXT,
    "artShiny" TEXT,
    "metadataJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PokemonHeldItemOverride" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pokemonId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemSprite" TEXT,
    "notes" TEXT,
    "overrideId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PokemonHeldItemOverride_overrideId_fkey" FOREIGN KEY ("overrideId") REFERENCES "PokemonOverride" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonOverride_slug_key" ON "PokemonOverride"("slug");
