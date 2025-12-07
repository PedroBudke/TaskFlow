// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getTasksByUserId,
  updateTask,
  deleteTask,
} from '@/lib/firestore';
import { Task } from '@/types';
import Header from '@/components/layout/Header';
import {
  Card,
  Metric,
  Text,
  Title,
  Grid,
} from '@tremor/react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchTasks(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchTasks = async (userId: string) => {
    setLoading(true);
    const userTasks = await getTasksByUserId(userId);
    setTasks(userTasks);
    setLoading(false);
  };

  // Métricas baseadas em `status`
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const completedThisWeek = tasks.filter(t => {
    if (t.status !== 'done') return false;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return t.createdAt >= oneWeekAgo;
  });
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    if (!t.dueDate) return false;
    return t.dueDate < new Date();
  });

  const handleToggleComplete = async (task: Task) => {
    // Alterna entre "todo" e "done"
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const success = await updateTask(task.id, { status: newStatus });
    if (success) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
  };

  const handleDeleteClick = (taskId: string) => {
    setDeleteModal({ open: true, taskId });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.taskId) {
      const success = await deleteTask(deleteModal.taskId);
      if (success) {
        setTasks(tasks.filter(t => t.id !== deleteModal.taskId));
      }
    }
    setDeleteModal({ open: false, taskId: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ open: false, taskId: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg font-medium">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bem-vindo, {user?.displayName || 'usuário'}!
            </h1>
            <p className="text-gray-600 mt-1">Gerencie suas tarefas com fluidez.</p>
          </div>

          {/* Métricas */}
          <Grid numItemsSm={2} numItemsLg={3} className="mt-4 gap-4">
            <Card decoration="top" decorationColor="indigo">
              <Text className="text-gray-600 font-medium">Pendentes</Text>
              <Metric className="text-gray-900">{pendingTasks.length}</Metric>
            </Card>
            <Card decoration="top" decorationColor="green">
              <Text className="text-gray-600 font-medium">Concluídas (7 dias)</Text>
              <Metric className="text-gray-900">{completedThisWeek.length}</Metric>
            </Card>
            <Card decoration="top" decorationColor="red">
              <Text className="text-gray-600 font-medium">Vencidas</Text>
              <Metric className="text-gray-900">{overdueTasks.length}</Metric>
            </Card>
          </Grid>

          {/* Lista de Tarefas */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Minhas Tarefas</h2>
              <div className="flex gap-2">
                <Link
                  href="/calendar"
                  className="px-4 py-2 bg-white text-gray-800 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
                >
                  📅 Calendário
                </Link>
                <Link
                  href="/kanban"
                  className="px-4 py-2 bg-white text-gray-800 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
                >
                  📋 Kanban
                </Link>
                <Link
                  href="/tasks/new"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                >
                  + Nova Tarefa
                </Link>
              </div>
            </div>

            {tasks.length === 0 ? (
              <Card className="bg-white border border-gray-200">
                <Text className="text-gray-600">Nenhuma tarefa encontrada.</Text>
                <Link
                  href="/tasks/new"
                  className="mt-2 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Crie sua primeira tarefa
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const progress = totalSubtasks > 0
                    ? (completedSubtasks / totalSubtasks) * 100
                    : 0;

                  const isOverdue = task.status !== 'done' && task.dueDate && task.dueDate < new Date();

                  return (
                    <Card
                      key={task.id}
                      className={`bg-white border ${
                        task.status === 'done'
                          ? 'border-green-200'
                          : isOverdue
                          ? 'border-red-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3
                              className={`text-lg font-semibold ${
                                task.status === 'done'
                                  ? 'text-green-700 line-through'
                                  : 'text-gray-900'
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-gray-700 mt-1 text-sm">{task.description}</p>
                          )}

                          {task.dueDate && (
                            <p
                              className={`text-sm mt-1 ${
                                isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
                              }`}
                            >
                              Vencimento: {task.dueDate.toLocaleDateString('pt-BR')}
                            </p>
                          )}

                          {/* Barra de progresso (só depende de sub-tarefas) */}
                          {totalSubtasks > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm text-gray-700 mb-1">
                                <span>Progresso</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-indigo-600 h-2.5 rounded-full"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {completedSubtasks} de {totalSubtasks} sub-tarefas concluídas
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                              task.status === 'done'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {task.status === 'done' ? 'Concluída' : 'Concluir'}
                          </button>
                          <button
                            onClick={() => router.push(`/tasks/${task.id}/edit`)}
                            className="px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(task.id)}
                            className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900">Excluir Tarefa</h3>
              <p className="mt-2 text-gray-600">
                Tem certeza de que deseja excluir esta tarefa? Esta ação não poderá ser desfeita.
              </p>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sim, excluir
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}