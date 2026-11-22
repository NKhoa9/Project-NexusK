import type { APIRoute } from 'astro';
import { purgeCache } from '@netlify/functions';
import { json } from '../../utils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json().catch(() => null);
    const tags: unknown = body?.tags;

    if (!Array.isArray(tags) || tags.length === 0 || !tags.every((t) => typeof t === 'string')) {
        return json({ error: 'Bad Request: expected a non-empty "tags" array of strings in the body' }, { status: 400 });
    }

    try {
        await purgeCache({ tags });
        return json({ invalidated: tags });
    } catch (e) {
        console.error(e);
        return json({ error: 'Failed to purge cache' }, { status: 500 });
    }
};
