
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async ({ mode }) => {
  let componentTagger;
  if (mode === "development") {
    try {
      // Importación dinámica compatible con ESM
      const module = await import("lovable-tagger");
      componentTagger = module.componentTagger;
    } catch (error) {
      console.warn("No se pudo cargar lovable-tagger:", error);
      componentTagger = () => null;
    }
  }

  return {
    server: {
      host: "0.0.0.0",
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
  };
});
