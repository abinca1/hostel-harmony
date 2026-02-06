import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Banknote,
  PiggyBank,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const monthlySummary = [
  {
    label: "Total Revenue",
    value: "₹4,85,000",
    helper: "+8.4% vs last month",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: Banknote,
  },
  {
    label: "Total Expenses",
    value: "₹3,12,900",
    helper: "-2.1% vs last month",
    tone: "bg-rose-50 text-rose-700 border-rose-100",
    icon: Receipt,
  },
  {
    label: "Profit",
    value: "₹1,72,100",
    helper: "Net margin 35.5%",
    tone: "bg-sky-50 text-sky-700 border-sky-100",
    icon: PiggyBank,
  },
  {
    label: "Rent",
    value: "₹78,000",
    helper: "Fixed monthly",
    tone: "bg-amber-50 text-amber-700 border-amber-100",
    icon: TrendingDown,
  },
  {
    label: "Salary",
    value: "₹1,24,000",
    helper: "Staff payout",
    tone: "bg-violet-50 text-violet-700 border-violet-100",
    icon: TrendingUp,
  },
  {
    label: "Utilities",
    value: "₹62,800",
    helper: "Electricity & water",
    tone: "bg-indigo-50 text-indigo-700 border-indigo-100",
    icon: Wallet,
  },
];

const expenseRecords = [
  {
    id: "exp-0",
    category: "Rent",
    description: "Building lease and common area rent",
    amount: "₹78,000",
    month: "Feb 2026",
    status: "paid",
  },
  {
    id: "exp-0b",
    category: "Salary",
    description: "Warden, cook, helper, cleaning, security",
    amount: "₹1,24,000",
    month: "Feb 2026",
    status: "paid",
  },
  {
    id: "exp-1",
    category: "Food & Mess",
    description: "Groceries, dairy, and kitchen supplies",
    amount: "₹58,000",
    month: "Feb 2026",
    status: "paid",
  },
  {
    id: "exp-2",
    category: "Utilities",
    description: "Electricity, water, and gas charges",
    amount: "₹42,500",
    month: "Feb 2026",
    status: "paid",
  },
  {
    id: "exp-3",
    category: "Maintenance",
    description: "Lift servicing and plumbing repairs",
    amount: "₹24,400",
    month: "Feb 2026",
    status: "pending",
  },
  {
    id: "exp-4",
    category: "Security",
    description: "Security staff overtime and supplies",
    amount: "₹18,600",
    month: "Feb 2026",
    status: "paid",
  },
  {
    id: "exp-5",
    category: "Cleaning",
    description: "Cleaning materials and outsourced services",
    amount: "₹9,300",
    month: "Feb 2026",
    status: "paid",
  },
];

const ExpensesPage = () => {
  const [monthFilter, setMonthFilter] = useState("Feb 2026");

  const filteredExpenses = useMemo(
    () => expenseRecords.filter((record) => record.month === monthFilter),
    [monthFilter],
  );

  return (
    <div className="animate-fade-in">
      <Header
        title="Overall Monthly Expense Tracker"
        subtitle="Monitor and review monthly operational expenses."
      />

      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Monthly Summary
                </CardTitle>
                <CardDescription>
                  Snapshot of expenses for the selected month.
                </CardDescription>
              </div>
              <div className="w-full sm:w-52">
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="bg-background border-input focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feb 2026">Feb 2026</SelectItem>
                    <SelectItem value="Jan 2026">Jan 2026</SelectItem>
                    <SelectItem value="Dec 2025">Dec 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {monthlySummary.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.label}
                    className={`border ${item.tone} shadow-sm`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-2xl font-semibold mt-1">{item.value}</p>
                        </div>
                        <div className="rounded-full bg-white/70 p-2">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="mt-3 text-xs font-medium opacity-80">{item.helper}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>
              Category-wise expenses for the selected month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.category}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.amount}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={record.status === "paid" ? "secondary" : "outline"}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredExpenses.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No expense records for this month.
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

export default ExpensesPage;
