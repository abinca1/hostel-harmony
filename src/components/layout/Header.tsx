 import { Bell, Menu, Search } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { useApp } from '@/contexts/AppContext';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { Badge } from '@/components/ui/badge';
 import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
 import { MobileSidebarContent } from './MobileSidebarContent';
 
 interface HeaderProps {
   title: string;
   subtitle?: string;
 }
 
 export function Header({ title, subtitle }: HeaderProps) {
   const { currentUser, currentRole } = useApp();
 
   return (
     <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
       <div className="flex h-16 items-center justify-between px-4 md:px-6">
         {/* Left Section */}
         <div className="flex items-center gap-4">
           {/* Mobile Menu */}
           <Sheet>
             <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="md:hidden">
                 <Menu className="h-5 w-5" />
               </Button>
             </SheetTrigger>
             <SheetContent side="left" className="w-72 p-0">
               <MobileSidebarContent />
             </SheetContent>
           </Sheet>
 
           <div>
             <h1 className="text-xl font-semibold">{title}</h1>
             {subtitle && (
               <p className="text-sm text-muted-foreground">{subtitle}</p>
             )}
           </div>
         </div>
 
         {/* Right Section */}
         <div className="flex items-center gap-3">
           {/* Search (Desktop) */}
           <div className="relative hidden lg:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
               placeholder="Search residents, rooms..."
               className="w-64 pl-9 bg-muted/50"
             />
           </div>
 
           {/* Notifications */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="relative">
                 <Bell className="h-5 w-5" />
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                   3
                 </span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-80">
               <DropdownMenuLabel>Notifications</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                 <div className="flex items-center gap-2">
                   <Badge variant="destructive" className="text-xs">Overdue</Badge>
                   <span className="text-sm font-medium">Rent payment overdue</span>
                 </div>
                 <p className="text-xs text-muted-foreground">
                   Vikram Singh - Room A-102 - ₹6,000
                 </p>
               </DropdownMenuItem>
               <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                 <div className="flex items-center gap-2">
                   <Badge className="text-xs bg-warning text-warning-foreground">Pending</Badge>
                   <span className="text-sm font-medium">New admission request</span>
                 </div>
                 <p className="text-xs text-muted-foreground">
                   Rahul Verma - Room application pending
                 </p>
               </DropdownMenuItem>
               <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                 <div className="flex items-center gap-2">
                   <Badge variant="outline" className="text-xs">Maintenance</Badge>
                   <span className="text-sm font-medium">Room A-104 maintenance</span>
                 </div>
                 <p className="text-xs text-muted-foreground">
                   Plumbing issue - Reported 2 days ago
                 </p>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
 
           {/* User Menu (Desktop) */}
           <div className="hidden md:flex items-center gap-2 pl-3 border-l">
             <div className="text-right">
               <p className="text-sm font-medium">{currentUser?.name}</p>
               <p className="text-xs text-muted-foreground capitalize">{currentRole}</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
               <span className="text-sm font-semibold text-primary">
                 {currentUser?.name.split(' ').map(n => n[0]).join('')}
               </span>
             </div>
           </div>
         </div>
       </div>
     </header>
   );
 }