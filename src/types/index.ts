export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: Priority;
  status: TaskStatus; 
  subtasks: Subtask[];
  createdAt: Date;
  userId: string;
}