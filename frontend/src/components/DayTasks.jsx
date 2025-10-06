import React, { useState } from 'react';
import { TaskForm } from './TaskForm';
import { Modal } from './Modal';
import { Trash2, Edit2 } from 'lucide-react';

// Task Item Component
const TaskItem = ({ task, project, onEdit, onDelete }) => (
    <div className="p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between items-start">
            <div>
                <div className="font-medium">
                    {task.title}
                    {task.recurring && (
                        <span className="ml-2 text-blue-400">({task.recurring})</span>
                    )}
                </div>
                <div className="text-sm" style={{ color: project.color, fontWeight: 'bold' }}>
                    {project.name}
                </div>
                {task.notes && (
                    <div className="text-sm text-gray-400 mt-1">
                        {task.notes}
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
                <div className="text-sm text-gray-400">
                    {task.hours} hour{task.hours !== 1 ? 's' : ''}
                </div>
                <button
                    className="text-blue-600 hover:text-blue-500"
                    onClick={() => onEdit(task)}
                >
                    <Edit2 size={16} />
                </button>
                <button
                    className="text-red-600 hover:text-red-500"
                    onClick={() => onDelete(task.id)}
                >
                    <Trash2 size={16} />
                </button>
            </div>
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
    isTaskEditActive,
    onEditTask,
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

    const handleOnEditTask = (task) => {
        onEditTask(true);
        setEditingTask(task);
    };

    const handleUpdateTask = async (updatedTask) => {
        await onUpdateTask(updatedTask);
        onUpdateTasks();
        setEditingTask(null);
        onEditTask(false);
    };

    const handleCloseEdit = () => {
        setEditingTask(null);
        onEditTask(false);
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
                        onEdit={handleOnEditTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </div>

            {editingTask && isTaskEditActive && (
                <Modal onClose={handleCloseEdit}>
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
