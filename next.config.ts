import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Sortie autonome : Next copie uniquement les fichiers (et le sous-ensemble
  // de node_modules) nécessaires à l'exécution dans .next/standalone, ce qui
  // permet une image Docker finale minimale.
  output: "standalone",
};

export default nextConfig;
