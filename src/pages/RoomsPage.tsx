 import { useState } from 'react';
 import { Header } from '@/components/layout/Header';
 import { FloorPlanView } from '@/components/rooms/FloorPlanView';
 import { RoomStatusBadge } from '@/components/rooms/RoomStatusBadge';
 import { mockHostels, mockRooms } from '@/data/mockData';
 import { Room, RoomStatus } from '@/types/hostel';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
 } from '@/components/ui/dialog';
 import {
   Building2,
   LayoutGrid,
   Grid3X3,
   Filter,
   Plus,
   User,
   Bed,
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 const RoomsPage = () => {
   const [selectedBlock, setSelectedBlock] = useState('block-a');
   const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
   const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
   const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
 
   const hostel = mockHostels[0];
   const currentBlock = hostel.blocks.find(b => b.id === selectedBlock);
 
   // Group rooms by floor
   const roomsByFloor = currentBlock?.floors.map(floor => {
     const floorRooms = mockRooms.filter(r => r.floorId === floor.id);
     return {
       floor,
       rooms: statusFilter === 'all'
         ? floorRooms
         : floorRooms.filter(r => r.status === statusFilter),
     };
   }) || [];
 
   // Stats
   const allBlockRooms = mockRooms.filter(r =>
     currentBlock?.floors.some(f => f.id === r.floorId)
   );
   const stats = {
     total: allBlockRooms.length,
     available: allBlockRooms.filter(r => r.status === 'available').length,
     occupied: allBlockRooms.filter(r => r.status === 'occupied').length,
     maintenance: allBlockRooms.filter(r => r.status === 'maintenance').length,
     reserved: allBlockRooms.filter(r => r.status === 'reserved').length,
   };
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(amount);
   };
 
   return (
     <div className="animate-fade-in">
       <Header
         title="Rooms & Beds"
         subtitle={`${hostel.name} - Managing ${mockRooms.length} rooms`}
       />
 
       <div className="p-4 md:p-6 space-y-6">
         {/* Status Summary */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
           {(['available', 'occupied', 'maintenance', 'reserved'] as RoomStatus[]).map(status => (
             <Card
               key={status}
               className={cn(
                 'cursor-pointer transition-all',
                 statusFilter === status && 'ring-2 ring-primary'
               )}
               onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
             >
               <CardContent className="p-4 flex items-center justify-between">
                 <div>
                   <p className="text-2xl font-bold">{stats[status]}</p>
                   <RoomStatusBadge status={status} size="sm" />
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Controls */}
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div className="flex items-center gap-3">
             {/* Block Selector */}
             <Select value={selectedBlock} onValueChange={setSelectedBlock}>
               <SelectTrigger className="w-40">
                 <Building2 className="w-4 h-4 mr-2" />
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {hostel.blocks.map(block => (
                   <SelectItem key={block.id} value={block.id}>
                     {block.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
 
             {/* View Toggle */}
             <div className="flex items-center bg-muted rounded-lg p-1">
               <Button
                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                 size="sm"
                 onClick={() => setViewMode('grid')}
               >
                 <LayoutGrid className="w-4 h-4" />
               </Button>
               <Button
                 variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                 size="sm"
                 onClick={() => setViewMode('compact')}
               >
                 <Grid3X3 className="w-4 h-4" />
               </Button>
             </div>
 
             {statusFilter !== 'all' && (
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setStatusFilter('all')}
               >
                 <Filter className="w-4 h-4 mr-1" />
                 Clear Filter
               </Button>
             )}
           </div>
 
           <Button className="gradient-primary">
             <Plus className="w-4 h-4 mr-2" />
             Add Room
           </Button>
         </div>
 
         {/* Floor Plans */}
         <Tabs defaultValue={currentBlock?.floors[0]?.id} className="space-y-4">
           <TabsList className="bg-muted/50">
             {currentBlock?.floors.map(floor => (
               <TabsTrigger key={floor.id} value={floor.id}>
                 Floor {floor.number}
               </TabsTrigger>
             ))}
           </TabsList>
 
           {roomsByFloor.map(({ floor, rooms }) => (
             <TabsContent key={floor.id} value={floor.id}>
               <FloorPlanView
                 floorNumber={floor.number}
                 rooms={rooms}
                 viewMode={viewMode}
                 onRoomClick={setSelectedRoom}
               />
             </TabsContent>
           ))}
         </Tabs>
       </div>
 
       {/* Room Detail Dialog */}
       <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               Room {selectedRoom?.number}
               {selectedRoom && <RoomStatusBadge status={selectedRoom.status} />}
             </DialogTitle>
           </DialogHeader>
           
           {selectedRoom && (
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <p className="text-xs text-muted-foreground">Category</p>
                   <p className="font-medium capitalize">{selectedRoom.category}</p>
                 </div>
                 <div className="p-3 bg-muted rounded-lg">
                   <p className="text-xs text-muted-foreground">Monthly Rent</p>
                   <p className="font-medium">{formatCurrency(selectedRoom.monthlyRent)}</p>
                 </div>
               </div>
 
               <div>
                 <p className="text-sm font-medium mb-2">Beds</p>
                 <div className="space-y-2">
                   {selectedRoom.beds.map(bed => (
                     <div
                       key={bed.id}
                       className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                     >
                       <div className="flex items-center gap-2">
                         <Bed className="w-4 h-4 text-muted-foreground" />
                         <span className="font-medium">Bed {bed.number}</span>
                       </div>
                       {bed.residentId ? (
                         <div className="flex items-center gap-2">
                           <User className="w-4 h-4 text-primary" />
                           <span className="text-sm text-primary">Occupied</span>
                         </div>
                       ) : (
                         <span className="text-sm text-success">Available</span>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
 
               <div>
                 <p className="text-sm font-medium mb-2">Amenities</p>
                 <div className="flex flex-wrap gap-2">
                   {selectedRoom.amenities.map(amenity => (
                     <span
                       key={amenity}
                       className="px-2 py-1 bg-muted rounded-md text-xs font-medium"
                     >
                       {amenity}
                     </span>
                   ))}
                 </div>
               </div>
 
               <div className="flex gap-2 pt-4">
                 <Button className="flex-1" variant="outline">
                   Edit Room
                 </Button>
                 {selectedRoom.status === 'available' && (
                   <Button className="flex-1 gradient-primary">
                     Allocate
                   </Button>
                 )}
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>
     </div>
   );
 };
 
 export default RoomsPage;