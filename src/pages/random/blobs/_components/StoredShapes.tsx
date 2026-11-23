import { useEffect, useState } from 'react';
import ShapePreview from './ShapePreview.tsx';
import { generateBlob } from '../../../../utils';
import type { BlobProps } from '../../../../types.ts';

interface Props {
    refreshKey: number;
}

export default function StoredShapes({ refreshKey }: Props) {
    const [keys, setKeys] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<BlobProps | null>(null);

    useEffect(() => {
        // Ignore responses from stale requests (e.g. several uploads in quick succession).
        const controller = new AbortController();
        fetch('/api/blobs', { signal: controller.signal })
            .then((res) => res.json())
            .then((data: { keys?: string[]; error?: string }) => {
                setKeys(data.keys ?? []);
                setError(data.error ?? null);
            })
            .catch((e) => {
                if (e.name !== 'AbortError') setError('Failed to load shapes');
            });
        return () => controller.abort();
    }, [refreshKey]);

    const selectBlob = async (key: string) => {
        setSelectedKey(key);
        try {
            const response = await fetch(`/api/blob?${new URLSearchParams({ key })}`);
            if (!response.ok) throw new Error(`Request failed (${response.status})`);
            const data = await response.json();
            setPreviewData(generateBlob(data.blob));
            setError(null);
        } catch (e) {
            console.error(e);
            setPreviewData(null);
            setError(`Failed to load "${key}"`);
        }
    };

    return (
        <>
            <h2 className="mb-4 text-center text-xl sm:text-xl">Objects in Blob Store</h2>
            <div className="w-full overflow-hidden rounded-xl bg-white text-gray-900 shadow-lg">
                <div className="max-h-80 min-h-14 overflow-y-auto p-4 text-center">
                    {keys === null ? (
                        <span className="text-gray-500">Loading…</span>
                    ) : keys.length ? (
                        <ul className="space-y-1">
                            {keys.map((keyName) => (
                                <li key={keyName}>
                                    <button
                                        className={`w-full cursor-pointer rounded-md px-4 py-1.5 font-mono text-sm transition hover:bg-complementary/15 ${
                                            selectedKey === keyName ? 'bg-complementary/20 font-semibold' : ''
                                        }`}
                                        aria-pressed={selectedKey === keyName}
                                        onClick={() => selectBlob(keyName)}
                                    >
                                        {keyName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-gray-500">Please upload some shapes!</span>
                    )}
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                {previewData && (
                    <div className="aspect-square border-t border-gray-200 p-4">
                        <ShapePreview {...previewData} />
                    </div>
                )}
            </div>
        </>
    );
}
