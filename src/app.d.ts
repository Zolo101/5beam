// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { User } from "discord-oauth2";

declare namespace App {
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
