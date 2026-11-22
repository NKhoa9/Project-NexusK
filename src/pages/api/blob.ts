import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { json } from '../../utils';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    const key = url.searchParams.get('key');
    if (!key) return json({ error: 'Missing "key" query parameter' }, { status: 400 });

    const blob = await getStore('shapes').get(key, { type: 'json' });
    if (blob === null) return json({ error: `Shape "${key}" not found` }, { status: 404 });

    return json({ blob });
};
