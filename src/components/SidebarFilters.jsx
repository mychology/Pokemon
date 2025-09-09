import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import axios from "axios";

export default function SidebarFilters({ typeFilter, setTypeFilter }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get("https://pokeapi.co/api/v2/type");
        const mainTypes = res.data.results.filter(
          (t) => t.name !== "unknown" && t.name !== "shadow"
        );
        setTypes(mainTypes);
      } catch (err) {
        console.error("Error fetching Pokémon types:", err);
      }
    };
    fetchTypes();
  }, []);

  return (
    <Box
      sx={{
        width: 200,
        p: 2,
        borderRight: "2px solid #ccc",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filter by Type
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Chip
          label="All"
          clickable
          color={!typeFilter ? "primary" : "default"}
          onClick={() => setTypeFilter("")}
        />
        {types.map((t) => (
          <Chip
            key={t.name}
            label={t.name.charAt(0).toUpperCase() + t.name.slice(1)}
            clickable
            color={typeFilter === t.name ? "primary" : "default"}
            onClick={() => setTypeFilter(t.name)}
          />
        ))}
      </Box>
    </Box>
  );
}
