import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { mockMenuItems } from "@/data/mockData";
import { DietaryTag, MealType, MenuItem } from "@/types/hostel";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

const dietaryColors: Record<DietaryTag, string> = {
  vegetarian: "bg-green-100 text-green-700 border-green-200",
  vegan: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "non-veg": "bg-red-100 text-red-700 border-red-200",
  jain: "bg-yellow-100 text-yellow-700 border-yellow-200",
  halal: "bg-blue-100 text-blue-700 border-blue-200",
};

const dietaryTagOptions: DietaryTag[] = [
  "vegetarian",
  "vegan",
  "non-veg",
  "jain",
  "halal",
];

const mealTypeOptions: MealType[] = ["breakfast", "lunch", "dinner"];

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MessPage = () => {
  const { currentRole } = useApp();
  const canManageMeals = currentRole !== "warden";
  const [selectedDay, setSelectedDay] = useState(1);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
  const [mealDraft, setMealDraft] = useState<MenuItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<MenuItem | null>(null);

  const sortedMeals = [...menuItems]
    .filter((item) => item.dayOfWeek === selectedDay)
    .sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return (
        mealTypeOptions.indexOf(a.mealType) -
        mealTypeOptions.indexOf(b.mealType)
      );
    });

  const handleEditMeal = (meal: MenuItem) => {
    setMealDraft({ ...meal });
    setIsMealDialogOpen(true);
  };

  const handleSaveMeal = () => {
    if (!mealDraft || !mealDraft.name.trim()) return;
    setMenuItems((prev) => {
      const exists = prev.some((item) => item.id === mealDraft.id);
      if (exists) {
        return prev.map((item) =>
          item.id === mealDraft.id ? mealDraft : item,
        );
      }
      return [...prev, mealDraft];
    });
    setIsMealDialogOpen(false);
  };

  const handleDeleteMeal = (meal: MenuItem) => {
    setMealToDelete(meal);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!mealToDelete) return;
    setMenuItems((prev) => prev.filter((item) => item.id !== mealToDelete.id));
    setIsDeleteOpen(false);
  };

  const parseDietaryTags = (value: string): DietaryTag[] =>
    value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) =>
        dietaryTagOptions.includes(tag as DietaryTag),
      ) as DietaryTag[];

  return (
    <div className="animate-fade-in">
      <Header title="Mess Management" subtitle="Add, edit, and delete meals" />

      <div className="p-4 md:p-6 space-y-6">
        <Tabs
          value={String(selectedDay)}
          onValueChange={(value) => setSelectedDay(Number(value))}
        >
          <TabsList className="bg-muted/50">
            {weekdays.map((day, index) => (
              <TabsTrigger key={day} value={String(index)}>
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={String(selectedDay)} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                    Meals for {weekdays[selectedDay]}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Meal</TableHead>
                        <TableHead>Menu Item</TableHead>
                        <TableHead>Tags</TableHead>
                        {canManageMeals && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedMeals.map((meal) => (
                        <TableRow key={meal.id}>
                          <TableCell className="capitalize">
                            {meal.mealType}
                          </TableCell>
                          <TableCell className="font-medium">
                            {meal.name}
                          </TableCell>
                          <TableCell>
                            {meal.dietaryTags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {meal.dietaryTags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className={cn(
                                      "text-xs capitalize",
                                      dietaryColors[tag],
                                    )}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>
                          {canManageMeals && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditMeal(meal)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteMeal(meal)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {sortedMeals.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={canManageMeals ? 4 : 3}
                            className="text-center text-sm text-muted-foreground"
                          >
                            No meals added for {weekdays[selectedDay]}.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mealDraft?.name ? "Edit Meal" : "Add Meal"}
            </DialogTitle>
          </DialogHeader>
          {mealDraft ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  value={mealDraft.name}
                  onChange={(event) =>
                    setMealDraft({ ...mealDraft, name: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                  <Select
                    value={mealDraft.mealType}
                    onValueChange={(value) =>
                      setMealDraft({
                        ...mealDraft,
                        mealType: value as MealType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={String(mealDraft.dayOfWeek)}
                    onValueChange={(value) =>
                      setMealDraft({
                        ...mealDraft,
                        dayOfWeek: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weekdays.map((day, index) => (
                        <SelectItem key={day} value={String(index)}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-tags">
                  Dietary Tags (comma separated)
                </Label>
                <Input
                  id="meal-tags"
                  placeholder="vegetarian, vegan"
                  value={mealDraft.dietaryTags.join(", ")}
                  onChange={(event) =>
                    setMealDraft({
                      ...mealDraft,
                      dietaryTags: parseDietaryTags(event.target.value),
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No meal selected.</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMealDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMeal}>Save Meal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Meal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {mealToDelete?.name}
            </span>
            ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessPage;
