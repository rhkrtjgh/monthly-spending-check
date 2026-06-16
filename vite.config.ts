import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/monthly-spending-check/", // 이 줄을 꼭 추가하세요!
});
