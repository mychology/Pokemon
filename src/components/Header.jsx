// src/components/Header.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SearchBar from "./SearchBar";

export default function Header({ search, setSearch, favorites, navigate }) {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#CC0000",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            letterSpacing: 2,
            fontFamily: "Orbitron, sans-serif",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Pokédex
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => navigate("/favorites")}
          >
            Favorites ({favorites.length})
          </Button>

          <SearchBar search={search} setSearch={setSearch} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
