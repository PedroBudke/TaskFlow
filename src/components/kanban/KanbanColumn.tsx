// src/components/kanban/KanbanColumn.tsx
import { Task } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-lg p-4 min-w-[300px] w-[300px] h-[500px] flex flex-col"
    >
      <h2 className="font-bold text-gray-800 mb-3">{title}</h2>
      <div className="flex-grow overflow-y-auto space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}