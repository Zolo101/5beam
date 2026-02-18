<script lang="ts">
    import "../../app.css";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import type { PageData } from "./$types";
    import type { Snippet } from "svelte";
    import { page } from "$app/state";

    import Clouds from "$lib/assets/background_homepage/clouds.svg?component";
    import Moon from "$lib/assets/background_homepage/moon.svg?component";
    import Platforms from "$lib/assets/background_homepage/platforms.svg?component";
    import Stars from "$lib/assets/background_homepage/stars.svg?component";

    interface Props {
        data: PageData;
        children?: Snippet;
    }

    let { data, children }: Props = $props();

    let user = $derived(data.user);

    let scrollY = $state(0);
</script>

<svelte:head>
    <meta name="theme-color" content="#d10000" />
    <link rel="canonical" href={page.url.href} />
    <meta property="og:url" content={page.url.href} />
    <script
        defer
        src="https://analytics.zelo.dev/script.js"
        data-website-id="45534dc8-3f72-4cdb-a0d1-d40308cee3ed"
    ></script>
</svelte:head>

<svelte:window bind:scrollY />

<div class="background fixed -z-10 h-screen w-screen bg-cover">
    <Moon class="-top-50 left-55" />
    <!-- <Stars class="left-1/3" /> -->
    <!-- <Stars class="" /> -->
    <Platforms class="top-110 right-20" />
    <Platforms class="top-130 -left-50 rotate-y-180" />
    <Platforms class="top-100 left-250" />
    <Clouds class="top-1/5 right-1/4" />
    <Clouds class="top-1/3 left-1/4" />
</div>
<Navbar {user} />
<div class="container mx-auto w-full">
    {@render children?.()}
</div>
<Footer />

<style>
    .background {
        background: linear-gradient(in oklab, #000000 100px, #777777 80%);
        /* background-image: url("$lib/assets/backgrounds/2.png"); */
        /* This is heavy on the CPU so I'm disabling */
        /* animation: hue-rotate 10s linear infinite; */

        & :global(svg) {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
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
