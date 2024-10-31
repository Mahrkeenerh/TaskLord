import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const RECURRING_OPTIONS = {
    NONE: { value: '', label: 'Not recurring' },
    DAILY: { value: 'daily', label: 'Daily' },
    WEEKLY: { value: 'weekly', label: 'Weekly' },
    MONTHLY: { value: 'monthly', label: 'Monthly' }
};

export const formStyles = {
    input: "w-full bg-gray-700 rounded-lg p-2",
    label: "block text-sm font-medium mb-1",
    button: "w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-500",
    form: "space-y-4",
    select: "w-full bg-gray-700 rounded-lg p-2"
};

const FormField = ({ label, children }) => (
    <div>
        <label className={formStyles.label}>{label}</label>
        {children}
    </div>
);

export const TaskForm = ({
    selectedDate,
    projects,
    clients,
    onSubmit,
    initialTask = null
}) => {
    const [formData, setFormData] = useState({
        client_id: initialTask?.client_id || '',
        project_id: initialTask?.project_id || '',
        date: initialTask?.date || selectedDate,
        hours: initialTask?.hours || '',
        notes: initialTask?.notes || '',
        recurring: initialTask?.recurring || ''
    });

    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        if (formData.client_id) {
            const projectsForClient = projects.filter(
                project => project.client_id === formData.client_id
            );
            setFilteredProjects(projectsForClient);

            if (!initialTask) {
                setFormData(prev => ({ ...prev, project_id: '' }));
            }
        } else {
            setFilteredProjects([]);
        }
    }, [formData.client_id, projects, initialTask]);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleClientChange = (e) => {
        setFormData(prev => ({
            ...prev,
            client_id: e.target.value,
            project_id: ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            ...(initialTask && { id: initialTask.id })
        };
        onSubmit(submissionData);
    };

    // Only show recurring field if:
    // 1. It's a new task OR
    // 2. It's an existing recurring task
    const shouldShowRecurring = !initialTask || initialTask.recurring;

    return (
        <form onSubmit={handleSubmit} className={formStyles.form}>
            <h2 className="text-xl font-semibold mb-4">
                {initialTask ? 'Edit Task' : 'New Task'}
            </h2>

            <FormField label="Client">
                <select
                    value={formData.client_id}
                    onChange={handleClientChange}
                    className={formStyles.select}
                    required
                >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Project">
                <select
                    value={formData.project_id}
                    onChange={handleChange('project_id')}
                    className={formStyles.select}
                    required
                    disabled={!formData.client_id}
                >
                    <option value="">Select a project</option>
                    {filteredProjects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Hours">
                <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={formData.hours}
                    onChange={handleChange('hours')}
                    className={formStyles.input}
                    required
                />
            </FormField>

            <FormField label="Notes">
                <textarea
                    value={formData.notes}
                    onChange={handleChange('notes')}
                    className={formStyles.input}
                    rows="3"
                />
            </FormField>

            {shouldShowRecurring && (
                <FormField label="Recurring">
                    <select
                        value={formData.recurring}
                        onChange={handleChange('recurring')}
                        className={formStyles.select}
                    >
                        {!initialTask ? (
                            // New task - show all options
                            Object.values(RECURRING_OPTIONS).map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        ) : (
                            // Editing recurring task - show current option and not recurring
                            [
                                RECURRING_OPTIONS.NONE,
                                {
                                    value: initialTask.recurring,
                                    label: initialTask.recurring.charAt(0).toUpperCase() + initialTask.recurring.slice(1)
                                }
                            ].map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        )}
                    </select>
                </FormField>
            )}

            <button
                type="submit"
                className={formStyles.button}
            >
                {initialTask ? 'Update Task' : 'Add Task'}
            </button>
        </form>
    );
};

TaskForm.propTypes = {
    selectedDate: PropTypes.string.isRequired,
    projects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        client_id: PropTypes.string.isRequired
    })).isRequired,
    clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialTask: PropTypes.shape({
        id: PropTypes.string,
        client_id: PropTypes.string,
        project_id: PropTypes.string,
        date: PropTypes.string,
        hours: PropTypes.number,
        notes: PropTypes.string,
        recurring: PropTypes.string
    })
};

export default TaskForm;
