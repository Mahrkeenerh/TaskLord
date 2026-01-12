import React from 'react';

export const Input = ({ photoMode, className = '', ...props }) => {
    const baseClassName = photoMode
        ? "w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
        : "w-full bg-gray-700 rounded-lg p-2";

    return <input className={`${baseClassName} ${className}`} {...props} />;
};

export const Button = ({ photoMode, variant = 'primary', children, className = '', ...props }) => {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-500",
        secondary: photoMode
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-gray-600 text-gray-200 hover:bg-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-500"
    };

    return (
        <button
            className={`rounded-lg py-2 px-4 transition-colors ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Label = ({ photoMode, children }) => {
    const className = photoMode
        ? "block text-sm font-medium mb-1 text-gray-700"
        : "block text-sm font-medium mb-1";

    return <label className={className}>{children}</label>;
};

export const TabButton = ({ active, photoMode, children, onClick }) => {
    const baseClasses = "px-4 py-2 font-medium transition-colors";
    const activeClasses = photoMode
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-blue-400 border-b-2 border-blue-400";
    const inactiveClasses = photoMode
        ? "text-gray-500 hover:text-gray-700"
        : "text-gray-400 hover:text-gray-200";

    return (
        <button
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const ListItem = ({ selected, photoMode, children, onClick }) => {
    const baseClasses = "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border-2";
    const selectedClasses = photoMode
        ? "bg-blue-50 border-blue-500"
        : "bg-blue-900/30 border-blue-500";
    const normalClasses = photoMode
        ? "bg-white border-gray-200 hover:bg-gray-50"
        : "bg-gray-700 border-transparent hover:bg-gray-600";

    return (
        <div
            className={`${baseClasses} ${selected ? selectedClasses : normalClasses}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
