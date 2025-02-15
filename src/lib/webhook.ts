import type { Level, Levelpack } from "$lib/types";
import { generateDiff, getLevelThumbnailURL } from "../misc";

type WebhookObject = {
    username?: string;
    content?: string;
    embeds?: WebhookEmbed[];
};

type WebhookEmbed = {
    title: string;
    description: string;
    url: string;
    color: number;
    author: {
        name: string;
        url: string;
        icon_url: string;
    };
    image?: {
        url: string;
    };
};

// type CustomFetch = (url: string, init?: RequestInit) => Promise<Response>

const difficultyEmoji = [
    "<:unknown:1175550121690271895>",
    "<:easy:1175550124336873553>",
    "<:normal:1175550120637501470>",
    "<:difficult:1175550123284107396>",
    "<:hard:1175550124987007028>",
    "<:extreme:1175550116891983872>",
    "<:insane:1175550119639261245>",
    "<:impossible:1175550118561333399>"
] as const;

const WebhookChannel = {
    New: import.meta.env.VITE_WEBHOOK_NEW,
    PublicLog: import.meta.env.VITE_WEBHOOK_PUBLIC_LOG,
    PrivateLog: import.meta.env.VITE_WEBHOOK_PRIVATE_LOG,
    Featured: import.meta.env.VITE_WEBHOOK_FEATURED
};

// 058. etc ruins the link because of markdown, so replace the dot with a similar unicode character
const getMarkdownLevelURL = (level: Level) =>
    `[${level.title.replace(".", "ꓸ")}](<https://5beam.zelo.dev/level/${level.id}>)`;

export default class Webhook<P extends unknown[]> {
    public channel: keyof typeof WebhookChannel;
    public bodyFunction: (...params: P) => WebhookObject;

    constructor(channel: Webhook<P>["channel"], bodyFunction: Webhook<P>["bodyFunction"]) {
        this.channel = WebhookChannel[channel];
        this.bodyFunction = bodyFunction;
    }

    async send(...params: P) {
        await fetch(this.channel, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.bodyFunction(...params))
        });
    }

    // async sendWithCustomFetch(customFetch: CustomFetch,...params: P) {
    //     const response = await customFetch(this.channel, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(params)
    //     })
    //
    //     console.log(this.channel, await response.json())
    //     return response.text()
    // }
}

// export const UpdatedLevelWebhook = new Webhook("PublicLog", (level: Level) => {
//     return {
//         content: `\`**${getMarkdownLevelURL(level)}\` has been updated!**`,
//     }
// })

export const RemoveLevelWebhook = new Webhook("PrivateLog", (level: Level) => {
    return {
        content: `\`**${level.title}\` by ${level.creator.username} has been removed!**`
    };
});

export const RemoveLevelpackWebhook = new Webhook("PrivateLog", (levelpack: Levelpack) => {
    return {
        content: `\`**${levelpack.title}\` by ${levelpack.creator.username} has been removed!**`
    };
});

export const ChangeDifficultyWebhook = new Webhook(
    "PublicLog",
    (newDifficulty: number, level: Level) => {
        return {
            content: `**${getMarkdownLevelURL(level)}**: **Changed difficulty** from ${difficultyEmoji[level.difficulty]} to ${difficultyEmoji[newDifficulty]}`
        };
    }
);

export const ChangeTitleWebhook = new Webhook("PublicLog", (newTitle: string, level: Level) => {
    return {
        content: `**${getMarkdownLevelURL(level)} has changed title:** \`\`\`diff\n${generateDiff(level.title, newTitle)}\`\`\``
    };
});

export const ChangeDescriptionWebhook = new Webhook(
    "PublicLog",
    (newDescription: string, level: Level) => {
        return {
            content: `**${getMarkdownLevelURL(level)} has changed description:** \`\`\`diff\n${generateDiff(level.description, newDescription)}\`\`\``
        };
    }
);

export const ChangeLevelWebhook = new Webhook("PublicLog", (_, level: Level) => {
    return {
        content: `**${getMarkdownLevelURL(level)} has changed its level data!**`
    };
});

export const NewFeaturedWebhook = new Webhook("Featured", (level: Level) => {
    return {
        username: "New Featured",
        embeds: [
            {
                title: level.title,
                description: level.description,
                url: `https://5beam.zelo.dev/level/${level.id}`,
                color: 65392,
                author: {
                    name: level.creator.global_name,
                    url: `https://5beam.zelo.dev/user/${level.creator.id}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${level.creator.id}/${level.creator.avatar}.png`
                },
                image: {
                    url: getLevelThumbnailURL(level.id, level.thumbnail)
                }
            }
        ]
    };
});

export const NewLevelWebhook = new Webhook("New", (level: Level) => {
    return {
        username: "New Level",
        embeds: [
            {
                title: level.title,
                description: level.description,
                url: `https://5beam.zelo.dev/level/${level.id}`,
                color: 5689629,
                author: {
                    name: level.creator.global_name,
                    url: `https://5beam.zelo.dev/user/${level.creator.id}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${level.creator.id}/${level.creator.avatar}.png`
                },
                image: {
                    url: getLevelThumbnailURL(level.id, level.thumbnail)
                }
            }
        ]
    };
});

export const NewLevelpackWebhook = new Webhook("New", (levelpack: Levelpack, preview: Level) => {
    return {
        username: "New Levelpack",
        embeds: [
            {
                title: levelpack.title,
                description: levelpack.description,
                url: `https://5beam.zelo.dev/levelpack/${levelpack.id}`,
                color: 3461525,
                author: {
                    name: levelpack.creator.global_name,
                    url: `https://5beam.zelo.dev/user/${levelpack.creator.id}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${levelpack.creator.id}/${levelpack.creator.avatar}.png`
                },
                image: {
                    url: getLevelThumbnailURL(preview.id, preview.thumbnail)
                }
            }
        ]
    };
});

// const e = {
//     "username": "New Level",
//     "embeds": [
//         {
//             "title": "e ",
//             "description": "e ",
//             "url": "e",
//             "color": 5689629,
//             "author": {
//                 "name": "e",
//                 "url": "",
//                 "icon_url": ""
//             },
//             "image": {
//                 "url": ""
//             }
//         }
//     ]
// }
