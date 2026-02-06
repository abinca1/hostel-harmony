import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { User } from "@/types/hostel";

type Warden = User & {
  idProofType: string;
  idProofNumber: string;
  joinedDate: string;
  salary: string;
  assignedBuilding: string;
  address: string;
  contactNumber: string;
};

const AttendancePage = () => {
  const [wardens, setWardens] = useState<Warden[]>([
    {
      id: "warden-1",
      name: "Asha Kumar",
      email: "asha.kumar@example.com",
      phone: "+91 90000 10001",
      role: "warden",
      idProofType: "Aadhar",
      idProofNumber: "XXXX-XXXX-1234",
      joinedDate: "2023-02-10",
      salary: "35000",
      assignedBuilding: "Building A",
      address: "12 MG Road, Bengaluru",
      contactNumber: "+91 90000 20001",
    },
    {
      id: "warden-2",
      name: "Rohit Singh",
      email: "rohit.singh@example.com",
      phone: "+91 90000 10002",
      role: "warden",
      idProofType: "Passport",
      idProofNumber: "P1234567",
      joinedDate: "2022-08-05",
      salary: "42000",
      assignedBuilding: "Building B",
      address: "7 Park Street, Kolkata",
      contactNumber: "+91 90000 20002",
    },
  ]);
  const [wardenDraft, setWardenDraft] = useState<Warden | null>(null);
  const [isWardenDialogOpen, setIsWardenDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [wardenToDelete, setWardenToDelete] = useState<Warden | null>(null);

  const handleAddWarden = () => {
    setWardenDraft({
      id: `warden-${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      role: "warden",
      idProofType: "",
      idProofNumber: "",
      joinedDate: "",
      salary: "",
      assignedBuilding: "",
      address: "",
      contactNumber: "",
    });
    setIsWardenDialogOpen(true);
  };

  const handleEditWarden = (warden: Warden) => {
    setWardenDraft({ ...warden });
    setIsWardenDialogOpen(true);
  };

  const handleSaveWarden = () => {
    if (!wardenDraft || !wardenDraft.name.trim()) return;
    setWardens((prev) => {
      const exists = prev.some((item) => item.id === wardenDraft.id);
      if (exists) {
        return prev.map((item) =>
          item.id === wardenDraft.id ? wardenDraft : item,
        );
      }
      return [...prev, wardenDraft];
    });
    setIsWardenDialogOpen(false);
  };

  const handleDeleteWarden = (warden: Warden) => {
    setWardenToDelete(warden);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!wardenToDelete) return;
    setWardens((prev) => prev.filter((item) => item.id !== wardenToDelete.id));
    setIsDeleteOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Warden Management"
        subtitle="Add, edit, and remove wardens"
      />

      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                Wardens
              </CardTitle>
              <Button onClick={handleAddWarden}>
                <Plus className="w-4 h-4 mr-2" />
                Add Warden
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>ID Proof</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wardens.map((warden) => (
                    <TableRow key={warden.id}>
                      <TableCell className="font-medium">
                        {warden.name}
                      </TableCell>
                      <TableCell>{warden.email}</TableCell>
                      <TableCell>{warden.phone}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {warden.idProofType || "-"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {warden.idProofNumber || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {warden.joinedDate
                          ? new Date(warden.joinedDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {warden.salary ? `₹${warden.salary}` : "-"}
                      </TableCell>
                      <TableCell>{warden.assignedBuilding || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWarden(warden)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWarden(warden)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {wardens.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-sm text-muted-foreground"
                      >
                        No wardens added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isWardenDialogOpen} onOpenChange={setIsWardenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {wardenDraft?.name ? "Edit Warden" : "Add Warden"}
            </DialogTitle>
          </DialogHeader>
          {wardenDraft ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="warden-name">Name</Label>
                  <Input
                    id="warden-name"
                    value={wardenDraft.name}
                    onChange={(event) =>
                      setWardenDraft({
                        ...wardenDraft,
                        name: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warden-phone">Phone</Label>
                  <Input
                    id="warden-phone"
                    value={wardenDraft.phone}
                    onChange={(event) =>
                      setWardenDraft({
                        ...wardenDraft,
                        phone: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warden-email">Email</Label>
                  <Input
                    id="warden-email"
                    type="email"
                    value={wardenDraft.email}
                    onChange={(event) =>
                      setWardenDraft({
                        ...wardenDraft,
                        email: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warden-joined">Joined Date</Label>
                  <Input
                    id="warden-joined"
                    type="date"
                    value={wardenDraft.joinedDate}
                    onChange={(event) =>
                      setWardenDraft({
                        ...wardenDraft,
                        joinedDate: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warden-salary">Salary (₹)</Label>
                  <Input
                    id="warden-salary"
                    type="number"
                    value={wardenDraft.salary}
                    onChange={(event) =>
                      setWardenDraft({
                        ...wardenDraft,
                        salary: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assigned Building</Label>
                  <Select
                    value={wardenDraft.assignedBuilding}
                    onValueChange={(value) =>
                      setWardenDraft({
                        ...wardenDraft,
                        assignedBuilding: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Building A", "Building B", "Building C"].map(
                        (building) => (
                          <SelectItem key={building} value={building}>
                            {building}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ID Proof Type</Label>
                  <Select
                    value={wardenDraft.idProofType}
                    onValueChange={(value) =>
                      setWardenDraft({ ...wardenDraft, idProofType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Aadhar",
                        "Passport",
                        "Driving License",
                        "Voter ID",
                      ].map((idType) => (
                        <SelectItem key={idType} value={idType}>
                          {idType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warden-id-number">ID Proof Number</Label>
                  <Input
                    id="warden-id-number"
                    value={wardenDraft.idProofNumber}
                    onChange={(event) =>
                      setWardenDraft({
                        ...wardenDraft,
                        idProofNumber: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warden-address">Address</Label>
                <Input
                  id="warden-address"
                  value={wardenDraft.address}
                  onChange={(event) =>
                    setWardenDraft({
                      ...wardenDraft,
                      address: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warden-contact">Contact number 2</Label>
                <Input
                  id="warden-contact"
                  value={wardenDraft.contactNumber}
                  onChange={(event) =>
                    setWardenDraft({
                      ...wardenDraft,
                      contactNumber: event.target.value,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No warden selected.</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWardenDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWarden}>Save Warden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Warden</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {wardenToDelete?.name}
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

export default AttendancePage;
