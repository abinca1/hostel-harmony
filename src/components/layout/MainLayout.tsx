 import { ReactNode } from 'react';
 import { AppSidebar } from './AppSidebar';
 import { MobileNav } from './MobileNav';
 import { useApp } from '@/contexts/AppContext';
 import { cn } from '@/lib/utils';
 
 interface MainLayoutProps {
   children: ReactNode;
 }
 
 export function MainLayout({ children }: MainLayoutProps) {
   const { sidebarOpen } = useApp();
 
   return (
     <div className="min-h-screen bg-background">
       <AppSidebar />
       <main
         className={cn(
           'min-h-screen transition-all duration-300 pb-20 md:pb-0',
           sidebarOpen ? 'md:ml-64' : 'md:ml-20'
         )}
       >
         {children}
       </main>
       <MobileNav />
     </div>
   );
 }