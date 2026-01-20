import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task } from '../types';

// 1. Tipos de Estado y Acciones
type TaskState = {
    tasks: Task[];
};

type TaskAction =
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'TOGGLE_TASK'; payload: string }
    | { type: 'DELETE_TASK'; payload: string };

// 2. Reducer (Igual que antes, pero viviendo en el contexto)
function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload };
        case 'ADD_TASK':
            return { ...state, tasks: [action.payload, ...state.tasks] };
        case 'TOGGLE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
                ),
            };
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
        default:
            return state;
    }
}

// 3. Crear Contexto
const TaskContext = createContext<{
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
} | undefined>(undefined);

// 4. Provider Component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Inicializamos el reducer
    const [state, dispatch] = useReducer(taskReducer, { tasks: [] });

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
};

// 5. Custom Hook para consumir el contexto fácilmente
export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

// Exportamos los tipos para que los usen otros componentes
export type { TaskAction };
