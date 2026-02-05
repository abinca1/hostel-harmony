 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
 import { EntryLog } from '@/types/hostel';
 import { cn } from '@/lib/utils';
 
 interface RecentActivityProps {
   logs: EntryLog[];
 }
 
 export function RecentActivity({ logs }: RecentActivityProps) {
   const sortedLogs = [...logs].sort(
     (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
   ).slice(0, 6);
 
   const formatTime = (timestamp: string) => {
     return new Date(timestamp).toLocaleTimeString('en-IN', {
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   return (
     <Card className="card-hover">
       <CardHeader className="pb-3">
         <CardTitle className="text-lg font-semibold flex items-center gap-2">
           <Clock className="w-5 h-5 text-muted-foreground" />
           Recent Entry/Exit
         </CardTitle>
       </CardHeader>
       <CardContent>
         <div className="space-y-3">
           {sortedLogs.map((log) => (
             <div
               key={log.id}
               className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
             >
               <div
                 className={cn(
                   'w-8 h-8 rounded-full flex items-center justify-center',
                   log.type === 'entry'
                     ? 'bg-success/10 text-success'
                     : 'bg-warning/10 text-warning'
                 )}
               >
                 {log.type === 'entry' ? (
                   <ArrowDownLeft className="w-4 h-4" />
                 ) : (
                   <ArrowUpRight className="w-4 h-4" />
                 )}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium truncate">
                   {log.resident?.name || 'Unknown'}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {log.type === 'entry' ? 'Entered' : 'Exited'} via {log.method.toUpperCase()}
                 </p>
               </div>
               <Badge variant="outline" className="text-xs">
                 {formatTime(log.timestamp)}
               </Badge>
             </div>
           ))}
         </div>
       </CardContent>
     </Card>
   );
 }