export const filterProjects = (projects, filter) => {
    return projects.filter(project => {
        if (project.hidden) return false;
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

/**
 * Get the applicable rate for a given date from a project's rate_changes
 */
export const getRateForDate = (project, dateStr) => {
    const rateChanges = project.rate_changes || [];

    // If no rate_changes (legacy), use hourly_rate
    if (rateChanges.length === 0 && project.hourly_rate !== undefined) {
        return project.hourly_rate;
    }

    // Sort: null/original first, then by date ascending
    const sorted = [...rateChanges].sort((a, b) => {
        if (a.effective_date === null) return -1;
        if (b.effective_date === null) return 1;
        return a.effective_date.localeCompare(b.effective_date);
    });

    let applicableRate = sorted[0]?.hourly_rate || 0;

    for (const rc of sorted) {
        if (rc.effective_date === null || rc.effective_date <= dateStr) {
            applicableRate = rc.hourly_rate;
        } else {
            break;
        }
    }

    return applicableRate;
};

/**
 * Get the current rate for display purposes
 */
export const getCurrentRate = (project) => {
    const today = new Date().toISOString().split('T')[0];
    return getRateForDate(project, today);
};

export const calculateProjectMetrics = (tasks, project) => {
    const projectTasks = tasks.filter(task => task.project_id === project.id);

    let hours = 0;
    let billing = 0;

    for (const task of projectTasks) {
        const taskHours = parseFloat(task.hours);
        const rate = getRateForDate(project, task.date);
        hours += taskHours;
        billing += taskHours * rate;
    }

    return { hours, billing };
};
