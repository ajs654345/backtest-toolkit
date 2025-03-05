
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Importar lovable-tagger solo en desarrollo y de manera condicional
let componentTagger: (() => any) | undefined;
if (process.env.NODE_ENV === 'development') {
  try {
    // Importación dinámica para evitar problemas de ESM/CJS
    const lovableTagger = require("lovable-tagger");
    componentTagger = lovableTagger.componentTagger;
  } catch (error) {
    console.warn("No se pudo cargar lovable-tagger:", error);
    componentTagger = () => null; // Función vacía como fallback
  }
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",  // Cambiado de :: a 0.0.0.0 para mejor compatibilidad
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'chrome95',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['electron', 'lovable-tagger', 'electron-is-dev']
  },
}));
