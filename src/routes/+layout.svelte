<script lang="ts">
    import "../app.css";
    import Navbar from "../components/layout/Navbar.svelte";
    import Line from "../components/layout/Line.svelte";
    import Footer from "../components/layout/Footer.svelte";
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

<div class="h-fit backdrop-blur-[6px]">
    <Navbar {user}/>
    <Line/>
    <div class="w-4/5 m-auto py-2">
        <slot></slot>
    </div>
</div>

<Footer/>