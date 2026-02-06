import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  CalendarDays,
  IdCard,
  Phone,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { mockHostels } from "@/data/mockData";

const staffRoles = [
  { value: "warden", label: "Warden" },
  { value: "cook", label: "Cook" },
  { value: "cleaning", label: "Cleaning" },
  { value: "helper", label: "Helper" },
  { value: "security", label: "Security" },
];

const idProofOptions = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "passport", label: "Passport" },
  { value: "driving-license", label: "Driving License" },
  { value: "voter-id", label: "Voter ID" },
];

const initialStaffList = [
  {
    id: "staff-1",
    name: "Anita Sharma",
    role: "warden",
    contactPrimary: "+91 98765 43210",
    contactSecondary: "+91 99110 22334",
    idProof: "Aadhar Card",
    idProofValue: "aadhar",
    idNumber: "XXXX-XXXX-1234",
    joinDate: "2024-04-12",
    building: "Building A",
    buildingId: "block-a",
    address: "12 Rose Park, Bangalore 560001",
    salary: "28000",
  },
  {
    id: "staff-2",
    name: "Rahul Nair",
    role: "cook",
    contactPrimary: "+91 98220 44556",
    contactSecondary: "+91 99887 66554",
    idProof: "Driving License",
    idProofValue: "driving-license",
    idNumber: "DL-1423-8899",
    joinDate: "2023-11-08",
    building: "-",
    buildingId: "",
    address: "5 Lakeview Street, Bangalore 560002",
    salary: "22000",
  },
  {
    id: "staff-3",
    name: "Meera Joshi",
    role: "security",
    contactPrimary: "+91 91234 55667",
    contactSecondary: "+91 90011 33445",
    idProof: "Voter ID",
    idProofValue: "voter-id",
    idNumber: "WB-5543-9921",
    joinDate: "2024-06-01",
    building: "-",
    buildingId: "",
    address: "4 City Gate, Bangalore 560010",
    salary: "24000",
  },
];

const emptyStaffForm = {
  name: "",
  role: "warden",
  contactPrimary: "",
  contactSecondary: "",
  idProof: "",
  idNumber: "",
  address: "",
  salary: "",
  joinDate: "",
  buildingId: "",
};

const StaffManagementPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [staffRecords, setStaffRecords] = useState(initialStaffList);
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [deleteStaffId, setDeleteStaffId] = useState<string | null>(null);

  const buildingOptions = useMemo(() => {
    const primaryHostel = mockHostels[0];
    if (!primaryHostel) return [];
    return primaryHostel.blocks.map((block) => ({
      value: block.id,
      label: block.name,
    }));
  }, []);

  const roleLabelMap = useMemo(
    () => new Map(staffRoles.map((role) => [role.value, role.label])),
    [],
  );

  const idProofLabelMap = useMemo(
    () => new Map(idProofOptions.map((option) => [option.value, option.label])),
    [],
  );

  const filteredStaffList = useMemo(() => {
    if (roleFilter === "all") return staffRecords;
    return staffRecords.filter((staff) => staff.role === roleFilter);
  }, [roleFilter, staffRecords]);

  const openCreateModal = () => {
    setEditingStaffId(null);
    setStaffForm({ ...emptyStaffForm });
    setCreateModalOpen(true);
  };

  const openEditModal = (staffId: string) => {
    const record = staffRecords.find((staff) => staff.id === staffId);
    if (!record) return;
    setEditingStaffId(staffId);
    setStaffForm({
      name: record.name,
      role: record.role,
      contactPrimary: record.contactPrimary,
      contactSecondary: record.contactSecondary,
      idProof: record.idProofValue ?? "",
      idNumber: record.idNumber,
      address: record.address ?? "",
      salary: record.salary ?? "",
      joinDate: record.joinDate,
      buildingId: record.buildingId ?? "",
    });
    setCreateModalOpen(true);
  };

  const handleSaveStaff = () => {
    const normalizedBuildingId = staffForm.role === "warden" ? staffForm.buildingId : "";
    const buildingLabel =
      buildingOptions.find((option) => option.value === normalizedBuildingId)?.label ?? "-";
    const idProofLabel = idProofLabelMap.get(staffForm.idProof) ?? "—";

    if (editingStaffId) {
      setStaffRecords((prev) =>
        prev.map((staff) =>
          staff.id === editingStaffId
            ? {
                ...staff,
                name: staffForm.name,
                role: staffForm.role,
                contactPrimary: staffForm.contactPrimary,
                contactSecondary: staffForm.contactSecondary,
                idProof: idProofLabel,
                idProofValue: staffForm.idProof,
                idNumber: staffForm.idNumber,
                address: staffForm.address,
                salary: staffForm.salary,
                joinDate: staffForm.joinDate,
                buildingId: normalizedBuildingId,
                building: staffForm.role === "warden" ? buildingLabel : "-",
              }
            : staff,
        ),
      );
    } else {
      setStaffRecords((prev) => [
        {
          id: `staff-${Date.now()}`,
          name: staffForm.name,
          role: staffForm.role,
          contactPrimary: staffForm.contactPrimary,
          contactSecondary: staffForm.contactSecondary,
          idProof: idProofLabel,
          idProofValue: staffForm.idProof,
          idNumber: staffForm.idNumber,
          address: staffForm.address,
          salary: staffForm.salary,
          joinDate: staffForm.joinDate,
          buildingId: normalizedBuildingId,
          building: staffForm.role === "warden" ? buildingLabel : "-",
        },
        ...prev,
      ]);
    }

    setCreateModalOpen(false);
    setEditingStaffId(null);
    setStaffForm({ ...emptyStaffForm, role: "warden" });
  };

  const handleDeleteStaff = () => {
    if (!deleteStaffId) return;
    setStaffRecords((prev) => prev.filter((staff) => staff.id !== deleteStaffId));
    setDeleteStaffId(null);
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Staff Management"
        subtitle="Maintain staff credentials, roles, and assignments"
      />

      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Staff Management
                </CardTitle>
                <CardDescription>
                  Track staff profiles and role assignments.
                </CardDescription>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
                <div className="w-full sm:w-60">
                  <Label>Filter by Staff Type</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-background border-input focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="All staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      {staffRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead>ID Proof</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaffList.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {roleLabelMap.get(staff.role) ?? staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          <div>{staff.contactPrimary}</div>
                          <div>{staff.contactSecondary}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{staff.idProof}</div>
                          <div className="text-muted-foreground">{staff.idNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.joinDate}</TableCell>
                      <TableCell>{staff.building}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Edit staff"
                            onClick={() => openEditModal(staff.id)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete staff"
                            onClick={() => setDeleteStaffId(staff.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingStaffId ? "Edit Staff Profile" : "Create Staff Profile"}</DialogTitle>
            <DialogDescription>
              Add staff credentials for warden, cook, cleaning, helper, or security.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Staff Role</Label>
                <Select
                  value={staffForm.role}
                  onValueChange={(value) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      role: value,
                      buildingId: value === "warden" ? prev.buildingId : "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Enter staff name"
                  value={staffForm.name}
                  onChange={(event) =>
                    setStaffForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Number 1
                </Label>
                <Input
                  placeholder="Primary contact number"
                  value={staffForm.contactPrimary}
                  onChange={(event) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      contactPrimary: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Number 2
                </Label>
                <Input
                  placeholder="Alternate contact number"
                  value={staffForm.contactSecondary}
                  onChange={(event) =>
                    setStaffForm((prev) => ({
                      ...prev,
                      contactSecondary: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  ID Proof
                </Label>
                <Select
                  value={staffForm.idProof}
                  onValueChange={(value) =>
                    setStaffForm((prev) => ({ ...prev, idProof: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID proof" />
                  </SelectTrigger>
                  <SelectContent>
                    {idProofOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input
                  placeholder="Enter ID number"
                  value={staffForm.idNumber}
                  onChange={(event) =>
                    setStaffForm((prev) => ({ ...prev, idNumber: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                placeholder="Enter full address"
                className="min-h-[90px]"
                value={staffForm.address}
                onChange={(event) =>
                  setStaffForm((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input
                  type="number"
                  placeholder="Monthly salary"
                  min="0"
                  value={staffForm.salary}
                  onChange={(event) =>
                    setStaffForm((prev) => ({ ...prev, salary: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Join Date
                </Label>
                <Input
                  type="date"
                  value={staffForm.joinDate}
                  onChange={(event) =>
                    setStaffForm((prev) => ({ ...prev, joinDate: event.target.value }))
                  }
                />
              </div>
            </div>

            {staffForm.role === "warden" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Building Assignment
                </Label>
                <Select
                  value={staffForm.buildingId}
                  onValueChange={(value) =>
                    setStaffForm((prev) => ({ ...prev, buildingId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingOptions.map((building) => (
                      <SelectItem key={building.value} value={building.value}>
                        {building.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStaff}>
                {editingStaffId ? "Update Staff Profile" : "Save Staff Profile"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteStaffId} onOpenChange={(open) => !open && setDeleteStaffId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Staff Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this staff profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteStaffId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagementPage;
