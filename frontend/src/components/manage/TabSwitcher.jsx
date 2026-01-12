import React from 'react';
import { TabButton } from './StyledComponents';

export const TabSwitcher = ({ activeTab, setActiveTab, photoMode }) => (
    <div className={`flex space-x-2 mb-4 border-b ${photoMode ? 'border-gray-200' : 'border-gray-700'}`}>
        <TabButton
            active={activeTab === 'projects'}
            photoMode={photoMode}
            onClick={() => setActiveTab('projects')}
        >
            Projects
        </TabButton>
        <TabButton
            active={activeTab === 'clients'}
            photoMode={photoMode}
            onClick={() => setActiveTab('clients')}
        >
            Clients
        </TabButton>
    </div>
);
