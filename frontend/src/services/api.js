const API_ENDPOINTS = {
    TASKS: '/api/tasks',
    CLIENTS: '/api/clients',
    PROJECTS: '/api/projects'
};

export const apiService = {
    async fetchMonthData(date) {
        const response = await fetch(
            `${API_ENDPOINTS.TASKS}/${date.getFullYear()}/${date.getMonth() + 1}`
        );
        const data = await response.json();
        return data.tasks || [];
    },

    async fetchClients() {
        const response = await fetch(API_ENDPOINTS.CLIENTS);
        return await response.json() || [];
    },

    async fetchProjects() {
        const response = await fetch(API_ENDPOINTS.PROJECTS);
        return await response.json() || [];
    },

    async deleteProject(projectId) {
        await fetch(`${API_ENDPOINTS.PROJECTS}/${projectId}`, {
            method: 'DELETE'
        });
    },

    async createClient(formData) {
        await fetch(API_ENDPOINTS.CLIENTS, {
            method: 'POST',
            body: formData,
        });
    },

    async updateClient(formData, clientId) {
        await fetch(`${API_ENDPOINTS.CLIENTS}/${clientId}`, {
            method: 'PUT',
            body: formData,
        });
    },

    async deleteClient(clientId) {
        await fetch(`${API_ENDPOINTS.CLIENTS}/${clientId}`, {
            method: 'DELETE'
        });
    },

    async createTask(taskData) {
        await fetch(API_ENDPOINTS.TASKS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
    },

    async updateTask(updatedTask) {
        await fetch(`${API_ENDPOINTS.TASKS}/${updatedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
    },

    async deleteTask(taskId) {
        await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
            method: 'DELETE'
        });
    }
};
