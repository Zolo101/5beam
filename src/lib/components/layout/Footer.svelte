<script>
    import FiveBStyle from "../FiveBStyle.svelte";
    import ZeloLogoTransparent from "../zelo_logo_transparent.svelte";
</script>

<footer class="mt-auto flex justify-evenly bg-neutral-700 p-5 text-neutral-50">
    <div>
        <!-- <span>Site by</span> -->
        <!-- <span>By</span> -->
        <a class="relative bottom-0.5 hover:underline" href="https://zelo.dev/" target="_blank"
            ><ZeloLogoTransparent width="40" height="20" textFill="white" /></a
        >
        <span>•</span>
        <a class="hover:underline" href="/api"><FiveBStyle text="5beam API" /></a>
    </div>
    <div>
        <FiveBStyle text="5beam is not affiliated with Jacknjellify." />
    </div>
</footer>
