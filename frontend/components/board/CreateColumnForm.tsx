'use client';

import { useState } from 'react';

import { api } from '@/lib/api';

type CreateColumnFormProps = {
  boardId: string;
  onColumnCreated: () => void;
};

const CreateColumnForm = ({
  boardId,
  onColumnCreated,
}: CreateColumnFormProps) => {
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.post(`/boards/${boardId}/columns`, {
        name,
      });

      setName('');

      onColumnCreated?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create column',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded border px-3 py-2"
        placeholder="Column name"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Add Column'}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
};

export default CreateColumnForm;
