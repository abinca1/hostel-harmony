import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { LeaveRecord } from "@/types/hostel";
import { mockResidents, mockRooms } from "@/data/mockData";
import { useLeaveRecords } from "@/hooks/useLeaveRecords";

const formatDateValue = (date: Date) => date.toISOString().split("T")[0];

const LeaveManagementPage = () => {
  const today = formatDateValue(new Date());
  const { leaveRecords, setLeaveRecords } = useLeaveRecords();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [leaveStartDate, setLeaveStartDate] = useState(today);
  const [leaveEndDate, setLeaveEndDate] = useState(today);
  const [leaveReason, setLeaveReason] = useState("");

  const roomLookup = useMemo(() => {
    return mockRooms.reduce<Record<string, string>>((acc, room) => {
      acc[room.id] = room.number;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (!selectedResidentId && mockResidents.length > 0) {
      setSelectedResidentId(mockResidents[0].id);
    }
  }, [selectedResidentId]);

  const handleAddLeave = () => {
    if (!selectedResidentId) return;
    const normalizedEndDate =
      leaveEndDate < leaveStartDate ? leaveStartDate : leaveEndDate;
    const newRecord: LeaveRecord = {
      id: `leave-${Date.now()}`,
      residentId: selectedResidentId,
      startDate: leaveStartDate,
      endDate: normalizedEndDate,
      reason: leaveReason.trim() || undefined,
      markedBy: "Warden",
      markedAt: new Date().toISOString(),
    };
    setLeaveRecords((prev) => [newRecord, ...prev]);
    setLeaveReason("");
    setIsLeaveDialogOpen(false);
  };

  const handleRemoveLeave = (recordId: string) => {
    setLeaveRecords((prev) => prev.filter((record) => record.id !== recordId));
  };

  const getLeaveStatus = (record: LeaveRecord) => {
    if (today < record.startDate) return "Upcoming";
    if (today > record.endDate) return "Completed";
    return "Active";
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Leave Management"
        subtitle="Track short leave periods for residents"
      />

      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-muted-foreground" />
              Leave Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Track temporary leaves for 1-2 days or longer.
              </p>
              <Button onClick={() => setIsLeaveDialogOpen(true)}>
                Mark Leave
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Resident</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRecords.map((record) => {
                    const resident = mockResidents.find(
                      (item) => item.id === record.residentId,
                    );
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {resident?.name ?? record.residentId}
                        </TableCell>
                        <TableCell>
                          {resident ? roomLookup[resident.roomId] : "-"}
                        </TableCell>
                        <TableCell>
                          {record.startDate} → {record.endDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              getLeaveStatus(record) === "Active"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {getLeaveStatus(record)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.reason ?? "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveLeave(record.id)}
                          >
                            Clear
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {leaveRecords.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-sm text-muted-foreground"
                      >
                        No leave records yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark Resident Leave</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Resident</Label>
              <Select
                value={selectedResidentId}
                onValueChange={setSelectedResidentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resident" />
                </SelectTrigger>
                <SelectContent>
                  {mockResidents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.name} ({roomLookup[resident.roomId] ?? "-"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leave-start-date">Start</Label>
              <Input
                id="leave-start-date"
                type="date"
                value={leaveStartDate}
                onChange={(event) => setLeaveStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leave-end-date">End</Label>
              <Input
                id="leave-end-date"
                type="date"
                value={leaveEndDate}
                onChange={(event) => setLeaveEndDate(event.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="leave-reason">Reason</Label>
              <Input
                id="leave-reason"
                placeholder="Optional note"
                value={leaveReason}
                onChange={(event) => setLeaveReason(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLeave}>Mark Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagementPage;
