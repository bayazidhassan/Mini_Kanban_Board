'use client';

import { useState } from 'react';

import { api } from '@/lib/api';

type CreateBoardFormProps = {
  onBoardCreated: () => void;
};

const CreateBoardForm = ({ onBoardCreated }: CreateBoardFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.post('/boards', {
        name,
        description,
      });

      setName('');
      setDescription('');

      onBoardCreated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create board',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Create Board</h2>

      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="Board name"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="Description"
          rows={3}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Board'}
        </button>
      </div>
    </form>
  );
};

export default CreateBoardForm;
