// src/App.jsx
import React, { useState } from 'react';
import PokedexContainer from './components/PokedexContainer.jsx';

export default function App() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {open && (
        <PokedexContainer
          initialPokemon="pikachu"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
