
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

// Crear require y definir __dirname para módulos ESM
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar lovable-tagger solo en desarrollo y de manera condicional
let componentTagger: (() => any) | undefined;
if (process.env.NODE_ENV === "development") {
  try {
    const lovableTagger = require("lovable-tagger");
    componentTagger = lovableTagger.componentTagger;
  } catch (error) {
    console.warn("No se pudo cargar lovable-tagger:", error);
    componentTagger = () => null; // Función vacía como fallback
  }
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Mejor compatibilidad
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    target: "chrome95",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  optimizeDeps: {
    exclude: ["electron", "lovable-tagger", "electron-is-dev"],
  },
}));
