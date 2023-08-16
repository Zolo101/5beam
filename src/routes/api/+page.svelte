<script lang="ts">
    import APIEndpoint from "../../components/api/APIEndpoint.svelte";
    import Table from "../../components/layout/Table.svelte";
    import APIReference from "../../components/api/APIReference.svelte";
    // const ratelimits = [
    //     ["GET", 1000, 10],
    //     ["POST", 5, 1],
    // ]

    enum ParamType {
        STRING = "STRING",
        INTEGER = "INTEGER",
        BOOLEAN = "BOOLEAN"
    }
</script>

<svelte:head>
    <style>
        td {
            font-size: 1rem;
            font-family: monospace;
        }
    </style>
</svelte:head>

<div class="flex flex-col items-center">
    <APIEndpoint endpoint={["5beam 2023 summer update"]} type="INFO">
        <p class="text-xl text-center">There has been some major changes:</p>
        <br>
        <div class="flex flex-col gap-5">
<!--            <p>-->
<!--                - <APIReference type={"STRUCT"} reference={"Level"}/> now has a "creator" property of <APIReference type={"STRUCT"} reference={"User"}/>.-->
<!--            </p>-->
            <p class="text-center">
                <APIReference type={"GLOBAL"} reference={"Everything"}/>
            </p>
            <ul>
                <li>The <code>amount</code> parameter has been removed from all endpoints</li>
            </ul>

            <p class="text-center">
                <APIReference type={"STRUCT"} reference={"Level"}/>
            </p>
            <ul>
                <li><code>createdAt</code> is now <code>created</code></li>
                <li><code>plays</code> is now <code>views</code></li>
                <li><code>updated</code> has been added (although users cannot edit levels yet)</li>
                <li><code>creatorId</code> has been removed</li>
                <li><code>levelpackId</code> has been removed</li>
                <li><code>levelpackPart</code> has been removed</li>
            </ul>

            <p class="text-center">
                <APIReference type={"STRUCT"} reference={"Levelpack"}/>
            </p>
            <ul>
                <li>The maximum amount of levels in a levelpack is 100</li>
                <li><code>views</code> has been added</li>
                <li><code>stars</code> has been added</li>
                <li><code>updated</code> has been added (although users cannot edit levelpacks yet)</li>
                <li>By default, <code>levels</code> will now have a list of level ID's. But you can use the <code>levels</code> parameter to change it back to how it was before.</li>
                <li><code>creatorId</code> has been removed</li>
                <li><code>createdAt</code> is now <code>created</code></li>
            </ul>

            <p class="text-center">
                <APIReference type={"STRUCT"} reference={"User"}/>
            </p>
            <ul>
                <li><code>createdAt</code> is now <code>created</code></li>
                <li><code>name</code> is now <code>username</code></li>
                <li><code>updated</code> has been added</li>
                <li><code>levelpacks</code> has been added. It's an array of levelpacks ID's the user has made.</li>
                <li><code>levels</code> has been added. It's an array of level ID's the user has made.</li>
                <li><code>stars</code> has been added. It's an array of level ID's the user has starred. (although for now this feature is WIP)</li>
            </ul>

            <p class="text-center">
                <APIReference type={"GET"} reference={["api", "page"]}/>
            </p>
            <ul>
                <li>Type and sort codes have changed.</li>
                <li>New <code>featured</code> property.</li>
            </ul>

            <p class="text-center">
                <APIReference type={"GET"} reference={["api", "user", "page"]}/>
            </p>
            <ul>
                <li>Type and sort codes have changed.</li>
                <li>New <code>featured</code> property.</li>
            </ul>

            <p class="text-center">
                <APIReference type={"GET"} reference={["api", "search"]}/>
            </p>
            <ul>
                <li>Search results may be different because of the move to another database.</li>
            </ul>

            <p class="text-center">
                <APIReference type={"GET"} reference={["api", "auth", "discord"]}/>
            </p>
            <ul>
                <li>No changes, but it's now in the API docs</li>
            </ul>

            <p class="text-center">
                <APIReference type={"GET"} reference={["api", "auth", "refresh"]}/>
            </p>
            <ul>
                <li>New!</li>
            </ul>
        </div>
    </APIEndpoint>
