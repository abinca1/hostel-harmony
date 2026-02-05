 import { Room } from '@/types/hostel';
 import { RoomCard } from './RoomCard';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Layers } from 'lucide-react';
 
 interface FloorPlanViewProps {
   floorNumber: number;
   rooms: Room[];
   onRoomClick?: (room: Room) => void;
   viewMode: 'grid' | 'compact';
 }
 
 export function FloorPlanView({ floorNumber, rooms, onRoomClick, viewMode }: FloorPlanViewProps) {
   return (
     <Card className="animate-fade-in">
       <CardHeader className="pb-3">
         <CardTitle className="text-md font-semibold flex items-center gap-2">
           <Layers className="w-4 h-4 text-muted-foreground" />
           Floor {floorNumber}
           <span className="text-sm font-normal text-muted-foreground">
             ({rooms.length} rooms)
           </span>
         </CardTitle>
       </CardHeader>
       <CardContent>
         {viewMode === 'compact' ? (
           <div className="room-grid">
             {rooms.map((room) => (
               <RoomCard
                 key={room.id}
                 room={room}
                 compact
                 onClick={() => onRoomClick?.(room)}
               />
             ))}
           </div>
         ) : (
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {rooms.map((room) => (
               <RoomCard
                 key={room.id}
                 room={room}
                 onClick={() => onRoomClick?.(room)}
               />
             ))}
           </div>
         )}
       </CardContent>
     </Card>
   );
 }