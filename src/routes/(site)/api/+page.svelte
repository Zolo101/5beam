<script lang="ts">
    import APIEndpoint from "$lib/components/api/APIEndpoint.svelte";
    import Table from "$lib/components/layout/Table.svelte";
    import APIReference from "$lib/components/api/APIReference.svelte";
    import type { PageData } from "./$types";
    const ParamType = {
        STRING: "STRING",
        INTEGER: "INTEGER",
        BOOLEAN: "BOOLEAN",
        ARRAY: "ARRAY"
    };

    const { data }: { data: PageData } = $props();
    const { level, levelpack, user } = $derived(data);
</script>

<svelte:head>
    <title>API Reference - 5beam</title>
    <meta
        name="description"
        content="5beam API reference documentation for levels, levelpacks, users, and authentication."
    />
    <meta property="og:title" content="API Reference - 5beam" />
    <meta
        property="og:description"
        content="5beam API reference documentation for levels, levelpacks, users, and authentication."
    />
</svelte:head>

{#snippet auth()}
    <p>
        To authenticate, include your <APIReference type={"TOKEN"} reference={"5beam_auth"} />
        in the "Authorization" header of your request. Example: "Authorization: Bearer (TOKEN HERE)".
    </p>
{/snippet}

{#snippet type()}
    <p>Type codes:</p>
    <Table
        title="Type Codes"
        heads={["Code", "Meaning"]}
        content={[
            ["0", "Levels"],
            ["1", "Levelpacks"]
        ]}
    />
{/snippet}

{#snippet sort()}
    <p>Sort codes:</p>
    <Table
        title="Filter Codes"
        heads={["Code", "Meaning"]}
        content={[
            ["0", "Age (newest)"],
            ["1", "Age (oldest)"],
            ["2", "Plays (descending)"],
            ["3", "Stars (descending)"]
        ]}
    />
{/snippet}

{#snippet area()}
    <p>Area codes:</p>
    <Table
        title="Area Codes"
        heads={["Code", "Meaning"]}
        content={[
            ["0", "Any"],
            ["1", "<=576 (18 * 32)"],
            ["2", ">=576 to <=1024"],
            ["3", ">=1024"]
        ]}
    />
{/snippet}

{#snippet characters()}
    <p>Character codes:</p>
    <Table
        title="Character Codes"
        heads={["Code", "Meaning"]}
        content={[
            ["Book"],
            ["Bubble"],
            ["Ice Cube"],
            ["Lego Brick"],
            ["Match"],
            ["Pencil"],
            ["Ruby"],
            ["Tune"],
            ["Waffle"]
        ]}
    />
{/snippet}

<div class="mx-auto mb-10 flex flex-col gap-2">
    <APIEndpoint open endpoint={["Stars Update"]} type="WARNING">
        <p>
            The stars update has completely overhauled the 5beam API works, so there is a chance
            that some of the endpoints here are missing information or are outdated. If you're
            trying to do something and the documentation here isn't clear, PLEASE don't persevere,
            contact me on <APIReference type={"DISCORD"} reference={["zelo101"]} /> or alternatively my
            <APIReference type={"ZELO.DEV"} reference={["/qa"]} /> page so I can fix it ASAP.
        </p>
    </APIEndpoint>

    <APIEndpoint open endpoint={["CORS"]} type="WARNING">
        <p>
            To prevent abuse, endpoints that require authentication only work for allowed domains.
            If you want to use these endpoints for a site, please contact Contact <APIReference
                type={"DISCORD"}
                reference={["zelo101"]}
            /> with your domain.
        </p>
    </APIEndpoint>

    <APIEndpoint open endpoint={["Supported Mods"]} type="INFO">
        <div class="text-3xl">
            <ul>
                <li>Mawilite's "5*30"</li>
                <li>The Golden Guard's "Golden 5"</li>
            </ul>
        </div>
        <br />
        <p>
            While these mods are supported, they are currently missing some features such as
            advanced search and validation when uploading.
        </p>
        <br />
        <p>
            Contact <APIReference type={"DISCORD"} reference={["zelo101"]} /> if you'd like to have your
            5b mod supported!
        </p>
    </APIEndpoint>
    <!--    <div class="ratelimit-container">-->
    <!--        {#each ratelimits as ratelimit}-->
    <!--            <p class="ratelimit"><span class="endpoint-type-{ratelimit[0]}">{ratelimit[0]}</span> {ratelimit[1]} requests per {ratelimit[2]} minutes</p>-->
    <!--        {/each}-->
    <!--    </div>-->
    <APIEndpoint endpoint={["Level"]} type="STRUCT" code={JSON.stringify(level, null, 2)} />
    <APIEndpoint endpoint={["Levelpack"]} type="STRUCT" code={JSON.stringify(levelpack, null, 2)} />
    <APIEndpoint endpoint={["User"]} type="STRUCT" code={JSON.stringify(user, null, 2)} />

    <APIEndpoint endpoint={["api", "level"]} params={[["id", "Level ID", ParamType.INTEGER]]}>
        <p>Returns a <APIReference type={"STRUCT"} reference={"Level"} />.</p>
        <p>
            Also returns <APIReference type={"PROP"} reference={"starred"} /> if you are logged in.
        </p>
        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint
        type="POST"
        endpoint={["api", "level", "star"]}
        params={[["id", "Level ID", ParamType.INTEGER]]}
        token_required
    >
        <p>Stars or unstars a level.</p>
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "levelpack"]}
        params={[
            ["id", "Levelpack ID", ParamType.INTEGER],
            ["levels", "Include Levels", ParamType.INTEGER, 0]
        ]}
    >
        <p>Level codes:</p>
        <Table
            title="Level Codes"
            heads={["Code", "Meaning"]}
            content={[
                ["0", "Return Level ID's"],
                ["1", "Return STRUCT Levels (can be slow)"]
            ]}
        />
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a <APIReference type={"STRUCT"} reference={"Levelpack"} /></p>
        <p>
            Also returns <APIReference type={"PROP"} reference={"starred"} /> if you are logged in.
        </p>
        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint
        type="POST"
        endpoint={["api", "levelpack", "star"]}
        params={[["id", "Levelpack ID", ParamType.INTEGER]]}
        token_required
    >
        <p>Stars or unstars a levelpack.</p>
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "user"]} params={[["id", "User ID", ParamType.STRING]]}>
        <p>Returns a <APIReference type={"STRUCT"} reference={"User"} />.</p>
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "user", "page"]}
        params={[
            ["id", "User ID", ParamType.INTEGER],
            ["page", "Page number", ParamType.INTEGER],
            ["type", "Type of", ParamType.INTEGER, 0],
            ["sort", "Sort by", ParamType.INTEGER, 0],
            [
                "mod",
                "Only show levels / levelpacks that are for a specific 5b mod",
                ParamType.STRING
            ]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>
            Returns a list of <APIReference type={"STRUCT"} reference={"Level"} /> created by the user.
        </p>
        {@render type()}
        {@render sort()}
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "user", "stars"]}
        params={[
            ["id", "User ID", ParamType.INTEGER],
            ["type", "Type of", ParamType.INTEGER, 0]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>
            Returns the full list of <APIReference type={"STRUCT"} reference={"Level"} /> starred by the
            user.
        </p>
        {@render type()}
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "user", "stars", "page"]}
        params={[
            ["id", "User ID", ParamType.INTEGER],
            ["page", "Page number", ParamType.INTEGER],
            ["type", "Type of", ParamType.INTEGER, 0],
            ["sort", "Sort by", ParamType.INTEGER, 0],
            [
                "mod",
                "Only show levels / levelpacks that are for a specific 5b mod",
                ParamType.STRING
            ]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>
            Returns a page of <APIReference type={"STRUCT"} reference={"Level"} /> starred by the user.
        </p>
        {@render type()}
        {@render sort()}
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "profile"]} token_required>
        <p>Returns your <APIReference type={"STRUCT"} reference={"User"} />.</p>
        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "page"]}
        params={[
            ["page", "Page number", ParamType.INTEGER],
            ["type", "Type of", ParamType.INTEGER, 0],
            ["sort", "Sort by", ParamType.INTEGER, 0],
            ["featured", "Only featured levels / levelpacks", ParamType.BOOLEAN, false],
            [
                "mod",
                "Only show levels / levelpacks that are for a specific 5b mod",
                ParamType.STRING
            ]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"} />.</p>
        {@render type()}
        {@render sort()}
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "page", "random"]}
        params={[
            ["page", "Page number", ParamType.INTEGER],
            ["type", "Type of", ParamType.INTEGER, 0],
            ["sort", "Sort by", ParamType.INTEGER, 0],
            ["featured", "Only featured levels / levelpacks", ParamType.BOOLEAN, false],
            [
                "mod",
                "Only show levels / levelpacks that are for a specific 5b mod",
                ParamType.STRING
            ]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"} />.</p>
        {@render type()}
        {@render sort()}
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "page", "trending"]}
        params={[
            ["page", "Page number", ParamType.INTEGER],
            ["type", "Type of", ParamType.INTEGER, 0],
            ["sort", "Sort by", ParamType.INTEGER, 0],
            ["featured", "Only featured levels / levelpacks", ParamType.BOOLEAN, false],
            [
                "mod",
                "Only show levels / levelpacks that are for a specific 5b mod",
                ParamType.STRING
            ]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"} />.</p>
        {@render type()}
        {@render sort()}
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "daily"]} type="GET">
        <p>
            Returns the daily <APIReference type={"STRUCT"} reference={"Level"} />.
        </p>
    </APIEndpoint>

    <!-- <APIEndpoint endpoint={["api", "weekly"]} type="GET">
        <p>
            Returns the weekly <APIReference type={"STRUCT"} reference={"Levelpack"} /> challenge.
        </p>
    </APIEndpoint> -->

    <APIEndpoint
        endpoint={["api", "search"]}
        params={[
            ["text", "Search text", ParamType.STRING],
            ["type", "Type of", ParamType.INTEGER, 0],
            ["page", "Page number", ParamType.INTEGER],
            ["sort", "Sort by", ParamType.INTEGER, 0],
            ["featured", "Only featured levels / levelpacks", ParamType.BOOLEAN, false],
            [
                "area",
                "(Levels only) Filter levels based on size (width * height)",
                ParamType.INTEGER,
                0
            ],
            [
                "characters",
                "(Levels only) Filter levels based on characters present",
                ParamType.ARRAY
            ],
            ["mod", "Only show levels that are for a specific 5b mod", ParamType.STRING]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>
            Returns a list of <APIReference type={"STRUCT"} reference={"Level"} /> who's title contains
            the search text. Levelpacks are not supported in search yet.
        </p>
        {@render type()}
        {@render sort()}
        {@render area()}
        {@render characters()}
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "create", "level"]} type="POST" token_required>
        <p>
            Create a <APIReference type={"STRUCT"} reference={"Level"} />. You will need to give
            5beam the following using a FormData object:
        </p>
        <Table
            heads={["Property", "Meaning", "Type"]}
            content={[
                ["title", "Level title", ParamType.STRING],
                ["description", "Level description", ParamType.STRING],
                ["difficulty", "Level difficulty (0 - 7)", ParamType.INTEGER],
                ["data", "Level file", "File"],
                [
                    "modded",
                    "What mod this level is for (Leave blank for HTML5b / Flash 5b)",
                    ParamType.STRING
                ]
            ]}
        ></Table>
        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "create", "levelpack"]} type="POST" token_required>
        <p>
            Create a <APIReference type={"STRUCT"} reference={"Levelpack"} />. You will need to give
            5beam the following using a FormData object:
        </p>
        <Table
            heads={["Property", "Meaning", "Type"]}
            content={[
                ["title", "Levelpack title", ParamType.STRING],
                ["description", "Levelpack description", ParamType.STRING],
                ["difficulty", "Levelpack difficulty (0 - 7)", "Array of INTEGERS"],
                ["data", "Levelpack file", "File"],
                [
                    "modded",
                    "What mod this levelpack is for (Leave blank for HTML5b / Flash 5b)",
                    ParamType.STRING
                ]
            ]}
        ></Table>

        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "modify", "level"]} type="POST" token_required>
        <p>
            Create a <APIReference type={"STRUCT"} reference={"Level"} />. You will need to give
            5beam the following using a FormData object:
        </p>
        <Table
            heads={["Property", "Meaning", "Type"]}
            content={[
                ["title", "Level title", ParamType.STRING],
                ["description", "Level description", ParamType.STRING],
                ["difficulty", "Level difficulty (0 - 7)", ParamType.INTEGER],
                ["data", "Level file", "File"],
                [
                    "modded",
                    "What mod this level is for (Leave blank for HTML5b / Flash 5b)",
                    ParamType.STRING
                ]
            ]}
        ></Table>
        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "modify", "levelpack"]} type="POST" token_required>
        <p>
            Create a <APIReference type={"STRUCT"} reference={"Levelpack"} />. You will need to give
            5beam the following using a FormData object:
        </p>
        <Table
            heads={["Property", "Meaning", "Type"]}
            content={[
                ["title", "Levelpack title", ParamType.STRING],
                ["description", "Levelpack description", ParamType.STRING],
                ["difficulty", "Levelpack difficulty (0 - 7)", "Array of INTEGERS"],
                ["data", "Levelpack file", "File"],
                [
                    "modded",
                    "What mod this levelpack is for (Leave blank for HTML5b / Flash 5b)",
                    ParamType.STRING
                ]
            ]}
        ></Table>

        <br />
        {@render auth()}
    </APIEndpoint>

    <APIEndpoint
        endpoint={["api", "login", "oauth"]}
        params={[["redirectURI", "Redirect URI", ParamType.STRING]]}
    >
        <p>
            Public endpoint for logging into 5beam discord OAuth, returns an <APIReference
                type={"TOKEN"}
                reference={"5beam_auth"}
            /> on successful login.
        </p>
    </APIEndpoint>

    <!-- <APIEndpoint endpoint={["api", "auth", "refresh"]} type="POST" game_only token_required>
        <p>
            Gives you a new access_token. If this returns 400, it means your refresh_token is bad
            and you'll have to login again.
        </p>
        <Table
            heads={["Property", "Meaning", "Type"]}
            content={[["refresh_token", "User's discord refresh token.", ParamType.STRING]]}
        ></Table>
    </APIEndpoint> -->
</div>
