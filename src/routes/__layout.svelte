<script lang="ts">
    import Navbar from "../components/Navbar.svelte";
    import Line from "../components/Line.svelte";
    import Footer from "../components/Footer.svelte";

    let navbarComponent;
    let backgroundId = `/backgrounds/${Date.now() % 11}.png`;
</script>

<div class="app">
    <div class="background" style="background-image: url({backgroundId})"></div>
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