<!--    <div class="ratelimit-container">-->
<!--        {#each ratelimits as ratelimit}-->
<!--            <p class="ratelimit"><span class="endpoint-type-{ratelimit[0]}">{ratelimit[0]}</span> {ratelimit[1]} requests per {ratelimit[2]} minutes</p>-->
<!--        {/each}-->
<!--    </div>-->
    <APIEndpoint
            endpoint={["Level"]}
            type="STRUCT"
            code={`
{
  "created": "2023-08-02 20:00:29.848Z",
  "creator": {
    "created": "2023-08-02 19:58:58.849Z",
    "discordId": "1032069168419319849",
    "id": "bo4wdr6syac901u",
    "levels": [
      "h2o60d2dqklmwdz"
    ],
    "stars": [],
    "updated": "2023-08-02 20:00:29.916Z",
    "username": "orangemario2009"
  },
  "data": "(levels.txt)",
  "description": "\\"I want revenge!\\"",
  "difficulty": 0,
  "featured": false,
  "id": "h2o60d2dqklmwdz",
  "title": "Ice Cube's Revenge!",
  "updated": "2023-08-02 20:00:29.848Z",
  "views": 0
}
            `}
    />

    <APIEndpoint
            endpoint={["Levelpack"]}
            type="STRUCT"
            code={`
{
  "created": "2023-08-03 19:19:00.152Z",
  "creator": {
    "created": "2023-08-02 19:58:48.051Z",
    "discordId": "189004032600309760",
    "id": "3hfbpvnkpywte1k",
    "levelpacks": [
      "98doig139d2su27"
    ],
    "levels": [
      "mo4ze2nvbkvtsay",
      "8pjwict2l5b0v59",
      "4ljvua2t3n9zqvl"
    ],
    "stars": [],
    "updated": "2023-08-04 00:09:38.473Z",
    "username": "Zinc_Battery"
  },
  "description": "that i found in the database",
  "featured": false,
  "id": "98doig139d2su27",
  "levels": [
    "h2o60d2dqklmwdz",
    "7xh421meonyk67m",
    "52mlfgyz3w7szx4",
    "3i0pci3vqcy4t6z",
    "iu59zjjufi13487",
    "a28ei1gdvw2xtlw",
    "2bg7b6tbvdp2lub",
    "07g36jbp9j30s2w",
    "d6w28252kp0mpcy",
    "36mqgcgv30w2jb3",
    "b8daes3u6xoew8l",
    "n41zswfvn909cgb",
    "6mms3g04oy6ijqk",
    "i9scxz43qe96o4v",
    "ertlv22sxa75v23"
  ],
  "stars": 0,
  "title": "random levels",
  "updated": "2023-08-03 19:19:00.152Z",
  "views": 0
}
            `}
    />

    <APIEndpoint
            endpoint={["User"]}
            type="STRUCT"
            code={`
{
  "created": "2023-08-02 19:58:58.929Z",
  "discordId": "1128443643221508187",
  "id": "buve7iifzkz8kzz",
  "levels": [
    "oayu8nm22wg3qyj",
    "986ycm3dw75g00t"
  ],
  "stars": [],
  "updated": "2023-08-02 20:00:30.089Z",
  "username": "ue"
}
            `}
    >
        <p>There is a parameter in most endpoints that let you expand the levels property to actually include the levels.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "level"]}
            params={[
                ["id", "Level ID", ParamType.INTEGER],
            ]}
    >
                <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a <APIReference type={"STRUCT"} reference={"Level"}/>.</p>
    </APIEndpoint>

<!--    <APIEndpoint-->
<!--            endpoint={["api", "level", "vote"]}-->
<!--            params={[-->
<!--                ["id", "Level ID", ParamType.INTEGER],-->
<!--                ["difficulty", "1 - 7 (easiest to hardest)", ParamType.INTEGER],-->
<!--            ]}-->
<!--            wip-->
<!--            token_required-->
<!--    >-->
<!--        <p>Lets a user give a difficulty for a level. This will be used to calculate the final difficulty of the level.</p>-->
<!--    </APIEndpoint>-->

<!--    <APIEndpoint-->
<!--            endpoint={["api", "level", "star"]}-->
<!--            params={[-->
<!--                ["id", "Level ID", ParamType.INTEGER],-->
<!--                ["bool", "Star(1) or Un-star(0)", ParamType.BOOLEAN],-->
<!--            ]}-->
<!--            wip-->
<!--            token_required-->
<!--    >-->
<!--        <p>Stars a level.</p>-->
<!--    </APIEndpoint>-->

    <APIEndpoint
            endpoint={["api", "levelpack"]}
            params={[
                ["id", "Levelpack ID", ParamType.INTEGER],
                ["levels", "Include Levels", ParamType.INTEGER, 0],
            ]}
    >
        <p>Level codes:</p>
        <Table title="Level Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Return Level ID's"],
            ["1", "Return STRUCT Levels (can be slow)"],
        ]}/>
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a <APIReference type={"STRUCT"} reference={"Levelpack"}/></p>
    </APIEndpoint>

