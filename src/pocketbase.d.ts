// Override ListResult to be an array type since the afterSend hook extracts items
// This makes ListResult behave like T[] at the type level

declare module "pocketbase" {
    interface ListResult<T> extends Array<T> {
        items: Array<T>;
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
    }
}

export {};
