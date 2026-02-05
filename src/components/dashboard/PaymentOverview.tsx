 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
 import { Payment } from '@/types/hostel';
 import { cn } from '@/lib/utils';
 
 interface PaymentOverviewProps {
   payments: Payment[];
 }
 
 export function PaymentOverview({ payments }: PaymentOverviewProps) {
   const rentPayments = payments.filter(p => p.type === 'rent');
   const overduePayments = rentPayments.filter(p => p.status === 'overdue');
   const pendingPayments = rentPayments.filter(p => p.status === 'pending');
 
   const statusConfig = {
     paid: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', badge: 'status-available' },
     pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', badge: 'status-maintenance' },
     overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', badge: 'status-reserved' },
     partial: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', badge: 'status-occupied' },
   };
 
   const displayPayments = [...overduePayments, ...pendingPayments].slice(0, 5);
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(amount);
   };
 
   return (
     <Card className="card-hover">
       <CardHeader className="pb-3">
         <CardTitle className="text-lg font-semibold flex items-center gap-2">
           <CreditCard className="w-5 h-5 text-muted-foreground" />
           Payment Alerts
         </CardTitle>
       </CardHeader>
       <CardContent>
         {displayPayments.length === 0 ? (
           <div className="text-center py-8 text-muted-foreground">
             <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success/50" />
             <p className="text-sm">All payments are up to date!</p>
           </div>
         ) : (
           <div className="space-y-3">
             {displayPayments.map((payment) => {
               const config = statusConfig[payment.status];
               const Icon = config.icon;
 
               return (
                 <div
                   key={payment.id}
                   className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                 >
                   <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', config.bg)}>
                     <Icon className={cn('w-4 h-4', config.color)} />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">
                       {payment.resident?.name || 'Unknown'}
                     </p>
                     <p className="text-xs text-muted-foreground">
                       {payment.month} • Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                     <span className={cn('status-badge', config.badge)}>
                       {payment.status}
                     </span>
                   </div>
                 </div>
               );
             })}
           </div>
         )}
       </CardContent>
     </Card>
   );
 }