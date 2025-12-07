// src/app/kanban/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getTasksByUserId } from '@/lib/firestore';
import { Task } from '@/types';
import Header from '@/components/layout/Header';
import KanbanBoard from '@/components/kanban/KanbanBoard';

export default function KanbanPage() {
  const [user, setUser] = useState<any | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900">Carregando quadro Kanban...</div>
      </div>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quadro Kanban</h1>
            <p className="text-gray-600 mt-1">Arraste e solte tarefas entre as colunas.</p>
          </div>

          <KanbanBoard tasks={tasks} userId={user.uid} />
        </div>
      </main>
    </>
  );
}
