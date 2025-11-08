<script lang="ts">
    import "../../app.css";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import type { PageData } from "./$types";
    import type { Snippet } from "svelte";

    import clouds from "$lib/assets/background_homepage/clouds.svg";
    import moon from "$lib/assets/background_homepage/moon.svg";
    import platforms from "$lib/assets/background_homepage/platforms.svg";
    import stars from "$lib/assets/background_homepage/stars.svg";

    interface Props {
        data: PageData;
        children?: Snippet;
    }

    let { data, children }: Props = $props();

    let user = data.user;

    let scrollY = $state(0);
</script>

<svelte:head>
    <title>5beam - Play, share and upload BFDIA 5b levels!</title>
    <meta name="theme-color" content="#d10000" />
    <script
        defer
        src="https://analytics.zelo.dev/script.js"
        data-website-id="45534dc8-3f72-4cdb-a0d1-d40308cee3ed"
    ></script>
</svelte:head>

<svelte:window bind:scrollY />

<div class="background fixed -z-10 h-screen w-screen bg-cover">
    <img src={moon} alt="" />
    <img src={stars} alt="" />
    <img src={platforms} alt="" />
    <img src={clouds} alt="" />
</div>
<Navbar {user} />
<div class="container m-auto w-full">
    {@render children?.()}
</div>
<Footer />

<style>
    .background {
        background: linear-gradient(in oklab, #000000 100px, #777777 80%);
        /* background-image: url("$lib/assets/backgrounds/2.png"); */
        /* This is heavy on the CPU so I'm disabling */
        /* animation: hue-rotate 10s linear infinite; */

        & img {
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
