import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Building2, Bed, Plus, MapPin } from "lucide-react";
import { mockResidents } from "@/data/mockData";

type RoomType = "single" | "double" | "suite" | "dorm";

interface Building {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  totalRooms: number;
  capacity?: number;
  notes?: string;
}

interface ManagedRoom {
  id: string;
  buildingId: string;
  number: string;
  type: RoomType;
  floorNumber: number;
  totalBedspaces: number;
  pricePerBedspace: number;
  hasAttachedBathroom: boolean;
  features: string[];
}

interface BedspaceConfig {
  id: string;
  roomId: string;
  label: string;
  price: number;
  features: string[];
}


const initialBuildings: Building[] = [
  {
    id: "building-1",
    name: "Green Valley Tower",
    address: "123 University Road, Bangalore 560001",
    totalFloors: 6,
    totalRooms: 90,
    capacity: 240,
    notes: "Primary residence for undergraduate students.",
  },
  {
    id: "building-2",
    name: "Sunrise Annex",
    address: "45 North Avenue, Bangalore 560002",
    totalFloors: 4,
    totalRooms: 48,
    capacity: 120,
    notes: "Preferred for professionals and faculty.",
  },
];

const initialRooms: ManagedRoom[] = [
  {
    id: "room-1",
    buildingId: "building-1",
    number: "A-101",
    type: "double",
    floorNumber: 1,
    totalBedspaces: 2,
    pricePerBedspace: 6200,
    hasAttachedBathroom: true,
    features: ["Attached Bathroom", "AC", "Study Desk"],
  },
  {
    id: "room-2",
    buildingId: "building-1",
    number: "A-210",
    type: "suite",
    floorNumber: 2,
    totalBedspaces: 3,
    pricePerBedspace: 7600,
    hasAttachedBathroom: true,
    features: ["Balcony", "Premium Furnishing"],
  },
  {
    id: "room-3",
    buildingId: "building-2",
    number: "B-12",
    type: "single",
    floorNumber: 1,
    totalBedspaces: 1,
    pricePerBedspace: 8400,
    hasAttachedBathroom: false,
    features: ["Garden View", "AC"],
  },
];

const initialBedspaces: BedspaceConfig[] = [
  {
    id: "bed-1",
    roomId: "room-1",
    label: "A-101-B1",
    price: 6200,
    features: ["Near Window"],
  },
  {
    id: "bed-2",
    roomId: "room-1",
    label: "A-101-B2",
    price: 6000,
    features: ["Lower Bunk"],
  },
  {
    id: "bed-3",
    roomId: "room-2",
    label: "A-210-B1",
    price: 7800,
    features: ["Corner Side"],
  },
];


