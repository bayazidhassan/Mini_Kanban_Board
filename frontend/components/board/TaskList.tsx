'use client';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import TaskCard from './TaskCard';

type Task = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
};

type TasksResponse = {
  data: Task[];
};

type TaskListProps = {
  boardId: string;
  columnId: string;
};

const TaskList = ({ boardId, columnId }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get<TasksResponse>(
        `/boards/${boardId}/columns/${columnId}/tasks`,
      );

      setTasks(response.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch tasks',
      );
    } finally {
      setLoading(false);
    }
  }, [boardId, columnId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return <p className="text-sm">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!tasks.length) {
    return <p className="text-sm text-gray-500">No tasks yet.</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          boardId={boardId}
          onTaskUpdated={fetchTasks}
          onTaskDeleted={fetchTasks}
        />
      ))}
    </div>
  );
};

export default TaskList;
