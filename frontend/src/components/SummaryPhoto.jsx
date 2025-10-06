import React from 'react';
import { filterProjects, groupProjectsByClient, calculateProjectMetrics } from '../utils/summaries';

// Reusable components
const ClientLogo = ({ client }) => {
    if (!client?.logo_path) return null;

    return (
        <div className="flex flex-col items-center space-y-4 mb-8">
            <img
                src={client.logo_path}
                alt={`${client.name} logo`}
                className="object-contain"
            />
        </div>
    );
};

const ProjectCard = ({ project, hours, billing }) => (
    <div className="flex justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
            <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: project.color }}
            />
            <span className="text-gray-800">{project.name}</span>
        </div>
        <div className="text-right">
            <div className="text-gray-800">
                {hours.toFixed(2)} {hours === 1 ? 'hour' : 'hours'}
            </div>
            <div className="text-sm text-gray-600">
                {billing.toFixed(2)} €
            </div>
        </div>
    </div>
);

const ClientSection = ({ client, projects, tasks, showClientName }) => {
    // Filter out projects with zero hours
    const projectsWithHours = projects.filter(project => {
        const { hours } = calculateProjectMetrics(tasks, project);
        return hours > 0;
    });

    // Don't render the section if no projects have hours
    if (projectsWithHours.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {showClientName && (
                <div className="text-lg font-medium text-gray-800">
                    {client ? client.name : 'Unknown Client'}
                </div>
            )}
            {projectsWithHours.map(project => {
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
    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Summary</h3>
        <div className="flex justify-between">
            <div className="text-gray-800">
                <div>Hours:</div>
                <div>Billing:</div>
            </div>
            <div className="text-right text-gray-800">
                <div>{hours.toFixed(2)} {hours === 1 ? 'hour' : 'hours'}</div>
                <div>{billing.toFixed(2)} €</div>
            </div>
        </div>
    </div>
);

// Main component
export const PhotoModeSummary = ({ tasks, projects, clients, filter }) => {
    const filteredProjects = filterProjects(projects, filter);
    const groupedProjects = groupProjectsByClient(filteredProjects);
    const selectedClient = filter.client ? clients.find(c => c.id === filter.client) : null;

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
        <div className="space-y-6">
            <ClientLogo client={selectedClient} />

            <div className="space-y-6">
                {Object.entries(groupedProjects).map(([clientId, clientProjects]) => (
                    <ClientSection
                        key={clientId}
                        client={clients.find(c => c.id === clientId)}
                        projects={clientProjects}
                        tasks={tasks}
                        showClientName={!selectedClient}
                    />
                ))}
            </div>

            <TotalSummary hours={totals.hours} billing={totals.billing} />
        </div>
    );
};

export default PhotoModeSummary;
