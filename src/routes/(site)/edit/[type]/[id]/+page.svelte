<script lang="ts">
    import Validator from "$lib/components/Validator.svelte";
    import Log from "$lib/components/Log.svelte";
    import Dropzone from "svelte-file-dropzone";
    import type { PageData } from "./$types";
    import Button from "$lib/components/Button.svelte";
    import LevelpackManipulator from "$lib/client/LevelpackManipulator.svelte";
    import type { DetectedLevelMeta, ValidateResult } from "$lib/client/FileValidator";
    import { updateLevelpackV2 } from "$lib/create.remote";

    let { data }: { data: PageData } = $props();
    let { user, thing } = $derived(data);

    const loggedIn = !!user;

    // TODO: /level/ support (right now the current edit feature is fine for levels...)

    function getRaw() {
        switch (thing.type) {
            case "level":
                return thing.item.data;

            case "levelpack":
                return thing.item.levels.map((level) => level.data).join("\n\n");

            default:
                throw new Error("Invalid type for edit page");
        }
    }

    const meta: DetectedLevelMeta[] = (() => {
        switch (thing.type) {
            case "level":
                return [
                    {
                        tag: "default",
                        difficulty: thing.item.difficulty,
                        dbId: thing.item.id
                    }
                ];

            case "levelpack":
                return thing.item.levels.map((level) => ({
                    tag: "default",
                    difficulty: level.difficulty,
                    dbId: level.id
                }));

            default:
                throw new Error("Invalid type for edit page");
        }
    })();

    const manipulator = $state(
        new LevelpackManipulator(
            new File([getRaw()], `${thing.item.title}.txt`, { type: "text/plain" }),
            meta
        )
    );

    const newTag = "outline-4 outline-green-400 rounded-lg";

    let results = $state<ValidateResult[]>(await manipulator.gatherAndComputeValidations());
    async function onUpload(e: CustomEvent<{ acceptedFiles: File[] }>) {
        manipulator.addFiles(newTag, ...e?.detail?.acceptedFiles);
        results = await manipulator.gatherAndComputeValidations();
    }

    const levelsToCreate = $derived(
        manipulator.getLevelsByTag(newTag).map((l) => {
            return {
                title: l.name,
                difficulty: l.meta.difficulty,
                modded: thing.item.modded,
                raw: l.raw
            };
        })
    );

    const order = $derived.by(() => {
        switch (thing.type) {
            case "level": {
                return [thing.item.id];
            }
            case "levelpack": {
                let newId = 0;
                return manipulator.levelpack.levels.map((level) => {
                    if (level.meta.tag === newTag) {
                        return `@${newId++}`;
                    } else {
                        return level.meta.dbId;
                    }
                });
            }
        }
    });
    // $inspect(order);

    // ("Unfortunately your upload has failed. Please contact @zelo101 on discord with your file(s).");
</script>

<!-- "Changes may not be saved" -->
<svelte:window onbeforeunload={() => true} />

<section class="flex items-start">
    <form
        {...updateLevelpackV2}
        class="flex w-120 flex-col gap-1 rounded-l-xl bg-zinc-800 p-5 text-xl shadow-lg [&_label]:font-bold"
    >
        {#each updateLevelpackV2.fields.allIssues() as issue}
            <p>{issue.path} {issue.message}</p>
        {/each}
        <input
            {...updateLevelpackV2.fields.id.as("text")}
            value={thing.item.id}
            type="text"
            name="id"
            hidden
            required
        />
        <label for="title">Title:</label>
        <input
            {...updateLevelpackV2.fields.title.as("text")}
            value={thing.item.title}
            class="rounded-lg bg-black/30 p-2.5"
            placeholder="My improved 5b level (max 64 chars)"
            required
        />
        <br />
        <label for="description">Description:</label>
        <textarea
            {...updateLevelpackV2.fields.description.as("text")}
            value={thing.item.description}
            class="w-full rounded-lg bg-black/30 p-2.5"
            rows="5"
            cols="33"
            placeholder="Level description (max 1024 chars)"
            required
        ></textarea>
        <br />
        <!-- <label for="unlisted">Unlisted:</label> -->
        <input
            type="checkbox"
            class="h-8"
            name="unlisted"
            hidden
            bind:checked={thing.item.unlisted}
        />
        <input name="levels" value={JSON.stringify(levelsToCreate)} hidden />
        <input name="order" value={JSON.stringify(order)} hidden />
        <div class="mt-auto">
            <Button
                text="Save Updates"
                bg="#7777ff"
                disabled={manipulator.isEmpty()}
                data-umami-event={`edit-${thing.type}`}
            />
        </div>
    </form>
    <section class="flex grow flex-col items-start gap-5 rounded-r-xl bg-zinc-900 p-4 shadow-lg">
        {#if thing.type === "levelpack"}
            <Dropzone
                accept="text/plain"
                multiple={false}
                maxSize={1000000}
                required={true}
                disableDefaultStyles={true}
                disabled={!loggedIn}
                containerClasses="w-full h-full p-10 bg-zinc-900 flex flex-col items-center rounded-sm transition-colors outline-emerald-400/10 outline-4 outline-dashed hover:outline-emerald-400 cursor-pointer"
                on:drop={onUpload}
            >
                <div class="m-auto text-2xl">
                    <p class="font-bold">
                        Drag and drop your file here, or click to select a file!
                    </p>
                    <p class="text-center text-lg">Levelpacks cannot have more than 200 levels</p>
                </div>
            </Dropzone>
            {#if !manipulator.isEmpty()}
                <section class="flex gap-2">
                    <div class="w-6 rounded-lg bg-green-500"></div>
                    <span>= From an uploaded file</span>
                    <div class="w-6 rounded-lg bg-amber-500"></div>
                    <span>= Warning</span>
                    <div class="w-6 rounded-lg bg-red-500"></div>
                    <span>= Error</span>
                </section>
                <div class="w-full">
                    {#if manipulator.mod}
                        <p class="p-5 text-center">Levelpacks for mods cannot yet be updated.</p>
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
            <!-- {:else if thing.type === "level"}
            <Dropzone
                accept="text/plain"
                multiple={false}
                multiple={false}
                maxSize={1000000}
                required={true}
                disableDefaultStyles={true}
                disabled={!loggedIn}
                containerClasses="w-full h-full p-10 bg-zinc-900 flex flex-col items-center rounded-sm transition-colors outline-emerald-400/10 outline-4 outline-dashed hover:outline-emerald-400 cursor-pointer"
                on:drop={onUpload}
            >
                <div class="m-auto text-2xl">
                    <p class="font-bold">
                        Drag and drop your file here, or click to select a file!
                    </p>
                    <p class="text-center text-lg">This will replace your current level data.</p>
                </div>
            </Dropzone>--->
        {/if}
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
