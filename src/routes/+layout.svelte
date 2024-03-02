<script lang="ts">
    import "../app.css";
    import Navbar from "../components/layout/Navbar.svelte";
    import Footer from "../components/layout/Footer.svelte";
    // import background from "$lib/assets/backgrounds/2.png";
    import type { PageData } from "./$types";

    export let data: PageData;

    let user = data.user;
</script>

<svelte:head>
    <meta name="theme-color" content="#d10000">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-8QDE04Q52S"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-8QDE04Q52S');
    </script>
</svelte:head>

<div class="m">
<!--    <div></div>-->
<!--    <img src={background} alt=""/>-->
</div>
<Navbar {user}/>
<div class="w-full backdrop-blur-[3px]">
    <div class="max-w-[1600px] grow m-auto py-2 m-auto">
        <slot></slot>
    </div>
</div>
<Footer/>

<style>
    /* parallel */
    .m {
        background-image: url("$lib/assets/backgrounds/2.png");
        background-size: cover;
        position: fixed;
        width: 100%;
        height: 100%;
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