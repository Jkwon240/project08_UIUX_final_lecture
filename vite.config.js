import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/project08_UIUX_final_lecture/", // ✅ GitHub 저장소 이름 그대로!
  plugins: [react()],
});
