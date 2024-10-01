import { caching, MemoryCache } from 'cache-manager';

let memoryCache: MemoryCache;

export async function getCacheStore(): Promise<MemoryCache> {
    if(!memoryCache) {
        memoryCache = await caching('memory', {
            max: 100,
            ttl: 4 * 60 * 60 * 1000 /*milliseconds*/,
            shouldCloneBeforeSet: false,
          });
    }

    return memoryCache;
}