// src/app/tasks/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createTask } from '@/lib/firestore';
import { Priority } from '@/types';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function NewTaskPage() {
  const [user, setUser] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [subtasks, setSubtasks] = useState<{ title: string }[]>([{ title: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: '' }]);
  };

  const removeSubtask = (index: number) => {
    if (subtasks.length <= 1) return;
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  const updateSubtask = (index: number, title: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = title;
    setSubtasks(newSubtasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      setError('Título é obrigatório.');
      return;
    }

    setLoading(true);
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      completed: false,
      subtasks: subtasks
        .filter(st => st.title.trim() !== '')
        .map(st => ({
          id: Math.random().toString(36).substring(2, 9),
          title: st.title.trim(),
          completed: false,
        })),
      userId: user.uid,
    };

    const taskId = await createTask(newTask);
    setLoading(false);

    if (taskId) {
      router.push('/dashboard');
    } else {
      setError('Erro ao criar tarefa. Tente novamente.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Tarefa</h1>
            <p className="mt-2 text-sm text-gray-600">
              Criar uma nova tarefa para organizar seu dia.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

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
                  <label key={p} className="text-black inline-flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === p}
                      onChange={() => setPriority(p)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm capitalize">
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
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => updateSubtask(index, e.target.value)}
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
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Criando...' : 'Criar Tarefa'}
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
        </div>
      </div>
    </>
  );
}