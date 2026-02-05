 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { 
   UserPlus, 
   QrCode, 
   Receipt, 
   Bed, 
   UtensilsCrossed,
   FileText,
 } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 import { useApp } from '@/contexts/AppContext';
 
 export function QuickActions() {
   const navigate = useNavigate();
   const { currentRole } = useApp();
 
   const actions = [
     { icon: UserPlus, label: 'New Admission', path: '/residents', color: 'bg-primary/10 text-primary hover:bg-primary/20' },
     { icon: QrCode, label: 'Scan Entry', path: '/attendance', color: 'bg-success/10 text-success hover:bg-success/20' },
     { icon: Bed, label: 'Allocate Room', path: '/rooms', color: 'bg-accent/10 text-accent hover:bg-accent/20' },
     { icon: UtensilsCrossed, label: 'Mark Meals', path: '/mess', color: 'bg-warning/10 text-warning hover:bg-warning/20' },
     ...(currentRole === 'admin' ? [
       { icon: Receipt, label: 'Generate Bills', path: '/billing', color: 'bg-primary/10 text-primary hover:bg-primary/20' },
       { icon: FileText, label: 'View Reports', path: '/settings', color: 'bg-muted text-muted-foreground hover:bg-muted/80' },
     ] : []),
   ];
 
   return (
     <Card className="card-hover">
       <CardHeader className="pb-3">
         <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
           {actions.map((action) => {
             const Icon = action.icon;
             return (
               <Button
                 key={action.label}
                 variant="ghost"
                 className={`h-auto py-4 flex flex-col gap-2 ${action.color} transition-all`}
                 onClick={() => navigate(action.path)}
               >
                 <Icon className="w-5 h-5" />
                 <span className="text-xs font-medium">{action.label}</span>
               </Button>
             );
           })}
         </div>
       </CardContent>
     </Card>
   );
 }