const AdminPanelPage = () => {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [rooms, setRooms] = useState<ManagedRoom[]>(initialRooms);
  const [bedspaces, setBedspaces] =
    useState<BedspaceConfig[]>(initialBedspaces);

  const [selectedBuildingId, setSelectedBuildingId] = useState(
    initialBuildings[0]?.id ?? "",
  );
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [buildingForm, setBuildingForm] = useState({
    name: "",
    address: "",
    totalFloors: "",
    totalRooms: "",
    capacity: "",
    notes: "",
  });
  const [roomForm, setRoomForm] = useState({
    buildingId: selectedBuildingId,
    number: "",
    type: "single" as RoomType,
    floorNumber: "",
    totalBedspaces: "",
    pricePerBedspace: "",
    hasAttachedBathroom: false,
    features: "",
  });
  const [bedspaceForm, setBedspaceForm] = useState({
    roomId: "",
    label: "",
    price: "",
    features: "",
  });

  const [buildingErrors, setBuildingErrors] = useState<Record<string, string>>(
    {},
  );
  const [roomErrors, setRoomErrors] = useState<Record<string, string>>({});
  const [bedspaceErrors, setBedspaceErrors] = useState<Record<string, string>>(
    {},
  );
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [documentationOpen, setDocumentationOpen] = useState(false);

  useEffect(() => {
    setRoomForm((prev) => ({ ...prev, buildingId: selectedBuildingId }));
  }, [selectedBuildingId]);

  const buildingRooms = useMemo(
    () => rooms.filter((room) => room.buildingId === selectedBuildingId),
    [rooms, selectedBuildingId],
  );

  useEffect(() => {
    if (!buildingRooms.length) {
      setSelectedRoomId("");
      return;
    }
    if (!buildingRooms.some((room) => room.id === selectedRoomId)) {
      setSelectedRoomId(buildingRooms[0].id);
    }
  }, [buildingRooms, selectedRoomId]);

  useEffect(() => {
    setBedspaceForm((prev) => ({ ...prev, roomId: selectedRoomId }));
  }, [selectedRoomId]);

  const selectedBuilding = buildings.find(
    (building) => building.id === selectedBuildingId,
  );
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const totalBuildings = buildings.length;
  const totalRooms = buildings.reduce(
    (sum, building) => sum + building.totalRooms,
    0,
  );
  const totalResidents = mockResidents.length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleAddBuilding = () => {
    const errors: Record<string, string> = {};
    if (!buildingForm.name.trim()) errors.name = "Building name is required.";
    if (!buildingForm.address.trim()) errors.address = "Address is required.";
    const totalFloors = Number(buildingForm.totalFloors);
    if (!totalFloors || totalFloors < 1)
      errors.totalFloors = "Enter a valid floor count.";
    const totalRooms = Number(buildingForm.totalRooms);
    if (!totalRooms || totalRooms < 1)
      errors.totalRooms = "Enter total number of rooms.";
    const capacity = buildingForm.capacity
      ? Number(buildingForm.capacity)
      : undefined;
    if (buildingForm.capacity && (!capacity || capacity < 1)) {
      errors.capacity = "Capacity must be a positive number.";
    }
    setBuildingErrors(errors);
    if (Object.keys(errors).length) return;

    const newBuilding: Building = {
      id: `building-${Date.now()}`,
      name: buildingForm.name.trim(),
      address: buildingForm.address.trim(),
      totalFloors,
      totalRooms,
      capacity,
      notes: buildingForm.notes.trim() || undefined,
    };
    setBuildings((prev) => [...prev, newBuilding]);
    setSelectedBuildingId(newBuilding.id);
    setBuildingModalOpen(false);
    setBuildingForm({
      name: "",
      address: "",
      totalFloors: "",
      totalRooms: "",
      capacity: "",
      notes: "",
    });
    setBuildingErrors({});
  };

  const handleAddRoom = () => {
    const errors: Record<string, string> = {};
    if (!roomForm.buildingId) errors.buildingId = "Select a building.";
    if (!roomForm.number.trim()) errors.number = "Room number is required.";
    const floorNumber = Number(roomForm.floorNumber);
    if (!floorNumber || floorNumber < 1)
      errors.floorNumber = "Enter a valid floor number.";
    const totalBedspaces = Number(roomForm.totalBedspaces);
    if (!totalBedspaces || totalBedspaces < 1)
      errors.totalBedspaces = "Enter total bedspaces.";
    const pricePerBedspace = Number(roomForm.pricePerBedspace);
    if (!pricePerBedspace || pricePerBedspace < 1) {
      errors.pricePerBedspace = "Enter a valid price.";
    }
    const duplicate = rooms.some(
      (room) =>
        room.id !== editingRoomId &&
        room.buildingId === roomForm.buildingId &&
        room.number.toLowerCase() === roomForm.number.trim().toLowerCase(),
    );
    if (duplicate)
      errors.number = "Room number already exists in this building.";

    setRoomErrors(errors);
    if (Object.keys(errors).length) return;

    const features = roomForm.features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);

    if (editingRoomId) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === editingRoomId
            ? {
                ...room,
                buildingId: roomForm.buildingId,
                number: roomForm.number.trim(),
                type: roomForm.type,
                floorNumber,
                totalBedspaces,
                pricePerBedspace,
                hasAttachedBathroom: roomForm.hasAttachedBathroom,
                features,
              }
            : room,
        ),
      );
      setSelectedRoomId(editingRoomId);
      setEditingRoomId(null);
    } else {
      const newRoom: ManagedRoom = {
        id: `room-${Date.now()}`,
        buildingId: roomForm.buildingId,
        number: roomForm.number.trim(),
        type: roomForm.type,
        floorNumber,
        totalBedspaces,
        pricePerBedspace,
        hasAttachedBathroom: roomForm.hasAttachedBathroom,
        features,
      };
      setRooms((prev) => [...prev, newRoom]);
      setSelectedRoomId(newRoom.id);
    }
    setRoomModalOpen(false);
    setRoomForm({
      buildingId: roomForm.buildingId,
      number: "",
      type: "single",
      floorNumber: "",
      totalBedspaces: "",
      pricePerBedspace: "",
      hasAttachedBathroom: false,
      features: "",
    });
    setRoomErrors({});
  };

  const handleStartEditRoom = (room: ManagedRoom) => {
    setEditingRoomId(room.id);
    setRoomForm({
      buildingId: room.buildingId,
      number: room.number,
      type: room.type,
      floorNumber: String(room.floorNumber),
      totalBedspaces: String(room.totalBedspaces),
      pricePerBedspace: String(room.pricePerBedspace),
      hasAttachedBathroom: room.hasAttachedBathroom,
      features: room.features.join(", "),
    });
    setRoomModalOpen(true);
  };

  const handleCancelEditRoom = () => {
    setEditingRoomId(null);
    setRoomForm({
      buildingId: selectedBuildingId,
      number: "",
      type: "single",
      floorNumber: "",
      totalBedspaces: "",
      pricePerBedspace: "",
      hasAttachedBathroom: false,
      features: "",
    });
    setRoomErrors({});
    setRoomModalOpen(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    setBedspaces((prev) =>
      prev.filter((bedspace) => bedspace.roomId !== roomId),
    );
    if (selectedRoomId === roomId) {
      setSelectedRoomId("");
    }
    if (editingRoomId === roomId) {
      setEditingRoomId(null);
      setRoomForm({
        buildingId: selectedBuildingId,
        number: "",
        type: "single",
        floorNumber: "",
        totalBedspaces: "",
        pricePerBedspace: "",
        hasAttachedBathroom: false,
        features: "",
      });
      setRoomErrors({});
    }
  };

  const handleOpenCreateRoom = () => {
    setEditingRoomId(null);
    setRoomForm({
      buildingId: selectedBuildingId,
      number: "",
      type: "single",
      floorNumber: "",
      totalBedspaces: "",
      pricePerBedspace: "",
      hasAttachedBathroom: false,
      features: "",
    });
    setRoomErrors({});
    setRoomModalOpen(true);
  };

  const handleAddBedspace = () => {
    const errors: Record<string, string> = {};
    if (!bedspaceForm.roomId) errors.roomId = "Select a room.";
    if (!bedspaceForm.label.trim())
      errors.label = "Bedspace label is required.";
    const room = rooms.find((item) => item.id === bedspaceForm.roomId);
    if (!room) errors.roomId = "Select a valid room.";
    const price = bedspaceForm.price
      ? Number(bedspaceForm.price)
      : room?.pricePerBedspace;
    if (!price || price < 1) errors.price = "Enter a valid price.";
    const duplicate = bedspaces.some(
      (bedspace) =>
        bedspace.roomId === bedspaceForm.roomId &&
        bedspace.label.toLowerCase() ===
          bedspaceForm.label.trim().toLowerCase(),
    );
    if (duplicate)
      errors.label = "Bedspace label already exists for this room.";
    setBedspaceErrors(errors);
    if (Object.keys(errors).length) return;

    const newBedspace: BedspaceConfig = {
      id: `bedspace-${Date.now()}`,
      roomId: bedspaceForm.roomId,
      label: bedspaceForm.label.trim(),
      price: price ?? 0,
      features: bedspaceForm.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
    };
    setBedspaces((prev) => [...prev, newBedspace]);
    setBedspaceForm({
      roomId: bedspaceForm.roomId,
      label: "",
      price: "",
      features: "",
    });
    setBedspaceErrors({});
  };


  return (
    <div className="animate-fade-in">
      <Header
        title="Admin Panel"
        subtitle="Configure buildings and rooms"
      />

      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            className="border-dashed text-muted-foreground hover:text-foreground"
            onClick={() => setDocumentationOpen(true)}
          >
            Documentation
          </Button>
          <Button className="gradient-primary" onClick={handleOpenCreateRoom}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rooms
          </Button>
          <Button
            className="gradient-primary"
            onClick={() => setBuildingModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Building
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Buildings</p>
              <p className="text-2xl font-semibold">{totalBuildings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Rooms</p>
              <p className="text-2xl font-semibold">{totalRooms}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Residents</p>
              <p className="text-2xl font-semibold">{totalResidents}</p>
            </CardContent>
          </Card>
        </div>

        <Dialog open={buildingModalOpen} onOpenChange={setBuildingModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Building</DialogTitle>
              <DialogDescription>
                Register a new building with total floors, rooms, and capacity
                details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Building Name</Label>
                <Input
                  value={buildingForm.name}
                  onChange={(event) =>
                    setBuildingForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Green Valley Tower"
                />
                {buildingErrors.name && (
                  <p className="text-xs text-destructive">
                    {buildingErrors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={buildingForm.address}
                  onChange={(event) =>
                    setBuildingForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  placeholder="123 University Road, Bangalore"
                />
                {buildingErrors.address && (
                  <p className="text-xs text-destructive">
                    {buildingErrors.address}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Floors</Label>
                  <Input
                    type="number"
                    min="1"
                    value={buildingForm.totalFloors}
                    onChange={(event) =>
                      setBuildingForm((prev) => ({
                        ...prev,
                        totalFloors: event.target.value,
                      }))
                    }
                  />
                  {buildingErrors.totalFloors && (
                    <p className="text-xs text-destructive">
                      {buildingErrors.totalFloors}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Total Rooms</Label>
                  <Input
                    type="number"
                    min="1"
                    value={buildingForm.totalRooms}
                    onChange={(event) =>
                      setBuildingForm((prev) => ({
                        ...prev,
                        totalRooms: event.target.value,
                      }))
                    }
                  />
                  {buildingErrors.totalRooms && (
                    <p className="text-xs text-destructive">
                      {buildingErrors.totalRooms}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Capacity (Optional)</Label>
                <Input
                  type="number"
                  min="1"
                  value={buildingForm.capacity}
                  onChange={(event) =>
                    setBuildingForm((prev) => ({
                      ...prev,
                      capacity: event.target.value,
                    }))
                  }
                  placeholder="240"
                />
                {buildingErrors.capacity && (
                  <p className="text-xs text-destructive">
                    {buildingErrors.capacity}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={buildingForm.notes}
                  onChange={(event) =>
                    setBuildingForm((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Any additional information such as occupancy rules."
                />
              </div>
              <Button
                className="gradient-primary w-full"
                onClick={handleAddBuilding}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Add Building
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRoomId ? "Edit Room" : "Create Room"}
              </DialogTitle>
              <DialogDescription>
                Add rooms for the selected building, including bedspaces and
                pricing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Building</Label>
                <Select
                  value={roomForm.buildingId}
                  onValueChange={(value) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      buildingId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {roomErrors.buildingId && (
                  <p className="text-xs text-destructive">
                    {roomErrors.buildingId}
                  </p>
                )}
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
                    value={roomForm.type}
                    onValueChange={(value) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        type: value as RoomType,
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
                  value={roomForm.features}
                  onChange={(event) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      features: event.target.value,
                    }))
                  }
                  placeholder="Attached Bathroom, Balcony, AC"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple features with commas.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="gradient-primary w-full"
                  onClick={handleAddRoom}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {editingRoomId ? "Save Changes" : "Add Room"}
                </Button>
                {editingRoomId && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCancelEditRoom}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Building Directory
                </CardTitle>
                <CardDescription>
                  Tap a building to manage rooms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {buildings.map((building) => {
                  const roomCount = rooms.filter(
                    (room) => room.buildingId === building.id,
                  ).length;
                  return (
                    <div
                      key={building.id}
                      className={`rounded-lg border p-4 transition-all ${
                        selectedBuildingId === building.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <button
                        type="button"
                        className="w-full text-left space-y-2"
                        onClick={() => setSelectedBuildingId(building.id)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold">{building.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {building.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>{building.totalFloors} Floors</span>
                            <span>•</span>
                            <span>
                              {roomCount}/{building.totalRooms} Rooms
                            </span>
                            {building.capacity && (
                              <>
                                <span>•</span>
                                <span>{building.capacity} Capacity</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      Rooms in Building
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {selectedBuilding
                      ? `${selectedBuilding.name} room list.`
                      : "Select a building."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {buildingRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`rounded-lg border p-4 ${
                        selectedRoomId === room.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="w-full text-left space-y-2"
                        onClick={() => setSelectedRoomId(room.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{room.number}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {room.type}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {room.totalBedspaces} Beds
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>Floor {room.floorNumber}</span>
                          <span>•</span>
                          <span>
                            {room.hasAttachedBathroom
                              ? "Attached Bathroom"
                              : "Shared Bathroom"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(room.pricePerBedspace)} per bedspace
                        </div>
                        {room.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {room.features.map((feature) => (
                              <Badge key={feature} variant="secondary">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </button>
                      <div className="pt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEditRoom(room)}
                        >
                          Edit Room
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!buildingRooms.length && (
                    <p className="text-sm text-muted-foreground">
                      No rooms added yet. Add the first room to begin.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Dialog open={documentationOpen} onOpenChange={setDocumentationOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Documentation</DialogTitle>
              <DialogDescription>
                How to use building and room management.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Use These Features</CardTitle>
                  <CardDescription>
                    Follow the recommended setup sequence for a clean hierarchy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Add buildings with accurate floor counts and addresses.
                    </li>
                    <li>
                      Create rooms for the selected building, setting bedspace
                      counts and pricing.
                    </li>
                  </ol>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Example entry</p>
                    <div className="rounded-lg border bg-muted/40 p-4 text-xs">
                      <p>
                        Building: Green Valley Tower • Floors: 6 • Rooms: 90 •
                        Capacity: 240
                      </p>
                      <p>
                        Room: A-101 • Type: Double • Bedspaces: 2 • Price:
                        ₹6,200
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Schema Suggestions</CardTitle>
                  <CardDescription>
                    Normalize by building and room with foreign keys.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Table</TableHead>
                          <TableHead>Key Columns</TableHead>
                          <TableHead>Relationships</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            buildings
                          </TableCell>
                          <TableCell>
                            id, name, address, total_floors, total_rooms,
                            capacity, notes
                          </TableCell>
                          <TableCell>
                            rooms.building_id → buildings.id
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">rooms</TableCell>
                          <TableCell>
                            id, building_id, number, type, floor_number,
                            total_bedspaces, base_price, has_attached_bathroom
                          </TableCell>
                          <TableCell>unique(building_id, number)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Validation & Scalability Notes</CardTitle>
                  <CardDescription>
                    Built-in safeguards help maintain data integrity as you
                    scale.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Room numbers are unique within a building to avoid
                      conflicts.
                    </li>
                    <li>Floor and bedspace counts must be positive numbers.</li>
                    <li>
                      Pricing inputs enforce positive numbers for consistent
                      billing.
                    </li>
                    <li>
                      Expand the schema with audit logs, role-based access, and
                      occupancy history as the system grows.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanelPage;
