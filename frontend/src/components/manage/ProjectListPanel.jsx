import React from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { getCurrentRate } from '../../utils/summaries';
import { ListItem } from './StyledComponents';

export const ProjectListPanel = ({
    projects,
    photoMode,
    selectedId,
    onSelect,
    onAddNew,
    onToggleVisibility
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
            Add Project
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
            {[...projects].sort((a, b) => a.name.localeCompare(b.name)).map(project => (
                <ListItem
                    key={project.id}
                    selected={selectedId === project.id}
                    photoMode={photoMode}
                    onClick={() => onSelect(project)}
                >
                    <div className="flex items-center space-x-3 min-w-0">
                        <div
                            className="w-3 h-3 rounded flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                        />
                        <span className={`truncate ${photoMode ? "text-gray-800" : ""}`}>
                            {project.name}
                        </span>
                        {project.hidden && (
                            <EyeOff size={14} className="text-gray-500 flex-shrink-0" />
                        )}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className={`text-sm ${photoMode ? "text-gray-600" : "text-gray-400"}`}>
                            {getCurrentRate(project)}€/h
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility(project);
                            }}
                            className={`p-1 rounded ${photoMode ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`}
                            title={project.hidden ? "Show project" : "Hide project"}
                        >
                            {project.hidden ? (
                                <EyeOff size={14} className="text-gray-400" />
                            ) : (
                                <Eye size={14} className="text-gray-400" />
                            )}
                        </button>
                    </div>
                </ListItem>
            ))}
        </div>
    </div>
);
