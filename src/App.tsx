import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import RoomsPage from "./pages/RoomsPage";
import ResidentsPage from "./pages/ResidentsPage";
import BillingPage from "./pages/BillingPage";
import MessPage from "./pages/MessPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import SettingsPage from "./pages/SettingsPage";
import StaffManagementPage from "./pages/StaffManagementPage";
import ExpensesPage from "./pages/ExpensesPage";
import NotFound from "./pages/NotFound";
import WardenLoginPage from "./pages/WardenLoginPage";
import WardenModule from "./pages/warden/WardenModule";
import AdminLoginPage from "./pages/AdminLoginPage";
import CookLoginPage from "./pages/CookLoginPage";
import CookModule from "./pages/cook/CookModule";

const queryClient = new QueryClient();

const AdminModule = () => {
  const navigate = useNavigate();
  const { currentRole, setCurrentRole } = useApp();

  useEffect(() => {
    if (currentRole === "warden") {
      navigate("/warden");
      return;
    }
    if (currentRole === "cook") {
      navigate("/cook");
      return;
    }
    if (currentRole !== "admin") {
      setCurrentRole("admin");
    }
  }, [currentRole, navigate, setCurrentRole]);

  return (
    <MainLayout basePath="/admin">
      <Routes>
        <Route index element={<Index />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="mess" element={<MessPage />} />
        <Route path="building" element={<AdminPanelPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={<AdminModule />} />
            <Route path="/warden/login" element={<WardenLoginPage />} />
            <Route path="/warden/*" element={<WardenModule />} />
            <Route path="/cook/login" element={<CookLoginPage />} />
            <Route path="/cook/*" element={<CookModule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
