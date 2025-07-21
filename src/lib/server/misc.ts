// Cant find
export function NOT_FOUND() {
    return new Response(null, { status: 404 });
}

// All good
export const OK = (body?: unknown) => new Response(JSON.stringify(body), { status: 200 });

// User error
export const BAD = (message?: string) => new Response(message, { status: 400 });

// Server error
export const MY_BAD = (message?: string) => new Response(message, { status: 500 });

// Denied
export const DENIED = () =>
    new Response("Authentication Denied. Make sure you have a valid 'pb_auth' cookie!", {
        status: 401
    });
