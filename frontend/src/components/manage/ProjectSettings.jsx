import React, { useState } from 'react';
import { INITIAL_PROJECT_FORM, INITIAL_CLIENT_FORM } from './constants';
import { TabSwitcher } from './TabSwitcher';
import { EmptyDetailState } from './EmptyDetailState';
import { MasterDetailLayout } from './MasterDetailLayout';
import { ProjectListPanel } from './ProjectListPanel';
import { ClientListPanel } from './ClientListPanel';
import { ProjectDetailForm } from './ProjectDetailForm';
import { ClientDetailForm } from './ClientDetailForm';

export const ProjectSettings = ({
    projects,
    clients,
    onProjectUpdate,
    createClient,
    updateClient,
    deleteClient,
    deleteProject,
    photoMode
}) => {
    // Tab state
    const [activeTab, setActiveTab] = useState('projects');

    // Selection and mode state
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [projectMode, setProjectMode] = useState('view'); // 'view' | 'create' | 'edit'
    const [clientMode, setClientMode] = useState('view');

    // Form data
    const [projectFormData, setProjectFormData] = useState(INITIAL_PROJECT_FORM);
    const [clientFormData, setClientFormData] = useState(INITIAL_CLIENT_FORM);

    // Project handlers
    const handleSelectProject = (project) => {
        setSelectedProject(project.id);
        setProjectFormData({
            ...project,
            rate_changes: project.rate_changes || [{
                hourly_rate: project.hourly_rate || 0,
                effective_date: null
            }]
        });
        setProjectMode('edit');
    };

    const handleAddNewProject = () => {
        setSelectedProject(null);
        setProjectFormData(INITIAL_PROJECT_FORM);
        setProjectMode('create');
    };

    const handleCancelProject = () => {
        setSelectedProject(null);
        setProjectFormData(INITIAL_PROJECT_FORM);
        setProjectMode('view');
    };

    const handleToggleVisibility = async (project) => {
        const updatedProject = { ...project, hidden: !project.hidden };
        await fetch(`/api/projects/${project.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProject)
        });
        onProjectUpdate();
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const endpoint = projectMode === 'edit'
            ? `/api/projects/${selectedProject}`
            : '/api/projects';
        const method = projectMode === 'edit' ? 'PUT' : 'POST';

        await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectFormData)
        });

        onProjectUpdate();
        handleCancelProject();
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteProject(selectedProject);
            handleCancelProject();
        }
    };

    // Client handlers
    const handleSelectClient = (client) => {
        setSelectedClient(client.id);
        setClientFormData(client);
        setClientMode('edit');
    };

    const handleAddNewClient = () => {
        setSelectedClient(null);
        setClientFormData(INITIAL_CLIENT_FORM);
        setClientMode('create');
    };

    const handleCancelClient = () => {
        setSelectedClient(null);
        setClientFormData(INITIAL_CLIENT_FORM);
        setClientMode('view');
    };

    const handleClientSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', clientFormData.name);
        if (clientFormData.logo_file) {
            formData.append('logo', clientFormData.logo_file);
        }

        if (clientMode === 'edit') {
            await updateClient(formData, selectedClient);
        } else {
            await createClient(formData);
        }

        onProjectUpdate();
        handleCancelClient();
    };

    const handleDeleteClient = async () => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            await deleteClient(selectedClient);
            handleCancelClient();
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setClientFormData(prev => ({
                ...prev,
                logo_file: file,
                logo_path: URL.createObjectURL(file)
            }));
        }
    };

    // Render tab content
    const renderProjectsTab = () => (
        <MasterDetailLayout
            photoMode={photoMode}
            listPanel={
                <ProjectListPanel
                    projects={projects}
                    photoMode={photoMode}
                    selectedId={selectedProject}
                    onSelect={handleSelectProject}
                    onAddNew={handleAddNewProject}
                    onToggleVisibility={handleToggleVisibility}
                />
            }
            detailPanel={
                projectMode === 'view' ? (
                    <EmptyDetailState photoMode={photoMode} type="project" />
                ) : (
                    <ProjectDetailForm
                        formData={projectFormData}
                        setFormData={setProjectFormData}
                        clients={clients}
                        photoMode={photoMode}
                        onSubmit={handleProjectSubmit}
                        onCancel={handleCancelProject}
                        onDelete={handleDeleteProject}
                        isEditing={projectMode === 'edit'}
                    />
                )
            }
        />
    );

    const renderClientsTab = () => (
        <MasterDetailLayout
            photoMode={photoMode}
            listPanel={
                <ClientListPanel
                    clients={clients}
                    photoMode={photoMode}
                    selectedId={selectedClient}
                    onSelect={handleSelectClient}
                    onAddNew={handleAddNewClient}
                />
            }
            detailPanel={
                clientMode === 'view' ? (
                    <EmptyDetailState photoMode={photoMode} type="client" />
                ) : (
                    <ClientDetailForm
                        formData={clientFormData}
                        setFormData={setClientFormData}
                        photoMode={photoMode}
                        onSubmit={handleClientSubmit}
                        onCancel={handleCancelClient}
                        onDelete={handleDeleteClient}
                        onLogoChange={handleLogoChange}
                        isEditing={clientMode === 'edit'}
                    />
                )
            }
        />
    );

    return (
        <div>
            <h2 className={`text-xl font-semibold mb-4 ${photoMode ? "text-gray-800" : ""}`}>
                Manage
            </h2>

            <TabSwitcher
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                photoMode={photoMode}
            />

            {activeTab === 'projects' ? renderProjectsTab() : renderClientsTab()}
        </div>
    );
};

export default ProjectSettings;
