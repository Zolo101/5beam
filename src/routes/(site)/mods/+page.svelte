<script lang="ts">
    import Button from "../../../components/Button.svelte";
    import type { PageData } from "./$types";

    // let { data }: { data: PageData } = $props();

    let b = ["Golden 5", "5*30"];
</script>

<main>
    <h2>Coming Soon!</h2>
    <!-- <section class="flex flex-col items-center justify-center gap-5">
        {#each b as mod}
            <div
                class="backdrop-blur-m mx-5 rounded bg-purple-900/30 p-5 outline-2 outline-purple-700/60"
            >
                <h2>{mod}</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quis nibh mollis
                    metus elementum rhoncus a et sapien. Curabitur ac odio eget urna sagittis
                    ultricies. Etiam lacinia ligula non nisi lacinia placerat. Morbi sed dolor ac
                    tellus malesuada lacinia condimentum nec mi. Nunc venenatis posuere orci. Aenean
                    maximus auctor tellus, et aliquam mauris facilisis quis. Mauris dictum quis
                    velit ullamcorper faucibus. Duis ut facilisis lacus. Integer semper tincidunt
                    finibus. Morbi lacinia in ligula vel consequat.
                </p>
                <Button text="Play {mod}" bg="#4bff5d" href="#" event="visit-mod" />
                <h2>Recent Levels</h2>
                <h2>Recent Levelpacks</h2>
            </div>
        {/each}
    </section> -->
</main>

<style>
</style>
