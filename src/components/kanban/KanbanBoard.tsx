// src/components/kanban/KanbanBoard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '@/types';
import { updateTask } from '@/lib/firestore';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  userId: string;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'doing', title: 'Fazendo' },
  { id: 'done', title: 'Concluído' },
];

export default function KanbanBoard({ tasks, userId }: KanbanBoardProps) {
  const [tasksState, setTasksState] = useState<Task[]>(tasks);

  useEffect(() => {
    setTasksState(tasks);
  }, [tasks]);

  // Configuração de sensores para evitar arrastos acidentais
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // requer pequeno movimento para iniciar o drag
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Se não houver destino (soltou fora de qualquer droppable), ignora
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Garante que o destino seja uma coluna válida
    const isValidColumn = COLUMNS.some((col) => col.id === overId);
    if (!isValidColumn) return;

    const activeTask = tasksState.find((t) => t.id === activeId);
    if (!activeTask || activeTask.status === overId) return;

    // Atualiza localmente
    const updatedTasks = tasksState.map((t) =>
      t.id === activeId ? { ...t, status: overId as TaskStatus } : t
    );
    setTasksState(updatedTasks);

    // Sincroniza com o banco
    await updateTask(activeId, { status: overId as TaskStatus });
  };

  // Agrupa tarefas por status
  const groupedTasks = COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = tasksState.filter((task) => task.status === column.id);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  return (
  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    {/* Container centralizado com padding e max-width */}
    <div className="max-w-6xl mx-auto px-6 py-4">
      {/* Flex container com espaçamento fixo entre colunas */}
      <div className="max-w-6xl mx-auto px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-500">
  <div className="flex gap-6 justify-center">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={groupedTasks[column.id]}
          />
        ))}
        </div>
      </div>
    </div>
  </DndContext>
);
}