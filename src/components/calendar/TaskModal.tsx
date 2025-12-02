// src/components/calendar/TaskModal.tsx
import { Task } from '@/types';
import Link from 'next/link';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Fechar"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {task.description && (
          <p className="mt-2 text-gray-700">{task.description}</p>
        )}

        <div className="mt-4 space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-600">Vencimento:</span>
            <span className="ml-2 text-gray-900">
              {task.dueDate ? task.dueDate.toLocaleDateString('pt-BR') : 'Sem data'}
            </span>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Prioridade:</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                task.priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {task.priority === 'high'
                ? 'Alta'
                : task.priority === 'medium'
                ? 'Média'
                : 'Baixa'}
            </span>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {task.completed ? 'Concluída' : 'Pendente'}
            </span>
          </div>

          {task.subtasks.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-600">Sub-tarefas:</span>
              <ul className="mt-1 space-y-1">
                {task.subtasks.map((sub) => (
                  <li key={sub.id} className="text-sm text-gray-700">
                    <span
                      className={
                        sub.completed ? 'line-through text-gray-500' : ''
                      }
                    >
                      {sub.title}
                    </span>
                    {sub.completed && (
                      <span className="ml-2 text-green-600 text-sm">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="flex-1 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Editar
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}