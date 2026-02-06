 import { ReactNode } from 'react';
 import { AppSidebar } from './AppSidebar';
 import { MobileNav } from './MobileNav';
 import { useApp } from '@/contexts/AppContext';
 import { cn } from '@/lib/utils';
 
interface MainLayoutProps {
  children: ReactNode;
  basePath?: string;
  showRoleSwitcher?: boolean;
}

export function MainLayout({
  children,
  basePath,
  showRoleSwitcher = true,
}: MainLayoutProps) {
   const { sidebarOpen } = useApp();
 
   return (
     <div className="min-h-screen bg-background">
      <AppSidebar basePath={basePath} showRoleSwitcher={showRoleSwitcher} />
       <main
         className={cn(
           'min-h-screen transition-all duration-300 pb-20 md:pb-0',
           sidebarOpen ? 'md:ml-64' : 'md:ml-20'
         )}
       >
         {children}
       </main>
      <MobileNav basePath={basePath} />
     </div>
   );
 }