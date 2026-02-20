import type { Level, LevelChange, Levelpack, LevelpackDifficultyChange, Report } from "$lib/types";
import { generateDiff, getLevelThumbnailURL } from "$lib/misc";

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
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
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
    New: [import.meta.env.VITE_WEBHOOK_NEW, import.meta.env.VITE_WEBHOOK_NEW_5BCENTRAL],
    PublicLog: [import.meta.env.VITE_WEBHOOK_PUBLIC_LOG],
    PrivateLog: [import.meta.env.VITE_WEBHOOK_PRIVATE_LOG],
    Report: [import.meta.env.VITE_WEBHOOK_REPORT],
    Featured: [import.meta.env.VITE_WEBHOOK_FEATURED],
    Daily: [import.meta.env.VITE_WEBHOOK_DAILYIES]
};

// 058. etc ruins the link because of markdown, so replace the dot with a similar unicode character
function getMarkdownLevelURL(level: Level | Levelpack) {
    // TODO: Hardcoded... also WTF
    const type = "difficulty" in level ? "levelpack" : "level";
    return `[${level.title.replace(".", "ꓸ")}](<https://5beam.zelo.dev/${type}/${level.id}>)`;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default class Webhook<P extends unknown[]> {
    public channel: string[];
    public bodyFunction: (...params: P) => WebhookObject;

    constructor(channel: keyof typeof WebhookChannel, bodyFunction: Webhook<P>["bodyFunction"]) {
        this.channel = WebhookChannel[channel];
        this.bodyFunction = bodyFunction;
    }

    async send(...params: P) {
        for (const channel of this.channel) {
            await this.sendToChannel(channel, this.bodyFunction(...params));
        }
    }

    private async sendToChannel(channel: string, body: WebhookObject) {
        await fetch(channel, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }
}

function getCreatorName(level: Level | Levelpack) {
    return level.creator?.username || "Guest";
}

function makeAuthor(level: Level | Levelpack) {
    return level.creator
        ? {
              name: getCreatorName(level),
              url: `https://5beam.zelo.dev/user/${level.creator.id}`,
              icon_url: `https://cdn.discordapp.com/avatars/${level.creator.id}/${level.creator.avatar}.png`
          }
        : { name: getCreatorName(level) };
}

export const RemoveItemWebhook = new Webhook("PrivateLog", (item: Level | Levelpack) => {
    return {
        content: `\`${item.title}\`** by ${getCreatorName(item)} has been removed!**`
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

export const ChangeTitleWebhook = new Webhook(
    "PublicLog",
    (newTitle: string, item: Level | Levelpack) => {
        return {
            content: `**${getMarkdownLevelURL(item)} has changed title:** \`\`\`diff\n${generateDiff(item.title, newTitle)}\`\`\``
        };
    }
);

export const ChangeDescriptionWebhook = new Webhook(
    "PublicLog",
    (newDescription: string, item: Level | Levelpack) => {
        return {
            content: `**${getMarkdownLevelURL(item)} has changed description:** \`\`\`diff\n${generateDiff(item.description, newDescription)}\`\`\``
        };
    }
);

export const ChangeLevelWebhook = new Webhook("PublicLog", (_, level: Level) => {
    return {
        content: `**${getMarkdownLevelURL(level)} has changed its level data!**`
    };
});

export const ChangeLevelpackWebhook = new Webhook(
    "PublicLog",
    (levelChanges: LevelChange[], levelpack: Levelpack) => {
        const added = levelChanges.filter((change) => change.action === "create");
        const removed = levelChanges.filter((change) => change.action === "delete");
        const updated = levelChanges.filter((change) => change.action === "update");

        const lines: string[] = [];
        if (added.length > 0) {
            lines.push(`**Added levels:**`);
            lines.push(`- ${added.map((c) => c.title).join(", ")}`);
        }
        if (removed.length > 0) {
            lines.push(`**Removed levels:**`);
            lines.push(`- ${removed.map((c) => c.title).join(", ")}`);
        }
        if (updated.length > 0) {
            lines.push(`**Updated levels:**`);
            lines.push(`- ${updated.map((c) => c.title).join(", ")}`);
        }
        if (lines.length === 0) {
            lines.push("No level changes.");
        }

        return {
            content: `**${getMarkdownLevelURL(levelpack)} has changed its levels:**\n${lines.join("\n")}`
        };
    }
);

export const ChangeLevelpackDifficultyWebhook = new Webhook(
    "PublicLog",
    (levelChanges: LevelpackDifficultyChange[], levelpack: Levelpack) => {
        const lines = levelChanges.map(
            ({ title, oldD, newD }) =>
                `- **${title}**: ${difficultyEmoji[oldD]} **→** ${difficultyEmoji[newD]}`
        );

        return {
            content: `**${getMarkdownLevelURL(levelpack)} has changed level difficulties:**\n${lines.join("\n")}`
        };
    }
);

export const NewFeaturedWebhook = new Webhook("Featured", (level: Level) => {
    return {
        username: "New Featured",
        embeds: [
            {
                title: level.title,
                description: level.description,
                url: `https://5beam.zelo.dev/level/${level.id}`,
                color: 65392,
                author: makeAuthor(level),
                image: {
                    url: getLevelThumbnailURL(level.id, level.thumbnail)
                },
                footer: {
                    text: `${level.plays} plays`
                },
                timestamp: level.created
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
                author: makeAuthor(level),
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
                author: makeAuthor(levelpack),
                image: {
                    url: getLevelThumbnailURL(preview.id, preview.thumbnail)
                }
            }
        ]
    };
});

export const NewDailyWebhook = new Webhook("Daily", (level: Level) => {
    return {
        username: "New Daily",
        embeds: [
            {
                title: level.title,
                description: level.description,
                url: `https://5beam.zelo.dev/level/${level.id}`,
                color: 16761344,
                author: makeAuthor(level),
                image: {
                    url: getLevelThumbnailURL(level.id, level.thumbnail)
                },
                footer: {
                    text: `${level.plays} plays`
                },
                timestamp: level.created
            }
        ]
    };
});

export const ReportWebhook = new Webhook("Report", (report: Report) => {
    const reportDescription = report.description ? `\n${report.description}` : "";
    return {
        username: "New Report",
        content: "<@262343010916892673>",
        embeds: [
            {
                title: `${capitalize(report.reason)} ${capitalize(report.kind)}`,
                description: `**Link:** <https://5beam.zelo.dev/${report.kind}/${report.reportedId}>${reportDescription}`,
                url: `https://5beam.zelo.dev/reports/`,
                color: 16711930,
                timestamp: report.created
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
