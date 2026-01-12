import React from 'react';

export const MasterDetailLayout = ({ listPanel, detailPanel, photoMode }) => (
    <div className="flex h-[640px] gap-4">
        <div className={`w-2/5 rounded-lg p-3 overflow-hidden flex flex-col ${
            photoMode ? 'bg-gray-50' : 'bg-gray-800'
        }`}>
            {listPanel}
        </div>
        <div className={`w-3/5 rounded-lg overflow-y-auto ${
            photoMode ? 'bg-gray-50' : 'bg-gray-800'
        }`}>
            {detailPanel}
        </div>
    </div>
);
