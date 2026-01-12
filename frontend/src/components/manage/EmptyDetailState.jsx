import React from 'react';

export const EmptyDetailState = ({ photoMode, type }) => (
    <div className={`flex flex-col items-center justify-center h-full p-8 ${
        photoMode ? 'text-gray-500' : 'text-gray-400'
    }`}>
        <p className="text-center">
            Select a {type} from the list to edit,<br />
            or click <strong>+ Add {type}</strong> to create a new one.
        </p>
    </div>
);
