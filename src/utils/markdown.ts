import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import { createHighlighter } from 'shiki';

const THEME = 'min-dark';
const LANGS = ['jsx', 'js', 'ts', 'tsx', 'json', 'bash'];

const highlighterPromise = createHighlighter({ langs: LANGS, themes: [THEME] });

// A single, shared parser instance — previously a new Marked instance (and plugin) was built on every render.
const marked = new Marked().use(
    markedShiki({
        async highlight(code, lang) {
            const highlighter = await highlighterPromise;
            return highlighter.codeToHtml(code, {
                lang: lang && LANGS.includes(lang) ? lang : 'text',
                theme: THEME
            });
        }
    })
);

const cache = new Map<string, Promise<string>>();

/** Render markdown to HTML. Results are memoized since page content is mostly static. */
export function renderMarkdown(content: string): Promise<string> {
    let html = cache.get(content);
    if (!html) {
        html = Promise.resolve(marked.parse(content));
        // Avoid unbounded growth for dynamic content (e.g. server-rendered timestamps).
        if (cache.size > 100) cache.clear();
        cache.set(content, html);
    }
    return html;
}
