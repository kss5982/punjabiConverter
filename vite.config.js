import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import csp from "vite-plugin-csp-guard";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    csp({
      algorithm: "sha256", // The algorithm to use for hashing
      dev: {
        run: true, // If you want to run the plugin in `vite dev` mode
      },
      policy: {
        // Specify the policy here.
        "script-src-elem": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://www.googletagmanager.com/gtag/",
        ],
        "script-src": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://www.googletagmanager.com",
        ], // Example: Allow Google Analytics
        "connect-src": [
          "'self'",
          "https://www.google-analytics.com",
          "https://cdn.jsdelivr.net",
        ],
        "style-src-elem": ["'self'", "https://cdn.jsdelivr.net"], // Allow bootstrap stylesheet
      },
    }),
  ],
  server: {
    proxy: {
      "/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
