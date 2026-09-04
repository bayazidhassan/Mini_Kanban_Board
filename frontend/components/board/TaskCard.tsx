'use client';

import { api } from '@/lib/api';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
};

type TaskCardProps = {
  task: Task;
  boardId: string;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
};

const TaskCard = ({
  task,
  boardId,
  onTaskUpdated,
  onTaskDeleted,
}: TaskCardProps) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: {
        columnId: task.columnId,
      },
    });

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.patch(
        `/boards/${boardId}/columns/${task.columnId}/tasks/${task.id}`,
        {
          title,
          description,
        },
      );

      setEditing(false);

      onTaskUpdated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update task',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?',
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.delete(
        `/boards/${boardId}/columns/${task.columnId}/tasks/${task.id}`,
      );

      onTaskDeleted();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete task',
      );
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="rounded border p-3">
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
            placeholder="Task title"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
            placeholder="Description"
            rows={2}
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-black px-2 py-1 text-xs text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border px-2 py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      {...listeners}
      {...attributes}
      className="rounded-lg border p-3"
    >
      <h4 className="font-medium">{task.title}</h4>

      {task.description && (
        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded border px-2 py-1 text-xs"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded border px-2 py-1 text-xs text-red-500 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
