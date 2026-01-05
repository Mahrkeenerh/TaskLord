import React, { useState } from 'react';
import { Trash2, Edit2, Eye, EyeOff, Plus } from 'lucide-react';
import { getCurrentRate } from '../utils/summaries';

const INITIAL_PROJECT_FORM = {
    id: '',
    name: '',
    client_id: '',
    color: '#3B82F6',
    rate_changes: [{ hourly_rate: '', effective_date: null }],
    hidden: false
};

const INITIAL_CLIENT_FORM = {
    id: '',
    name: '',
    logo_path: ''
};

const StyledCard = ({ photoMode, children }) => {
    const className = photoMode
        ? "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
        : "flex items-center justify-between p-3 bg-gray-700 rounded-lg";

    return <div className={className}>{children}</div>;
};

const Input = ({ photoMode, ...props }) => {
    const className = photoMode
        ? "w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
        : "w-full bg-gray-700 rounded-lg p-2";

    return <input className={className} {...props} />;
};

const Button = ({ photoMode, children, ...props }) => {
    const className = photoMode
        ? "w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-500"
        : "w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-500";

    return <button className={className} {...props}>{children}</button>;
};

const Label = ({ photoMode, children }) => {
    const className = photoMode
        ? "block text-sm font-medium mb-1 text-gray-700"
        : "block text-sm font-medium mb-1";

    return <label className={className}>{children}</label>;
};

