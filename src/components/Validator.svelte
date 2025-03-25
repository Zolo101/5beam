<script lang="ts">
    import { fly } from "svelte/transition";
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type { DetectedLevel, ValidateResult } from "../client/FileValidator";
    import Log from "./Log.svelte";
    import { to5bLevelFormat } from "../misc";
    import Table from "./layout/Table.svelte";
    // import { difficultyMap } from "../misc";
    import Difficulty from "./Difficulty.svelte";
    // import SpriteViewer from "./viewer/SpriteViewer.svelte";

    // let dialog = document.querySelector<HTMLDivElement>("#levelDetails")
    export let result: ValidateResult | undefined;
    let selectedLevel: DetectedLevel | undefined;
    let selectableDifficulties = [0, 1, 2, 3, 4, 5, 6];
    $: levelDifficulties = new Array(result?.levels.length).fill(0);
    $: selectedDifficulties = new Array(result?.levels.length).fill(false);

    $: tableSprites = selectedLevel?.sprites.map((s) =>
        Object.values(s).filter((v) => v !== undefined)
    );

    $: tableDialogues = selectedLevel?.dialogues.map((d) => Object.values(d));

    // TODO: Find a better way to get the log level of a validation
    $: warningLog = selectedLevel?.logs.find((l) => l.level === "warning") !== undefined;
    $: errorLog = selectedLevel?.logs.find((l) => l.level === "error") !== undefined;
    const stickDetails = () => {
        try {
            document.querySelector<HTMLDivElement>("#levelDetails").style.top =
                `${window.scrollY}px`;
        } catch {}
    };

    const selectLevel = (level: DetectedLevel) => {
        selectedLevel = level;
        stickDetails();
    };

    // window.addEventListener("scroll", stickDetails)
</script>

<div class="flex flex-wrap justify-center gap-3">
    {#if result}
        {#each result.globalLogs as log}
            <Log {log} />
        {/each}
        {#each result.levels as level, i}
            <section>
                <div in:fly={{ y: 200, duration: 100 * i }} on:click={() => selectLevel(level)}>
                    <ValidatedLevel {level} {i} />
                </div>
                <!--                <div on:click={() => selectedDifficulties[i] = !selectedDifficulties[i]} class="relative w-[35px] h-[0px] left-[90px] bottom-[40px] hover:bg-white/20 rounded-sm cursor-pointer transition hover:scale-110">-->
                <!--                    <Difficulty difficulty={levelDifficulties[i]}/>-->
                <!--                </div>-->
            </section>
            <!--{#if !selectedDifficulties[i]}-->
            {#if false}
                <div class="flex w-full rounded-[10px] bg-black/50 shadow-2xl">
                    <div class="m-auto p-2 text-center">
                        <span class="rounded-sm bg-red-600 p-1 text-xl font-black">BETA</span>
                        <span class="text-center text-xl font-bold"
                            >Select a difficulty for
                        </span><span class="text-xl">{to5bLevelFormat(i + 1)}</span>
                        <p>
                            Check out this page if your unsure on what difficulty your level should
                            be!
                        </p>
                    </div>
                    <div class="inline-grid w-3/4 grid-cols-3 justify-items-center p-5">
                        {#each [0, 1, 2, 3, 4, 5, 6] as j}
                            <div
                                class="cursor-pointer rounded-sm p-1 transition hover:scale-110 hover:bg-white/20"
                                on:click={() => (levelDifficulties[i] = j)}
                            >
                                <Difficulty difficulty={j} />
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
</div>
