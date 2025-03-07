
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import type { ConfigEnv, UserConfig } from "vite";

// Define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async (config: ConfigEnv): Promise<UserConfig> => {
  const { mode } = config;
  let componentTagger;
  
  if (mode === "development") {
    try {
      // Dynamic import compatible with ESM
      const module = await import("lovable-tagger");
      componentTagger = module.componentTagger;
    } catch (error) {
      console.warn("Could not load lovable-tagger:", error);
      componentTagger = () => null;
    }
  }

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true, // Force specified port
      hmr: {
        overlay: true, // Show errors in overlay
        // Make sure HMR works with Electron
        protocol: 'ws',
        host: 'localhost',
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      // Add this to help with CommonJS/ESM interoperability
      preserveSymlinks: true,
    },
    base: "./", // Configuration for relative paths
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      target: "chrome95",
      sourcemap: true, // Enable sourcemaps for debugging
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
    },
    optimizeDeps: {
      exclude: ["electron", "lovable-tagger", "electron-is-dev"],
      // This helps with handling CommonJS modules in ESM context
      esbuildOptions: {
        target: 'esnext',
        supported: { 
          bigint: true 
        },
        define: {
          global: 'globalThis'
        }
      }
    },
    // Better error detection
    logLevel: 'info',
    // Add support for CommonJS modules
    esbuild: {
      target: 'es2020',
    }
  };
});
