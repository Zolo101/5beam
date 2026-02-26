<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL, getPlaysShortString } from "$lib/misc";

    import Button from "../Button.svelte";
    import FunctionButton from "../FunctionButton.svelte";
    import UserComponent from "../UserComponent.svelte";
    import { fade } from "svelte/transition";
    import Featured from "$lib/assets/icons/Featured.svg?component";
    import Plays from "$lib/assets/icons/Plays.svg?component";
    import StarEnabled from "$lib/assets/icons/starEnabled.svg?component";
    // import Star from "../Star.svelte";
    // import { operateStar } from "$lib/stars.remote";

    const { data = $bindable(), glow = false }: { data: Level | null; glow?: boolean } = $props();

    // let starred = $state(false);

    // async function clickStar() {
    //     const { starred: isStarred } = await operateStar({ id: data!.id, type: 0 });
    //     starred = isStarred;
    // }
</script>

{#if data === null}
    <div
        class:glow
        class="flex h-[248px] w-[350px] flex-col items-center justify-center rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-3 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
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
                // starred &&
                //     !featured &&
                //     "bg-yellow-950/70! outline-yellow-600! hover:outline-yellow-300!",
                "flex h-[248px] w-[350px] flex-col items-start justify-start rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-3 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
            ]}
        >
            <div class="inline-flex h-full w-full">
                {#key thumbnailUrl}
                    <a href="/level/{id}" transition:fade={{ duration: 100 }}>
                        <img
                            class="absolute h-[183px] w-[335px] rounded-sm"
                            src={thumbnailUrl}
                            alt="Level Thumbnail"
                        />
                        <div class="absolute bottom-14.5 left-2.5 inline h-[35px] w-[35px]">
                            <Difficulty {difficulty} />
                        </div>
                    </a>
                    <!-- TODO: Hide if user not logged in -->
                    <!-- <button
                        onclick={clickStar}
                        class="absolute top-3 right-3 cursor-pointer transition-transform hover:scale-110"
                        aria-label="Star level"
                    >
                        <Star bind:starred width="32" height="32" class="glow" />
                    </button> -->
                {/key}
            </div>
            <div class="flex w-full items-center justify-start">
                <div class="w-full flex-col items-start justify-start">
                    <div class="flex h-7 justify-between gap-2">
                        <a
                            href="/level/{id}"
                            class="flex items-center gap-1 overflow-hidden text-xl text-ellipsis whitespace-nowrap drop-shadow-lg"
                            class:featured
                        >
                            {#if featured}
                                <Featured class="min-w-5" width="20" height="20" />
                            {/if}
                            <span>
                                {title}
                            </span>
                        </a>
                        <div class="my-1 **:h-6 **:text-sm!">
                            <div class="absolute right-2 bottom-15 flex **:px-2!">
                                {#if !featured}
                                    <FunctionButton
                                        text="Feature"
                                        action="feature"
                                        event="add-feature"
                                        bg="#ffae4b"
                                        data={{ id }}
                                        disabled={featured}
                                    />
                                {/if}
                                <FunctionButton
                                    text="Daily"
                                    action="daily"
                                    event="add-daily"
                                    bg="#fff64b"
                                    data={{ id }}
                                    disabled={false}
                                />
                            </div>

                            {#if !modded}
                                <Button
                                    text="Play"
                                    bg="#4bff5d"
                                    href="https://coppersalts.github.io/HTML5b?level={id}"
                                    event="play-level"
                                    newWindow
                                />
                            {/if}
                        </div>
                    </div>
                    <div class="flex justify-between gap-2 text-sm">
                        <div class="grow text-neutral-400">
                            <UserComponent prefix="by" {creator} />
                        </div>
                        <div class="flex gap-2">
                            <div class="flex items-end gap-1">
                                <Plays width="13" height="13" />
                                <p class="h-[15px] font-bold text-green-500">
                                    {getPlaysShortString(plays)}
                                </p>
                            </div>
                            <div class="flex items-end gap-1">
                                <StarEnabled width="15" height="15" />
                                <p class="h-[15px] font-bold text-yellow-500">
                                    <!-- {getPlaysString(stars + +starred)} -->
                                    {getPlaysShortString(stars)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/snippet}

    {@render levelContent()}
{/if}
