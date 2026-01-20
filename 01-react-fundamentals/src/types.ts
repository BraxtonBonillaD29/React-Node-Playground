export type TaskStatus = 'pending' | 'completed';

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    createdAt: number;
}

export type Filter = 'all' | 'pending' | 'completed';
