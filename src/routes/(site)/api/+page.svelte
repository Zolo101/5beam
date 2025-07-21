<script lang="ts">
    import APIEndpoint from "$lib/components/api/APIEndpoint.svelte";
    import Table from "$lib/components/layout/Table.svelte";
    import APIReference from "$lib/components/api/APIReference.svelte";
    const ParamType = {
        STRING: "STRING",
        INTEGER: "INTEGER",
        BOOLEAN: "BOOLEAN"
    };
</script>

<svelte:head>
    <style>
        td {
            font-size: 1rem;
            font-family: monospace;
        }
    </style>
</svelte:head>

<div class="mx-auto flex w-4/5 flex-col gap-5">
    <APIEndpoint endpoint={["Supported Mods"]} type="INFO">
        <div class="text-3xl">
            <ul>
                <li>Mawilite's "5*30"</li>
                <li>The Golden Guard's "Golden 5"</li>
            </ul>
        </div>
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
    <APIEndpoint
        endpoint={["Level"]}
        type="STRUCT"
        code={`
{
  "created": "2023-11-23 18:31:45.013Z",
  "creator": {
    "created": "2022-07-08 01:10:53.329Z",
    "discordId": "189004032600309760",
    "id": "m44nvxs3tjoqor0",
    "levelpacks": [],
    "levels": [
      "1fck6fch07q3m0i",
      "lhdwlewjfdvzlhn",
      "kj6wocd60vau9tr",
      "40wv5qcjy4atsfy",
      "bmvssr912h6w4if",
      "wg3deog6vh02lm6",
      "2v67vvttg13tdkz"
    ],
    "stars": [],
    "updated": "2025-05-31 00:14:11.512Z",
    "username": "zelo.dev"
  },
  "data": "no chill\r\n32,18,04,02,L\r\n_qqqqqqqqqq_qqqqqqqqqqqqqqqqqqq_\r\nqffffffffffqf=zzzzzzzzzz=@@=zz=q\r\nqf........<qfC.................q\r\nqf........yqfC......m..........q\r\nqf........yqfC.......Q....p....q\r\nq.........yqfC...........|xqq..q\r\n..........yqfC...........qqAA..q\r\n..........yqfC..¥........qq....q\r\n.p....B...yqfC..=====....qq....q\r\nEE...DqC..yxq_.£.........qq....q\r\nGI....A...yq........=....Eq....q\r\nF.........AA........n....Fq...Bq\r\nF..................¡....hFq...qq\r\nF.......................£qq.....\r\nF.......................|qq.....\r\nI.......>..Q............|qq.....\r\n¹¹¹¹¹¹¹¹¹¹¹;............|qq=\`..4\r\n¸¸¸¸¸¸¸¸¸¸¸=............|xqqqqqq\r\n02,01.00,09.00,10\r\n45,06.50,10.00,05\r\n37,19.50,12.00,06\r\n41,21.00,03.00,06\r\n00\r\n000000",
  "description": "one must imagine ice cube happy",
  "difficulty": 6,
  "featured": true,
  "id": "bmvssr912h6w4if",
  "modded": "",
  "plays": 1713,
  "thumbnail": "blob_raB0sFKfDn.png",
  "title": "no chill",
  "unlisted": false,
  "updated": "2025-07-15 06:54:10.540Z"
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
  "plays": 0
}
            `}
    />

    <APIEndpoint
        endpoint={["User"]}
        type="STRUCT"
        code={`
{
  "avatar": "https://cdn.discordapp.com/avatars/189004032600309760/7112b5c2b8c31cad5fc6988b80a85eb9.png",
  "created": "2025-07-14 03:46:47.025Z",
  "id": "3i99jv0tw8t7awf",
  "stars": [],
  "username": "zelo.dev"
}
            `}
    />

    <APIEndpoint endpoint={["api", "level"]} params={[["id", "Level ID", ParamType.INTEGER]]}>
        <p>Returns a <APIReference type={"STRUCT"} reference={"Level"} />.</p>
    </APIEndpoint>

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
        <p>Type codes:</p>
        <Table
            title="Type Codes"
            heads={["Code", "Meaning"]}
            content={[
                ["0", "Levels"],
                ["1", "Levelpacks"]
            ]}
        />
        <p>Sort codes:</p>
        <Table
            title="Filter Codes"
            heads={["Code", "Meaning"]}
            content={[
                ["0", "Age (newest)"],
                ["1", "Age (oldest)"],
                ["2", "Plays (descending)"]
            ]}
        />
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "profile"]}>
        <p>Returns your <APIReference type={"STRUCT"} reference={"User"} />.</p>
        <br />
        <p>
            To authenticate, include your <APIReference type={"TOKEN"} reference={"5beam_auth"} />
            in the "Authorization" header of your request. Example: "Authorization: Bearer (TOKEN HERE)".
        </p>
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
        <p>Type codes:</p>
        <Table
            title="Type Codes"
            heads={["Code", "Meaning"]}
            content={[
                ["0", "Levels"],
                ["1", "Levelpacks"]
            ]}
        />
        <p>Sort codes:</p>
        <Table
            title="Sort Codes"
            heads={["Code", "Meaning"]}
            content={[
                ["0", "Age (newest)"],
                ["1", "Age (oldest)"],
                ["2", "Plays (descending)"]
            ]}
        />
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
            ["page", "Page number", ParamType.INTEGER],
            ["mod", "Only show levels that are for a specific 5b mod", ParamType.STRING]
        ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>
            Returns a list of <APIReference type={"STRUCT"} reference={"Level"} /> who's title contains
            the search text. Levelpacks are not supported in search yet.
        </p>
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "create", "level"]} type="POST">
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
        <p>
            To authenticate, include your <APIReference type={"TOKEN"} reference={"5beam_auth"} />
            in the "Authorization" header of your request. Example: "Authorization: Bearer (TOKEN HERE)".
        </p>
    </APIEndpoint>

    <APIEndpoint endpoint={["api", "create", "levelpack"]} type="POST">
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
        <p>
            To authenticate, include your <APIReference type={"TOKEN"} reference={"5beam_auth"} />
            in the "Authorization" header of your request. Example: "Authorization: Bearer (TOKEN HERE)".
        </p>
    </APIEndpoint>

    <!-- <APIEndpoint endpoint={["Supported Mods"]} type="INFO">
        <div class="text-3xl">
            <ul>
                <li>Mawilite's "5*30"</li>
                <li>The Golden Guard's "Golden 5"</li>
            </ul>
        </div>
        <p>
            Contact <APIReference type={"DISCORD"} reference={["zelo101"]} /> if you'd like to have your
            5b mod supported!
        </p>
    </APIEndpoint> -->

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
