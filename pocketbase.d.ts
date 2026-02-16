declare module "pocketbase" {
    // Replace the interface with a type alias
    type ListResult<T> = T[];

    // Re-export it
    export { ListResult };
}
