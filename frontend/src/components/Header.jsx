import React from 'react';
import { Camera } from 'lucide-react';

export const Header = ({
    filter,
    clients,
    projects,
    handleFilterChange,
    setIsManageWindowActive,
    photoMode,
    setPhotoMode
}) => (
    <>
        <header className="flex justify-between items-center mb-6 mt-4">
            <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="TaskLord Icon" className="w-8 h-8" />
                <h1 className="tasklord-logo">TaskLord</h1>
            </div>
        </header>

        <div className="flex space-x-4 mb-4">
            <select
                value={filter.client || ''}
                onChange={(e) => handleFilterChange('client', e.target.value)}
                className={`${photoMode ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-100' : 'bg-gray-700 border border-gray-700 hover:bg-opacity-75'} rounded-lg p-2`}
            >
                <option value="">All Clients</option>
                {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                ))}
            </select>

            <select
                value={filter.project || ''}
                onChange={(e) => handleFilterChange('project', e.target.value)}
                className={`${photoMode ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-100' : 'bg-gray-700 border border-gray-700 hover:bg-opacity-75'} rounded-lg p-2`}
            >
                <option value="">All Projects</option>
                {projects
                    .filter(project => !project.hidden && (!filter.client || project.client_id === filter.client))
                    .map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
            </select>

            <button
                onClick={() => setIsManageWindowActive(true)}
                className={`px-4 py-2 ${photoMode ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-100' : 'bg-gray-700 border border-gray-700 hover:bg-opacity-75'} rounded-lg`}
            >
                Manage
            </button>

            <button
                onClick={() => setPhotoMode(!photoMode)}
                className={`px-4 py-2 ${photoMode ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-100' : 'bg-gray-700 border border-gray-700 hover:bg-opacity-75'} rounded-lg flex items-center space-x-2`}
            >
                <Camera size={20} />
            </button>
        </div>
    </>
);
