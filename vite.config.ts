import { execSync } from "child_process"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

const gitHash = execSync("git rev-parse --short HEAD").toString().trim()
const buildTime = new Date().toISOString().slice(0, 16).replace("T", " ") + "Z"

export default defineConfig({
  plugins: [solid()],
  base: "./",
  define: {
    __BUILD_INFO__: JSON.stringify(`${buildTime} · ${gitHash}`),
  },
})
