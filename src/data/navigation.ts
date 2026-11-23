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
export const primaryLinks: NavLink[] = [];

/** Grouped sections: rendered as header dropdowns and as hub pages. */
export const sections: NavSection[] = [
    {
        title: 'Random',
        href: '/random',
        description: 'Odds and ends. Click at your own risk.',
        items: [
            { label: 'Christmas SP!', href: '/christmas-sp' },
            { label: 'RR embed', href: '/random/rrembed', description: 'You know exactly what this is.' },
            { label: 'Calculonton', href: '/random/calculonton', description: 'The world’s most advanced calculator™.' },
            { label: 'Corgi!', href: '/random/image-cdn', description: 'Netlify Image CDN, demonstrated with a very good dog.' },
            { label: 'Blobs', href: '/random/blobs', description: 'Generate random shapes and store them in Netlify Blobs.' }
        ]
    },
    {
        title: 'Projects',
        href: '/projects',
        description: 'Real projects live here. Eventually.',
        items: [
            { label: 'Grouped Stats', href: '/projects/grouped-stats', description: 'Work with grouped frequency statistics.' },
            { label: 'GeMicro-wth', href: '/projects/gemicro-wth', description: 'A local-first chat workspace with GeMicro (Gehihi).' },
            { label: 'Gehihi ↔ Discord', href: '/projects/gehihi-discord', description: 'Try the Gehihi-powered Discord bot.' }
        ]
    },
];

export const socialLinks: NavLink[] = [
    { label: 'Discord', href: 'https://discord.gg/xSqkHaWhna' },
    { label: 'X', href: 'https://x.com/Lukas_wth' },
    { label: 'Github', href: 'https://github.com/NKhoa9' }
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
