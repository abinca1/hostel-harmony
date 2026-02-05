 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { AppProvider } from "@/contexts/AppContext";
 import { MainLayout } from "@/components/layout/MainLayout";
 import Index from "./pages/Index";
 import RoomsPage from "./pages/RoomsPage";
 import ResidentsPage from "./pages/ResidentsPage";
 import BillingPage from "./pages/BillingPage";
 import AttendancePage from "./pages/AttendancePage";
 import MessPage from "./pages/MessPage";
import AdminPanelPage from "./pages/AdminPanelPage";
 import SettingsPage from "./pages/SettingsPage";
 import NotFound from "./pages/NotFound";
 
 const queryClient = new QueryClient();
 
 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <AppProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <MainLayout>
             <Routes>
               <Route path="/" element={<Index />} />
               <Route path="/rooms" element={<RoomsPage />} />
               <Route path="/residents" element={<ResidentsPage />} />
               <Route path="/billing" element={<BillingPage />} />
               <Route path="/attendance" element={<AttendancePage />} />
               <Route path="/mess" element={<MessPage />} />
              <Route path="/building" element={<AdminPanelPage />} />
               <Route path="/settings" element={<SettingsPage />} />
               <Route path="*" element={<NotFound />} />
             </Routes>
           </MainLayout>
         </BrowserRouter>
       </AppProvider>
     </TooltipProvider>
   </QueryClientProvider>
 );
 
 export default App;
