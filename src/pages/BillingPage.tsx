import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Send,
  FileText,
  IndianRupee,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { getEnrichedPayments, mockResidents } from "@/data/mockData";
import { Payment, PaymentStatus } from "@/types/hostel";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const BillingPage = () => {
  const [selectedMonthDate, setSelectedMonthDate] = useState(
    new Date(2024, 1, 1),
  );
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "mark" | "reminder" | null
  >(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const payments = getEnrichedPayments();

  const selectedMonthLabel = format(selectedMonthDate, "MMMM yyyy");
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearOptions = Array.from({ length: 16 }, (_, index) => 2020 + index);
  const filteredPayments = payments.filter((p) => {
    const monthMatch = p.month === selectedMonthLabel;
    const statusMatch = statusFilter === "all" || p.status === statusFilter;
    return monthMatch && statusMatch && p.type === "rent";
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const getDaysAfterDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const startOfDue = new Date(
      due.getFullYear(),
      due.getMonth(),
      due.getDate(),
    );
    const diffMs = startOfToday.getTime() - startOfDue.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };
  const getActionLabel = (action: "mark" | "reminder" | null) => {
    switch (action) {
      case "mark":
        return "Mark Payment";
      case "reminder":
        return "Send Reminder";
      default:
        return "";
    }
  };
  const handleOpenConfirm = (action: "mark" | "reminder", payment: Payment) => {
    setSelectedPayment(payment);
    setConfirmAction(action);
  };
  const handleOpenView = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewOpen(true);
  };
  const handleClearFilters = () => {
    setSelectedMonthDate(new Date(2024, 1, 1));
    setStatusFilter("all");
  };

  const stats = {
    totalExpected: mockResidents.length * 8000, // Simplified
    totalCollected: payments
      .filter((p) => p.status === "paid" && p.month === selectedMonthLabel)
      .reduce((s, p) => s + p.amount, 0),
    total: payments.filter(
      (p) => p.type === "rent" && p.month === selectedMonthLabel,
    ).length,
    paid: payments.filter(
      (p) => p.status === "paid" && p.month === selectedMonthLabel,
    ).length,
    pending: payments.filter(
      (p) => p.status === "pending" && p.month === selectedMonthLabel,
    ).length,
    overdue: payments.filter(
      (p) => p.status === "overdue" && p.month === selectedMonthLabel,
    ).length,
  };

  const statusConfig: Record<
    PaymentStatus,
    { icon: React.ElementType; className: string }
  > = {
    paid: { icon: CheckCircle2, className: "status-available" },
    pending: { icon: Clock, className: "status-maintenance" },
    overdue: {
      icon: AlertCircle,
      className: "bg-destructive/10 text-destructive",
    },
    partial: { icon: Clock, className: "status-occupied" },
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Billing & Payments"
        subtitle="Track rent, deposits, and generate invoices"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <div className="flex flex-wrap items-center gap-2">
            <Select
              value={format(selectedMonthDate, "MMMM")}
              onValueChange={(month) => {
                const monthIndex = monthOptions.indexOf(month);
                setSelectedMonthDate(
                  new Date(
                    selectedMonthDate.getFullYear(),
                    monthIndex,
                    1,
                  ),
                );
              }}
            >
              <SelectTrigger className="w-36">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(selectedMonthDate.getFullYear())}
              onValueChange={(year) => {
                setSelectedMonthDate(
                  new Date(
                    Number(year),
                    selectedMonthDate.getMonth(),
                    1,
                  ),
                );
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>

            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={statusFilter === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="gap-2"
            >
              <IndianRupee className="h-4 w-4" />
              Total {stats.total}
            </Button>
            <Button
              variant={statusFilter === "paid" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("paid")}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Paid {stats.paid}
            </Button>
            <Button
              variant={statusFilter === "overdue" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("overdue")}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Overdue {stats.overdue}
            </Button>
            <Button
              variant={statusFilter === "pending" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Pending {stats.pending}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Card className="kpi-card before:bg-primary">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Expected Revenue
                </p>
                <div className="p-1.5 rounded-full bg-primary/10">
                  <IndianRupee className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-xl font-semibold">
                {formatCurrency(stats.totalExpected)}
              </p>
            </CardContent>
          </Card>

          <Card className="kpi-card before:bg-success">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Collected</p>
                <div className="p-1.5 rounded-full bg-success/10">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
              </div>
              <p className="mt-2 text-xl font-semibold">
                {formatCurrency(stats.totalCollected)}
              </p>
            </CardContent>
          </Card>

          <Card className="kpi-card before:bg-warning">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Balance Amount</p>
                <div className="p-1.5 rounded-full bg-warning/10">
                  <Clock className="w-4 h-4 text-warning" />
                </div>
              </div>
              <p className="mt-2 text-xl font-semibold">
                {formatCurrency(stats.totalExpected - stats.totalCollected)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Resident</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Due Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Days Overdue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const config = statusConfig[payment.status];
                    const StatusIcon = config.icon;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {payment.resident?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {payment.resident?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payment.resident?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.resident?.roomId?.replace("room-", "")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">
                            {formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm">
                            {new Date(payment.dueDate).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn("status-badge", config.className)}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm">
                            {getDaysAfterDue(payment.dueDate) > 0
                              ? getDaysAfterDue(payment.dueDate)
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleOpenConfirm("mark", payment)
                                }
                              >
                                Mark Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleOpenConfirm("reminder", payment)
                                }
                              >
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleOpenView(payment)}
                              >
                                View Payment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={confirmAction !== null}
          onOpenChange={(open) => {
            if (!open) setConfirmAction(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{getActionLabel(confirmAction)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Are you sure you want to{" "}
                {getActionLabel(confirmAction).toLowerCase()} for{" "}
                <span className="font-medium text-foreground">
                  {selectedPayment?.resident?.name ?? "this resident"}
                </span>
                ?
              </p>
              {selectedPayment && (
                <p>
                  Amount:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(selectedPayment.amount)}
                  </span>
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button onClick={() => setConfirmAction(null)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            {selectedPayment ? (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Resident</p>
                  <p className="font-medium">
                    {selectedPayment.resident?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPayment.resident?.email}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">
                      {selectedPayment.resident?.roomId?.replace("room-", "")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {formatCurrency(selectedPayment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">
                      {new Date(selectedPayment.dueDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">
                      {selectedPayment.status}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Days Overdue</p>
                  <p className="font-medium">
                    {getDaysAfterDue(selectedPayment.dueDate) > 0
                      ? getDaysAfterDue(selectedPayment.dueDate)
                      : "-"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment selected.
              </p>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BillingPage;
