import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import GamePage from './pages/GamePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />
  },
  {
    path: '/room/:roomId/play',
    element: <GamePage />
  }
]);

export default router;
