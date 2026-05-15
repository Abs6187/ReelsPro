// SSRF guard: only allow fetching from known media hosts.
//
// Users submit URLs that the server fetches (for moderation). Without this
// gate, a user could point the server at internal IPs or cloud metadata
// endpoints (169.254.169.254, localhost, etc.).

const DEFAULT_HOSTS = ["ik.imagekit.io"];

function allowlist(): string[] {
    const fromEnv = (process.env.MODERATION_ALLOWED_HOSTS ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const ikEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
    const hosts = [...DEFAULT_HOSTS, ...fromEnv];
    if (ikEndpoint) {
        try {
            hosts.push(new URL(ikEndpoint).hostname);
        } catch {
            /* ignore */
        }
    }
    return hosts;
}

export function isAllowedMediaUrl(rawUrl: string): boolean {
    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch {
        return false;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;

    const host = url.hostname.toLowerCase();
    // Block obvious private / metadata endpoints
    if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        host === "169.254.169.254" ||
        host.endsWith(".local") ||
        host.endsWith(".internal")
    ) {
        return false;
    }
    // Block private IP ranges (basic check — not a full RFC1918 guard)
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
        return false;
    }

    const allowed = allowlist();
    if (allowed.length === 0) return true; // no allowlist configured
    return allowed.some((h) => host === h || host.endsWith(`.${h}`));
}

export function assertAllowedMediaUrl(url: string): void {
    if (!isAllowedMediaUrl(url)) {
        throw new Error(`URL not in media allowlist: ${url}`);
    }
}
