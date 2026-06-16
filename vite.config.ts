import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const isWebPreview = process.env.VITE_WEB_PREVIEW === "true";

export default defineConfig({
  plugins: [react()],
  base: isWebPreview ? "/monthly-spending-check/" : "/",
  resolve: isWebPreview
    ? {
        alias: {
          "@toss/tds-mobile": path.resolve(rootDir, "src/preview/tds-mobile.tsx"),
          "@toss/tds-mobile-ait": path.resolve(
            rootDir,
            "src/preview/tds-mobile-ait.tsx",
          ),
        },
      }
    : undefined,
});
