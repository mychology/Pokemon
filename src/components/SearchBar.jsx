// src/components/SearchBar.jsx
import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchBar({ search, setSearch }) {
  return (
    <TextField
      variant="outlined"
      placeholder="Search Pokémon..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      fullWidth
      size="small"
      sx={{
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: 1,
        minWidth: 220,
        "& fieldset": { border: "none" },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: search && (
          <InputAdornment position="end">
            <IconButton onClick={() => setSearch("")}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
