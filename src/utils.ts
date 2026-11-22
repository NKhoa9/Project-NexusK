import blobshape from 'blobshape';
import { uniqueNamesGenerator, adjectives, animals, type Config } from 'unique-names-generator';
import type { BlobParameterProps, BlobProps } from './types';

const NAME_CONFIG: Config = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
};

const GRADIENT_COLORS: [string, string][] = [
    ['#2E3192', '#1BFFFF'],
    ['#93A5CF', '#E4EfE9'],
    ['#BFF098', '#6FD6FF'],
    ['#A1C4FD', '#C2E9FB'],
    ['#11998E', '#38EF7D'],
    ['#D8B5FF', '#1EAE98']
];

/** Random integer in the inclusive range [min, max]. */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomItem<T>(items: readonly T[]): T {
    return items[randomInt(0, items.length - 1)];
}

export function uniqueName(): string {
    return `${uniqueNamesGenerator(NAME_CONFIG)}-${randomInt(100, 999)}`;
}

/** Generate a blob shape. Passing stored parameters (including `seed`) reproduces the same shape. */
export function generateBlob(overrides: Partial<BlobParameterProps> = {}): BlobProps {
    const parameters = {
        seed: null as number | null,
        size: 512,
        edges: randomInt(3, 20),
        growth: randomInt(2, 9),
        name: uniqueName(),
        colors: randomItem(GRADIENT_COLORS),
        ...overrides
    };
    // @types/blobshape declares `seed` as a string, but the library does numeric arithmetic on it.
    const { path: svgPath, seedValue: seed } = blobshape(parameters as unknown as Parameters<typeof blobshape>[0]);
    return { parameters: { ...parameters, seed }, svgPath };
}

export function cacheHeaders(maxAgeDays = 365, cacheTags: string[] = []): Record<string, string> {
    // As far as the browser is concerned, it must revalidate on every request.
    // However, Netlify CDN is told to keep the content cached for up to maxAgeDays (note: new deployment bust the cache by default).
    // We're also setting cache tags to be able to later purge via API (see: https://www.netlify.com/blog/cache-tags-and-purge-api-on-netlify/)
    const headers: Record<string, string> = {
        'Cache-Control': 'public, max-age=0, must-revalidate', // Tell browsers to always revalidate
        'Netlify-CDN-Cache-Control': `public, max-age=${maxAgeDays * 86_400}, must-revalidate` // Tells Netlify CDN the max allowed cache duration
    };
    if (cacheTags.length > 0) headers['Cache-Tag'] = cacheTags.join(',');
    return headers;
}

/** JSON response helper for API routes. */
export function json(data: unknown, init: ResponseInit = {}): Response {
    return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init.headers }
    });
}

export const uploadDisabled = import.meta.env.PUBLIC_DISABLE_UPLOADS?.toLowerCase() === 'true';
