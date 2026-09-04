'use client';

import { useState } from 'react';

import BoardList from './BoardList';
import CreateBoardForm from './CreateBoardForm';

const DashboardContent = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBoardCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">My Boards</h1>
      </div>

      <CreateBoardForm onBoardCreated={handleBoardCreated} />

      <BoardList key={refreshKey} />
    </div>
  );
};

export default DashboardContent;
