import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockInventoryItems, mockMealAttendance, mockMenuItems } from '@/data/mockData';
import { MealType, MenuItem } from '@/types/hostel';
import { cn } from '@/lib/utils';

const mealOrder: MealType[] = ['breakfast', 'lunch', 'dinner'];

const getTodayMenu = (dayOfWeek: number): MenuItem[] => {
  return mockMenuItems
    .filter((item) => item.dayOfWeek === dayOfWeek)
    .sort((a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType));
};

const mealCardStyles: Record<MealType, { ring: string; badge: string }> = {
  breakfast: {
    ring: 'border-amber-200 bg-amber-50/40',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  lunch: {
    ring: 'border-sky-200 bg-sky-50/40',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
  },
  dinner: {
    ring: 'border-indigo-200 bg-indigo-50/40',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
};

const CookDashboardPage = () => {
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];
  const dayOfWeek = today.getDay();

  const todayMenu = getTodayMenu(dayOfWeek);
  const menuForDisplay = todayMenu.length > 0 ? todayMenu : getTodayMenu(1);

  const attendanceToday = mockMealAttendance.filter(
    (entry) => entry.date === todayKey && !entry.optedOut,
  );
  const attendanceForDisplay =
    attendanceToday.length > 0 ? attendanceToday : mockMealAttendance.filter((entry) => !entry.optedOut);
  const expectedDiners = attendanceForDisplay.length;
  const expectedByMeal = attendanceForDisplay.reduce(
    (acc, entry) => {
      acc[entry.mealType] += 1;
      return acc;
    },
    { breakfast: 0, lunch: 0, dinner: 0 } as Record<MealType, number>,
  );
  const lowStockItems = mockInventoryItems.filter(
    (item) => item.currentStock <= item.minStock,
  );

  return (
    <div className="animate-fade-in">
      <Header
        title="Cook Dashboard"
        subtitle="Plan prep and monitor inventory for today."
      />

      <div className="p-4 md:p-6 space-y-6">
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meal Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">Breakfast</p>
                <p className="text-lg font-semibold text-foreground">
                  {expectedByMeal.breakfast}
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">Lunch</p>
                <p className="text-lg font-semibold text-foreground">
                  {expectedByMeal.lunch}
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">Dinner</p>
                <p className="text-lg font-semibold text-foreground">
                  {expectedByMeal.dinner}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Today&apos;s Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mealOrder.map((mealType) => {
                  const meal = menuForDisplay.find((item) => item.mealType === mealType);
                  const styles = mealCardStyles[mealType];
                  return (
                    <div
                      key={mealType}
                      className={cn(
                        'rounded-lg border p-4 space-y-3',
                        styles.ring,
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold capitalize">{mealType}</p>
                        <Badge variant="outline" className={cn('capitalize', styles.badge)}>
                          {meal ? 'Scheduled' : 'Not set'}
                        </Badge>
                      </div>
                      {meal ? (
                        <>
                          <p className="font-medium">{meal.name}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            {meal.dietaryTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="capitalize"
                              >
                                {tag.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No menu item assigned yet.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Low Stock ({lowStockItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  All essential items are sufficiently stocked.
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3',
                      'bg-destructive/5 border-destructive/20',
                    )}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.category}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {item.currentStock}
                      {item.unit}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookDashboardPage;
