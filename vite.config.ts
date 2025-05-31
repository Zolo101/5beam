import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

const config: UserConfig = {
    plugins: [sveltekit(), devtoolsJson()]
};

export default config;
