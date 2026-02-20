<script lang="ts">
    import { postCreateLevelClient, postCreateLevelpackClient } from "$lib/client/ClientSideAPI";
    import Validator from "$lib/components/Validator.svelte";
    import Log from "$lib/components/Log.svelte";
    import type { Level, Levelpack } from "$lib/types";
    import Dropzone from "svelte-file-dropzone";
    import type { PageData } from "./$types";
    import Button from "$lib/components/Button.svelte";
    import { enhance } from "$app/forms";
    import LevelpackManipulator from "$lib/client/LevelpackManipulator.svelte";
    import dummyLevelData from "$lib/assets/level.txt?raw";
    import type { ValidateResult } from "$lib/client/FileValidator";
    // import dummyValidLevel from "$lib/assets/validatedLevel.json";

    // Be aware: This is only the first 28 levels
    // import dummyLevelData from "$lib/assets/levels.txt?raw";

    let { data }: { data: PageData } = $props();
    let user = { data };

    const loggedIn = !!user;
    let uploading = $state(false);
    const manipulator = $state(new LevelpackManipulator());

    // function createDummyFile() {
    //     return new File([dummyLevelData], "levels.txt", { type: "text/plain" });
    // }
    // manipulator.files.push(createDummyFile(), createDummyFile(), createDummyFile());

    let results = $state<ValidateResult[]>([]);

    let title = $state("");
    let description = $state("");

    // $effect(() => (results, console.log(manipulator.toRaw())));

    async function onUpload(e: CustomEvent<{ acceptedFiles: File[] }>) {
        manipulator.addFiles("new", ...e?.detail?.acceptedFiles);
        // results = await manipulator.computeValidations();
        results = await manipulator.gatherAndComputeValidations();
    }

    async function onSubmit() {
        if (manipulator.isEmpty() || !manipulator.files || manipulator.files.length === 0) return;

        uploading = true;

        const type = manipulator.levelpack.levels.length === 1;
        const typeName = type ? "level" : "levelpack";
        const func = type ? postCreateLevelClient : postCreateLevelpackClient;

        // @ts-ignore
        window.umami?.track("upload-level");

        func(await manipulator.toPayload(title, description))
            .then((res: Level | Levelpack) => {
                window.location.href = `/${typeName}/${res.id}`;
            })
            .catch((err: unknown) => {
                console.error(err);
                uploading = false;

                // @ts-ignore
                window.umami?.track("upload-level-failed");

                // TODO: Better error handling (like webhooks?)
                alert(
                    "Unfortunately your upload has failed. Please contact @zelo101 on discord with your file(s)."
                );
            });
    }
</script>

<!-- "Changes may not be saved" -->
<svelte:head>
    <title>Upload - 5beam</title>
    <meta name="description" content="Upload your BFDIA 5b levels and levelpacks to 5beam." />
    <meta name="robots" content="noindex" />
</svelte:head>

<svelte:window
    onbeforeunload={(e) => {
        if (!uploading) {
            e.preventDefault();
            e.returnValue = true;
        }
    }}
/>

<section class="flex items-start">
    <div
        class="flex w-120 flex-col gap-1 rounded-l-xl bg-zinc-800 p-5 text-xl shadow-lg [&_label]:font-bold"
    >
        <label for="title">Title:</label>
        <input
            bind:value={title}
            class="rounded-lg bg-black/30 p-2.5"
            type="text"
            name="title"
            minlength="2"
            maxlength="64"
            placeholder="My 5b level (max 64 chars)"
            required
        />
        <br />
        <label for="description">Description:</label>
        <textarea
            bind:value={description}
            class="w-full rounded-lg bg-black/30 p-2.5"
            name="description"
            rows="5"
            cols="33"
            maxlength="1024"
            placeholder="Level description (max 1024 chars)"
            required
        ></textarea>
        <label for="modded" class="pt-6">Is this for a 5b mod?</label>
        <span class="text-sm">Changing this removes all currently uploaded files.</span>
        {#if manipulator.mod}
            <p class="text-sm">
                Be aware, levels for 5b mods cannot be played on HTML5b, and will only show up on
                your profile and in the future "Mods" section of this site.
            </p>
        {/if}
        <select bind:value={manipulator.mod} name="modded" class="rounded-lg bg-black/30 p-2.5">
            <option value={""}>No</option>
            <option value={"golden5"}>Golden 5</option>
            <option value={"5*"}>5*30</option>
        </select>
        <br />
        <div class="mt-auto">
            <Button
                text={uploading ? "Uploading... Please wait!" : "Upload!"}
                bg="#55ff55"
                disabled={manipulator.isEmpty()}
                onclick={() => onSubmit()}
            />
        </div>
    </div>
    <section class="flex grow flex-col items-start gap-5 rounded-r-xl bg-zinc-900 p-4 shadow-lg">
        {#if !manipulator.isEmpty()}
            <div class="w-full">
                {#if manipulator.mod}
                    <p class="p-5 text-center">
                        Levels for mods cannot be automatically validated yet. Please check that
                        your level file works in the 5b mod before uploading!
                    </p>
                {:else}
                    <Validator {manipulator} />
                {/if}
            </div>
            <section>
                <p>Files:</p>
                <div class="flex flex-col gap-2">
                    {#each manipulator.files as file}
                        <div class="w-full">
                            <h3 class="text-2xl font-bold">
                                {file.name} ({file.size.toLocaleString()} bytes)
                            </h3>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
        <Dropzone
            accept="text/plain"
            multiple={true}
            maxSize={1000000}
            required={true}
            disableDefaultStyles={true}
            disabled={!loggedIn}
            containerClasses="w-full h-full p-10 bg-zinc-900 flex flex-col items-center rounded-sm transition-colors outline-emerald-400/10 outline-4 outline-dashed hover:outline-emerald-400 cursor-pointer"
            on:drop={onUpload}
        >
            {#if loggedIn}
                <div class="m-auto text-2xl">
                    <p class="font-bold">
                        Drag and drop your file here, or click to select a file!
                    </p>
                    <p class="text-center text-lg">Levelpacks cannot have more than 200 levels</p>
                </div>
            {:else}
                <p class="mx-5 p-10 text-center text-lg">You must Log In to upload levels.</p>
                <div class="flex justify-end gap-2 *:grow *:rounded *:text-center">
                    <form use:enhance method="POST" action="/login">
                        <Button text="Log In" href="/login" bg="#5555ff" />
                    </form>
                </div>
            {/if}
        </Dropzone>
        {#if !results.every((r) => r.valid)}
            <section>
                <p>One or more files couldn't be uploaded, reasons below:</p>
                {#each results.filter((r) => !r.valid) as result}
                    {#each result.globalLogs as log}
                        <Log {log} />
                    {/each}
                    {#each result.levels as level}
                        {#each level.logs.filter((l) => l.level === "error") as log}
                            <Log {log} />
                        {/each}
                    {/each}
                {/each}
            </section>
        {/if}
    </section>
</section>
<br />
