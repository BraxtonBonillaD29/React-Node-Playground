import React, { useReducer, useMemo, useEffect, useState } from 'react';
import type { Task, Filter } from '../types';
import { useAsync } from '../hooks/useAsync';
import './TaskBoard.css';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from './TaskItem';



// --- Fake API ---
const fakeFetchTasks = (): Promise<Task[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', title: 'Learn React Core', status: 'completed', createdAt: Date.now() },
                { id: '2', title: 'Master TypeScript', status: 'pending', createdAt: Date.now() },
                { id: '3', title: 'Understand Event Loop', status: 'pending', createdAt: Date.now() },
            ]);
        }, 800);
    });
};

export const TaskBoard: React.FC = () => {

    const [filter, setFilter] = useState<Filter>('all');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const { state, dispatch } = useTasks();
    const { tasks } = state;
    const { status, data: fetchedData, error, run } = useAsync<Task[]>();

    // 1. Fetch on mount
    useEffect(() => {
        run(fakeFetchTasks());
    }, [run]);

    // 2. Sync Server State -> Client State
    useEffect(() => {
        if (status === 'success' && fetchedData) {
            dispatch({ type: 'SET_TASKS', payload: fetchedData });
        }
    }, [status, fetchedData]);

    // 3. Derived State (Filtering)
    const filteredTasks = useMemo(() => {
        if (filter === 'all') return tasks;
        return tasks.filter((t: Task) => t.status === filter);
    }, [tasks, filter]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: newTaskTitle,
            status: 'pending',
            createdAt: Date.now(),
        };

        dispatch({ type: 'ADD_TASK', payload: newTask });
        setNewTaskTitle('');
    };

    if (status === 'pending') return <div className="task-board"><p style={{ textAlign: 'center' }}>Loading tasks...</p></div>;
    if (status === 'error') return <div className="task-board"><p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p></div>;

    return (
        <div className="task-board">
            <header className="task-header">
                <h1>Task Board</h1>
                <p>Managing client state synchronized with server data.</p>
            </header>

            {/* Controls */}
            <div className="task-filters">
                {(['all', 'pending', 'completed'] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Add Task */}
            <form onSubmit={handleAddTask} className="add-task-form">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="task-input"
                />
                <button
                    type="submit"
                    className="add-btn"
                    disabled={!newTaskTitle.trim()}
                >
                    Add
                </button>
            </form>

            {/* List */}
            <ul className="task-list">
                {filteredTasks.length === 0 ? (
                    <li className="empty-state">No tasks found</li>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', payload: id })}
                            onDelete={(id) => dispatch({ type: 'DELETE_TASK', payload: id })}
                        />
                    ))
                )}
            </ul>

            <footer className="task-footer">
                <span>Total: {tasks.length}</span>
                <span>Showing: {filteredTasks.length}</span>
            </footer>
        </div>
    );
};
