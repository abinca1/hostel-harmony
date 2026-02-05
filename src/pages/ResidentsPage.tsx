import { useState, type ElementType } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Building2,
  Calendar,
  FileText,
  UserPlus,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  getEnrichedPayments,
  mockHostels,
  mockResidents,
  mockRooms,
} from "@/data/mockData";
import { PaymentStatus, Resident } from "@/types/hostel";
import { cn } from "@/lib/utils";

const ResidentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "student" | "professional"
  >("all");
  const [listMode, setListMode] = useState<"active" | "moved-out">("active");
  const [moveInFilter, setMoveInFilter] = useState("");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );
  const [editingResidentId, setEditingResidentId] = useState<string | null>(
    null,
  );
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [residentErrors, setResidentErrors] = useState<Record<string, string>>(
    {},
  );
  const [isViewingResident, setIsViewingResident] = useState(false);
  const [isViewingPayments, setIsViewingPayments] = useState(false);
  const [movedOutResidents, setMovedOutResidents] = useState<Resident[]>([]);
  const [moveOutResident, setMoveOutResident] = useState<Resident | null>(null);
  const [isMoveOutConfirmOpen, setIsMoveOutConfirmOpen] = useState(false);
  const [rooms, setRooms] = useState(mockRooms);
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [residentForm, setResidentForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "student" as Resident["type"],
    organization: "",
    idType: "aadhar" as Resident["idType"],
    idNumber: "",
    moveInDate: "",
    blockId: "",
    roomId: "",
    bedId: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });
  const payments = getEnrichedPayments();

  const hostel = mockHostels[0];
  const floorToBlockId = new Map<string, string>();
  hostel.blocks.forEach((block) => {
    block.floors.forEach((floor) => {
      floorToBlockId.set(floor.id, block.id);
    });
  });
  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const getResidentBlockId = (resident: Resident) => {
    const room = roomById.get(resident.roomId);
    if (!room) return "";
    return floorToBlockId.get(room.floorId) ?? "";
  };
  const getRoomLabel = (roomId: string) =>
    roomById.get(roomId)?.number ?? roomId.replace("room-", "");
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const statusConfig: Record<
    PaymentStatus,
    { icon: ElementType; className: string }
  > = {
    paid: { icon: CheckCircle2, className: "status-available" },
    pending: { icon: Clock, className: "status-maintenance" },
    overdue: {
      icon: AlertCircle,
      className: "bg-destructive/10 text-destructive",
    },
    partial: { icon: Clock, className: "status-occupied" },
  };

  const selectedResidentPayments = selectedResident
    ? payments.filter((payment) => payment.residentId === selectedResident.id)
    : [];
  const paymentSummary = selectedResident
    ? {
        totalPaid: selectedResidentPayments
          .filter((payment) => payment.status === "paid")
          .reduce((sum, payment) => sum + payment.amount, 0),
        pendingCount: selectedResidentPayments.filter(
          (payment) =>
            payment.status === "pending" || payment.status === "partial",
        ).length,
        overdueCount: selectedResidentPayments.filter(
          (payment) => payment.status === "overdue",
        ).length,
      }
    : { totalPaid: 0, pendingCount: 0, overdueCount: 0 };

  const residentsByBlock =
    selectedBlock === "all"
      ? residents
      : residents.filter(
          (resident) => getResidentBlockId(resident) === selectedBlock,
        );
  const movedOutResidentsByBlock =
    selectedBlock === "all"
      ? movedOutResidents
      : movedOutResidents.filter(
          (resident) => getResidentBlockId(resident) === selectedBlock,
        );
  const visibleResidents =
    listMode === "active" ? residentsByBlock : movedOutResidentsByBlock;

  const filteredResidents = visibleResidents.filter((resident) => {
    const matchesSearch =
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.phone.includes(searchTerm);
    const matchesType = typeFilter === "all" || resident.type === typeFilter;
    const matchesDate = !moveInFilter || resident.moveInDate >= moveInFilter;
    return matchesSearch && matchesType && matchesDate;
  });

  const stats = {
    total: residentsByBlock.length,
    students: visibleResidents.filter((r) => r.type === "student").length,
    professionals: visibleResidents.filter((r) => r.type === "professional")
      .length,
    movedOut: movedOutResidentsByBlock.length,
  };

  const handleOpenAddResident = () => {
    const defaultBlockId =
      selectedBlock === "all" ? (hostel.blocks[0]?.id ?? "") : selectedBlock;
    setEditingResidentId(null);
    setResidentForm({
      name: "",
      email: "",
      phone: "",
      type: "student",
      organization: "",
      idType: "aadhar",
      idNumber: "",
      moveInDate: "",
      blockId: defaultBlockId,
      roomId: "",
      bedId: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
    });
    setResidentErrors({});
    setAddModalOpen(true);
  };

  const handleOpenEditResident = (resident: Resident) => {
    const blockId = getResidentBlockId(resident);
    setEditingResidentId(resident.id);
    setResidentForm({
      name: resident.name,
      email: resident.email,
      phone: resident.phone,
      type: resident.type,
      organization: resident.organization ?? "",
      idType: resident.idType,
      idNumber: resident.idNumber,
      moveInDate: resident.moveInDate,
      blockId,
      roomId: resident.roomId,
      bedId: resident.bedId,
      emergencyName: resident.emergencyContact.name,
      emergencyPhone: resident.emergencyContact.phone,
      emergencyRelation: resident.emergencyContact.relation,
    });
    setResidentErrors({});
    setAddModalOpen(true);
  };

  const handleMoveOut = (resident: Resident) => {
    const moveOutDate = new Date().toISOString().split("T")[0];
    setMovedOutResidents((prev) => [...prev, { ...resident, moveOutDate }]);
    setResidents((prev) => prev.filter((item) => item.id !== resident.id));
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== resident.roomId) return room;
        return {
          ...room,
          beds: room.beds.map((bed) =>
            bed.id === resident.bedId ? { ...bed, residentId: undefined } : bed,
          ),
        };
      }),
    );
    if (selectedResident?.id === resident.id) {
      setSelectedResident(null);
    }
  };

  const handleAddResident = () => {
    const errors: Record<string, string> = {};
    if (!residentForm.name.trim()) errors.name = "Name is required.";
    if (!residentForm.email.trim()) errors.email = "Email is required.";
    if (!residentForm.phone.trim()) errors.phone = "Phone is required.";
    if (!residentForm.idNumber.trim())
      errors.idNumber = "ID number is required.";
    if (!residentForm.moveInDate)
      errors.moveInDate = "Move-in date is required.";
    if (!residentForm.blockId) errors.blockId = "Select a building.";
    if (!residentForm.roomId) errors.roomId = "Select a room.";
    if (!residentForm.bedId) errors.bedId = "Select a bed.";
    if (!residentForm.emergencyName.trim()) {
      errors.emergencyName = "Emergency contact name is required.";
    }
    if (!residentForm.emergencyPhone.trim()) {
      errors.emergencyPhone = "Emergency contact phone is required.";
    }
    if (!residentForm.emergencyRelation.trim()) {
      errors.emergencyRelation = "Emergency contact relation is required.";
    }

    const selectedRoom = roomById.get(residentForm.roomId);
    const selectedBed = selectedRoom?.beds.find(
      (bed) => bed.id === residentForm.bedId,
    );
    if (
      selectedBed?.residentId &&
      selectedBed.residentId !== editingResidentId
    ) {
      errors.bedId = "Selected bed is already occupied.";
    }

    setResidentErrors(errors);
    if (Object.keys(errors).length) return;

    const newResidentId = editingResidentId ?? `resident-${Date.now()}`;
    const newResident: Resident = {
      id: newResidentId,
      name: residentForm.name.trim(),
      email: residentForm.email.trim(),
      phone: residentForm.phone.trim(),
      type: residentForm.type,
      organization: residentForm.organization.trim() || undefined,
      idType: residentForm.idType,
      idNumber: residentForm.idNumber.trim(),
      emergencyContact: {
        name: residentForm.emergencyName.trim(),
        phone: residentForm.emergencyPhone.trim(),
        relation: residentForm.emergencyRelation.trim(),
      },
      moveInDate: residentForm.moveInDate,
      roomId: residentForm.roomId,
      bedId: residentForm.bedId,
      mealPlan: "no-meals",
      dietaryTags: [],
    };

    setResidents((prev) => {
      if (editingResidentId) {
        return prev.map((item) =>
          item.id === newResidentId ? newResident : item,
        );
      }
      return [...prev, newResident];
    });
    setRooms((prev) => {
      const existing = residents.find((item) => item.id === newResidentId);
      const previousRoomId = existing?.roomId;
      const previousBedId = existing?.bedId;
      return prev.map((room) => {
        if (room.id !== residentForm.roomId && room.id !== previousRoomId) {
          return room;
        }
        return {
          ...room,
          beds: room.beds.map((bed) => {
            if (room.id === previousRoomId && bed.id === previousBedId) {
              return { ...bed, residentId: undefined };
            }
            if (
              room.id === residentForm.roomId &&
              bed.id === residentForm.bedId
            ) {
              return { ...bed, residentId: newResidentId };
            }
            return bed;
          }),
        };
      });
    });
    setAddModalOpen(false);
    setEditingResidentId(null);
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Residents"
        subtitle={`Managing ${residentsByBlock.length} residents`}
      />

      <div className="p-4 md:p-6 space-y-6">
        <div className="space-y-4 rounded-xl border bg-card/50 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={selectedBlock} onValueChange={setSelectedBlock}>
              <TabsList className="flex flex-wrap justify-start">
                <TabsTrigger value="all">All Buildings</TabsTrigger>
                {hostel.blocks.map((block) => (
                  <TabsTrigger key={block.id} value={block.id}>
                    {block.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={typeFilter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setTypeFilter("all");
                  setListMode("active");
                }}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                {stats.total} Total Active
              </Button>
              <Button
                variant={typeFilter === "student" ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setTypeFilter("student");
                  setListMode("active");
                }}
                className="gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                {stats.students} Students
              </Button>
              <Button
                variant={
                  typeFilter === "professional" ? "secondary" : "outline"
                }
                size="sm"
                onClick={() => {
                  setTypeFilter("professional");
                  setListMode("active");
                }}
                className="gap-2"
              >
                <Briefcase className="h-4 w-4" />
                {stats.professionals} Professionals
              </Button>
              <Button
                variant={listMode === "moved-out" ? "secondary" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setListMode("moved-out")}
              >
                <Users className="h-4 w-4" />
                {stats.movedOut} Moved-out
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Move-in from
                </span>
                <Input
                  type="date"
                  className="w-full sm:w-40"
                  value={moveInFilter}
                  onChange={(event) => setMoveInFilter(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setMoveInFilter("");
                  setTypeFilter("all");
                  setSelectedBlock("all");
                  setListMode("active");
                }}
              >
                Clear Filters
              </Button>
              <Button
                className="gradient-primary"
                onClick={handleOpenAddResident}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Resident
              </Button>
            </div>
          </div>
        </div>

        {/* Residents Table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Resident</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>
                      {listMode === "active" ? "Move-in Date" : "Move-out Date"}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => (
                    <TableRow
                      key={resident.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedResident(resident)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {resident.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{resident.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {resident.organization}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            resident.type === "student"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-accent/10 text-accent border-accent/20",
                          )}
                        >
                          {resident.type === "student" ? (
                            <GraduationCap className="w-3 h-3 mr-1" />
                          ) : (
                            <Briefcase className="w-3 h-3 mr-1" />
                          )}
                          {resident.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getRoomLabel(resident.roomId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{resident.phone}</p>
                          <p className="text-xs text-muted-foreground">
                            {resident.email}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">
                          {new Date(
                            listMode === "active"
                              ? resident.moveInDate
                              : (resident.moveOutDate ?? resident.moveInDate),
                          ).toLocaleDateString("en-IN")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            listMode === "active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-muted text-muted-foreground border-muted",
                          )}
                        >
                          {listMode === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setSelectedResident(resident);
                                setIsViewingResident(true);
                              }}
                            >
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleOpenEditResident(resident)}
                            >
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                setSelectedResident(resident);
                                setIsViewingResident(false);
                                setIsViewingPayments(true);
                              }}
                            >
                              View Payments
                            </DropdownMenuItem>
                            {listMode === "active" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={() => {
                                  setMoveOutResident(resident);
                                  setIsMoveOutConfirmOpen(true);
                                }}
                              >
                                Initiate Move-out
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Resident Dialog */}
      <Dialog
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) setEditingResidentId(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingResidentId ? "Edit Resident" : "Add Resident"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={residentForm.name}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Full name"
                />
                {residentErrors.name && (
                  <p className="text-xs text-destructive">
                    {residentErrors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={residentForm.email}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="email@example.com"
                />
                {residentErrors.email && (
                  <p className="text-xs text-destructive">
                    {residentErrors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={residentForm.phone}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="+91 98765 12345"
                />
                {residentErrors.phone && (
                  <p className="text-xs text-destructive">
                    {residentErrors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Resident Type</Label>
                <Select
                  value={residentForm.type}
                  onValueChange={(value) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      type: value as Resident["type"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input
                  value={residentForm.organization}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      organization: event.target.value,
                    }))
                  }
                  placeholder="College / Company"
                />
              </div>
              <div className="space-y-2">
                <Label>Move-in Date</Label>
                <Input
                  type="date"
                  value={residentForm.moveInDate}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      moveInDate: event.target.value,
                    }))
                  }
                />
                {residentErrors.moveInDate && (
                  <p className="text-xs text-destructive">
                    {residentErrors.moveInDate}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>ID Type</Label>
                <Select
                  value={residentForm.idType}
                  onValueChange={(value) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      idType: value as Resident["idType"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhar">Aadhar</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="college_id">College ID</SelectItem>
                    <SelectItem value="employee_id">Employee ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input
                  value={residentForm.idNumber}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      idNumber: event.target.value,
                    }))
                  }
                  placeholder="ID number"
                />
                {residentErrors.idNumber && (
                  <p className="text-xs text-destructive">
                    {residentErrors.idNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Building</Label>
                <Select
                  value={residentForm.blockId || undefined}
                  onValueChange={(value) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      blockId: value,
                      roomId: "",
                      bedId: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostel.blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {residentErrors.blockId && (
                  <p className="text-xs text-destructive">
                    {residentErrors.blockId}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Select
                  value={residentForm.roomId || undefined}
                  onValueChange={(value) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      roomId: value,
                      bedId: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms
                      .filter(
                        (room) =>
                          !residentForm.blockId ||
                          floorToBlockId.get(room.floorId) ===
                            residentForm.blockId,
                      )
                      .filter(
                        (room) =>
                          room.id === residentForm.roomId ||
                          room.beds.some((bed) => !bed.residentId),
                      )
                      .map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.number}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {residentErrors.roomId && (
                  <p className="text-xs text-destructive">
                    {residentErrors.roomId}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Bed</Label>
                <Select
                  value={residentForm.bedId || undefined}
                  onValueChange={(value) =>
                    setResidentForm((prev) => ({ ...prev, bedId: value }))
                  }
                  disabled={!residentForm.roomId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roomById.get(residentForm.roomId)?.beds ?? [])
                      .filter(
                        (bed) =>
                          !bed.residentId ||
                          bed.residentId === editingResidentId,
                      )
                      .map((bed) => (
                        <SelectItem key={bed.id} value={bed.id}>
                          Bed {bed.number}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {residentErrors.bedId && (
                  <p className="text-xs text-destructive">
                    {residentErrors.bedId}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Emergency Contact Name</Label>
                <Input
                  value={residentForm.emergencyName}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      emergencyName: event.target.value,
                    }))
                  }
                  placeholder="Contact name"
                />
                {residentErrors.emergencyName && (
                  <p className="text-xs text-destructive">
                    {residentErrors.emergencyName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Emergency Phone</Label>
                <Input
                  value={residentForm.emergencyPhone}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      emergencyPhone: event.target.value,
                    }))
                  }
                  placeholder="+91 98765 00000"
                />
                {residentErrors.emergencyPhone && (
                  <p className="text-xs text-destructive">
                    {residentErrors.emergencyPhone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Relation</Label>
                <Input
                  value={residentForm.emergencyRelation}
                  onChange={(event) =>
                    setResidentForm((prev) => ({
                      ...prev,
                      emergencyRelation: event.target.value,
                    }))
                  }
                  placeholder="Relation"
                />
                {residentErrors.emergencyRelation && (
                  <p className="text-xs text-destructive">
                    {residentErrors.emergencyRelation}
                  </p>
                )}
              </div>
            </div>
            <Button
              className="gradient-primary w-full"
              onClick={handleAddResident}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Resident
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resident Detail Dialog */}
      <Dialog
        open={isViewingResident}
        onOpenChange={() => {
          setIsViewingResident(false);
          setSelectedResident(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resident Details</DialogTitle>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {selectedResident.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedResident.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedResident.organization}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1",
                      selectedResident.type === "student"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-accent/10 text-accent border-accent/20",
                    )}
                  >
                    {selectedResident.type}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Phone</span>
                  </div>
                  <p className="font-medium">{selectedResident.phone}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Email</span>
                  </div>
                  <p className="font-medium text-sm truncate">
                    {selectedResident.email}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Room</span>
                  </div>
                  <p className="font-medium">
                    {getRoomLabel(selectedResident.roomId)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Move-in
                    </span>
                  </div>
                  <p className="font-medium">
                    {new Date(selectedResident.moveInDate).toLocaleDateString(
                      "en-IN",
                    )}
                  </p>
                </div>
              </div>

              {/* ID Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">ID Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ID Type</p>
                    <p className="font-medium capitalize">
                      {selectedResident.idType.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ID Number</p>
                    <p className="font-medium">{selectedResident.idNumber}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                <p className="font-medium mb-2 text-destructive">
                  Emergency Contact
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {selectedResident.emergencyContact.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Relation</p>
                    <p className="font-medium">
                      {selectedResident.emergencyContact.relation}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {selectedResident.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsViewingResident(false);
                    setIsViewingPayments(true);
                  }}
                >
                  View Payments
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resident Payments Dialog */}
      <Dialog
        open={isViewingPayments}
        onOpenChange={(open) => {
          setIsViewingPayments(open);
          if (!open) setSelectedResident(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment History</DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resident</p>
                    <p className="text-lg font-semibold">
                      {selectedResident.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Room {getRoomLabel(selectedResident.roomId)}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="rounded-lg bg-success/10 px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        Total Paid
                      </p>
                      <p className="font-semibold text-success">
                        {formatCurrency(paymentSummary.totalPaid)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-warning/10 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="font-semibold">
                        {paymentSummary.pendingCount}
                      </p>
                    </div>
                    <div className="rounded-lg bg-destructive/10 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      <p className="font-semibold text-destructive">
                        {paymentSummary.overdueCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResidentPayments.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-6">
                      No payment records available for this resident.
                    </div>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Month</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedResidentPayments.map((payment) => {
                            const config = statusConfig[payment.status];
                            const StatusIcon = config.icon;

                            return (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">
                                  {payment.month}
                                </TableCell>
                                <TableCell className="capitalize">
                                  {payment.type.replace("_", " ")}
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {formatCurrency(payment.amount)}
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {new Date(
                                      payment.dueDate,
                                    ).toLocaleDateString("en-IN")}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-muted-foreground">
                                    {payment.paidDate
                                      ? new Date(
                                          payment.paidDate,
                                        ).toLocaleDateString("en-IN")
                                      : "—"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={cn(
                                      "status-badge",
                                      config.className,
                                    )}
                                  >
                                    <StatusIcon className="w-3 h-3" />
                                    {payment.status}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Move-out Confirmation Dialog */}
      <Dialog
        open={isMoveOutConfirmOpen}
        onOpenChange={(open) => {
          setIsMoveOutConfirmOpen(open);
          if (!open) setMoveOutResident(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Move-out</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
              {moveOutResident ? (
                <p>
                  You are about to move out{" "}
                  <span className="font-semibold">{moveOutResident.name}</span>{" "}
                  from room {getRoomLabel(moveOutResident.roomId)}. This action
                  will release the assigned bed.
                </p>
              ) : (
                <p>Select a resident to proceed with move-out.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsMoveOutConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={!moveOutResident}
                onClick={() => {
                  if (!moveOutResident) return;
                  handleMoveOut(moveOutResident);
                  setIsMoveOutConfirmOpen(false);
                  setMoveOutResident(null);
                }}
              >
                Confirm Move-out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentsPage;
