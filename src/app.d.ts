// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// https://github.com/sveltejs/kit/issues/3766
declare namespace App {
    import type { User } from "discord-oauth2";

    interface Locals {
        user: User
    }
    interface PageData {
        user: User
        // dbUser: PocketbaseUser
        loggedIn: boolean
    }
    // interface Platform {}
}
