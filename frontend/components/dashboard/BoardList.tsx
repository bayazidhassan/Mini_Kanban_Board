'use client';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import BoardCard from './BoardCard';

type Board = {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

type BoardsResponse = {
  data: Board[];
};

const BoardList = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBoards = useCallback(async () => {
    try {
      const response = await api.get<BoardsResponse>('/boards');
      setBoards(response.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch boards',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBoards();
  }, [fetchBoards]);

  if (loading) {
    return <p>Loading boards...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!boards.length) {
    return <p>No boards found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onBoardUpdated={fetchBoards}
          onBoardDeleted={fetchBoards}
        />
      ))}
    </div>
  );
};

export default BoardList;
