import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/contexts/AppContext';
import Index from '@/pages/Index';
import RoomsPage from '@/pages/RoomsPage';
import ResidentsPage from '@/pages/ResidentsPage';
import MealAttendancePage from '@/pages/attendance/MealAttendancePage';
import LeaveManagementPage from '@/pages/attendance/LeaveManagementPage';
import MessPage from '@/pages/MessPage';
import NotFound from '@/pages/NotFound';

const WardenModule = () => {
  const navigate = useNavigate();
  const { currentRole } = useApp();

  useEffect(() => {
    if (currentRole !== 'warden') {
      navigate('/warden/login');
    }
  }, [currentRole, navigate]);

  return (
    <MainLayout basePath="/warden" showRoleSwitcher={false}>
      <Routes>
        <Route index element={<Index />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route
          path="attendance"
          element={<Navigate to="/warden/attendance/meal" replace />}
        />
        <Route path="attendance/meal" element={<MealAttendancePage />} />
        <Route path="attendance/leave" element={<LeaveManagementPage />} />
        <Route path="mess" element={<MessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default WardenModule;
