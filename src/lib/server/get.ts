// Pocketbase gives results in a weird format,
// so we need to convert it to a POJO (plain old javascript object)
// so sveltekit won't complain
// TODO: ...also, this does more than just "toPOJO"... see cleanObject
// moveExpandsInline from pocketbase-expandless does not work...
export function clean<T extends Record<string, unknown> | Record<string, unknown>[]>(
    obj: T
): T | null {
    if (obj === undefined || obj === null) return null;
    // console.log(obj);
    if (obj.items) {
        return obj.items.map(cleanObject) as T;
    } else {
        return cleanObject(obj) as T;
    }
}

// removes the weird "expand" properties
function cleanObject(obj: Record<string, any>) {
    // TODO: Figure out why getUserLevelpacks & getUserByDiscordId gives undefined objects
    if (obj === undefined) {
        console.trace("WARNING: undefined in cleanObject()");
        return {};
    }

    delete obj.collectionId;
    delete obj.collectionName;

    const expand = obj.expand;
    if (expand) {
        if (Object.keys(expand).length === 0) delete obj.expand;

        for (const key in expand) {
            const prop = expand[key];

            if (Array.isArray(prop)) {
                if (prop.length > 0) expand[key] = prop.map(cleanObject);
            }

            obj[key] = cleanObject(prop);
            delete obj.expand;
        }
    }

    return obj;
}
