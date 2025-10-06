import React from 'react';
import { calculateProjectMetrics, filterProjects, groupProjectsByClient } from '../utils/summaries';

// Reusable components
const ProjectCard = ({ project, hours, billing }) => (
    <div className="flex justify-between p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
            <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: project.color }}
            />
            <span>{project.name}</span>
        </div>
        <div className="text-right">
            <div>{hours.toFixed(2)} {hours === 1 ? 'hour' : 'hours'}</div>
            <div className="text-sm text-gray-400">
                {billing.toFixed(2)} €
            </div>
        </div>
    </div>
);

const ClientSection = ({ client, projects, tasks }) => {
    return (
        <div className="space-y-2">
            <div className="text-lg font-medium text-gray-300">
                {client ? client.name : 'Unknown Client'}
            </div>
            {projects.map(project => {
                const { hours, billing } = calculateProjectMetrics(tasks, project);
                return (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        hours={hours}
                        billing={billing}
                    />
                );
            })}
        </div>
    );
};

const TotalSummary = ({ hours, billing }) => (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <div className="flex justify-between">
            <div>
                <div>Hours:</div>
                <div>Billing:</div>
            </div>
            <div className="text-right">
                <div>{hours.toFixed(2)} {hours === 1 ? 'hour' : 'hours'}</div>
                <div>{billing.toFixed(2)} €</div>
            </div>
        </div>
    </div>
);

// Main component
export const Summary = ({ tasks, projects, clients, filter }) => {
    const filteredProjects = filterProjects(projects, filter);
    const groupedProjects = groupProjectsByClient(filteredProjects);

    // Calculate totals
    const totals = Object.values(groupedProjects).reduce((acc, clientProjects) => {
        clientProjects.forEach(project => {
            const { hours, billing } = calculateProjectMetrics(tasks, project);
            acc.hours += hours;
            acc.billing += billing;
        });
        return acc;
    }, { hours: 0, billing: 0 });

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
            <div className="space-y-6">
                {Object.entries(groupedProjects).map(([clientId, clientProjects]) => (
                    <ClientSection
                        key={clientId}
                        client={clients.find(c => c.id === clientId)}
                        projects={clientProjects}
                        tasks={tasks}
                    />
                ))}
            </div>
            <TotalSummary hours={totals.hours} billing={totals.billing} />
        </div>
    );
};

export default Summary;
