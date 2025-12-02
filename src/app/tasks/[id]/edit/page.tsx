// src/app/tasks/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getTaskById, updateTask } from '@/lib/firestore';
import { Task, Priority } from '@/types';
import Header from '@/components/layout/Header';

export default function EditTaskPage() {
  const { id } = useParams();
  const taskId = Array.isArray(id) ? id[0] : id;

  const [user, setUser] = useState<any | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchTask(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router, taskId]);

  const fetchTask = async (userId: string) => {
    if (!taskId) {
      router.push('/dashboard');
      return;
    }

    const fetchedTask = await getTaskById(taskId);
    if (fetchedTask && fetchedTask.userId === userId) {
      setTask(fetchedTask);
      setTitle(fetchedTask.title);
      setDescription(fetchedTask.description || '');
      setDueDate(fetchedTask.dueDate ? fetchedTask.dueDate.toISOString().split('T')[0] : '');
      setPriority(fetchedTask.priority);
      // Garante que todas as sub-tarefas tenham um ID (compatibilidade)
      setSubtasks(
        fetchedTask.subtasks.map(st => ({
          id: st.id || Math.random().toString(36).substring(2, 9),
          title: st.title || '',
          completed: st.completed || false,
        }))
      );
    } else {
      setError('Tarefa não encontrada.');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        id: Math.random().toString(36).substring(2, 9), // ✅ ID gerado aqui
        title: '',
        completed: false,
      },
    ]);
  };

  const removeSubtask = (index: number) => {
    if (subtasks.length <= 1) return;
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  const updateSubtask = (index: number, field: 'title' | 'completed', value: string | boolean) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = { ...newSubtasks[index], [field]: value };
    setSubtasks(newSubtasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !task) return;

    if (!title.trim()) {
      setError('Título é obrigatório.');
      return;
    }

    setSaving(true);
    const updatedData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      subtasks: subtasks
        .filter(st => st.title.trim() !== '')
        .map(st => ({
          id: st.id, // ✅ Nunca regenera ID aqui
          title: st.title.trim(),
          completed: st.completed,
        })),
    };

    if (!taskId) {
      setSaving(false);
      setError('ID da tarefa inválido.');
      return;
    }

    const success = await updateTask(taskId, updatedData);
    setSaving(false);

    if (success) {
      router.push('/dashboard');
    } else {
      setError('Erro ao atualizar tarefa. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Tarefa</h1>
            <p className="mt-2 text-sm text-gray-600">
              Atualize os detalhes da sua tarefa.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {task && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    text-gray-900 bg-white"
                />
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    text-gray-900 bg-white"
                />
              </div>

              {/* Data de vencimento */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Data de vencimento
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    text-gray-900 bg-white"
                />
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <div className="flex space-x-4">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <label key={p} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === p}
                        onChange={() => setPriority(p)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-black ml-2 text-sm capitalize">
                        {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub-tarefas */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub-tarefas
                  </label>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    + Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => updateSubtask(index, 'completed', e.target.checked)}
                        className="h-5 w-5 text-indigo-600 rounded"
                      />
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                        placeholder={`Sub-tarefa ${index + 1}`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          text-gray-900 bg-white"
                      />
                      {subtasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubtask(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    saving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}