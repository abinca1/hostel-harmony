 import React, { createContext, useContext, useState, ReactNode } from 'react';
 import { UserRole, User } from '@/types/hostel';
 
 interface AppContextType {
   currentUser: User | null;
   currentRole: UserRole;
   setCurrentRole: (role: UserRole) => void;
   sidebarOpen: boolean;
   setSidebarOpen: (open: boolean) => void;
   selectedHostelId: string | null;
   setSelectedHostelId: (id: string | null) => void;
 }
 
 const AppContext = createContext<AppContextType | undefined>(undefined);
 
 export function AppProvider({ children }: { children: ReactNode }) {
   const [currentRole, setCurrentRole] = useState<UserRole>('admin');
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const [selectedHostelId, setSelectedHostelId] = useState<string | null>('hostel-1');
 
   // Mock current user
   const currentUser: User = {
     id: 'user-1',
     name: 'Rajesh Kumar',
     email: 'rajesh@hostelhub.com',
     phone: '+91 98765 43210',
     role: currentRole,
     avatar: undefined,
   };
 
   return (
     <AppContext.Provider
       value={{
         currentUser,
         currentRole,
         setCurrentRole,
         sidebarOpen,
         setSidebarOpen,
         selectedHostelId,
         setSelectedHostelId,
       }}
     >
       {children}
     </AppContext.Provider>
   );
 }
 
 export function useApp() {
   const context = useContext(AppContext);
   if (context === undefined) {
     throw new Error('useApp must be used within an AppProvider');
   }
   return context;
 }