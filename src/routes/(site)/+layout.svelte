<script lang="ts">
    import "../../app.css";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import type { PageData } from "./$types";
    import type { Snippet } from "svelte";

    interface Props {
        data: PageData;
        children?: Snippet;
    }

    let { data, children }: Props = $props();

    let user = data.user;

    let scrollY = $state(0);
</script>

<svelte:head>
    <meta name="theme-color" content="#d10000" />
    <script
        defer
        src="https://analytics.zelo.dev/script.js"
        data-website-id="45534dc8-3f72-4cdb-a0d1-d40308cee3ed"
    ></script>
</svelte:head>

<svelte:window bind:scrollY />

<div
    class="background fixed -z-10 h-screen w-screen bg-cover"
    style="transform: translateY({100 - scrollY / 40}px)"
></div>
<Navbar {user} />
<div class="container m-auto w-full">
    {@render children?.()}
</div>
<Footer />

<style>
    .background {
        background-image: url("$lib/assets/backgrounds/2.png");
        /* This is heavy on the CPU so I'm disabling */
        /* animation: hue-rotate 10s linear infinite; */
    }

    @keyframes hue-rotate {
        0% {
            filter: blur(2px) hue-rotate(0deg);
        }
        100% {
            filter: blur(2px) hue-rotate(360deg);
        }
    }
</style>
