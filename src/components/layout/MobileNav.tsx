 import { NavLink, useLocation } from 'react-router-dom';
 import {
   LayoutDashboard,
   Bed,
   CreditCard,
  UtensilsCrossed,
  Users,
  Package,
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { useApp } from '@/contexts/AppContext';
 
const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/', roles: ['admin', 'warden', 'cook'] },
  { icon: Bed, label: 'Rooms', path: '/rooms', roles: ['admin', 'warden'] },
  { icon: CreditCard, label: 'Billing', path: '/billing', roles: ['admin'] },
  { icon: Users, label: 'Attendance', path: '/attendance', roles: ['warden'] },
  { icon: UtensilsCrossed, label: 'Mess', path: '/mess', roles: ['admin', 'warden', 'cook'] },
  { icon: Package, label: 'Inventory', path: '/inventory', roles: ['cook'] },
];
 
interface MobileNavProps {
  basePath?: string;
}

const buildPath = (basePath: string | undefined, path: string) => {
  if (!basePath) return path;
  if (path === '/') return basePath;
  return `${basePath}${path}`;
};

export function MobileNav({ basePath }: MobileNavProps) {
   const location = useLocation();
   const { currentRole } = useApp();
 
  const filteredItems = navItems.filter(item => item.roles.includes(currentRole));
 
   return (
     <nav className="mobile-nav safe-bottom">
       <div className="flex items-center justify-around py-2 px-4">
         {filteredItems.map((item) => {
           const Icon = item.icon;
          const navPath = buildPath(basePath, item.path);
          const isActive = location.pathname === navPath;
 
           return (
             <NavLink
              key={navPath}
              to={navPath}
               className={cn(
                 'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                 isActive ? 'text-primary' : 'text-muted-foreground'
               )}
             >
               <Icon className={cn('w-5 h-5', isActive && 'animate-scale-in')} />
               <span className="text-xs font-medium">{item.label}</span>
             </NavLink>
           );
         })}
       </div>
     </nav>
   );
 }