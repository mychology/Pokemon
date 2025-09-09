import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

export default function PokemonDetailModal({ open, onClose, pokemon }) {
  if (!pokemon) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "16px",
          backgroundColor: "#fefefe",
          border: "4px solid #CC0000",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#CC0000",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {pokemon.name.toUpperCase()}
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box
            component="img"
            src={
              pokemon.sprites?.other?.["official-artwork"]?.front_default ||
              pokemon.sprites?.front_default
            }
            alt={pokemon.name}
            sx={{ width: 150, height: 150 }}
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Types
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          {pokemon.types.map((t, idx) => (
            <Chip
              key={idx}
              label={t.type.name}
              sx={{
                backgroundColor: "#EEE",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            />
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Stats
        </Typography>
        <Box>
          {pokemon.stats.map((s, idx) => (
            <Typography key={idx} sx={{ textTransform: "capitalize" }}>
              {s.stat.name}: <strong>{s.base_stat}</strong>
            </Typography>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
