// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// https://github.com/sveltejs/kit/issues/3766

declare namespace App {
    import type { PrivateBaseUserV2 } from "$lib/types";
    interface Locals {
        user: PrivateBaseUserV2 | null;
        pb: Pocketbase;
    }
    interface PageData {
        user: PrivateBaseUserV2 | null;
        admin: boolean;
        loggedIn: boolean;
    }
}
