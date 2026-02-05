 import { NavLink, useLocation } from 'react-router-dom';
 import {
   LayoutDashboard,
   Bed,
   CreditCard,
   QrCode,
   UtensilsCrossed,
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { useApp } from '@/contexts/AppContext';
 
 const navItems = [
   { icon: LayoutDashboard, label: 'Home', path: '/' },
   { icon: Bed, label: 'Rooms', path: '/rooms' },
   { icon: CreditCard, label: 'Billing', path: '/billing', adminOnly: true },
   { icon: QrCode, label: 'Attendance', path: '/attendance' },
   { icon: UtensilsCrossed, label: 'Mess', path: '/mess' },
 ];
 
 export function MobileNav() {
   const location = useLocation();
   const { currentRole } = useApp();
 
   const filteredItems = navItems.filter(item => !item.adminOnly || currentRole === 'admin');
 
   return (
     <nav className="mobile-nav safe-bottom">
       <div className="flex items-center justify-around py-2 px-4">
         {filteredItems.map((item) => {
           const Icon = item.icon;
           const isActive = location.pathname === item.path;
 
           return (
             <NavLink
               key={item.path}
               to={item.path}
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