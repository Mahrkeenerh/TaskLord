import { X } from 'lucide-react';
import React from 'react';

export const Modal = ({ children, onClose, photoMode }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className={`${photoMode ? 'bg-white' : 'bg-gray-800'} rounded-lg p-6 w-full max-w-lg relative`}>
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
