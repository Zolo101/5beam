<script lang="ts">
    import "../../app.css";
    import Navbar from "../../components/layout/Navbar.svelte";
    import Footer from "../../components/layout/Footer.svelte";
    // import background from "$lib/assets/backgrounds/2.png";
    import type { PageData } from "../../../.svelte-kit/types/src/routes";

    export let data: PageData;

    let user = data.user;
</script>

<svelte:head>
    <meta name="theme-color" content="#d10000" />
    <script
        defer
        src="https://analytics.zelo.dev/script.js"
        data-website-id="45534dc8-3f72-4cdb-a0d1-d40308cee3ed"
    ></script>
</svelte:head>

<div class="m blur-sm">
    <!--    <div></div>-->
    <!--    <img src={background} alt=""/>-->
</div>
<Navbar {user} />
<!--<div class="w-full backdrop-blur-[3px]">-->
<div class="w-full">
    <div class="m-auto max-w-[1600px] grow py-2">
        <slot></slot>
    </div>
</div>
<Footer />

<style>
    /* parallel */
    .m {
        background-image: url("$lib/assets/backgrounds/2.png");
        background-size: cover;
        position: fixed;
        left: -5px;
        top: -5px;
        width: 105%;
        height: 105%;
        z-index: -1;

        overflow-x: hidden;

        perspective: 1px;
    }

    /*.m {*/
    /*    height: 100vh;*/
    /*    overflow-x: hidden;*/
    /*    perspective: 1px;*/
    /*    z-index: -1;*/
    /*}*/

    /*img {*/
    /*    position: absolute;*/
    /*    top: 0;*/
    /*    right: 0;*/
    /*    bottom: 0;*/
    /*    left: 0;*/

    /*    transform: translateZ(0);*/
    /*}*/
</style>
