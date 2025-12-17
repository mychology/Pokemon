"use client";

import PokedexShell from "../../src/components/PokedexShell";

export default function Home() {
  return (
    <div
      className="flex min-h-screen justify-center items-start"
      style={{ paddingTop: 0, marginTop: -150, marginLeft: 320 }}
    >
      <PokedexShell initial={1} />
    </div>
  );
}
