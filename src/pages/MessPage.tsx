 import { useState } from 'react';
 import { Header } from '@/components/layout/Header';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Switch } from '@/components/ui/switch';
 import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
 import {
   UtensilsCrossed,
   Coffee,
   Sun,
   Moon,
   Leaf,
   Check,
   X,
   Star,
   Calendar,
   Users,
 } from 'lucide-react';
 import {
   mockMealPlans,
   mockMenuItems,
   mockMealAttendance,
   mockResidents,
 } from '@/data/mockData';
import { MealPlan, MealType, DietaryTag } from '@/types/hostel';
 import { cn } from '@/lib/utils';
 
 const mealIcons: Record<MealType, React.ElementType> = {
   breakfast: Coffee,
   lunch: Sun,
   dinner: Moon,
 };
 
 const dietaryColors: Record<DietaryTag, string> = {
   vegetarian: 'bg-green-100 text-green-700 border-green-200',
   vegan: 'bg-emerald-100 text-emerald-700 border-emerald-200',
   'non-veg': 'bg-red-100 text-red-700 border-red-200',
   jain: 'bg-yellow-100 text-yellow-700 border-yellow-200',
   halal: 'bg-blue-100 text-blue-700 border-blue-200',
 };
 
 const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 
 const MessPage = () => {
   const [selectedDay, setSelectedDay] = useState(new Date().getDay());
   const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [mealAttendance, setMealAttendance] = useState(mockMealAttendance);
  const [mealPlans, setMealPlans] = useState(mockMealPlans);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [planDraft, setPlanDraft] = useState<MealPlan | null>(null);
 
  const todayMenu = menuItems.filter(item => item.dayOfWeek === selectedDay);
   
  const todayKey = new Date().toISOString().split('T')[0];
  const mealAttendanceToday = mealAttendance.filter(
    a => a.mealType === selectedMeal && a.date === todayKey
  );
   const totalWithPlan = mockResidents.filter(r => r.mealPlan && r.mealPlan !== 'no-meals').length;
   const attended = mealAttendanceToday.filter(a => a.attended).length;
   const optedOut = mealAttendanceToday.filter(a => a.optedOut).length;
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(amount);
   };
  const handleToggleAttendance = (residentId: string, checked: boolean) => {
    setMealAttendance(prev => {
      const index = prev.findIndex(
        entry =>
          entry.residentId === residentId &&
          entry.mealType === selectedMeal &&
          entry.date === todayKey
      );
      if (index === -1) {
        return [
          ...prev,
          {
            id: `att-${Date.now()}`,
            residentId,
            date: todayKey,
            mealType: selectedMeal,
            attended: checked,
            optedOut: false,
          },
        ];
      }
      return prev.map((entry, idx) =>
        idx === index
          ? { ...entry, attended: checked, optedOut: checked ? false : entry.optedOut }
          : entry
      );
    });
  };
  const handleToggleOptOut = (residentId: string) => {
    setMealAttendance(prev => {
      const index = prev.findIndex(
        entry =>
          entry.residentId === residentId &&
          entry.mealType === selectedMeal &&
          entry.date === todayKey
      );
      if (index === -1) {
        return [
          ...prev,
          {
            id: `att-${Date.now()}`,
            residentId,
            date: todayKey,
            mealType: selectedMeal,
            attended: false,
            optedOut: true,
          },
        ];
      }
      return prev.map((entry, idx) =>
        idx === index
          ? { ...entry, optedOut: !entry.optedOut, attended: false }
          : entry
      );
    });
  };
  const handleOpenPlan = (plan: MealPlan) => {
    setPlanDraft({ ...plan });
    setIsPlanDialogOpen(true);
  };
  const handleSavePlan = () => {
    if (!planDraft) return;
    setMealPlans(prev =>
      prev.map(plan => (plan.id === planDraft.id ? planDraft : plan))
    );
    setIsPlanDialogOpen(false);
  };
  const handleTogglePlanMeal = (meal: MealType) => {
    setPlanDraft(current => {
      if (!current) return current;
      const exists = current.mealsIncluded.includes(meal);
      return {
        ...current,
        mealsIncluded: exists
          ? current.mealsIncluded.filter(item => item !== meal)
          : [...current.mealsIncluded, meal],
      };
    });
  };
 
   return (
     <div className="animate-fade-in">
       <Header
         title="Mess Management"
         subtitle="Meal plans, menu scheduling, and attendance tracking"
       />
 
       <div className="p-4 md:p-6 space-y-6">
         {/* Quick Stats */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <Card className="kpi-card before:bg-primary">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Active Meal Plans</p>
                   <p className="text-3xl font-bold">{totalWithPlan}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-primary/10">
                   <UtensilsCrossed className="w-5 h-5 text-primary" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-success">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Today's Attendance</p>
                   <p className="text-3xl font-bold">{attended}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-success/10">
                   <Check className="w-5 h-5 text-success" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-warning">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Opt-outs</p>
                   <p className="text-3xl font-bold">{optedOut}</p>
                 </div>
                 <div className="p-2 rounded-lg bg-warning/10">
                   <X className="w-5 h-5 text-warning" />
                 </div>
               </div>
             </CardContent>
           </Card>
 
           <Card className="kpi-card before:bg-accent">
             <CardContent className="pt-0">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Avg Rating</p>
                   <p className="text-3xl font-bold">4.2</p>
                 </div>
                 <div className="p-2 rounded-lg bg-accent/10">
                   <Star className="w-5 h-5 text-accent" />
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         <Tabs defaultValue="menu" className="space-y-4">
           <TabsList className="bg-muted/50">
             <TabsTrigger value="menu">Today's Menu</TabsTrigger>
             <TabsTrigger value="attendance">Meal Attendance</TabsTrigger>
             <TabsTrigger value="plans">Meal Plans</TabsTrigger>
           </TabsList>
 
           {/* Today's Menu */}
           <TabsContent value="menu">
             <Card>
               <CardHeader className="pb-3">
                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                   <CardTitle className="text-lg flex items-center gap-2">
                     <Calendar className="w-5 h-5 text-muted-foreground" />
                     Menu Schedule
                   </CardTitle>
                   <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                     {weekdays.map((day, idx) => (
                       <Button
                         key={day}
                         variant={selectedDay === idx ? 'default' : 'outline'}
                         size="sm"
                         onClick={() => setSelectedDay(idx)}
                         className={cn(
                           'whitespace-nowrap',
                           selectedDay === idx && 'gradient-primary'
                         )}
                       >
                         {day.slice(0, 3)}
                       </Button>
                     ))}
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="grid md:grid-cols-3 gap-4">
                   {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => {
                     const Icon = mealIcons[mealType];
                     const menuItem = todayMenu.find(m => m.mealType === mealType);
 
                     return (
                       <Card key={mealType} className="bg-muted/30">
                         <CardContent className="p-4">
                           <div className="flex items-center gap-3 mb-3">
                             <div className="p-2 rounded-lg bg-primary/10">
                               <Icon className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                               <h3 className="font-semibold capitalize">{mealType}</h3>
                               <p className="text-xs text-muted-foreground">
                                 {mealType === 'breakfast' && '7:30 - 9:00 AM'}
                                 {mealType === 'lunch' && '12:30 - 2:00 PM'}
                                 {mealType === 'dinner' && '7:30 - 9:00 PM'}
                               </p>
                             </div>
                           </div>
 
                           {menuItem ? (
                             <div className="space-y-3">
                               <p className="text-sm font-medium">{menuItem.name}</p>
                               <div className="flex flex-wrap gap-1">
                                 {menuItem.dietaryTags.map(tag => (
                                   <Badge
                                     key={tag}
                                     variant="outline"
                                     className={cn('text-xs', dietaryColors[tag])}
                                   >
                                     <Leaf className="w-3 h-3 mr-1" />
                                     {tag}
                                   </Badge>
                                 ))}
                               </div>
                               {menuItem.calories && (
                                 <p className="text-xs text-muted-foreground">
                                   ~{menuItem.calories} kcal
                                 </p>
                               )}
                             </div>
                           ) : (
                             <p className="text-sm text-muted-foreground italic">
                               Menu not set for this day
                             </p>
                           )}
                         </CardContent>
                       </Card>
                     );
                   })}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Meal Attendance */}
           <TabsContent value="attendance">
             <Card>
               <CardHeader className="pb-3">
                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                   <CardTitle className="text-lg flex items-center gap-2">
                     <Users className="w-5 h-5 text-muted-foreground" />
                     Meal Attendance
                   </CardTitle>
                   <div className="flex items-center gap-2">
                     {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(meal => {
                       const Icon = mealIcons[meal];
                       return (
                         <Button
                           key={meal}
                           variant={selectedMeal === meal ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => setSelectedMeal(meal)}
                           className={cn(selectedMeal === meal && 'gradient-primary')}
                         >
                           <Icon className="w-4 h-4 mr-1" />
                           {meal}
                         </Button>
                       );
                     })}
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 {/* Attendance Summary */}
                 <div className="mb-6 p-4 rounded-lg bg-muted/50">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-medium">Attendance Rate</span>
                     <span className="text-sm font-bold">
                       {totalWithPlan > 0 ? Math.round((attended / totalWithPlan) * 100) : 0}%
                     </span>
                   </div>
                   <Progress
                     value={totalWithPlan > 0 ? (attended / totalWithPlan) * 100 : 0}
                     className="h-2"
                   />
                   <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                     <span>{attended} attended</span>
                     <span>{optedOut} opted out</span>
                     <span>{totalWithPlan - attended - optedOut} pending</span>
                   </div>
                 </div>
 
                 {/* Resident List */}
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {mockResidents
                     .filter(r => r.mealPlan && r.mealPlan !== 'no-meals')
                     .map(resident => {
                       const attendance = mealAttendanceToday.find(
                         a => a.residentId === resident.id
                       );
 
                       return (
                         <div
                           key={resident.id}
                           className={cn(
                             'p-4 rounded-lg border transition-colors',
                             attendance?.attended && 'bg-success/5 border-success/20',
                             attendance?.optedOut && 'bg-warning/5 border-warning/20',
                             !attendance && 'bg-muted/30'
                           )}
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                 <span className="text-sm font-medium text-primary">
                                   {resident.name.split(' ').map(n => n[0]).join('')}
                                 </span>
                               </div>
                               <div>
                                 <p className="font-medium text-sm">{resident.name}</p>
                                 <p className="text-xs text-muted-foreground">
                                   Room {resident.roomId.replace('room-', '')}
                                 </p>
                               </div>
                             </div>
                             <div className="flex flex-col items-end gap-2">
                               <Switch
                                 checked={attendance?.attended || false}
                                 onCheckedChange={checked =>
                                   handleToggleAttendance(resident.id, checked)
                                 }
                                 className="data-[state=checked]:bg-success"
                               />
                               <Button
                                 variant={attendance?.optedOut ? 'default' : 'outline'}
                                 size="sm"
                                 className="h-7 px-2 text-xs"
                                 onClick={() => handleToggleOptOut(resident.id)}
                               >
                                 {attendance?.optedOut ? 'Opted Out' : 'Opt-out'}
                               </Button>
                             </div>
                           </div>
                           {resident.dietaryTags.length > 0 && (
                             <div className="flex gap-1 mt-2 ml-13">
                               {resident.dietaryTags.map(tag => (
                                 <Badge
                                   key={tag}
                                   variant="outline"
                                   className={cn('text-[10px] px-1.5 py-0', dietaryColors[tag])}
                                 >
                                   {tag}
                                 </Badge>
                               ))}
                             </div>
                           )}
                         </div>
                       );
                     })}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Meal Plans */}
           <TabsContent value="plans">
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mealPlans.map(plan => (
                 <Card key={plan.id} className="card-hover">
                   <CardContent className="p-6">
                     <div className="text-center space-y-4">
                       <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                         <UtensilsCrossed className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-lg">{plan.name}</h3>
                         <p className="text-sm text-muted-foreground">{plan.description}</p>
                       </div>
                       <div className="flex justify-center gap-2">
                         {plan.mealsIncluded.map(meal => {
                           const Icon = mealIcons[meal];
                           return (
                             <div
                               key={meal}
                               className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                               title={meal}
                             >
                               <Icon className="w-4 h-4 text-muted-foreground" />
                             </div>
                           );
                         })}
                         {plan.mealsIncluded.length === 0 && (
                           <span className="text-sm text-muted-foreground">No meals</span>
                         )}
                       </div>
                       <div className="pt-4 border-t">
                         <p className="text-2xl font-bold text-primary">
                           {formatCurrency(plan.monthlyPrice)}
                           <span className="text-xs font-normal text-muted-foreground">/month</span>
                         </p>
                       </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOpenPlan(plan)}
                      >
                        Edit Plan
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </TabsContent>
         </Tabs>
       </div>

      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Meal Plan</DialogTitle>
          </DialogHeader>
          {planDraft ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={planDraft.name}
                  onChange={event =>
                    setPlanDraft({ ...planDraft, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Input
                  id="plan-description"
                  value={planDraft.description}
                  onChange={event =>
                    setPlanDraft({ ...planDraft, description: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-price">Monthly Price</Label>
                <Input
                  id="plan-price"
                  type="number"
                  value={planDraft.monthlyPrice}
                  onChange={event =>
                    setPlanDraft({
                      ...planDraft,
                      monthlyPrice: Number(event.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Meals Included</Label>
                <div className="flex flex-wrap gap-2">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(meal => (
                    <Button
                      key={meal}
                      variant={
                        planDraft.mealsIncluded.includes(meal)
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      className="capitalize"
                      onClick={() => handleTogglePlanMeal(meal)}
                    >
                      {meal}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Plan Active</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle availability for residents
                  </p>
                </div>
                <Switch
                  checked={planDraft.isActive}
                  onCheckedChange={checked =>
                    setPlanDraft({ ...planDraft, isActive: checked })
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No plan selected.</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     </div>
   );
 };
 
 export default MessPage;