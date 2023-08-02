<script lang="ts">
    import "../app.css";
    import Navbar from "../components/layout/Navbar.svelte";
    import Line from "../components/layout/Line.svelte";
    import Footer from "../components/layout/Footer.svelte";

    let navbarComponent;
    let backgroundId = `/backgrounds/${Date.now() % 11}.png`;
</script>

<svelte:head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-8QDE04Q52S"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-8QDE04Q52S');
    </script>
</svelte:head>

<div class="app">
<!--    <div class="background" style="background-image: url({backgroundId})"></div>-->
    <Navbar bind:this={navbarComponent}/>
    <Line/>
    <div class="page">
        <slot></slot>
    </div>
</div>

<Footer/>

<style>
    .app {
        height: fit-content;
        backdrop-filter: blur(2px);
    }

    .background {
        width: 100%;
        height: max(100%, 100vh);
        position: absolute;
        filter: brightness(75%);
        background-size: cover;
        background-attachment: fixed;
        z-index: -1;
    }

    .page {
        margin: 10px 50px 20px 50px;
    }
</style>