export interface NavLink {
    label: string;
    href: string;
    description?: string;
}

export interface NavSection {
    title: string;
    href: string;
    description: string;
    items: NavLink[];
}

/** Top-level links shown directly in the header. */
export const primaryLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Christmas SP!', href: '/christmas-sp' }
];

/** Grouped sections: rendered as header dropdowns and as hub pages (/random, /projects, /tests). */
export const sections: NavSection[] = [
    {
        title: 'Random',
        href: '/random',
        description: 'Odds and ends. Click at your own risk.',
        items: [
            { label: 'RR embed', href: '/random/rrembed', description: 'You know exactly what this is.' },
            { label: 'Calculonton', href: '/random/calculonton', description: 'The world’s most advanced calculator™.' }
        ]
    },
    {
        title: 'Projects',
        href: '/projects',
        description: 'Real projects live here. Eventually.',
        items: []
    },
    {
        title: 'Tests',
        href: '/tests',
        description: 'Experiments with Netlify platform features.',
        items: [
            { label: 'Corgi!', href: '/tests/image-cdn', description: 'Netlify Image CDN, demonstrated with a very good dog.' },
            { label: 'Blobs', href: '/tests/blobs', description: 'Generate random shapes and store them in Netlify Blobs.' }
        ]
    }
];

export const socialLinks: NavLink[] = [
    { label: 'Discord', href: 'https://discord.gg/xSqkHaWhna' },
    { label: 'YouTube', href: 'https://www.youtube.com/@ndkas7986' },
    { label: 'TikTok', href: 'https://tiktok.com/@khoanoob9' },
    { label: 'X', href: 'https://x.com/NLukash_' },
    { label: 'Facebook', href: 'https://www.facebook.com/khoa.noob.9/' }
];

export function getSection(title: string): NavSection {
    const section = sections.find((s) => s.title === title);
    if (!section) throw new Error(`Unknown navigation section: ${title}`);
    return section;
}

/** True when `pathname` is `href` or nested beneath it (ignores trailing slashes). */
export function isActive(pathname: string, href: string): boolean {
    const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
    const path = normalize(pathname);
    const target = normalize(href);
    return target === '/' ? path === '/' : path === target || path.startsWith(`${target}/`);
}
