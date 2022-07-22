<script lang="ts">
    import APIEndpoint from "../../components/api/APIEndpoint.svelte";
    import Table from "../../components/Table.svelte";
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

<div class="APIs">
<!--    <div class="ratelimit-container">-->
<!--        {#each ratelimits as ratelimit}-->
<!--            <p class="ratelimit"><span class="endpoint-type-{ratelimit[0]}">{ratelimit[0]}</span> {ratelimit[1]} requests per {ratelimit[2]} minutes</p>-->
<!--        {/each}-->
<!--    </div>-->
    <APIEndpoint
            endpoint={["Level"]}
            type="STRUCT"
    >
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["id", "Level ID", ParamType.INTEGER],
                ["creator", "User who made this", "User"],
                ["creatorId", "The user's ID who made this (not discord ID)", ParamType.INTEGER],
                ["createdAt", "Date when created", "Date"],
                ["title", "Level title", ParamType.STRING],
                ["description", "Level description", ParamType.STRING],
                ["data", "Level data (can be omitted by API)", ParamType.STRING],
                ["plays", "Amount of people who've played this", ParamType.INTEGER],
                ["difficulty", "The difficulty of the level (manually set?)", ParamType.INTEGER],
                ["creators_starred", "List of creators who've starred this level", "User[]"],
                ["creators_voted", "List of creators who've voted on this level", "User[]"],

                ["levelpack", "Levelpack this level is for", "Levelpack (optional)"],
                ["levelpackId", "Levelpack id", "Int (optional)"],
                ["levelpackPart", "Levelpack level number", "Int (optional)"],
            ]}>
        </Table>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["Levelpack"]}
            type="STRUCT"
    >
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["id", "Levelpack ID", ParamType.INTEGER],
                ["creator", "User who made this", "User"],
                ["creatorId", "The user's ID who made this (not discord ID)", ParamType.INTEGER],
                ["createdAt", "Date when created", "Date"],
                ["title", "Levelpack title", ParamType.STRING],
                ["description", "Levelpack description", ParamType.STRING],
                ["levels", "List of levels this levelpack contains", "Level[]"],
                ["creators_starred", "List of creators who've starred this levelpack", "User[]"],
            ]}>
        </Table>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["User"]}
            type="STRUCT"
    >
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["id", "Level ID", ParamType.INTEGER],
                ["discordId", "Discord user ID", ParamType.STRING],
                ["createdAt", "Date when created", "Date"],
                ["name", "Username", ParamType.STRING],
                ["levels", "Level created by user", "Level[]"],
                ["starred", "Level starred by user", "Level[]"],
                ["voted", "Level voted by user", "Level[]"],

                ["levelpack", "Levelpacks IDs created by user", "Levelpack[]"],
                ["starredLevelpacks", "Levelpacks starred by user", "Levelpack[]"],
            ]}>
        </Table>
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

    <APIEndpoint
            endpoint={["api", "level", "vote"]}
            params={[
                ["id", "Level ID", ParamType.INTEGER],
                ["difficulty", "1 - 7 (easiest to hardest)", ParamType.INTEGER],
            ]}
            wip
            token_required
    >
        <p>Lets a user give a difficulty for a level. This will be used to calculate the final difficulty of the level.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "level", "star"]}
            params={[
                ["id", "Level ID", ParamType.INTEGER],
                ["bool", "Star(1) or Un-star(0)", ParamType.BOOLEAN],
            ]}
            wip
            token_required
    >
        <p>Stars a level.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "levelpack"]}
            params={[
                ["id", "Levelpack ID", ParamType.INTEGER],
            ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a <APIReference type={"STRUCT"} reference={"Levelpack"}/>.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "levelpack", "star"]}
            params={[
                ["id", "Levelpack ID", ParamType.INTEGER],
                ["bool", "Star(1) or Un-star(0)", ParamType.BOOLEAN],
            ]}
            wip
            token_required
    >
        <p>Stars a levelpack.</p>
    </APIEndpoint>


    <APIEndpoint
            endpoint={["api", "user"]}
            params={[
                ["id", "User ID", ParamType.INTEGER],
                ["discordId", "User's Discord ID", ParamType.INTEGER],
            ]}
    >
        <p>Returns a <APIReference type={"STRUCT"} reference={"User"}/>.</p>
        <p>You can use either "id" or "discordId", but not both.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "page"]}
            params={[
                ["page", "Page number", ParamType.INTEGER],
                ["type", "Type of", ParamType.INTEGER, 0],
                ["sort", "Sort by (WIP)", ParamType.INTEGER, 0],
                ["amount", "Amount of levels", ParamType.INTEGER, 8],
            ]}
    >
                <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"}/>.</p>
        <p>Type codes:</p>
        <Table title="Filter Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Levels"],
            ["1", "Levelpacks"],
        ]}/>
        <p>Sort codes:</p>
        <Table title="Filter Codes" heads={["Code", "Meaning"]} content={[
            ["0", "By Age (new > old)"],
            ["1", "Top (by plays)"],
            ["2", "Top (by stars)"],
            ["3", "Featured (new > old)"],
        ]}/>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "search"]}
            params={[
                ["text", "Search text", ParamType.STRING],
                ["page", "Page number (WIP, NOT IMPLEMENTED YET)", ParamType.INTEGER],
                ["amount", "Amount of levels", ParamType.INTEGER, 8],
            ]}
    >
        <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"}/> who's title contains the search text.</p>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "user", "page"]}
            params={[
                ["id", "User ID", ParamType.INTEGER],
                ["page", "Page number", ParamType.INTEGER],
                ["type", "Type of (WIP)", ParamType.INTEGER, 0],
                ["sort", "Sort by (WIP)", ParamType.INTEGER, 0],
                ["amount", "Amount of levels", ParamType.INTEGER, 8],
            ]}
    >
                <!--["data", "Include the level data (the actual level)", ParamType.BOOLEAN, false],-->
        <p>Returns a list of <APIReference type={"STRUCT"} reference={"Level"}/> created by the user.</p>
        <p>Type codes:</p>
        <Table title="Filter Codes" heads={["Code", "Meaning"]} content={[
            ["0", "Levels"],
            ["1", "Levelpacks"],
        ]}/>
        <p>Sort codes:</p>
        <Table title="Filter Codes" heads={["Code", "Meaning"]} content={[
            ["0", "By Age (new > old)"],
            ["1", "Top (by plays)"],
            ["2", "Top (by likes?)"],
            ["3", "Featured (new > old)"],
        ]}/>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "create", "level"]}
            type="POST"
            game_only
            token_required
    >
        <p>Create a <APIReference type={"STRUCT"} reference={"Level"}/>. You will need to give 5beam the following:</p>
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["creatorId", "The user's ID who made this (not discord ID)", ParamType.INTEGER],
                ["title", "Level title", ParamType.STRING],
                ["description", "Level description", ParamType.STRING],
                ["data", "Level file", ParamType.STRING],
            ]}>
        </Table>
    </APIEndpoint>

    <APIEndpoint
            endpoint={["api", "create", "levelpack"]}
            type="POST"
            game_only
            token_required
    >
        <p>Create a <APIReference type={"STRUCT"} reference={"Levelpack"}/>. You will need to give 5beam the following:</p>
        <Table heads={["Property", "Meaning", "Type"]} content={[
                ["creatorId", "The user's ID who made this (not discord ID)", ParamType.INTEGER],
                ["title", "Levelpack title", ParamType.STRING],
                ["description", "Levelpack description", ParamType.STRING],
                ["data", "Levelpack file", ParamType.STRING],
            ]}>
        </Table>
    </APIEndpoint>
</div>

<style>
    /*.ratelimit-container {*/

    /*}*/

    /*.ratelimit {*/
    /*    background-color: black;*/
    /*    color: whitesmoke;*/
    /*    font-size: 1.5em;*/
    /*    font-weight: bold;*/
    /*    padding: 0.5em;*/
    /*    margin: 10px;*/
    /*}*/

    /*.endpoint-type-GET {*/
    /*    color: lawngreen;*/
    /*}*/

    /*.endpoint-type-POST {*/
    /*    color: hotpink;*/
    /*}*/

    .APIs {
        display: flex;
        flex-direction: column;
        align-items: center;
        /*margin: 0 20vw;*/
    }
</style>