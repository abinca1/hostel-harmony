 import { useState } from 'react';
 import { Header } from '@/components/layout/Header';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Input } from '@/components/ui/input';
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
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import {
   QrCode,
   ArrowUpRight,
   ArrowDownLeft,
   Clock,
   User,
   Search,
   Download,
   Camera,
   CheckCircle,
 } from 'lucide-react';
 import { getEnrichedEntryLogs, mockResidents, mockDashboardKPIs } from '@/data/mockData';
 import { cn } from '@/lib/utils';
 
 const AttendancePage = () => {
   const [showScanner, setShowScanner] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [scanResult, setScanResult] = useState<{
     name: string;
     room: string;
     type: 'entry' | 'exit';
   } | null>(null);
 
   const entryLogs = getEnrichedEntryLogs();
   const kpis = mockDashboardKPIs;
 
   const filteredLogs = entryLogs.filter(log =>
     log.resident?.name.toLowerCase().includes(searchTerm.toLowerCase())
   ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
 
   const formatTime = (timestamp: string) => {
     return new Date(timestamp).toLocaleTimeString('en-IN', {
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   const formatDate = (timestamp: string) => {
     return new Date(timestamp).toLocaleDateString('en-IN', {
       day: 'numeric',
       month: 'short',
     });
   };
 
   // Simulated QR scan
   const handleSimulateScan = () => {
     const randomResident = mockResidents[Math.floor(Math.random() * mockResidents.length)];
     const type = Math.random() > 0.5 ? 'entry' : 'exit';
     
     setScanResult({
       name: randomResident.name,
       room: randomResident.roomId.replace('room-', ''),
       type,
     });
 
     setTimeout(() => {
       setScanResult(null);
       setShowScanner(false);
     }, 3000);
   };
 
   // Track who's currently out
   const residentsStatus = mockResidents.map(resident => {
     const lastLog = entryLogs
       .filter(l => l.residentId === resident.id)
       .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
 
     return {
       resident,
       isIn: lastLog?.type === 'entry' || !lastLog,
       lastActivity: lastLog?.timestamp,
     };
   });
 
   const insideCount = residentsStatus.filter(r => r.isIn).length;
   const outsideCount = residentsStatus.filter(r => !r.isIn).length;
 
   return (
     <div className="animate-fade-in">
       <Header
         title="Attendance & Access"
         subtitle="QR-based entry/exit tracking"
       />
 
       <div className="p-4 md:p-6 space-y-6">
         {/* KPI Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <Card className="kpi-card before:bg-success">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Inside Hostel</p>
                   <p className="text-3xl font-bold">{insideCount}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-success/10">
                   <ArrowDownLeft className="w-5 h-5 text-success" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-warning">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Outside</p>
                   <p className="text-3xl font-bold">{outsideCount}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-warning/10">
                   <ArrowUpRight className="w-5 h-5 text-warning" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-primary">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Today's Entries</p>
                   <p className="text-3xl font-bold">{kpis.todayEntries}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-primary/10">
                   <ArrowDownLeft className="w-5 h-5 text-primary" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-muted-foreground">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Today's Exits</p>
                   <p className="text-3xl font-bold">{kpis.todayExits}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-muted">
                   <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* QR Scanner Button */}
         <div className="flex justify-center">
           <Button
             size="lg"
             className="gradient-primary h-16 px-8 text-lg"
             onClick={() => setShowScanner(true)}
           >
             <QrCode className="w-6 h-6 mr-3" />
             Scan QR Code
           </Button>
         </div>
 
         {/* Tabs for Logs and Status */}
         <Tabs defaultValue="logs" className="space-y-4">
           <TabsList className="bg-muted/50">
             <TabsTrigger value="logs">Entry/Exit Logs</TabsTrigger>
             <TabsTrigger value="status">Current Status</TabsTrigger>
           </TabsList>
 
           <TabsContent value="logs">
             <Card>
               <CardHeader className="pb-3">
                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                   <CardTitle className="text-lg flex items-center gap-2">
                     <Clock className="w-5 h-5 text-muted-foreground" />
                     Activity Log
                   </CardTitle>
                   <div className="flex items-center gap-3">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         placeholder="Search resident..."
                         className="pl-9 w-56"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                     </div>
                     <Button variant="outline" size="sm">
                       <Download className="w-4 h-4 mr-2" />
                       Export
                     </Button>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="rounded-lg border overflow-hidden">
                   <Table>
                     <TableHeader>
                       <TableRow className="bg-muted/50">
                         <TableHead>Resident</TableHead>
                         <TableHead>Type</TableHead>
                         <TableHead>Time</TableHead>
                         <TableHead>Method</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {filteredLogs.map((log) => (
                         <TableRow key={log.id}>
                           <TableCell>
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                 <span className="text-xs font-medium text-primary">
                                   {log.resident?.name.split(' ').map(n => n[0]).join('')}
                                 </span>
                               </div>
                               <div>
                                 <p className="font-medium">{log.resident?.name}</p>
                                 <p className="text-xs text-muted-foreground">
                                   Room {log.resident?.roomId.replace('room-', '')}
                                 </p>
                               </div>
                             </div>
                           </TableCell>
                           <TableCell>
                             <span
                               className={cn(
                                 'status-badge',
                                 log.type === 'entry' ? 'status-available' : 'status-maintenance'
                               )}
                             >
                               {log.type === 'entry' ? (
                                 <ArrowDownLeft className="w-3 h-3" />
                               ) : (
                                 <ArrowUpRight className="w-3 h-3" />
                               )}
                               {log.type}
                             </span>
                           </TableCell>
                           <TableCell>
                             <div>
                               <p className="font-medium">{formatTime(log.timestamp)}</p>
                               <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                             </div>
                           </TableCell>
                           <TableCell>
                             <Badge variant="outline" className="text-xs">
                               {log.method.toUpperCase()}
                             </Badge>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           <TabsContent value="status">
             <Card>
               <CardHeader className="pb-3">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <User className="w-5 h-5 text-muted-foreground" />
                   Current Resident Status
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {residentsStatus.map(({ resident, isIn, lastActivity }) => (
                     <div
                       key={resident.id}
                       className={cn(
                         'p-4 rounded-lg border transition-colors',
                         isIn ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'
                       )}
                     >
                       <div className="flex items-center gap-3">
                         <div
                           className={cn(
                             'w-10 h-10 rounded-full flex items-center justify-center',
                             isIn ? 'bg-success/10' : 'bg-warning/10'
                           )}
                         >
                           <span className={cn('text-sm font-medium', isIn ? 'text-success' : 'text-warning')}>
                             {resident.name.split(' ').map(n => n[0]).join('')}
                           </span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-medium truncate">{resident.name}</p>
                           <p className="text-xs text-muted-foreground">
                             Room {resident.roomId.replace('room-', '')}
                           </p>
                         </div>
                         <span
                           className={cn(
                             'status-badge',
                             isIn ? 'status-available' : 'status-maintenance'
                           )}
                         >
                           {isIn ? 'IN' : 'OUT'}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
       </div>
 
       {/* QR Scanner Dialog */}
       <Dialog open={showScanner} onOpenChange={setShowScanner}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <QrCode className="w-5 h-5" />
               QR Scanner
             </DialogTitle>
           </DialogHeader>
 
           {!scanResult ? (
             <div className="space-y-4">
               <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-4 border-2 border-primary/30 rounded-lg" />
                 <div className="absolute inset-4 border-t-2 border-primary animate-pulse" style={{ animation: 'scan 2s ease-in-out infinite' }} />
                 <Camera className="w-16 h-16 text-muted-foreground/30" />
               </div>
               <p className="text-sm text-center text-muted-foreground">
                 Position the QR code within the frame
               </p>
               <Button className="w-full" onClick={handleSimulateScan}>
                 Simulate Scan (Demo)
               </Button>
             </div>
           ) : (
             <div className="text-center space-y-4 py-6">
               <div className={cn(
                 'w-20 h-20 mx-auto rounded-full flex items-center justify-center',
                 scanResult.type === 'entry' ? 'bg-success/10' : 'bg-warning/10'
               )}>
                 <CheckCircle className={cn(
                   'w-10 h-10',
                   scanResult.type === 'entry' ? 'text-success' : 'text-warning'
                 )} />
               </div>
               <div>
                 <p className="text-xl font-semibold">{scanResult.name}</p>
                 <p className="text-muted-foreground">Room {scanResult.room}</p>
               </div>
               <Badge className={cn(
                 'text-lg py-2 px-4',
                 scanResult.type === 'entry' ? 'bg-success' : 'bg-warning'
               )}>
                 {scanResult.type === 'entry' ? 'Entry Recorded' : 'Exit Recorded'}
               </Badge>
             </div>
           )}
         </DialogContent>
       </Dialog>
 
       <style>{`
         @keyframes scan {
           0%, 100% { top: 1rem; }
           50% { top: calc(100% - 1rem - 2px); }
         }
       `}</style>
     </div>
   );
 };
 
 export default AttendancePage;