<!--    <APIEndpoint-->
<!--            endpoint={["api", "levelpack", "star"]}-->
<!--            params={[-->
<!--                ["id", "Levelpack ID", ParamType.INTEGER],-->
<!--                ["bool", "Star(1) or Un-star(0)", ParamType.BOOLEAN],-->
<!--            ]}-->
<!--            wip-->
<!--            token_required-->
<!--    >-->
<!--        <p>Stars a levelpack.</p>-->
<!--    </APIEndpoint>-->


    <APIEndpoint
            endpoint={["api", "user"]}
            params={[
                ["id", "User ID", ParamType.INTEGER],
                ["discordId", "User's Discord ID", ParamType.STRING],
            ]}
    >
        <p>Returns a <APIReference type={"STRUCT"} reference={"User"}/>.</p>
        <p>You can use either "id" or "discordId", but if you use both, only "id" will be used.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "page"]}
            params={[
                ["page", "Page number", ParamType.INTEGER],
                ["type", "Type of", ParamType.INTEGER, 0],
                ["sort", "Sort by", ParamType.INTEGER, 0],
                ["featured", "Only featured levels / levelpacks", ParamType.BOOLEAN, false],
            ]}
    >
                <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"}/>.</p>
        <p>Type codes:</p>
        <Table title="Type Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Levels"],
            ["1", "Levelpacks"],
        ]}/>
        <p>Sort codes:</p>
        <Table title="Sort Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Age (newest)"],
            ["1", "Age (oldest)"],
            ["2", "Views (descending)"],
        ]}/>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "search"]}
            params={[
                ["text", "Search text", ParamType.STRING],
                ["page", "Page number", ParamType.INTEGER],
            ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"}/> who's title contains the search text. Levelpacks are not supported in search yet.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "user", "page"]}
            params={[
                ["id", "User ID", ParamType.INTEGER],
                ["page", "Page number", ParamType.INTEGER],
                ["type", "Type of", ParamType.INTEGER, 0],
                ["sort", "Sort by", ParamType.INTEGER, 0],
            ]}
    >
                <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"}/> created by the user.</p>
        <p>Type codes:</p>
        <Table title="Type Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Levels"],
            ["1", "Levelpacks"],
        ]}/>
        <p>Sort codes:</p>
        <Table title="Filter Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Age (newest)"],
            ["1", "Age (oldest)"],
            ["2", "Views (descending)"],
        ]}/>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "create", "level"]}
            type="POST"
            game_only
            token_required
    >
        <p>Create a <APIReference type={"STRUCT"} reference={"Level"}/>. Make sure access_token is valid before posting! You will need to give 5beam the following using a FormData object:</p>
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["access_token", "User's discord access token.", ParamType.STRING],
                ["title", "Level title", ParamType.STRING],
                ["description", "Level description", ParamType.STRING],
                ["data", "Level file", "File"],
            ]}>
        </Table>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "create", "levelpack"]}
            type="POST"
            game_only
            token_required
    >
        <p>Create a <APIReference type={"STRUCT"} reference={"Levelpack"}/>. Make sure access_token is valid before posting! You will need to give 5beam the following using a FormData object:</p>
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["access_token", "User's discord access token.", ParamType.STRING],
                ["title", "Levelpack title", ParamType.STRING],
                ["description", "Levelpack description", ParamType.STRING],
                ["data", "Levelpack file", "File"],
            ]}>
        </Table>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "auth", "discord"]}
            type="GET"
            game_only
    >
        <p>Endpoint for logging into 5beam discord oauth, returns an access & refresh token.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "auth", "refresh"]}
            type="GET"
            game_only
    >
        <p>Gives you a new access_token. If this returns 400, it means your refresh_token is bad and you'll have to login again.</p>
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["refresh_token", "User's discord refresh token.", ParamType.STRING],
            ]}>
        </Table>
    </APIEndpoint>
</div>

<style>
    code {
        @apply bg-neutral-700 rounded p-1 mx-0.5;
    }

    ul {
        @apply flex flex-col gap-2 list-disc;
    }
</style>