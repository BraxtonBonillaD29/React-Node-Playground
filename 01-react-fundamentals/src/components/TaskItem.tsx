import React from 'react';
import type { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    return (
        <li className={`task-item ${task.status}`}>
            <div className="task-content">
                <button
                    onClick={() => onToggle(task.id)}
                    className="toggle-btn"
                    aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                >
                    {task.status === 'completed' && '✓'}
                </button>
                <span className="task-title">
                    {task.title}
                </span>
            </div>
            <button
                onClick={() => onDelete(task.id)}
                className="delete-btn"
                aria-label="Delete task"
            >
                ✕
            </button>
        </li>
    );
};
