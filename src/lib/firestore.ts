// src/lib/firestore.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, Subtask } from '@/types';

// Converte Date para timestamp do Firestore
const toFirestoreTimestamp = (date: Date | null | undefined) => {
  if (!date) return null;
  return date;
};

// Converte timestamp do Firestore para Date
const fromFirestoreTimestamp = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate ? timestamp.toDate() : null;
};

// CRIAR TAREFA
export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? toFirestoreTimestamp(task.dueDate) : null,
      priority: task.priority,
      subtasks: task.subtasks,
      userId: task.userId,
      status: 'todo', // ← padrão
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return null;
  }
};

// BUSCAR TAREFAS DO USUÁRIO
export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        title: data.title,
        description: data.description || '',
        dueDate: fromFirestoreTimestamp(data.dueDate),
        priority: data.priority || 'medium',
        status: data.status || 'todo',
        subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
        createdAt: fromFirestoreTimestamp(data.createdAt) || new Date(),
        userId: data.userId,
      });
    });

    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
};

// ATUALIZAR TAREFA
export const updateTask = async (taskId: string, task: Partial<Task>): Promise<boolean> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...task,
      dueDate: task.dueDate ? toFirestoreTimestamp(task.dueDate) : null,
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return false;
  }
};

// DELETAR TAREFA
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return false;
  }
};

// Buscar tarefa por ID
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const docRef = doc(db, 'tasks', taskId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description || '',
        dueDate: fromFirestoreTimestamp(data.dueDate),
        priority: data.priority || 'medium',
        status: data.status || 'todo',
        subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
        createdAt: fromFirestoreTimestamp(data.createdAt) || new Date(),
        userId: data.userId,
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return null;
  }
};