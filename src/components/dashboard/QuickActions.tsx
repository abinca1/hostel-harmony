 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  QrCode, 
  Bed, 
  UtensilsCrossed,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
 import { useApp } from '@/contexts/AppContext';
 
 export function QuickActions() {
   const navigate = useNavigate();
  const location = useLocation();
   const { currentRole } = useApp();
  const basePath = location.pathname.startsWith('/warden')
    ? '/warden'
    : location.pathname.startsWith('/admin')
      ? '/admin'
      : '';

  const buildPath = (path: string) => {
    if (!basePath) return path;
    if (path === '/') return basePath;
    return `${basePath}${path}`;
  };
 
  const actions = [
    { icon: UserPlus, label: 'New Admission', path: buildPath('/residents'), color: 'bg-primary/10 text-primary hover:bg-primary/20' },
    { icon: Bed, label: 'Allocate Room', path: buildPath('/rooms'), color: 'bg-accent/10 text-accent hover:bg-accent/20' },
    { icon: UtensilsCrossed, label: 'Mark Meals', path: buildPath('/mess'), color: 'bg-warning/10 text-warning hover:bg-warning/20' },
    ...(currentRole === 'warden'
      ? [{ icon: QrCode, label: 'Mark Attendance', path: buildPath('/attendance/meal'), color: 'bg-success/10 text-success hover:bg-success/20' }]
      : []),
    ...(currentRole === 'admin' ? [] : []),
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