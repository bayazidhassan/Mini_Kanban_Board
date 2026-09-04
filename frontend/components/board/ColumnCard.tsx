'use client';

import { useDroppable } from '@dnd-kit/core';

import { useState } from 'react';

import { api } from '@/lib/api';

import CreateTaskForm from './CreateTaskForm';
import TaskList from './TaskList';

type Column = {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
};

type ColumnCardProps = {
  column: Column;
  tasks: Task[];
  onColumnUpdated: () => void;
  onColumnDeleted: () => void;
};

const ColumnCard = ({
  column,
  tasks,
  onColumnUpdated,
  onColumnDeleted,
}: ColumnCardProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      columnId: column.id,
    },
  });

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(column.name);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setTaskRefreshKey((previous) => previous + 1);
  };

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.patch(`/boards/${column.boardId}/columns/${column.id}`, {
        name,
      });

      setEditing(false);

      onColumnUpdated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update column',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this column?',
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.delete(`/boards/${column.boardId}/columns/${column.id}`);

      onColumnDeleted();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete column',
      );
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="min-w-72 rounded-lg border p-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-3 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded border px-3 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div ref={setNodeRef} className="min-w-72 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{column.name}</h3>

        <div className="flex gap-1">
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

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4">
        <CreateTaskForm
          boardId={column.boardId}
          columnId={column.id}
          onTaskCreated={handleTaskCreated}
        />

        <TaskList key={taskRefreshKey} boardId={column.boardId} tasks={tasks} />
      </div>
    </div>
  );
};

export default ColumnCard;
