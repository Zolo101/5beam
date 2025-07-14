// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// https://github.com/sveltejs/kit/issues/3766

declare namespace App {
    import type { DiscordUser } from "$lib/types";
    interface Locals {
        user: DiscordUser;
        pb: Pocketbase;
    }
    interface PageData {
        user: DiscordUser;
        admin: boolean;
        loggedIn: boolean;
    }
}
