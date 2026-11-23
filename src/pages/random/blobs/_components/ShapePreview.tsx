import { useId } from 'react';
import type { BlobProps } from '../../../../types.ts';

export default function ShapePreview({ svgPath, parameters }: BlobProps) {
    // useId is stable across server/client renders, unlike the previous random id (which caused hydration mismatches).
    const gradientId = `gradient-${useId().replace(/:/g, '')}`;

    return (
        <svg viewBox={`0 0 ${parameters.size} ${parameters.size}`} xmlns="http://www.w3.org/2000/svg" width="100%" role="img" aria-label={`Shape ${parameters.name}`}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={parameters.colors[0]} />
                    <stop offset="100%" stopColor={parameters.colors[1]} />
                </linearGradient>
            </defs>
            <path d={svgPath} fill={`url(#${gradientId})`} />
        </svg>
    );
}
