import { X } from 'lucide-react';
import React from 'react';

export const Modal = ({ children, onClose, photoMode, size = 'default' }) => {
    const sizeClasses = {
        default: 'max-w-lg',  // Original size for task forms
        large: 'max-w-4xl',   // Wide size for project settings
        medium: 'max-w-2xl'   // Medium size if needed
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`${photoMode ? 'bg-white' : 'bg-gray-800'} rounded-lg p-6 w-full ${sizeClasses[size]} relative`}>
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 ${photoMode ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};
