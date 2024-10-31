export const filterProjects = (projects, filter) => {
    return projects.filter(project => {
        if (filter.project && project.id !== filter.project) return false;
        if (filter.client && project.client_id !== filter.client) return false;
        return true;
    });
};

export const groupProjectsByClient = (projects) => {
    return projects.reduce((acc, project) => {
        const clientId = project.client_id;
        if (!acc[clientId]) {
            acc[clientId] = [];
        }
        acc[clientId].push(project);
        return acc;
    }, {});
};

export const calculateProjectMetrics = (tasks, project) => {
    const projectTasks = tasks.filter(task => task.project_id === project.id);
    const hours = projectTasks.reduce((sum, task) => sum + parseFloat(task.hours), 0);
    const billing = hours * project.hourly_rate;

    return { hours, billing };
};
