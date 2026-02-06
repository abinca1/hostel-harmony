import { Header } from '@/components/layout/Header';
 import { KPICard } from '@/components/dashboard/KPICard';
 import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
 import { RecentActivity } from '@/components/dashboard/RecentActivity';
 import { PaymentOverview } from '@/components/dashboard/PaymentOverview';
 import { QuickActions } from '@/components/dashboard/QuickActions';
 import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
 import {
   mockDashboardKPIs,
   getEnrichedEntryLogs,
   getEnrichedPayments,
 } from '@/data/mockData';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
 import {
   Building2,
   Users,
   CreditCard,
   TrendingUp,
   DoorOpen,
   UtensilsCrossed,
  Wallet,
 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
 const Dashboard = () => {
   const { currentRole } = useApp();
  const navigate = useNavigate();
   const kpis = mockDashboardKPIs;
   const entryLogs = getEnrichedEntryLogs();
   const payments = getEnrichedPayments();
 
  const adminChartData = [
    { month: 'Oct', revenue: 438000, expenses: 295000, profit: 143000 },
    { month: 'Nov', revenue: 462500, expenses: 318600, profit: 143900 },
    { month: 'Dec', revenue: 474000, expenses: 329400, profit: 144600 },
    { month: 'Jan', revenue: 480500, expenses: 310900, profit: 169600 },
    { month: 'Feb', revenue: 485000, expenses: 312900, profit: 172100 },
  ];

  const adminChartConfig = {
    revenue: { label: 'Revenue', color: 'hsl(151 55% 42%)' },
    expenses: { label: 'Expenses', color: 'hsl(346 77% 49%)' },
    profit: { label: 'Profit', color: 'hsl(201 83% 45%)' },
  };

   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(amount);
   };
 
  const formatCompact = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(value);

   return (
     <div className="animate-fade-in">
       <Header
         title="Dashboard"
         subtitle={`Welcome back! Here's what's happening today.`}
       />
 
       <div className="p-4 md:p-6 space-y-6">
         {/* KPI Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <KPICard
             title="Total Rooms"
             value={kpis.totalRooms}
             subtitle={`${kpis.occupiedRooms} occupied`}
             icon={Building2}
             variant="primary"
           />
           <KPICard
             title="Occupancy Rate"
             value={`${kpis.occupancyRate}%`}
             icon={TrendingUp}
             trend={{ value: 5, isPositive: true }}
             variant="success"
           />
           <KPICard
             title="Total Residents"
             value={kpis.totalResidents}
             icon={Users}
             variant="default"
           />
           {currentRole === 'admin' && (
             <KPICard
               title="Monthly Revenue"
               value={formatCurrency(kpis.monthlyRevenue)}
               icon={CreditCard}
               trend={{ value: 12, isPositive: true }}
               variant="primary"
             />
           )}
           {currentRole === 'warden' && (
             <KPICard
               title="Today's Movement"
               value={kpis.todayEntries + kpis.todayExits}
               subtitle={`${kpis.todayEntries} in, ${kpis.todayExits} out`}
               icon={DoorOpen}
               variant="default"
             />
           )}
         </div>
 
         {/* Secondary KPIs for Warden */}
         {currentRole === 'warden' && (
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <KPICard
               title="Meal Opt-outs"
               value={kpis.mealOptOuts}
               subtitle="Today"
               icon={UtensilsCrossed}
               variant="warning"
             />
             <KPICard
               title="Maintenance"
               value={kpis.maintenanceRooms}
               subtitle="Rooms under repair"
               icon={Building2}
               variant="warning"
             />
           </div>
         )}
 
         {/* Main Content Grid */}
         <div className="grid lg:grid-cols-3 gap-6">
           {/* Left Column */}
           <div className="lg:col-span-2 space-y-6">
             <QuickActions />
            {currentRole === 'admin' && (
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-muted-foreground" />
                        Financial Overview
                      </CardTitle>
                      <CardDescription>Revenue, expenses, and profit trends.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/admin/expenses')}>
                      View Expenses
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
                      <p className="text-sm text-emerald-700">Total Revenue</p>
                      <p className="text-xl font-semibold text-emerald-900">₹4,85,000</p>
                    </div>
                    <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-4">
                      <p className="text-sm text-rose-700">Total Expenses</p>
                      <p className="text-xl font-semibold text-rose-900">₹3,12,900</p>
                    </div>
                    <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-4">
                      <p className="text-sm text-sky-700">Profit</p>
                      <p className="text-xl font-semibold text-sky-900">₹1,72,100</p>
                    </div>
                  </div>

                  <div className="mt-6 h-[240px]">
                    <ChartContainer config={adminChartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminChartData} margin={{ left: 8, right: 8 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={48}
                            tickFormatter={(value) => formatCompact(value as number)}
                          />
                          <ChartTooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={
                              <ChartTooltipContent
                                formatter={(value) => formatCurrency(value as number)}
                              />
                            }
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="expenses"
                            fill="var(--color-expenses)"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="profit"
                            fill="var(--color-profit)"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}
             <RecentActivity logs={entryLogs} />
           </div>
 
           {/* Right Column */}
           <div className="space-y-6">
             <OccupancyChart
               data={{
                 occupied: kpis.occupiedRooms,
                 available: kpis.availableRooms,
                 maintenance: kpis.maintenanceRooms,
                 reserved: kpis.totalRooms - kpis.occupiedRooms - kpis.availableRooms - kpis.maintenanceRooms,
               }}
             />
             {currentRole === 'admin' && (
               <PaymentOverview payments={payments} />
             )}
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default Dashboard;
