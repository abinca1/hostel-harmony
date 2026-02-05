 import { Header } from '@/components/layout/Header';
 import { KPICard } from '@/components/dashboard/KPICard';
 import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
 import { RecentActivity } from '@/components/dashboard/RecentActivity';
 import { PaymentOverview } from '@/components/dashboard/PaymentOverview';
 import { QuickActions } from '@/components/dashboard/QuickActions';
 import { useApp } from '@/contexts/AppContext';
 import {
   mockDashboardKPIs,
   getEnrichedEntryLogs,
   getEnrichedPayments,
 } from '@/data/mockData';
 import {
   Building2,
   Users,
   CreditCard,
   TrendingUp,
   DoorOpen,
   UtensilsCrossed,
 } from 'lucide-react';
 
 const Dashboard = () => {
   const { currentRole } = useApp();
   const kpis = mockDashboardKPIs;
   const entryLogs = getEnrichedEntryLogs();
   const payments = getEnrichedPayments();
 
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
