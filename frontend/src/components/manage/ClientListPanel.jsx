import React from 'react';
import { Plus } from 'lucide-react';
import { ListItem } from './StyledComponents';

export const ClientListPanel = ({
    clients,
    photoMode,
    selectedId,
    onSelect,
    onAddNew
}) => (
    <div className="h-full flex flex-col">
        <button
            onClick={onAddNew}
            className={`flex items-center justify-center gap-2 w-full p-2 mb-3 rounded-lg text-sm font-medium ${
                photoMode
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                    : 'bg-gray-700 text-blue-400 hover:bg-gray-600'
            } transition-colors`}
        >
            <Plus size={16} />
            Add Client
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
            {[...clients].sort((a, b) => a.name.localeCompare(b.name)).map(client => (
                <ListItem
                    key={client.id}
                    selected={selectedId === client.id}
                    photoMode={photoMode}
                    onClick={() => onSelect(client)}
                >
                    <div className="flex items-center space-x-3 min-w-0">
                        {client.logo_path ? (
                            <img
                                src={client.logo_path}
                                alt=""
                                className="w-6 h-6 object-contain flex-shrink-0"
                            />
                        ) : (
                            <div className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                                photoMode ? 'bg-gray-200 text-gray-600' : 'bg-gray-600 text-gray-300'
                            }`}>
                                {client.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className={`truncate ${photoMode ? "text-gray-800" : ""}`}>
                            {client.name}
                        </span>
                    </div>
                </ListItem>
            ))}
        </div>
    </div>
);
