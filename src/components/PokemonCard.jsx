import React from "react";
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function PokemonCard({ pokemon, isFavorite, toggleFavorite, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: "16px",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardMedia
        component="img"
        image={
          pokemon.sprites?.other?.["official-artwork"]?.front_default ||
          pokemon.sprites?.front_default
        }
        alt={pokemon.name}
        sx={{ width: "100%", height: 150, objectFit: "contain", mt: 2 }}
      />
      <CardContent sx={{ position: "relative", textAlign: "center" }}>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
          {pokemon.name}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {pokemon.types.map((t) => (
            <Typography
              key={t.type.name}
              variant="caption"
              sx={{
                backgroundColor: "#EEE",
                borderRadius: 1,
                px: 1,
                textTransform: "capitalize",
              }}
            >
              {t.type.name}
            </Typography>
          ))}
        </Box>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(pokemon.id);
          }}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          {isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
        </IconButton>
      </CardContent>
    </Card>
  );
}
