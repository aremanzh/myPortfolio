import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/*
 * Preview build: one script, one stylesheet, relative paths, contact form
 * disabled (see src/lib/env.js). Output goes to build-preview/, never to the
 * production build.
 */
export default defineConfig({
  base: "./",
  plugins: [react()],
  define: { "import.meta.env.VITE_PREVIEW": JSON.stringify("1") },
  build: {
    outDir: process.env.PREVIEW_OUT || "build-preview",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1024,
    cssCodeSplit: false,
    rollupOptions: {
      input: "preview.html",
      output: {
        format: "iife",
        entryFileNames: "static/js/main.[hash].js",
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith(".css") ? "static/css/main.[hash][extname]" : "static/media/[name][extname]",
      },
    },
  },
});
