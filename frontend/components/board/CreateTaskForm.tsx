'use client';

import { useState } from 'react';

import { api } from '@/lib/api';

type CreateTaskFormProps = {
  boardId: string;
  columnId: string;
  onTaskCreated: () => void;
};

const CreateTaskForm = ({
  boardId,
  columnId,
  onTaskCreated,
}: CreateTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.post(`/boards/${boardId}/columns/${columnId}/tasks`, {
        title,
        description,
      });

      setTitle('');
      setDescription('');

      onTaskCreated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create task',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Task title"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Description"
        rows={2}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-3 py-2 text-xs text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
