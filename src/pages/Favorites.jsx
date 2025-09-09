import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";

export default function Favorites({ favorites, toggleFavorite }) {
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const maxPokemonId = 493; // Gen 1–4

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!favorites || favorites.length === 0) {
        setFavoritePokemons([]);
        return;
      }

      try {
        const promises = favorites
          .filter((id) => id <= maxPokemonId)
          .map((id) =>
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => ({
              id: res.data.id,
              name: res.data.name,
              sprites: res.data.sprites,
              types: res.data.types,
              url: `https://pokeapi.co/api/v2/pokemon/${res.data.id}/`,
            }))
          );

        const results = await Promise.all(promises);
        setFavoritePokemons(results);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ⭐ Favorite Pokémon
      </Typography>

      {favoritePokemons.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 3 }}>
          You don’t have any favorites yet. Catch some Pokémon first!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {favoritePokemons.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <PokemonCard
                pokemon={p}
                isFavorite={favorites.includes(p.id)}
                toggleFavorite={toggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
