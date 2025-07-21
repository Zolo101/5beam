import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});