const RateChangeList = ({ rateChanges, onChange, photoMode }) => {
    // Sort for display: original (null date) first, then by date ascending
    const sortedRates = [...rateChanges].sort((a, b) => {
        if (a.effective_date === null) return -1;
        if (b.effective_date === null) return 1;
        return a.effective_date.localeCompare(b.effective_date);
    });

    const handleAddRate = () => {
        const today = new Date().toISOString().split('T')[0];
        const newRate = {
            hourly_rate: '',
            effective_date: today
        };
        onChange([...rateChanges, newRate]);
    };

    const handleUpdateRate = (targetRate, field, value) => {
        const updated = rateChanges.map(r => {
            if (r.effective_date === targetRate.effective_date) {
                return { ...r, [field]: field === 'hourly_rate' ? value : value };
            }
            return r;
        });
        onChange(updated);
    };

    const handleDeleteRate = (targetRate) => {
        if (rateChanges.length <= 1) {
            alert('Cannot delete the only rate');
            return;
        }
        const filtered = rateChanges.filter(r => r.effective_date !== targetRate.effective_date);
        onChange(filtered);
    };

    const canDelete = rateChanges.length > 1;

    return (
        <div className="space-y-2">
            <Label photoMode={photoMode}>Rate History</Label>

            {sortedRates.map((rate) => (
                <div
                    key={rate.effective_date || 'original'}
                    className={`flex items-center gap-2 p-2 rounded ${
                        photoMode ? 'bg-gray-100' : 'bg-gray-600'
                    }`}
                >
                    <div className="flex-1">
                        {rate.effective_date === null ? (
                            <span className={`text-sm ${photoMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                Original
                            </span>
                        ) : (
                            <input
                                type="date"
                                value={rate.effective_date}
                                onChange={(e) => handleUpdateRate(rate, 'effective_date', e.target.value)}
                                className={`text-sm ${
                                    photoMode
                                        ? 'bg-white border border-gray-200 rounded p-1 text-gray-800'
                                        : 'bg-gray-700 rounded p-1'
                                }`}
                            />
                        )}
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        value={rate.hourly_rate}
                        onChange={(e) => handleUpdateRate(rate, 'hourly_rate', e.target.value)}
                        placeholder="Rate"
                        className={`w-24 ${
                            photoMode
                                ? 'bg-white border border-gray-200 rounded p-1 text-gray-800'
                                : 'bg-gray-700 rounded p-1'
                        }`}
                        required
                    />
                    <span className={photoMode ? 'text-gray-600' : ''}>€/h</span>
                    {canDelete && rate.effective_date !== null && (
                        <button
                            type="button"
                            onClick={() => handleDeleteRate(rate)}
                            className="text-red-500 hover:text-red-400"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddRate}
                className={`flex items-center gap-1 text-sm ${
                    photoMode ? 'text-blue-600' : 'text-blue-400'
                } hover:underline`}
            >
                <Plus size={16} />
                Add rate change
            </button>
        </div>
    );
};

const ProjectList = ({ projects, photoMode, onEdit, onDelete, onToggleVisibility }) => (
    <div className="grid gap-2">
        {projects.map(project => {
            const rateCount = project.rate_changes?.length || 1;
            return (
                <StyledCard key={project.id} photoMode={photoMode}>
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: project.color }}
                        />
                        <span className={photoMode ? "text-gray-800" : ""}>{project.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={photoMode ? "text-gray-800" : ""}>
                            {getCurrentRate(project)}€/h
                            {rateCount > 1 && (
                                <span className="text-xs text-gray-500 ml-1">({rateCount})</span>
                            )}
                        </span>
                        <button
                            onClick={() => onToggleVisibility(project)}
                            className="text-gray-400 hover:text-gray-300"
                            title={project.hidden ? "Show project" : "Hide project"}
                        >
                            {project.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                            onClick={() => onEdit(project)}
                            className="text-blue-600 hover:text-blue-500"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(project.id)} className="text-red-600 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </StyledCard>
            );
        })}
    </div>
);

const ClientList = ({ clients, photoMode, onEdit, onDelete }) => (
    <div className="grid gap-2">
        {clients.map(client => (
            <StyledCard key={client.id} photoMode={photoMode}>
                <div className="flex items-center space-x-3">
                    {client.logo_path && (
                        <img
                            src={client.logo_path}
                            alt={`${client.name} logo`}
                            className="w-8 h-8 object-contain"
                        />
                    )}
                    <span className={photoMode ? "text-gray-800" : ""}>{client.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => onEdit(client)} className="text-blue-600 hover:text-blue-500">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(client.id)} className="text-red-600 hover:text-red-500">
                        <Trash2 size={16} />
                    </button>
                </div>
            </StyledCard>
        ))}
    </div>
);

const ProjectForm = ({ formData, setFormData, clients, photoMode, onSubmit, isEditing }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <h3 className={`font-medium ${photoMode ? "text-gray-800" : ""}`}>
            {isEditing ? 'Edit Project' : 'Add New Project'}
        </h3>

        <div>
            <Label photoMode={photoMode}>Client</Label>
            <select
                value={formData.client_id}
                onChange={e => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                className={photoMode ? "w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-800" : "w-full bg-gray-700 rounded-lg p-2"}
                required
            >
                <option value="">Select a client</option>
                {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                ))}
            </select>
        </div>

        <div>
            <Label photoMode={photoMode}>Project Name</Label>
            <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                photoMode={photoMode}
                required
            />
        </div>

        <div>
            <Label photoMode={photoMode}>Color</Label>
            <Input
                type="color"
                value={formData.color}
                onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="h-10 p-1"
                photoMode={photoMode}
                required
            />
        </div>

        <RateChangeList
            rateChanges={formData.rate_changes || []}
            onChange={(newRates) => setFormData(prev => ({ ...prev, rate_changes: newRates }))}
            photoMode={photoMode}
        />

        <Button type="submit" photoMode={photoMode}>
            {isEditing ? 'Update Project' : 'Add Project'}
        </Button>
    </form>
);

const ClientForm = ({ formData, setFormData, photoMode, onSubmit, isEditing, onLogoChange }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <h3 className={`font-medium ${photoMode ? "text-gray-800" : ""}`}>
            {isEditing ? 'Edit Client' : 'Add New Client'}
        </h3>

        <div>
            <Label photoMode={photoMode}>Client Name</Label>
            <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                photoMode={photoMode}
                required
            />
        </div>

        <div>
            <Label photoMode={photoMode}>Client Logo</Label>
            <Input
                type="file"
                accept="image/*"
                onChange={onLogoChange}
                photoMode={photoMode}
            />
            {formData.logo_path && (
                <img
                    src={formData.logo_path}
                    alt="Logo preview"
                    className="mt-2 h-20 object-contain"
                />
            )}
        </div>

        <Button type="submit" photoMode={photoMode}>
            {isEditing ? 'Update Client' : 'Add Client'}
        </Button>
    </form>
);

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
    const [projectFormData, setProjectFormData] = useState(INITIAL_PROJECT_FORM);
    const [clientFormData, setClientFormData] = useState(INITIAL_CLIENT_FORM);
    const [editingProject, setEditingProject] = useState(null);
    const [editingClient, setEditingClient] = useState(null);

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
        const endpoint = editingProject ? `/api/projects/${editingProject}` : '/api/projects';
        const method = editingProject ? 'PUT' : 'POST';

        await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectFormData)
        });

        onProjectUpdate();
        setProjectFormData(INITIAL_PROJECT_FORM);
        setEditingProject(null);
    };

    const handleClientSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', clientFormData.name);
        if (clientFormData.logo_file) {
            formData.append('logo', clientFormData.logo_file);
        }

        if (editingClient) {
            await updateClient(formData, editingClient);
        } else {
            await createClient(formData);
        }

        onProjectUpdate();
        setClientFormData(INITIAL_CLIENT_FORM);
        setEditingClient(null);
    };

    const handleEditProject = (project) => {
        // Ensure rate_changes is properly set (handle legacy format)
        const projectData = {
            ...project,
            rate_changes: project.rate_changes || [{
                hourly_rate: project.hourly_rate || 0,
                effective_date: null
            }]
        };
        setProjectFormData(projectData);
        setEditingProject(project.id);
    };

    const handleEditClient = (client) => {
        setClientFormData(client);
        setEditingClient(client.id);
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteProject(projectId);
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            await deleteClient(clientId);
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

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-semibold mb-4 ${photoMode ? "text-gray-800" : ""}`}>
                Manage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-full">
                {/* Projects Column */}
                <div className="space-y-6 min-w-0">
                    <div className="space-y-4">
                        <h3 className={`font-medium ${photoMode ? "text-gray-800" : ""}`}>Projects</h3>
                        <ProjectList
                            projects={projects}
                            photoMode={photoMode}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                            onToggleVisibility={handleToggleVisibility}
                        />
                    </div>

                    <ProjectForm
                        formData={projectFormData}
                        setFormData={setProjectFormData}
                        clients={clients}
                        photoMode={photoMode}
                        onSubmit={handleProjectSubmit}
                        isEditing={!!editingProject}
                    />
                </div>

                {/* Clients Column */}
                <div className="space-y-6 min-w-0">
                    <div className="space-y-4">
                        <h3 className={`font-medium ${photoMode ? "text-gray-800" : ""}`}>Clients</h3>
                        <ClientList
                            clients={clients}
                            photoMode={photoMode}
                            onEdit={handleEditClient}
                            onDelete={handleDeleteClient}
                        />
                    </div>

                    <ClientForm
                        formData={clientFormData}
                        setFormData={setClientFormData}
                        photoMode={photoMode}
                        onSubmit={handleClientSubmit}
                        isEditing={!!editingClient}
                        onLogoChange={handleLogoChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectSettings;
