'use client';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import ColumnCard from './ColumnCard';

type Column = {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
};

type ColumnsResponse = {
  data: Column[];
};

type ColumnListProps = {
  boardId: string;
};

const ColumnList = ({ boardId }: ColumnListProps) => {
  const [columns, setColumns] = useState<Column[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchColumns = useCallback(async () => {
    try {
      const response = await api.get<ColumnsResponse>(
        `/boards/${boardId}/columns`,
      );

      setColumns(response.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch columns',
      );
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchColumns();
  }, [fetchColumns]);

  if (loading) {
    return <p>Loading columns...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!columns.length) {
    return <p>No columns found.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto">
      {columns.map((column) => (
        <ColumnCard
          key={column.id}
          column={column}
          onColumnUpdated={fetchColumns}
          onColumnDeleted={fetchColumns}
        />
      ))}
    </div>
  );
};

export default ColumnList;
