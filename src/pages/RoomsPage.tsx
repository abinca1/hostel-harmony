import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FloorPlanView } from "@/components/rooms/FloorPlanView";
import { RoomStatusBadge } from "@/components/rooms/RoomStatusBadge";
import { mockHostels, mockRooms } from "@/data/mockData";
import { Room, RoomStatus } from "@/types/hostel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  LayoutGrid,
  Grid3X3,
  Filter,
  Plus,
  User,
  Bed,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RoomsPage = () => {
  const [selectedBlock, setSelectedBlock] = useState("block-a");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomErrors, setRoomErrors] = useState<Record<string, string>>({});
  const [roomForm, setRoomForm] = useState({
    number: "",
    category: "single" as Room["category"],
    floorNumber: "",
    totalBedspaces: "",
    pricePerBedspace: "",
    hasAttachedBathroom: false,
    amenities: "",
  });

  const hostel = mockHostels[0];
  const currentBlock = hostel.blocks.find((b) => b.id === selectedBlock);

  // Group rooms by floor
  const roomsByFloor =
    currentBlock?.floors.map((floor) => {
      const floorRooms = rooms.filter((r) => r.floorId === floor.id);
      return {
        floor,
        rooms:
          statusFilter === "all"
            ? floorRooms
            : floorRooms.filter((r) => r.status === statusFilter),
      };
    }) || [];

  // Stats
  const allBlockRooms = rooms.filter((r) =>
    currentBlock?.floors.some((f) => f.id === r.floorId),
  );
  const stats = {
    total: allBlockRooms.length,
    available: allBlockRooms.filter((r) => r.status === "available").length,
    occupied: allBlockRooms.filter((r) => r.status === "occupied").length,
    maintenance: allBlockRooms.filter((r) => r.status === "maintenance").length,
    reserved: allBlockRooms.filter((r) => r.status === "reserved").length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleOpenAddRoom = () => {
    setEditingRoomId(null);
    setRoomForm({
      number: "",
      category: "single",
      floorNumber: "",
      totalBedspaces: "",
      pricePerBedspace: "",
      hasAttachedBathroom: false,
      amenities: "",
    });
    setRoomErrors({});
    setRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room: Room) => {
    const floorNumber =
      currentBlock?.floors.find((floor) => floor.id === room.floorId)?.number ??
      "";
    setEditingRoomId(room.id);
    setRoomForm({
      number: room.number,
      category: room.category,
      floorNumber: floorNumber ? String(floorNumber) : "",
      totalBedspaces: String(room.beds.length),
      pricePerBedspace: String(
        Math.round(room.monthlyRent / Math.max(room.beds.length, 1)),
      ),
      hasAttachedBathroom: room.amenities.includes("Attached Bathroom"),
      amenities: room.amenities
        .filter((amenity) => amenity !== "Attached Bathroom")
        .join(", "),
    });
    setRoomErrors({});
    setRoomModalOpen(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    if (editingRoomId === roomId) {
      setEditingRoomId(null);
      setRoomModalOpen(false);
    }
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  const handleAddRoom = () => {
    const errors: Record<string, string> = {};
    if (!roomForm.number.trim()) errors.number = "Room number is required.";
    const floorNumber = Number(roomForm.floorNumber);
    if (!floorNumber || floorNumber < 1) {
      errors.floorNumber = "Enter a valid floor number.";
    }
    const totalBedspaces = Number(roomForm.totalBedspaces);
    if (!totalBedspaces || totalBedspaces < 1) {
      errors.totalBedspaces = "Enter total bedspaces.";
    }
    const pricePerBedspace = Number(roomForm.pricePerBedspace);
    if (!pricePerBedspace || pricePerBedspace < 1) {
      errors.pricePerBedspace = "Enter a valid price.";
    }
    const matchingFloor = currentBlock?.floors.find(
      (floor) => floor.number === floorNumber,
    );
    if (!matchingFloor) {
      errors.floorNumber = "Floor does not exist in this building.";
    }
    const duplicate = rooms.some((room) => {
      if (!matchingFloor) return false;
      return (
        room.floorId === matchingFloor.id &&
        room.number.toLowerCase() === roomForm.number.trim().toLowerCase() &&
        room.id !== editingRoomId
      );
    });
    if (duplicate) errors.number = "Room number already exists in this block.";

    setRoomErrors(errors);
    if (Object.keys(errors).length) return;

    const newRoomId = editingRoomId ?? `room-${Date.now()}`;
    const amenities = roomForm.amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean);
    if (
      roomForm.hasAttachedBathroom &&
      !amenities.includes("Attached Bathroom")
    ) {
      amenities.unshift("Attached Bathroom");
    }

    setRooms((prev) => {
      const existing = prev.find((room) => room.id === newRoomId);
      const status = existing?.status ?? "available";
      const existingBeds = existing?.beds ?? [];
      const nextBeds = Array.from({ length: totalBedspaces }, (_, index) => {
        const existingBed = existingBeds[index];
        return {
          id: existingBed?.id ?? `bed-${newRoomId}-${index + 1}`,
          number: String(index + 1),
          roomId: newRoomId,
          residentId: existingBed?.residentId,
        };
      });
      const nextRoom: Room = {
        id: newRoomId,
        number: roomForm.number.trim(),
        floorId: matchingFloor?.id ?? "",
        category: roomForm.category,
        status,
        monthlyRent: pricePerBedspace * totalBedspaces,
        beds: nextBeds,
        amenities,
      };
      if (existing) {
        return prev.map((room) => (room.id === newRoomId ? nextRoom : room));
      }
      return [...prev, nextRoom];
    });
    setRoomModalOpen(false);
    setEditingRoomId(null);
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Rooms & Beds"
        // subtitle={`${hostel.name} - Managing ${mockRooms.length} rooms`}
      />
      <div className="p-4 md:p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Block Selector */}
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-40">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hostel.blocks.map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "compact" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("compact")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>

            {statusFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                <Filter className="w-4 h-4 mr-1" />
                Clear Filter
              </Button>
            )}
          </div>

          <Button className="gradient-primary" onClick={handleOpenAddRoom}>
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
          {(
            [
              "total",
              "available",
              "occupied",
              "maintenance",
              "reserved",
            ] as Array<RoomStatus | "total">
          ).map((status) => (
            <Card
              key={status}
              className={cn(
                "cursor-pointer transition-all",
                status === "total"
                  ? statusFilter === "all" && "ring-2 ring-primary"
                  : statusFilter === status && "ring-2 ring-primary",
              )}
              onClick={() => {
                if (status === "total") {
                  setStatusFilter("all");
                } else {
                  setStatusFilter(statusFilter === status ? "all" : status);
                }
              }}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {status === "total" ? stats.total : stats[status]}
                  </p>
                  {status === "total" ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Bed className="w-3 h-3" />
                      <span>Total Rooms</span>
                    </div>
                  ) : (
                    <RoomStatusBadge status={status} size="sm" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floor Plans */}
        <div className="space-y-6">
          <div className=" space-y-3">
            {/* <p className="text-sm font-semibold">Floor {floor.number}</p> */}
            <FloorPlanView
              floorNumber={0}
              rooms={roomsByFloor[0]?.rooms}
              viewMode={viewMode}
              onRoomClick={setSelectedRoom}
            />
          </div>
        </div>
      </div>

      <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRoomId ? "Edit Room" : "Create Room"}
            </DialogTitle>
            <DialogDescription>
              {editingRoomId
                ? "Update room details, bedspaces, and pricing."
                : "Add rooms for the selected building, including bedspaces and pricing."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Building</Label>
              <Select
                value={selectedBlock}
                onValueChange={(value) => {
                  setSelectedBlock(value);
                  setRoomForm((prev) => ({
                    ...prev,
                    floorNumber: "",
                  }));
                }}
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
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Room Number</Label>
                <Input
                  value={roomForm.number}
                  onChange={(event) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      number: event.target.value,
                    }))
                  }
                  placeholder="A-101"
                />
                {roomErrors.number && (
                  <p className="text-xs text-destructive">
                    {roomErrors.number}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select
                  value={roomForm.category}
                  onValueChange={(value) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      category: value as Room["category"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="dorm">Dormitory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Floor</Label>
                <Input
                  type="number"
                  min="1"
                  value={roomForm.floorNumber}
                  onChange={(event) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      floorNumber: event.target.value,
                    }))
                  }
                />
                {roomErrors.floorNumber && (
                  <p className="text-xs text-destructive">
                    {roomErrors.floorNumber}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Total Bedspaces</Label>
                <Input
                  type="number"
                  min="1"
                  value={roomForm.totalBedspaces}
                  onChange={(event) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      totalBedspaces: event.target.value,
                    }))
                  }
                />
                {roomErrors.totalBedspaces && (
                  <p className="text-xs text-destructive">
                    {roomErrors.totalBedspaces}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Price per Bedspace (₹)</Label>
                <Input
                  type="number"
                  min="1"
                  value={roomForm.pricePerBedspace}
                  onChange={(event) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      pricePerBedspace: event.target.value,
                    }))
                  }
                />
                {roomErrors.pricePerBedspace && (
                  <p className="text-xs text-destructive">
                    {roomErrors.pricePerBedspace}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Bathroom Attached</Label>
                  <p className="text-xs text-muted-foreground">
                    Toggle if the room has an attached bathroom.
                  </p>
                </div>
                <Switch
                  checked={roomForm.hasAttachedBathroom}
                  onCheckedChange={(checked) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      hasAttachedBathroom: checked,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Features</Label>
              <Textarea
                value={roomForm.amenities}
                onChange={(event) =>
                  setRoomForm((prev) => ({
                    ...prev,
                    amenities: event.target.value,
                  }))
                }
                placeholder="Attached Bathroom, Balcony, AC"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple features with commas.
              </p>
            </div>
            <Button className="gradient-primary w-full" onClick={handleAddRoom}>
              <Plus className="w-4 h-4 mr-2" />
              {editingRoomId ? "Save Changes" : "Add Room"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Detail Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Room {selectedRoom?.number}
              {selectedRoom && <RoomStatusBadge status={selectedRoom.status} />}
            </DialogTitle>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">
                    {selectedRoom.category}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium">
                    {formatCurrency(selectedRoom.monthlyRent)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Beds</p>
                <div className="space-y-2">
                  {selectedRoom.beds.map((bed) => (
                    <div
                      key={bed.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Bed {bed.number}</span>
                      </div>
                      {bed.residentId ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="text-sm text-primary">Occupied</span>
                        </div>
                      ) : (
                        <span className="text-sm text-success">Available</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-muted rounded-md text-xs font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => {
                    handleOpenEditRoom(selectedRoom);
                    setSelectedRoom(null);
                  }}
                >
                  Edit Room
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => handleDeleteRoom(selectedRoom.id)}
                >
                  Delete
                </Button>
                {selectedRoom.status === "available" && (
                  <Button className="flex-1 gradient-primary">Allocate</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsPage;
