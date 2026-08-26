const TOKEN_KEY = 'aperio_auth_token';

export const API_BASE = import.meta.env.VITE_API_BASE || '';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
    json?: unknown;
    body?: BodyInit | null;
}

export async function apiFetch<T = any>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { json, headers, ...rest } = options;

    const finalHeaders: Record<string, string> = {};
    if (headers) Object.assign(finalHeaders, headers);

    let body = rest.body;
    if (json !== undefined) {
        finalHeaders['Content-Type'] = 'application/json';
        body = JSON.stringify(json);
    }

    const token = getToken();
    const PUBLIC_AUTH_PATHS = ['/api/auth/register', '/api/auth/login', '/api/auth/google'];
    const isPublicAuth = PUBLIC_AUTH_PATHS.includes(path);
    if (token && !isPublicAuth) {
        finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, { ...rest, body, headers: finalHeaders });
    } catch {
        throw new ApiError(0, 'Cannot reach the server. It may be offline or waking up — please try again.');
    }

    if (res.status === 401 && token && !isPublicAuth) {
        clearToken();
    }

    const text = await res.text();
    let data: any = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        throw new ApiError(res.status, 'Server returned an invalid response.');
    }

    if (!res.ok) {
        let detail = data?.detail;
        if (Array.isArray(detail)) {
            detail = detail.map((d: any) => d?.msg || String(d)).join('; ');
        }
        throw new ApiError(res.status, typeof detail === 'string' ? detail : `Request failed (${res.status}).`);
    }

    return data as T;
}
