 import { Room } from '@/types/hostel';
 import { Card, CardContent } from '@/components/ui/card';
 import { RoomStatusBadge } from './RoomStatusBadge';
 import { Bed, Wifi, Wind, Bath, User } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface RoomCardProps {
   room: Room;
   onClick?: () => void;
   compact?: boolean;
 }
 
 const amenityIcons: Record<string, React.ElementType> = {
   'WiFi': Wifi,
   'AC': Wind,
   'Attached Bathroom': Bath,
 };
 
 export function RoomCard({ room, onClick, compact = false }: RoomCardProps) {
   const occupiedBeds = room.beds.filter(b => b.residentId).length;
   const totalBeds = room.beds.length;
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(amount);
   };
 
   if (compact) {
     return (
       <div
         onClick={onClick}
         className={cn(
           'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md',
           room.status === 'available' && 'border-status-available/30 bg-status-available/5 hover:border-status-available',
           room.status === 'occupied' && 'border-status-occupied/30 bg-status-occupied/5 hover:border-status-occupied',
           room.status === 'maintenance' && 'border-status-maintenance/30 bg-status-maintenance/5 hover:border-status-maintenance',
           room.status === 'reserved' && 'border-status-reserved/30 bg-status-reserved/5 hover:border-status-reserved'
         )}
       >
         <div className="text-center">
           <p className="font-semibold text-sm">{room.number}</p>
           <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
             <Bed className="w-3 h-3" />
             {occupiedBeds}/{totalBeds}
           </div>
           <RoomStatusBadge status={room.status} showIcon={false} size="sm" />
         </div>
       </div>
     );
   }
 
   return (
     <Card
       className="card-hover cursor-pointer overflow-hidden"
       onClick={onClick}
     >
       <CardContent className="p-4">
         <div className="flex items-start justify-between mb-3">
           <div>
             <h3 className="font-semibold text-lg">{room.number}</h3>
             <p className="text-sm text-muted-foreground capitalize">{room.category}</p>
           </div>
           <RoomStatusBadge status={room.status} />
         </div>
 
         {/* Beds visualization */}
         <div className="mb-3">
           <p className="text-xs text-muted-foreground mb-2">Beds ({occupiedBeds}/{totalBeds})</p>
           <div className="flex gap-2 flex-wrap">
             {room.beds.map((bed) => (
               <div
                 key={bed.id}
                 className={cn(
                   'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium',
                   bed.residentId
                     ? 'bg-primary/10 text-primary border border-primary/20'
                     : 'bg-muted text-muted-foreground border border-border'
                 )}
                 title={bed.residentId ? 'Occupied' : 'Available'}
               >
                 {bed.residentId ? <User className="w-4 h-4" /> : bed.number}
               </div>
             ))}
           </div>
         </div>
 
         {/* Amenities */}
         <div className="flex items-center gap-2 mb-3">
           {room.amenities.slice(0, 3).map((amenity) => {
             const Icon = amenityIcons[amenity] || Bed;
             return (
               <div
                 key={amenity}
                 className="w-6 h-6 rounded bg-muted flex items-center justify-center"
                 title={amenity}
               >
                 <Icon className="w-3.5 h-3.5 text-muted-foreground" />
               </div>
             );
           })}
           {room.amenities.length > 3 && (
             <span className="text-xs text-muted-foreground">+{room.amenities.length - 3}</span>
           )}
         </div>
 
         {/* Price */}
         <div className="pt-3 border-t">
           <p className="text-lg font-bold text-primary">
             {formatCurrency(room.monthlyRent)}
             <span className="text-xs font-normal text-muted-foreground">/month</span>
           </p>
         </div>
       </CardContent>
     </Card>
   );
 }