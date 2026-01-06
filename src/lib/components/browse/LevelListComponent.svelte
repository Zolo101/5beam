<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "$lib/misc";

    import Button from "../Button.svelte";
    import FunctionButton from "../FunctionButton.svelte";
    import UserComponent from "../UserComponent.svelte";
    import { fade } from "svelte/transition";
    import Featured from "$lib/assets/icons/featured.svg?component";
    import Plays from "$lib/assets/icons/Plays.svg?component";
    import Star from "../Star.svelte";
    import { operateStar } from "$lib/stars.remote";

    const { data = $bindable(), glow = false }: { data: Level | null; glow?: boolean } = $props();

    let starred = $state(false);

    async function clickStar() {
        const { starred: isStarred } = await operateStar({ id: data!.id, type: 0 });
        starred = isStarred;
    }
</script>

<!-- TODO: Thumbnails spawn werid here -->
{#if data === null}
    <div
        class:glow
        class="flex h-[45px] w-[300px] flex-col items-center justify-center rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-3 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
    ></div>
{:else}
    {#snippet levelContent()}
        {@const { creator, id, modded, title, featured, difficulty, plays, stars } = data}
        {@const thumbnailUrl = getLevelThumbnailURL(data.id, data.thumbnail, true)}

        <div
            class:modded
            class:glow
            class={[
                featured && "bg-cyan-950/70! outline-cyan-800! hover:outline-cyan-500!",
                starred &&
                    !featured &&
                    "bg-yellow-950/70! outline-yellow-600! hover:outline-yellow-300!",
                "flex h-[45px] w-[300px] items-start justify-start gap-2 rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-3 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
            ]}
        >
            <div class="shrink-0">
                {#key thumbnailUrl}
                    <a href="/level/{id}" transition:fade={{ duration: 100 }}>
                        <img class="w-[53px] rounded-sm" src={thumbnailUrl} alt="Level Thumbnail" />
                        <!-- <div class="absolute bottom-13.5 left-2.5 inline h-[35px] w-[35px]">
                            <Difficulty {difficulty} />
                        </div> -->
                    </a>
                    <!-- <button
                        onclick={clickStar}
                        class="absolute top-3 right-3 cursor-pointer transition-transform hover:scale-110"
                        aria-label="Star level"
                    >
                        <Star bind:starred width="32" height="32" class="glow" />
                    </button> -->
                {/key}
            </div>
            <div class="relative bottom-1 flex w-full min-w-0 flex-col items-start justify-start">
                <div class="w-full items-start justify-start">
                    <div class="flex h-5 justify-between gap-2">
                        <a
                            href="/level/{id}"
                            class="flex items-center gap-1 overflow-hidden text-base text-ellipsis whitespace-nowrap drop-shadow-lg"
                            class:featured
                        >
                            {#if featured}
                                <Featured class="min-w-5" width="20" height="20" />
                            {/if}
                            <span>
                                {title}
                            </span>
                        </a>
                    </div>
                </div>
                <div class="relative bottom-0.5 flex flex-col justify-between gap-2 text-sm">
                    <div class="text-neutral-400">
                        <UserComponent prefix="by" {creator} />
                    </div>
                    <!-- <div class="flex gap-2">
                        <div class="flex items-end gap-1">
                            <Plays width="13" height="13" />
                            <p class="h-[15px] font-bold text-green-500">
                                {getPlaysString(plays)}
                            </p>
                        </div>
                        <div class="flex items-end gap-1">
                            <Star width="15" height="15" />
                            <p class="h-[15px] font-bold text-yellow-500">
                                {getPlaysString(stars + +starred)}
                            </p>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    {/snippet}

    {@render levelContent()}
{/if}
