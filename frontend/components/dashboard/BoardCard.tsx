'use client';

import Link from 'next/link';

import { useState } from 'react';

import { api } from '@/lib/api';

type Board = {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

type BoardCardProps = {
  board: Board;
  onBoardUpdated: () => void;
  onBoardDeleted: () => void;
};

const BoardCard = ({
  board,
  onBoardUpdated,
  onBoardDeleted,
}: BoardCardProps) => {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description ?? '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.patch(`/boards/${board.id}`, {
        name,
        description,
      });

      setEditing(false);

      onBoardUpdated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update board',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this board?',
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.delete(`/boards/${board.id}`);

      onBoardDeleted();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete board',
      );
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="rounded-lg border p-4">
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

          <div className="flex gap-2">
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
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <Link href={`/dashboard/boards/${board.id}`}>
        <h2 className="text-lg font-semibold">{board.name}</h2>

        {board.description && (
          <p className="mt-2 text-sm text-gray-600">{board.description}</p>
        )}
      </Link>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded border px-3 py-2 text-sm"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded border px-3 py-2 text-sm text-red-500 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
