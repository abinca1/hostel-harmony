 import { RoomStatus } from '@/types/hostel';
 import { cn } from '@/lib/utils';
 import { CheckCircle, User, Wrench, Clock } from 'lucide-react';
 
 interface RoomStatusBadgeProps {
   status: RoomStatus;
   showIcon?: boolean;
   size?: 'sm' | 'md';
 }
 
 const statusConfig: Record<RoomStatus, { label: string; icon: React.ElementType; className: string }> = {
   available: { label: 'Available', icon: CheckCircle, className: 'status-available' },
   occupied: { label: 'Occupied', icon: User, className: 'status-occupied' },
   maintenance: { label: 'Maintenance', icon: Wrench, className: 'status-maintenance' },
   reserved: { label: 'Reserved', icon: Clock, className: 'status-reserved' },
 };
 
 export function RoomStatusBadge({ status, showIcon = true, size = 'md' }: RoomStatusBadgeProps) {
   const config = statusConfig[status];
   const Icon = config.icon;
 
   return (
     <span className={cn('status-badge', config.className, size === 'sm' && 'text-[10px] px-2 py-0.5')}>
       {showIcon && <Icon className={cn('w-3 h-3', size === 'sm' && 'w-2.5 h-2.5')} />}
       {config.label}
     </span>
   );
 }