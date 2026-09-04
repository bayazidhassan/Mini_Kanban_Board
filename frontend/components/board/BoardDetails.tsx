'use client';

import { useParams } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import ColumnList from './ColumnList';
import CreateColumnForm from './CreateColumnForm';

type Board = {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

type BoardResponse = {
  data: Board;
};

const BoardDetails = () => {
  const params = useParams();

  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBoard = useCallback(async () => {
    try {
      const response = await api.get<BoardResponse>(`/boards/${boardId}`);

      setBoard(response.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch board',
      );
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBoard();
  }, [fetchBoard]);

  const handleColumnCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };

  if (loading) {
    return <p>Loading board...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!board) {
    return <p>Board not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{board.name}</h1>

        {board.description && (
          <p className="mt-2 text-gray-600">{board.description}</p>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Columns</h2>

        <CreateColumnForm
          boardId={board.id}
          onColumnCreated={handleColumnCreated}
        />

        <ColumnList key={refreshKey} boardId={board.id} />
      </div>
    </div>
  );
};

export default BoardDetails;
