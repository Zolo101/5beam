<script lang="ts">
    import { page } from "$app/state";

    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "../../misc";
    import Icon from "../Icon.svelte";
    import Button from "../Button.svelte";
    import FunctionButton from "../FunctionButton.svelte";
    import UserComponent from "../UserComponent.svelte";
    import { fade } from "svelte/transition";

    const { data = $bindable(), glow = false }: { data: Level | null; glow?: boolean } = $props();
</script>

{#if data === null}
    <div
        class:glow
        class="flex h-[248px] w-[350px] flex-col items-center justify-center rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-2 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
    ></div>
{:else}
    {#snippet levelContent()}
        {@const { creator, id, modded, title, featured, difficulty, plays } = data}
        {@const thumbnailUrl = getLevelThumbnailURL(data.id, data.thumbnail, true)}

        {@const makeFeatured = () => {
            fetch(`/api/feature?id=${data.id}`, {
                method: "POST"
            })
                .then((res) => {
                    if (res.ok) {
                        data.featured = true;
                    }
                })
                .catch(alert);
        }}

        {@const addDaily = () => {
            fetch(`/api/daily?id=${data.id}`, {
                method: "POST"
            }).catch(alert);
        }}

        <div
            class:modded
            class:glow
            class="flex h-[248px] w-[350px] flex-col items-start justify-start rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-2 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
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
                {/key}
            </div>
            <div class="flex w-full items-center justify-start">
                <div class="w-full flex-col items-start justify-start">
                    <div class="flex h-7 justify-between gap-2">
                        <a
                            href="/level/{id}"
                            class="overflow-hidden text-xl text-ellipsis whitespace-nowrap drop-shadow-lg"
                            style:color={featured ? "#ffea65" : "#f5f5f5"}
                        >
                            {#if featured}
                                <Icon name="starred" width="20" height="20" />
                            {/if}
                            {title}
                        </a>
                        <div class="my-1 **:h-6 **:text-sm!">
                            {#if page.data.admin}
                                <div class="absolute right-2 bottom-15 flex **:px-2!">
                                    {#if !featured}
                                        <FunctionButton
                                            text="Feature"
                                            bg="#ffae4b"
                                            onclick={makeFeatured}
                                            event="add-feature"
                                            disabled={featured}
                                        />
                                    {/if}
                                    <FunctionButton
                                        text="Daily"
                                        bg="#fff64b"
                                        onclick={addDaily}
                                        event="add-daily"
                                        disabled={false}
                                    />
                                </div>
                            {/if}

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
                        <div class="flex items-end">
                            <Icon name="plays" width="13" height="13" />
                            <p class="h-[15px] pl-1 font-bold text-green-500">
                                {getPlaysString(plays)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/snippet}

    {@render levelContent()}
{/if}
