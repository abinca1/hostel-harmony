 import { useState } from 'react';
 import { Header } from '@/components/layout/Header';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Input } from '@/components/ui/input';
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
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import {
   Users,
   Search,
   Plus,
   MoreVertical,
   Phone,
   Mail,
   Building2,
   Calendar,
   FileText,
   UserPlus,
   GraduationCap,
   Briefcase,
 } from 'lucide-react';
 import { mockResidents } from '@/data/mockData';
 import { Resident } from '@/types/hostel';
 import { cn } from '@/lib/utils';
 
 const ResidentsPage = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [typeFilter, setTypeFilter] = useState<'all' | 'student' | 'professional'>('all');
   const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
 
   const filteredResidents = mockResidents.filter(resident => {
     const matchesSearch =
       resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       resident.phone.includes(searchTerm);
     const matchesType = typeFilter === 'all' || resident.type === typeFilter;
     return matchesSearch && matchesType;
   });
 
   const stats = {
     total: mockResidents.length,
     students: mockResidents.filter(r => r.type === 'student').length,
     professionals: mockResidents.filter(r => r.type === 'professional').length,
   };
 
   return (
     <div className="animate-fade-in">
       <Header
         title="Residents"
         subtitle={`Managing ${mockResidents.length} residents`}
       />
 
       <div className="p-4 md:p-6 space-y-6">
         {/* Stats */}
         <div className="grid grid-cols-3 gap-4">
           <Card
             className={cn(
               'cursor-pointer transition-all',
               typeFilter === 'all' && 'ring-2 ring-primary'
             )}
             onClick={() => setTypeFilter('all')}
           >
             <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 rounded-xl bg-primary/10">
                 <Users className="w-6 h-6 text-primary" />
               </div>
               <div>
                 <p className="text-2xl font-bold">{stats.total}</p>
                 <p className="text-sm text-muted-foreground">Total Residents</p>
               </div>
             </CardContent>
           </Card>
 
           <Card
             className={cn(
               'cursor-pointer transition-all',
               typeFilter === 'student' && 'ring-2 ring-primary'
             )}
             onClick={() => setTypeFilter('student')}
           >
             <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 rounded-xl bg-success/10">
                 <GraduationCap className="w-6 h-6 text-success" />
               </div>
               <div>
                 <p className="text-2xl font-bold">{stats.students}</p>
                 <p className="text-sm text-muted-foreground">Students</p>
               </div>
             </CardContent>
           </Card>
 
           <Card
             className={cn(
               'cursor-pointer transition-all',
               typeFilter === 'professional' && 'ring-2 ring-primary'
             )}
             onClick={() => setTypeFilter('professional')}
           >
             <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 rounded-xl bg-accent/10">
                 <Briefcase className="w-6 h-6 text-accent" />
               </div>
               <div>
                 <p className="text-2xl font-bold">{stats.professionals}</p>
                 <p className="text-sm text-muted-foreground">Professionals</p>
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* Controls */}
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div className="relative w-full sm:w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
               placeholder="Search by name, email, phone..."
               className="pl-9"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Button className="gradient-primary">
             <UserPlus className="w-4 h-4 mr-2" />
             Add Resident
           </Button>
         </div>
 
         {/* Residents Table */}
         <Card>
           <CardContent className="p-0">
             <div className="rounded-lg border overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow className="bg-muted/50">
                     <TableHead>Resident</TableHead>
                     <TableHead>Type</TableHead>
                     <TableHead>Room</TableHead>
                     <TableHead>Contact</TableHead>
                     <TableHead>Move-in Date</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredResidents.map((resident) => (
                     <TableRow
                       key={resident.id}
                       className="cursor-pointer hover:bg-muted/50"
                       onClick={() => setSelectedResident(resident)}
                     >
                       <TableCell>
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                             <span className="text-sm font-medium text-primary">
                               {resident.name.split(' ').map(n => n[0]).join('')}
                             </span>
                           </div>
                           <div>
                             <p className="font-medium">{resident.name}</p>
                             <p className="text-xs text-muted-foreground">
                               {resident.organization}
                             </p>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell>
                         <Badge
                           variant="outline"
                           className={cn(
                             resident.type === 'student'
                               ? 'bg-success/10 text-success border-success/20'
                               : 'bg-accent/10 text-accent border-accent/20'
                           )}
                         >
                           {resident.type === 'student' ? (
                             <GraduationCap className="w-3 h-3 mr-1" />
                           ) : (
                             <Briefcase className="w-3 h-3 mr-1" />
                           )}
                           {resident.type}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge variant="outline">
                           {resident.roomId.replace('room-', '')}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <div className="space-y-1">
                           <p className="text-sm">{resident.phone}</p>
                           <p className="text-xs text-muted-foreground">{resident.email}</p>
                         </div>
                       </TableCell>
                       <TableCell>
                         <span className="text-sm">
                           {new Date(resident.moveInDate).toLocaleDateString('en-IN')}
                         </span>
                       </TableCell>
                       <TableCell className="text-right">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                             <Button variant="ghost" size="icon">
                               <MoreVertical className="w-4 h-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem>View Profile</DropdownMenuItem>
                             <DropdownMenuItem>Edit Details</DropdownMenuItem>
                             <DropdownMenuItem>View Payments</DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">
                               Initiate Move-out
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Resident Detail Dialog */}
       <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
         <DialogContent className="max-w-lg">
           <DialogHeader>
             <DialogTitle>Resident Details</DialogTitle>
           </DialogHeader>
 
           {selectedResident && (
             <div className="space-y-6">
               {/* Header */}
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                   <span className="text-xl font-bold text-primary">
                     {selectedResident.name.split(' ').map(n => n[0]).join('')}
                   </span>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold">{selectedResident.name}</h3>
                   <p className="text-muted-foreground">{selectedResident.organization}</p>
                   <Badge
                     variant="outline"
                     className={cn(
                       'mt-1',
                       selectedResident.type === 'student'
                         ? 'bg-success/10 text-success border-success/20'
                         : 'bg-accent/10 text-accent border-accent/20'
                     )}
                   >
                     {selectedResident.type}
                   </Badge>
                 </div>
               </div>
 
               {/* Contact Info */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <div className="flex items-center gap-2 mb-1">
                     <Phone className="w-4 h-4 text-muted-foreground" />
                     <span className="text-xs text-muted-foreground">Phone</span>
                   </div>
                   <p className="font-medium">{selectedResident.phone}</p>
                 </div>
                 <div className="p-3 bg-muted rounded-lg">
                   <div className="flex items-center gap-2 mb-1">
                     <Mail className="w-4 h-4 text-muted-foreground" />
                     <span className="text-xs text-muted-foreground">Email</span>
                   </div>
                   <p className="font-medium text-sm truncate">{selectedResident.email}</p>
                 </div>
                 <div className="p-3 bg-muted rounded-lg">
                   <div className="flex items-center gap-2 mb-1">
                     <Building2 className="w-4 h-4 text-muted-foreground" />
                     <span className="text-xs text-muted-foreground">Room</span>
                   </div>
                   <p className="font-medium">{selectedResident.roomId.replace('room-', '')}</p>
                 </div>
                 <div className="p-3 bg-muted rounded-lg">
                   <div className="flex items-center gap-2 mb-1">
                     <Calendar className="w-4 h-4 text-muted-foreground" />
                     <span className="text-xs text-muted-foreground">Move-in</span>
                   </div>
                   <p className="font-medium">
                     {new Date(selectedResident.moveInDate).toLocaleDateString('en-IN')}
                   </p>
                 </div>
               </div>
 
               {/* ID Info */}
               <div className="p-4 bg-muted/50 rounded-lg">
                 <div className="flex items-center gap-2 mb-2">
                   <FileText className="w-4 h-4 text-muted-foreground" />
                   <span className="font-medium">ID Verification</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="text-muted-foreground">ID Type</p>
                     <p className="font-medium capitalize">{selectedResident.idType.replace('_', ' ')}</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">ID Number</p>
                     <p className="font-medium">{selectedResident.idNumber}</p>
                   </div>
                 </div>
               </div>
 
               {/* Emergency Contact */}
               <div className="p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                 <p className="font-medium mb-2 text-destructive">Emergency Contact</p>
                 <div className="grid grid-cols-3 gap-4 text-sm">
                   <div>
                     <p className="text-muted-foreground">Name</p>
                     <p className="font-medium">{selectedResident.emergencyContact.name}</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">Relation</p>
                     <p className="font-medium">{selectedResident.emergencyContact.relation}</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">Phone</p>
                     <p className="font-medium">{selectedResident.emergencyContact.phone}</p>
                   </div>
                 </div>
               </div>
 
               {/* Actions */}
               <div className="flex gap-2">
                 <Button variant="outline" className="flex-1">Edit Profile</Button>
                 <Button variant="outline" className="flex-1">View Payments</Button>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>
     </div>
   );
 };
 
 export default ResidentsPage;