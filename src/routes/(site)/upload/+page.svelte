<script lang="ts">
    import languageEncoding from "detect-file-encoding-and-language";
    import { postCreateLevelClient, postCreateLevelpackClient } from "$lib/client/ClientSideAPI";
    import Validator from "$lib/components/Validator.svelte";
    import { validateFile, type ValidateResult } from "$lib/client/FileValidator";
    import type { Level, Levelpack } from "$lib/types";
    import { readBlobInANSI } from "$lib/misc";
    import Dropzone from "svelte-file-dropzone";
    import FiveBStyle from "$lib/components/FiveBStyle.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import type { PageData } from "./$types";
    import Button from "$lib/components/Button.svelte";
    // import dummyLevelData from "$lib/assets/level.txt?raw";
    import dummyLevelData from "$lib/assets/levels.txt?raw";

    let { data }: { data: PageData } = $props();
    let user = data.user;

    const loggedIn = !!user;
    let uploading = $state(false);
    let eventStore = $state<CustomEvent<{ acceptedFiles: File[] }>>();

    function createDummyFile() {
        return new File([dummyLevelData], "levels.txt", { type: "text/plain" });
    }
    let file = $state(createDummyFile());
    let result = $derived.by(async () => {
        if (!file) return;
        return validateFile(file);
    });

    let levelDifficulties = $state(new Array<number>(200).fill(0));

    let title = $state("easy");
    let description = $state("level");
    let modded = $state("");

    async function onSubmit(result: ValidateResult | undefined) {
        if (result === undefined) return;

        if (result.valid || modded) {
            uploading = true;

            // 5b levels can either be ANSI (flash) or UTF-8 (HTML5), so we need to support both.
            // We need to support ANSI to preserve the wood blocks (€) in flash levels.
            const encoding = (await languageEncoding(file!)).encoding;
            const isANSI = encoding === "CP1252";
            const text = isANSI ? await readBlobInANSI(file!) : await file!.text();

            const payload = {
                access_token: data.access_token,
                title: title,
                description: description,
                difficulty: levelDifficulties.slice(0, result.levels.length),
                modded: modded,
                file: text
            };

            const type = result.levels.length === 1;
            const typeName = type ? "level" : "levelpack";
            const func = type ? postCreateLevelClient : postCreateLevelpackClient;

            // @ts-ignore
            window.umami.track("upload-level");

            func(payload)
                .then((res: Level | Levelpack) => {
                    window.location.href = `/${typeName}/${res.id}`;
                })
                .catch((err: unknown) => {
                    console.error(err);

                    // @ts-ignore
                    window.umami.track("upload-level-failed");

                    alert(
                        "Unfortunately your upload has failed. Please contact @zelo101 on discord with your level(s)."
                    );
                });
        }
    }

    let guestWarning = $state(!loggedIn);
</script>

<!-- "Changes may not be saved" -->
<svelte:window onbeforeunload={() => true} />

<Dialog bind:open={guestWarning}>
    <div class="z-200 flex max-w-[500px] flex-col gap-4 p-5">
        <div class="text-center text-5xl">
            <FiveBStyle text="Warning" />
        </div>
        <p class="mx-5 text-center text-lg">
            You are uploading as a guest. You will not be able to edit or delete your level after!
        </p>
        <div class="flex justify-end gap-2 *:grow *:rounded *:text-center">
            <Button text="Log In" href="/login" bg="#aaaaaa" />
            <Button text="OK" bg="#5555ff" onclick={() => (guestWarning = false)} />
        </div>
    </div>
</Dialog>

<section class="m-auto flex items-start gap-2">
    <div class="w-full rounded-lg bg-neutral-950/70 p-4 text-neutral-100 shadow-lg">
        <div>
            <div class="flex h-[75vh] flex-col gap-2 text-xl">
                <Dropzone
                    accept="text/plain"
                    multiple={false}
                    maxSize={1000000}
                    required={true}
                    disableDefaultStyles={true}
                    containerClasses="h-full flex flex-col items-center rounded-sm outline-4 outline-dashed outline-white/75 cursor-pointer py-2"
                    on:drop={(e) => (eventStore = e)}
                >
                    <div class="m-auto text-4xl">
                        <p class="font-bold">
                            Drag and drop your file here, or click to select a file!
                        </p>
                        <p class="text-center text-xl">
                            Levelpacks with more than 200 levels will not be accepted
                        </p>
                    </div>
                </Dropzone>
            </div>
        </div>

        {#await result then response}
            <Dialog open={!!response}>
                <div class="flex max-h-[90vh] gap-2 text-xl">
                    <div class="sticky top-0 flex flex-col gap-2 p-5">
                        <label for="title" class="font-bold">Title:</label>
                        <input
                            bind:value={title}
                            class="rounded-lg bg-black/30 p-2.5"
                            type="text"
                            name="title"
                            maxlength="64"
                            placeholder="My 5b level (max 64 chars)"
                            required
                        />
                        <br />
                        <label for="description" class="font-bold">Description:</label>
                        <textarea
                            bind:value={description}
                            class="rounded-lg bg-black/30 p-2.5"
                            name="description"
                            rows="5"
                            cols="33"
                            maxlength="1024"
                            placeholder="Level description (max 1024 chars)"
                            required
                        ></textarea>
                        <p class="pt-6 font-bold">Is this for a 5b mod?</p>
                        {#if modded}
                            <p class="text-sm">
                                Be aware, levels for 5b mods cannot be played on HTML5b, and will
                                only show up on your profile and in the "Mods" section of this site.
                            </p>
                        {/if}
                        <select
                            bind:value={modded}
                            name="modded"
                            class="rounded-lg bg-black/30 p-2.5"
                        >
                            <option value={""}>No</option>
                            <option value={"golden5"}>Golden 5</option>
                            <option value={"5*"}>5*30</option>
                        </select>
                        <br class="my-10" />
                        <div class="flex gap-2 *:grow">
                            <Button
                                text={uploading ? "Uploading... Please wait!" : "Upload!"}
                                bg="#55ff55"
                                disabled={!(response?.valid ?? false) || uploading}
                                onclick={() => onSubmit(response)}
                            />
                            <Button
                                text="Cancel"
                                bg="#cccccc"
                                onclick={() => (result = undefined)}
                            />
                        </div>
                    </div>
                    <div class="overflow-y-auto rounded-r-lg bg-neutral-700 p-2 font-bold">
                        {#if modded}
                            <p class="p-5 text-center">
                                Levels for mods cannot be automatically validated yet. For now,
                                check that your level file works in the 5b mod before uploading!
                            </p>
                        {:else if response}
                            {#if levelDifficulties}
                                <p class="p-5 text-center">Click on a level for more details!</p>
                                <Validator
                                    result={response}
                                    bind:difficulties={levelDifficulties}
                                />
                            {/if}
                        {/if}
                    </div>
                </div>
            </Dialog>
        {/await}
    </div>
</section>
