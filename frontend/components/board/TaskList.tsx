'use client';

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

type TaskListProps = {
  boardId: string;
  tasks: Task[];
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
};

const TaskList = ({
  boardId,
  tasks,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListProps) => {
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
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;
