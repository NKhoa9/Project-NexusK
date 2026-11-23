import { useCallback, useState } from 'react';
import NewShape from './NewShape.tsx';
import StoredShapes from './StoredShapes.tsx';

export default function ShapeEditor() {
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

    return (
        <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-1">
                <NewShape onUploaded={refresh} />
            </div>
            <div className="flex-1">
                <StoredShapes refreshKey={refreshKey} />
            </div>
        </div>
    );
}
