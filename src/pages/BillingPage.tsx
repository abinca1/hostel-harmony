 import { useState } from 'react';
 import { Header } from '@/components/layout/Header';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from '@/components/ui/dialog';
 import {
   CreditCard,
   TrendingUp,
   AlertCircle,
   CheckCircle2,
   Clock,
   Download,
   Send,
   FileText,
   IndianRupee,
   Calendar,
 } from 'lucide-react';
 import { getEnrichedPayments, mockResidents } from '@/data/mockData';
 import { Payment, PaymentStatus } from '@/types/hostel';
 import { cn } from '@/lib/utils';
 
 const BillingPage = () => {
   const [selectedMonth, setSelectedMonth] = useState('February 2024');
   const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
   const payments = getEnrichedPayments();
 
   const filteredPayments = payments.filter(p => {
     const monthMatch = p.month === selectedMonth;
     const statusMatch = statusFilter === 'all' || p.status === statusFilter;
     return monthMatch && statusMatch && p.type === 'rent';
   });
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(amount);
   };
 
   const stats = {
     totalExpected: mockResidents.length * 8000, // Simplified
     totalCollected: payments.filter(p => p.status === 'paid' && p.month === selectedMonth).reduce((s, p) => s + p.amount, 0),
     pending: payments.filter(p => p.status === 'pending' && p.month === selectedMonth).length,
     overdue: payments.filter(p => p.status === 'overdue' && p.month === selectedMonth).length,
   };
 
   const statusConfig: Record<PaymentStatus, { icon: React.ElementType; className: string }> = {
     paid: { icon: CheckCircle2, className: 'status-available' },
     pending: { icon: Clock, className: 'status-maintenance' },
     overdue: { icon: AlertCircle, className: 'bg-destructive/10 text-destructive' },
     partial: { icon: Clock, className: 'status-occupied' },
   };
 
   return (
     <div className="animate-fade-in">
       <Header
         title="Billing & Payments"
         subtitle="Track rent, deposits, and generate invoices"
       />
 
       <div className="p-4 md:p-6 space-y-6">
         {/* KPI Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <Card className="kpi-card before:bg-primary">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Expected Revenue</p>
                   <p className="text-2xl font-bold">{formatCurrency(stats.totalExpected)}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-primary/10">
                   <IndianRupee className="w-5 h-5 text-primary" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-success">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Collected</p>
                   <p className="text-2xl font-bold">{formatCurrency(stats.totalCollected)}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-success/10">
                   <TrendingUp className="w-5 h-5 text-success" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-warning">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Pending</p>
                   <p className="text-2xl font-bold">{stats.pending}</p>
                   <p className="text-xs text-muted-foreground">payments</p>
                 </div>
                 <div className="p-2 rounded-lg bg-warning/10">
                   <Clock className="w-5 h-5 text-warning" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-destructive">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Overdue</p>
                   <p className="text-2xl font-bold">{stats.overdue}</p>
                   <p className="text-xs text-muted-foreground">payments</p>
                 </div>
                 <div className="p-2 rounded-lg bg-destructive/10">
                   <AlertCircle className="w-5 h-5 text-destructive" />
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* Controls */}
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div className="flex items-center gap-3">
             <Select value={selectedMonth} onValueChange={setSelectedMonth}>
               <SelectTrigger className="w-44">
                 <Calendar className="w-4 h-4 mr-2" />
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="February 2024">February 2024</SelectItem>
                 <SelectItem value="January 2024">January 2024</SelectItem>
                 <SelectItem value="December 2023">December 2023</SelectItem>
               </SelectContent>
             </Select>
 
             <Select
               value={statusFilter}
               onValueChange={(v) => setStatusFilter(v as PaymentStatus | 'all')}
             >
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="paid">Paid</SelectItem>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="overdue">Overdue</SelectItem>
                 <SelectItem value="partial">Partial</SelectItem>
               </SelectContent>
             </Select>
           </div>
 
           <div className="flex gap-2">
             <Button variant="outline">
               <Download className="w-4 h-4 mr-2" />
               Export
             </Button>
             <Button variant="outline">
               <Send className="w-4 h-4 mr-2" />
               Send Reminders
             </Button>
             <Button className="gradient-primary">
               <FileText className="w-4 h-4 mr-2" />
               Generate Bills
             </Button>
           </div>
         </div>
 
         {/* Payments Table */}
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-lg flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-muted-foreground" />
               Payment Records
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="rounded-lg border overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow className="bg-muted/50">
                     <TableHead>Resident</TableHead>
                     <TableHead>Room</TableHead>
                     <TableHead>Amount</TableHead>
                     <TableHead>Due Date</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredPayments.map((payment) => {
                     const config = statusConfig[payment.status];
                     const StatusIcon = config.icon;
 
                     return (
                       <TableRow key={payment.id}>
                         <TableCell>
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                               <span className="text-xs font-medium text-primary">
                                 {payment.resident?.name.split(' ').map(n => n[0]).join('')}
                               </span>
                             </div>
                             <div>
                               <p className="font-medium">{payment.resident?.name}</p>
                               <p className="text-xs text-muted-foreground">
                                 {payment.resident?.email}
                               </p>
                             </div>
                           </div>
                         </TableCell>
                         <TableCell>
                           <Badge variant="outline">{payment.resident?.roomId?.replace('room-', '')}</Badge>
                         </TableCell>
                         <TableCell>
                           <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                         </TableCell>
                         <TableCell>
                           <span className="text-sm">
                             {new Date(payment.dueDate).toLocaleDateString('en-IN')}
                           </span>
                         </TableCell>
                         <TableCell>
                           <span className={cn('status-badge', config.className)}>
                             <StatusIcon className="w-3 h-3" />
                             {payment.status}
                           </span>
                         </TableCell>
                         <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                             <Button variant="ghost" size="sm">
                               <FileText className="w-4 h-4" />
                             </Button>
                             {payment.status !== 'paid' && (
                               <Button size="sm" variant="outline">
                                 Record Payment
                               </Button>
                             )}
                           </div>
                         </TableCell>
                       </TableRow>
                     );
                   })}
                 </TableBody>
               </Table>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 };
 
 export default BillingPage;