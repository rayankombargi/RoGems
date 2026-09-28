import axios from 'axios';

const responseCache = new Map();
const DEFAULT_TTL = 60 * 1000;

function cacheKey(url, config = {}) {
    const params = config.params || {};
    const query = Object.entries(params)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${String(value)}`)
        .join('&');

    return query ? `${url}?${query}` : url;
}

export async function getCached(url, config = {}, ttl = DEFAULT_TTL) {
    const key = cacheKey(url, config);
    const cached = responseCache.get(key);

    if (cached && Date.now() - cached.createdAt < ttl) {
        return cached.response;
    }

    const response = await axios.get(url, config);
    responseCache.set(key, {
        createdAt: Date.now(),
        response,
    });

    return response;
}

export function clearCachedRequests() {
    responseCache.clear();
}
