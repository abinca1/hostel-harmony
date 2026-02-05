 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
 
 interface OccupancyData {
   occupied: number;
   available: number;
   maintenance: number;
   reserved: number;
 }
 
 interface OccupancyChartProps {
   data: OccupancyData;
 }
 
 export function OccupancyChart({ data }: OccupancyChartProps) {
   const chartData = [
     { name: 'Occupied', value: data.occupied, color: 'hsl(173, 58%, 39%)' },
     { name: 'Available', value: data.available, color: 'hsl(152, 69%, 40%)' },
     { name: 'Maintenance', value: data.maintenance, color: 'hsl(38, 92%, 50%)' },
     { name: 'Reserved', value: data.reserved, color: 'hsl(215, 25%, 55%)' },
   ].filter(d => d.value > 0);
 
   const total = data.occupied + data.available + data.maintenance + data.reserved;
   const occupancyRate = total > 0 ? Math.round((data.occupied / total) * 100) : 0;
 
   return (
     <Card className="card-hover">
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-semibold">Room Occupancy</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="h-64 relative">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={chartData}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={90}
                 paddingAngle={2}
                 dataKey="value"
               >
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip
                 formatter={(value: number) => [`${value} rooms`, '']}
                 contentStyle={{
                   borderRadius: '8px',
                   border: '1px solid hsl(var(--border))',
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                 }}
               />
               <Legend
                 verticalAlign="bottom"
                 height={36}
                 formatter={(value) => (
                   <span className="text-sm text-muted-foreground">{value}</span>
                 )}
               />
             </PieChart>
           </ResponsiveContainer>
           {/* Center text */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: '36px' }}>
             <div className="text-center">
               <p className="text-3xl font-bold">{occupancyRate}%</p>
               <p className="text-xs text-muted-foreground">Occupancy</p>
             </div>
           </div>
         </div>
       </CardContent>
     </Card>
   );
 }