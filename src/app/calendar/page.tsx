// src/app/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getTasksByUserId } from '@/lib/firestore';
import { Task } from '@/types';
import Header from '@/components/layout/Header';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Link from 'next/link';
import TaskModal from '@/components/calendar/TaskModal';
import { EventInput } from '@fullcalendar/core';

export default function CalendarPage() {
  const [user, setUser] = useState<any | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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

  // Converte tarefas para eventos do FullCalendar
  const taskEvents: EventInput[] = tasks
  .filter(task => task.dueDate)
  .map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate!.toISOString().split('T')[0],
    backgroundColor: task.status === 'done'
      ? '#4ade80'
      : task.priority === 'high'
      ? '#f87171'
      : task.priority === 'medium'
      ? '#fbbf24'
      : '#60a5fa',
    borderColor: task.status === 'done'
      ? '#22c55e'
      : task.priority === 'high'
      ? '#ef4444'
      : task.priority === 'medium'
      ? '#f59e0b'
      : '#3b82f6',
    extendedProps: {
      task,
    },
  }));

  const handleEventClick = (info: any) => {
    const task = info.event.extendedProps.task;
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900">Carregando calendário...</div>
      </div>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendário</h1>
            <p className="text-gray-800 mt-1">
              Visualize suas tarefas por data de vencimento.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={taskEvents}
  eventClick={handleEventClick}
  headerToolbar={{
    left: 'title',
    center: '',
    right: 'today prev,next',
  }}
  themeSystem="standard"
  editable={false}
  selectable={false}
  dayMaxEventRows={3}
  eventDisplay="block"
  eventTimeFormat={{
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
  }}
  locale="pt-br"
/>
          </div>

          {/* Modal de Detalhes */}
          {selectedTask && (
            <TaskModal task={selectedTask} onClose={closeModal} />
          )}
        </div>
      </main>
    </>
  );
}