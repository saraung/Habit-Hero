import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import CreateHabit from '../pages/CreateHabit';
import HabitDetails from '../pages/HabitDetails';
import Analytics from '../pages/Analytics';
import AIRecommendations from '../pages/AIRecommendations';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout-wrapped routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/habits/new"
        element={
          <MainLayout>
            <CreateHabit />
          </MainLayout>
        }
      />
      <Route
        path="/habits/:id"
        element={
          <MainLayout>
            <HabitDetails />
          </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        }
      />
      <Route
        path="/ai"
        element={
          <MainLayout>
            <AIRecommendations />
          </MainLayout>
        }
      />

      {/* 404 — no layout wrapper so it's full screen */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
