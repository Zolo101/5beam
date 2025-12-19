// TODO: Maybe extend Response instead?
export class DuplicateError extends Error {
    id: string;

    constructor(id: string) {
        super();
        this.id = id;
        this.name = "DuplicateError";
    }
}

export class InvalidError extends Error {
    constructor(message: string = "Invalid level") {
        super(message);
        this.name = "InvalidError";
    }
}
