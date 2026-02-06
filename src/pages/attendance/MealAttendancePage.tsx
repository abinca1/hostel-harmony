import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Coffee,
  Moon,
  UserCheck,
  UserMinus,
  UtensilsCrossed,
} from "lucide-react";
import { MealType } from "@/types/hostel";
import { mockMealAttendance, mockResidents, mockRooms } from "@/data/mockData";
import { useLeaveRecords } from "@/hooks/useLeaveRecords";

const mealPlanAvailability: Record<string, MealType[]> = {
  "full-board": ["breakfast", "lunch", "dinner"],
  "half-board": ["breakfast", "dinner"],
  breakfast: ["breakfast"],
  "no-meals": [],
};

const mealOptions: MealType[] = ["breakfast", "lunch", "dinner"];

const formatDateValue = (date: Date) => date.toISOString().split("T")[0];
const isDateWithinRange = (date: string, start: string, end: string) =>
  date >= start && date <= end;

const MealAttendancePage = () => {
  const today = formatDateValue(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    return mockMealAttendance.reduce<Record<string, boolean>>((acc, record) => {
      const key = `${record.residentId}-${record.date}-${record.mealType}`;
      acc[key] = record.attended;
      return acc;
    }, {});
  });
  const { leaveRecords } = useLeaveRecords();

  const roomLookup = useMemo(() => {
    return mockRooms.reduce<Record<string, string>>((acc, room) => {
      acc[room.id] = room.number;
      return acc;
    }, {});
  }, []);

  const eligibleResidents = useMemo(() => {
    return mockResidents.filter((resident) => {
      const planKey = resident.mealPlan ?? "no-meals";
      return (mealPlanAvailability[planKey] ?? []).length > 0;
    });
  }, []);

  const leaveLookup = useMemo(() => {
    return leaveRecords.reduce<Record<string, boolean>>((acc, record) => {
      if (isDateWithinRange(selectedDate, record.startDate, record.endDate)) {
        acc[record.residentId] = true;
      }
      return acc;
    }, {});
  }, [leaveRecords, selectedDate]);

  const availableResidents = useMemo(() => {
    return eligibleResidents.filter((resident) => !leaveLookup[resident.id]);
  }, [eligibleResidents, leaveLookup]);

  useEffect(() => {
    setAttendance((prev) => {
      const next = { ...prev };
      eligibleResidents.forEach((resident) => {
        mealOptions.forEach((meal) => {
          const key = `${resident.id}-${selectedDate}-${meal}`;
          const onLeave = Boolean(leaveLookup[resident.id]);
          next[key] = onLeave ? false : true;
        });
      });
      return next;
    });
  }, [eligibleResidents, leaveLookup, selectedDate]);

  const attendanceStats = useMemo(() => {
    const stats = mealOptions.reduce<Record<MealType, { present: number; absent: number }>>(
      (acc, meal) => {
        acc[meal] = { present: 0, absent: 0 };
        return acc;
      },
      {} as Record<MealType, { present: number; absent: number }>,
    );

    availableResidents.forEach((resident) => {
      mealOptions.forEach((meal) => {
        const key = `${resident.id}-${selectedDate}-${meal}`;
        if (attendance[key]) stats[meal].present += 1;
        else stats[meal].absent += 1;
      });
    });

    return {
      eligible: availableResidents.length,
      byMeal: stats,
    };
  }, [attendance, availableResidents, selectedDate]);

  const handleToggleAttendance = (
    residentId: string,
    meal: MealType,
    value: boolean,
  ) => {
    if (leaveLookup[residentId]) return;
    const key = `${residentId}-${selectedDate}-${meal}`;
    setAttendance((prev) => ({ ...prev, [key]: value }));
  };

  const handleMarkAll = (value: boolean) => {
    setAttendance((prev) => {
      const next = { ...prev };
      availableResidents.forEach((resident) => {
        mealOptions.forEach((meal) => {
          const key = `${resident.id}-${selectedDate}-${meal}`;
          next[key] = value;
        });
      });
      return next;
    });
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Attendance"
        subtitle="Mark daily meal attendance for eligible residents"
      />

      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
              Residents & Meal Attendance ({eligibleResidents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2 min-w-[180px]">
                <Label htmlFor="attendance-date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="attendance-date"
                    type="date"
                    className="pl-9"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={() => handleMarkAll(true)}>
                  Mark All Present
                </Button>
                <Button variant="outline" onClick={() => handleMarkAll(false)}>
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-muted/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-lg font-semibold">
                      {availableResidents.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-muted/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <UserMinus className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">On Leave</p>
                    <p className="text-lg font-semibold">
                      {eligibleResidents.length - availableResidents.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-muted/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <Coffee className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Breakfast</p>
                    <p className="text-lg font-semibold">
                      {attendanceStats.byMeal.breakfast.present}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-muted/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <Moon className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dinner</p>
                    <p className="text-lg font-semibold">
                      {attendanceStats.byMeal.dinner.present}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Meal Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Breakfast</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Dinner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eligibleResidents.map((resident) => {
                    const breakfastKey = `${resident.id}-${selectedDate}-breakfast`;
                    const lunchKey = `${resident.id}-${selectedDate}-lunch`;
                    const dinnerKey = `${resident.id}-${selectedDate}-dinner`;
                    const onLeave = Boolean(leaveLookup[resident.id]);
                    return (
                      <TableRow key={resident.id}>
                        <TableCell className="font-mono text-xs">
                          {resident.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p>{resident.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {resident.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{roomLookup[resident.roomId] ?? "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {resident.mealPlan?.replace("-", " ") ?? "No meals"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {onLeave ? (
                            <Badge variant="destructive">On Leave</Badge>
                          ) : (
                            <Badge variant="secondary">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={onLeave ? false : (attendance[breakfastKey] ?? true)}
                            disabled={onLeave}
                            onCheckedChange={(value) =>
                              handleToggleAttendance(resident.id, "breakfast", value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={onLeave ? false : (attendance[lunchKey] ?? true)}
                            disabled={onLeave}
                            onCheckedChange={(value) =>
                              handleToggleAttendance(resident.id, "lunch", value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={onLeave ? false : (attendance[dinnerKey] ?? true)}
                            disabled={onLeave}
                            onCheckedChange={(value) =>
                              handleToggleAttendance(resident.id, "dinner", value)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {eligibleResidents.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-sm text-muted-foreground"
                      >
                        No residents are eligible for this meal.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealAttendancePage;
