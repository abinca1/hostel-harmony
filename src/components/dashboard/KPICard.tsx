 import { LucideIcon } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface KPICardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   icon: LucideIcon;
   trend?: {
     value: number;
     isPositive: boolean;
   };
   variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
   className?: string;
 }
 
 const variantStyles = {
   default: 'before:bg-muted-foreground/30',
   primary: 'before:bg-primary',
   success: 'before:bg-success',
   warning: 'before:bg-warning',
   danger: 'before:bg-destructive',
 };
 
 const iconStyles = {
   default: 'bg-muted text-muted-foreground',
   primary: 'bg-primary/10 text-primary',
   success: 'bg-success/10 text-success',
   warning: 'bg-warning/10 text-warning',
   danger: 'bg-destructive/10 text-destructive',
 };
 
 export function KPICard({
   title,
   value,
   subtitle,
   icon: Icon,
   trend,
   variant = 'default',
   className,
 }: KPICardProps) {
   return (
     <div
       className={cn(
         'kpi-card card-hover',
         variantStyles[variant],
         className
       )}
     >
       <div className="flex items-start justify-between">
         <div className="space-y-2">
           <p className="text-sm font-medium text-muted-foreground">{title}</p>
           <p className="text-3xl font-bold tracking-tight">{value}</p>
           {subtitle && (
             <p className="text-sm text-muted-foreground">{subtitle}</p>
           )}
           {trend && (
             <div className="flex items-center gap-1">
               <span
                 className={cn(
                   'text-sm font-medium',
                   trend.isPositive ? 'text-success' : 'text-destructive'
                 )}
               >
                 {trend.isPositive ? '+' : ''}{trend.value}%
               </span>
               <span className="text-xs text-muted-foreground">vs last month</span>
             </div>
           )}
         </div>
         <div className={cn('p-3 rounded-xl', iconStyles[variant])}>
           <Icon className="w-6 h-6" />
         </div>
       </div>
     </div>
   );
 }