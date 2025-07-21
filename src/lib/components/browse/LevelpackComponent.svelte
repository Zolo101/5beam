<script lang="ts">
    import type { Levelpack } from "$lib/types";
    import Box from "$lib/assets/box.png";
    import Icon from "../Icon.svelte";
    import { getPlaysString } from "$lib/misc";
    import Button from "../Button.svelte";
    import UserComponent from "../UserComponent.svelte";

    const { data, glow = false }: { data: Levelpack | null; glow?: boolean } = $props();
</script>

{#if data === null}
    <div
        class:glow
        class="h-[192px] w-[350px] rounded-lg bg-zinc-700/20 p-2 text-sm text-neutral-50 shadow-sm outline-4 outline-white/10 backdrop-blur-xl backdrop-saturate-200 transition-all hover:outline-white/40"
    ></div>
{:else}
    {#snippet levelpackContent()}
        {@const { creator, id, modded, title, levels, plays } = data}

        <div
            class:moddedLevelpack={modded}
            class:glow
            class="w-[350px] rounded-lg bg-zinc-700/20 p-2 text-sm text-neutral-50 shadow-sm outline-4 outline-white/10 backdrop-blur-xl backdrop-saturate-200 transition-all hover:outline-white/40"
        >
            <div class="flex w-full justify-center">
                <a href="/levelpack/{id}">
                    <img
                        width="128"
                        height="128"
                        class="rounded-xs"
                        src={Box}
                        alt="Placeholder Thumbnail"
                    />
                </a>
            </div>
            <div class="flex h-7 justify-between gap-2">
                <p class="overflow-hidden text-xl text-ellipsis whitespace-nowrap">
                    {title}
                </p>
                <div class="my-1 **:h-6 **:text-sm!">
                    {#if !modded}
                        <Button
                            text="Play"
                            bg="#4bff5d"
                            href="https://coppersalts.github.io/HTML5b?levelpack={id}"
                            event="play-level"
                        />
                    {/if}
                </div>
            </div>
            <div class="flex justify-between gap-2">
                <div class="grow">
                    <UserComponent prefix="by" {creator} />
                </div>
                <div class="flex items-end gap-4 *:gap-1">
                    <div class="flex items-end">
                        <Icon name="levels" width="13" height="13" />
                        <p class="h-[15px] font-bold text-purple-400">
                            {getPlaysString(levels.length)}
                        </p>
                    </div>
                    <div class="flex items-end">
                        <Icon name="plays" width="13" height="13" />
                        <p class="h-[15px] font-bold text-green-500">
                            {getPlaysString(plays)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {/snippet}

    {@render levelpackContent()}
{/if}
