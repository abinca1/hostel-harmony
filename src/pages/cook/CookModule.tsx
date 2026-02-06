import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/contexts/AppContext';
import NotFound from '@/pages/NotFound';
import CookDashboardPage from '@/pages/cook/CookDashboardPage';
import InventoryPage from '@/pages/cook/InventoryPage';
import MessPage from '@/pages/MessPage';

const CookModule = () => {
  const navigate = useNavigate();
  const { currentRole } = useApp();

  useEffect(() => {
    if (currentRole !== 'cook') {
      navigate('/cook/login');
    }
  }, [currentRole, navigate]);

  return (
    <MainLayout basePath="/cook" showRoleSwitcher={false}>
      <Routes>
        <Route index element={<CookDashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="mess" element={<MessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default CookModule;
