import { useEffect, useState } from 'react';
import ShapePreview from './ShapePreview.tsx';
import { generateBlob, uploadDisabled } from '../../../../utils';
import type { BlobProps } from '../../../../types.ts';

interface Props {
    onUploaded?: () => void;
}

type Status = 'idle' | 'uploading' | 'uploaded' | 'error';

export default function NewShape({ onUploaded }: Props) {
    const [blobData, setBlobData] = useState<BlobProps>();
    const [status, setStatus] = useState<Status>('idle');

    const randomizeBlob = () => {
        setBlobData(generateBlob());
        setStatus('idle');
    };

    // Generate on mount only (client-side), so server and client markup match during hydration.
    useEffect(randomizeBlob, []);

    const uploadBlob = async () => {
        if (!blobData) return;
        setStatus('uploading');
        try {
            const response = await fetch('/api/blobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blobData.parameters)
            });
            if (!response.ok) throw new Error(`Upload failed (${response.status})`);
            setStatus('uploaded');
            onUploaded?.();
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <>
            <h2 className="mb-4 text-center text-xl sm:text-xl">New Random Shape</h2>
            <div className="mb-6 w-full overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="min-h-14 border-b border-gray-200 p-4 text-center font-mono text-sm text-gray-900">{blobData?.parameters.name}</div>
                <div className="aspect-square p-4">{blobData && <ShapePreview {...blobData} />}</div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <button className="btn btn-outline" onClick={randomizeBlob} disabled={status === 'uploading'}>
                    Randomize
                </button>
                <button className="btn" onClick={uploadBlob} disabled={uploadDisabled || !blobData || status === 'uploading' || status === 'uploaded'}>
                    {status === 'uploading' ? 'Uploading…' : status === 'uploaded' ? 'Uploaded ✓' : 'Upload'}
                </button>
            </div>
            <p className="mt-3 min-h-5 text-center text-sm text-red-300" role="status">
                {status === 'error' && 'Upload failed. Please try again.'}
            </p>
        </>
    );
}
