import React, { useCallback, useEffect, useState } from 'react';
import { Calendar } from './components/Calendar';
import { DayTasks } from './components/DayTasks';
import { Header } from './components/Header';
import { ProjectSettings } from './components/Manage';
import { Modal } from './components/Modal';
import { Summary } from './components/Summary';
import { PhotoModeSummary } from './components/SummaryPhoto';
import { TaskForm } from './components/TaskForm';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { apiService } from './services/api';
import { formatDate, parseDate } from './utils/dateHelpers';

const App = () => {
    const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [isTaskWindowActive, setIsTaskWindowActive] = useState(false);
    const [isTaskEditActive, setIsTaskEditActive] = useState(false);
    const [isManageWindowActive, setIsManageWindowActive] = useState(false);
    const [filter, setFilter] = useState({ client: null, project: null });
    const [photoMode, setPhotoMode] = useState(false);

    const refreshData = useCallback(async () => {
        const date = parseDate(selectedDate);
        const [newTasks, newClients, newProjects] = await Promise.all([
            apiService.fetchMonthData(date),
            apiService.fetchClients(),
            apiService.fetchProjects()
        ]);

        setTasks(newTasks);
        setClients(newClients);
        setProjects(newProjects);
    }, [selectedDate]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    useKeyboardShortcuts(
        isManageWindowActive,
        isTaskWindowActive,
        isTaskEditActive,
        setIsManageWindowActive,
        setIsTaskWindowActive,
        setIsTaskEditActive,
        setSelectedDate
    );

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    const handleClientOperations = {
        create: async (formData) => {
            await apiService.createClient(formData);
            await refreshData();
        },
        update: async (formData, clientId) => {
            await apiService.updateClient(formData, clientId);
            await refreshData();
        },
        delete: async (clientId) => {
            await apiService.deleteClient(clientId);
            await refreshData();
        }
    };

    const handleTaskOperations = {
        create: async (taskData) => {
            await apiService.createTask(taskData);
            await refreshData();
            setIsTaskWindowActive(false);
        },
        update: async (updatedTask) => {
            await apiService.updateTask(updatedTask);
            await refreshData();
            setIsTaskEditActive(false);
        },
        delete: async (taskId) => {
            await apiService.deleteTask(taskId);
            await refreshData();
        }
    };

    return (
        <div className={`min-h-screen ${photoMode ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-100'}`}>
            <div className="container mx-auto py-1">
                <Header
                    filter={filter}
                    clients={clients}
                    projects={projects}
                    handleFilterChange={handleFilterChange}
                    setIsManageWindowActive={setIsManageWindowActive}
                    photoMode={photoMode}
                    setPhotoMode={setPhotoMode}
                />

                <div className={`${photoMode ? 'border-2 border-gray-200 p-6' : ''}`}>
                    <div className="flex flex-wrap -mx-4">
                        <div className={`w-full md:w-3/4 px-4`}>
                            <Calendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                tasks={tasks}
                                projects={projects}
                                filter={filter}
                                photoMode={photoMode}
                            />
                        </div>

                        <div className="w-full md:w-1/4 px-4">
                            {!photoMode ? (
                                <div className="space-y-6">
                                    <DayTasks
                                        tasks={tasks}
                                        selectedDate={selectedDate}
                                        projects={projects}
                                        clients={clients}
                                        onUpdateTasks={refreshData}
                                        onNewTask={() => setIsTaskWindowActive(true)}
                                        isTaskEditActive={isTaskEditActive}
                                        onEditTask={(flag) => setIsTaskEditActive(flag)}
                                        onUpdateTask={handleTaskOperations.update}
                                        onDeleteTask={handleTaskOperations.delete}
                                    />
                                    <Summary
                                        tasks={tasks}
                                        projects={projects}
                                        clients={clients}
                                        filter={filter}
                                    />
                                </div>
                            ) : (
                                <PhotoModeSummary
                                    tasks={tasks}
                                    projects={projects}
                                    clients={clients}
                                    filter={filter}
                                />
                            )}
                        </div>
                    </div>

                    {isTaskWindowActive && !photoMode && (
                        <Modal onClose={() => setIsTaskWindowActive(false)} photoMode={photoMode}>
                            <TaskForm
                                selectedDate={selectedDate}
                                projects={projects}
                                clients={clients}
                                onSubmit={handleTaskOperations.create}
                            />
                        </Modal>
                    )}

                    {isManageWindowActive && (
                        <Modal onClose={() => setIsManageWindowActive(false)} photoMode={photoMode} size="large">
                            <ProjectSettings
                                projects={projects}
                                clients={clients}
                                onProjectUpdate={refreshData}
                                createClient={handleClientOperations.create}
                                updateClient={handleClientOperations.update}
                                deleteClient={handleClientOperations.delete}
                                deleteProject={async (projectId) => {
                                    await apiService.deleteProject(projectId);
                                    await refreshData();
                                }}
                                photoMode={photoMode}
                            />
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;