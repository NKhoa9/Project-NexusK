import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { json, uploadDisabled } from '../../utils';
import type { BlobParameterProps } from '../../types';

export const prerender = false;

const STORE_NAME = 'shapes';
const KEY_PATTERN = /^[a-z0-9-]{1,100}$/i;

function isValidShape(value: unknown): value is BlobParameterProps {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.name === 'string' &&
        KEY_PATTERN.test(v.name) &&
        typeof v.seed === 'number' &&
        typeof v.size === 'number' &&
        typeof v.edges === 'number' &&
        typeof v.growth === 'number' &&
        Array.isArray(v.colors) &&
        v.colors.length === 2 &&
        v.colors.every((c) => typeof c === 'string' && /^#[0-9a-f]{3,8}$/i.test(c))
    );
}

export const POST: APIRoute = async ({ request }) => {
    if (uploadDisabled) return json({ error: 'Sorry, uploads are disabled' }, { status: 403 });

    const body = await request.json().catch(() => null);
    if (!isValidShape(body)) return json({ error: 'Invalid shape parameters' }, { status: 400 });

    const { name, seed, size, edges, growth, colors } = body;
    await getStore(STORE_NAME).setJSON(name, { name, seed, size, edges, growth, colors });
    return json({ message: `Stored shape "${name}"` }, { status: 201 });
};

export const GET: APIRoute = async () => {
    try {
        const { blobs } = await getStore({ name: STORE_NAME, consistency: 'strong' }).list();
        return json({ keys: blobs.map(({ key }) => key) });
    } catch (e) {
        console.error(e);
        return json({ keys: [], error: 'Failed listing blobs' }, { status: 500 });
    }
};
