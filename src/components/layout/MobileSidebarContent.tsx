 import { NavLink, useLocation } from 'react-router-dom';
 import {
   Building2,
   LayoutDashboard,
   Bed,
   CreditCard,
   UtensilsCrossed,
   Users,
   Settings,
   ShieldCheck,
   UserCog,
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { useApp } from '@/contexts/AppContext';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 
 const navItems = [
   { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'warden'] },
   { icon: Bed, label: 'Rooms & Beds', path: '/rooms', roles: ['admin', 'warden'] },
   { icon: Users, label: 'Residents', path: '/residents', roles: ['admin', 'warden'] },
   { icon: CreditCard, label: 'Billing', path: '/billing', roles: ['admin'] },
  { icon: Users, label: 'Warden', path: '/attendance', roles: ['admin', 'warden'] },
   { icon: UtensilsCrossed, label: 'Mess', path: '/mess', roles: ['admin', 'warden'] },
   { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
 ];
 
 export function MobileSidebarContent() {
   const { currentRole, setCurrentRole, currentUser } = useApp();
   const location = useLocation();
 
   const filteredNavItems = navItems.filter(item => 
     item.roles.includes(currentRole)
   );
 
   return (
     <div className="flex flex-col h-full bg-sidebar">
       {/* Header */}
       <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
             <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
           </div>
           <div>
             <h1 className="font-bold text-sidebar-foreground">HostelHub</h1>
             <p className="text-xs text-sidebar-foreground/60">Management System</p>
           </div>
         </div>
       </div>
 
       {/* Role Switcher */}
       <div className="px-4 py-3 border-b border-sidebar-border">
         <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as 'admin' | 'warden')}>
           <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
             <div className="flex items-center gap-2">
               {currentRole === 'admin' ? (
                 <ShieldCheck className="w-4 h-4 text-sidebar-primary" />
               ) : (
                 <UserCog className="w-4 h-4 text-sidebar-primary" />
               )}
               <SelectValue />
             </div>
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="admin">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" />
                 Admin
               </div>
             </SelectItem>
             <SelectItem value="warden">
               <div className="flex items-center gap-2">
                 <UserCog className="w-4 h-4" />
                 Warden
               </div>
             </SelectItem>
           </SelectContent>
         </Select>
       </div>
 
       {/* Navigation */}
       <nav className="flex-1 overflow-y-auto py-4 px-3">
         <ul className="space-y-1">
           {filteredNavItems.map((item) => {
             const Icon = item.icon;
             const isActive = location.pathname === item.path;
 
             return (
               <li key={item.path}>
                 <NavLink
                   to={item.path}
                   className={cn(
                     'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                     'hover:bg-sidebar-accent',
                     isActive && 'bg-sidebar-accent text-sidebar-primary',
                     !isActive && 'text-sidebar-foreground/70'
                   )}
                 >
                   <Icon className={cn('w-5 h-5', isActive && 'text-sidebar-primary')} />
                   <span className={cn('font-medium', isActive && 'text-sidebar-primary')}>
                     {item.label}
                   </span>
                 </NavLink>
               </li>
             );
           })}
         </ul>
       </nav>
 
       {/* User Profile */}
       {currentUser && (
         <div className="p-4 border-t border-sidebar-border">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
               <span className="text-sm font-semibold text-sidebar-foreground">
                 {currentUser.name.split(' ').map(n => n[0]).join('')}
               </span>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-sidebar-foreground truncate">
                 {currentUser.name}
               </p>
               <p className="text-xs text-sidebar-foreground/60 truncate">
                 {currentUser.email}
               </p>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }