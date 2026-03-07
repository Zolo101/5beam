import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import svg from "@poppanator/sveltekit-svg";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        devtoolsJson(),
        svg({
            svgoOptions: {
                plugins: [
                    {
                        name: "prefixIds"
                    }
                ]
            }
        })
    ],
    test: {
        globals: true,
        environment: "node"
    }
});
