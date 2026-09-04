'use client';

import { api } from '@/lib/api';

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useCallback, useEffect, useState } from 'react';

import ColumnCard from './ColumnCard';

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

type ColumnsResponse = {
  data: Column[];
};

type TasksResponse = {
  data: Task[];
};

type ColumnListProps = {
  boardId: string;
};

const ColumnList = ({ boardId }: ColumnListProps) => {
  const [columns, setColumns] = useState<Column[]>([]);

  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Task[]>>(
    {},
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const fetchColumns = useCallback(async () => {
    try {
      const response = await api.get<ColumnsResponse>(
        `/boards/${boardId}/columns`,
      );

      setColumns(response.data);

      const taskEntries = await Promise.all(
        response.data.map(async (column) => {
          const response = await api.get<TasksResponse>(
            `/boards/${boardId}/columns/${column.id}/tasks`,
          );

          return [column.id, response.data] as const;
        }),
      );

      setTasksByColumn(Object.fromEntries(taskEntries));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch board data',
      );
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchColumns();
  }, [fetchColumns]);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id as string;

    setTasksByColumn((previous) => {
      const sourceColumnId = Object.keys(previous).find((columnId) =>
        previous[columnId]?.some((task) => task.id === activeId),
      );

      if (!sourceColumnId) {
        return previous;
      }

      const targetTask = Object.values(previous)
        .flat()
        .find((task) => task.id === over.id);

      const targetColumnId =
        targetTask?.columnId ||
        (columns.some((column) => column.id === over.id)
          ? (over.id as string)
          : null);

      if (!targetColumnId) {
        return previous;
      }

      const sourceTasks = previous[sourceColumnId] ?? [];

      const targetTasks = previous[targetColumnId] ?? [];

      const activeTask = sourceTasks.find((task) => task.id === activeId);

      if (!activeTask) {
        return previous;
      }

      if (sourceColumnId === targetColumnId) {
        const oldIndex = sourceTasks.findIndex((task) => task.id === activeId);

        const newIndex = targetTask
          ? sourceTasks.findIndex((task) => task.id === targetTask.id)
          : sourceTasks.length - 1;

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return previous;
        }

        const newTasks = [...sourceTasks];

        const [movedTask] = newTasks.splice(oldIndex, 1);

        newTasks.splice(newIndex, 0, movedTask);

        return {
          ...previous,
          [sourceColumnId]: newTasks,
        };
      }

      if (targetTasks.some((task) => task.id === activeId)) {
        return previous;
      }

      const newSourceTasks = sourceTasks.filter((task) => task.id !== activeId);

      const targetIndex = targetTask
        ? targetTasks.findIndex((task) => task.id === targetTask.id)
        : targetTasks.length;

      const newTargetTasks = [...targetTasks];

      newTargetTasks.splice(targetIndex, 0, {
        ...activeTask,
        columnId: targetColumnId,
      });

      return {
        ...previous,
        [sourceColumnId]: newSourceTasks,
        [targetColumnId]: newTargetTasks,
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id as string;

    const targetTask = Object.values(tasksByColumn)
      .flat()
      .find((task) => task.id === over.id);

    const targetColumnId =
      targetTask?.columnId ||
      (columns.some((column) => column.id === over.id)
        ? (over.id as string)
        : null);

    if (!targetColumnId) {
      return;
    }

    const targetTasks = tasksByColumn[targetColumnId] ?? [];

    const targetIndex = targetTasks.findIndex((task) => task.id === activeId);

    const targetPosition =
      targetIndex === -1 ? targetTasks.length + 1 : targetIndex + 1;

    try {
      await api.patch(`/boards/${boardId}/tasks/${activeId}/move`, {
        targetColumnId,
        targetPosition,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to move task');

      await fetchColumns();
    }
  };

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
    <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => {
          const tasks = tasksByColumn[column.id] ?? [];

          const taskIds = tasks.map((task) => task.id);

          return (
            <SortableContext
              key={column.id}
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              <ColumnCard
                column={column}
                tasks={tasks}
                onColumnUpdated={fetchColumns}
                onColumnDeleted={fetchColumns}
              />
            </SortableContext>
          );
        })}
      </div>
    </DndContext>
  );
};

export default ColumnList;
