// src/components/kanban/TaskCard.tsx
import { Task } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColor =
    task.priority === 'high'
      ? 'border-red-300 bg-red-50'
      : task.priority === 'medium'
      ? 'border-yellow-300 bg-yellow-50'
      : 'border-blue-300 bg-blue-50';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move ${priorityColor}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
      </div>
      {task.dueDate && (
        <p className="text-xs text-gray-600 mt-1">
          Vencimento: {task.dueDate.toLocaleDateString('pt-BR')}
        </p>
      )}
      {task.subtasks.length > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{
                width: `${task.subtasks.length > 0 ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length}
          </p>
        </div>
      )}
    </div>
  );
}