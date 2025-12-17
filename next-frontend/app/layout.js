import "./globals.css";

export const metadata = {
  title: "Pokedex",
  description: "Pokedex powered by Express/Prisma backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
