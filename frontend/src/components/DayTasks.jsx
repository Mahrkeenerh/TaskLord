import React, { useState } from 'react';
import { TaskForm } from './TaskForm';
import { Modal } from './Modal';

// Task Item Component
const TaskItem = ({ task, project, onEdit, onDelete }) => (
    <div className="p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between">
            <div>
                {project?.name}
                {task.recurring && (
                    <span className="ml-2 text-blue-400">({task.recurring})</span>
                )}
            </div>
            <div className="text-sm text-gray-400">
                {task.hours} hour{task.hours !== 1 ? 's' : ''}
            </div>
        </div>
        <div className="text-sm text-gray-400 mt-1">{task.notes}</div>
        <div className="flex justify-end mt-2 space-x-2">
            <button
                className="text-blue-500 hover:text-blue-300"
                onClick={() => onEdit(task)}
            >
                Edit
            </button>
            <button
                className="text-red-500 hover:text-red-300"
                onClick={() => onDelete(task.id)}
            >
                Delete
            </button>
        </div>
    </div>
);

// Header Component
const Header = ({ selectedDate, onNewTask }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{selectedDate}</h2>
        <button
            onClick={onNewTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
            New Task
        </button>
    </div>
);

// Main Component
export const DayTasks = ({
    tasks,
    selectedDate,
    projects,
    clients,
    onUpdateTasks,
    onNewTask,
    onUpdateTask,
    onDeleteTask,
}) => {
    const [editingTask, setEditingTask] = useState(null);
    const dayTasks = tasks.filter(task => task.date === selectedDate);

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await onDeleteTask(taskId);
            onUpdateTasks();
        }
    };

    const handleUpdateTask = async (updatedTask) => {
        await onUpdateTask(updatedTask);
        onUpdateTasks();
        setEditingTask(null);
    };

    return (
        <div>
            <Header selectedDate={selectedDate} onNewTask={onNewTask} />

            <div className="space-y-2">
                {dayTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        project={projects.find(p => p.id === task.project_id)}
                        onEdit={setEditingTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </div>

            {editingTask && (
                <Modal onClose={() => setEditingTask(null)}>
                    <TaskForm
                        selectedDate={selectedDate}
                        projects={projects}
                        clients={clients}
                        onSubmit={handleUpdateTask}
                        initialTask={editingTask}
                    />
                </Modal>
            )}
        </div>
    );
};

export default DayTasks;
