import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { mockInventoryItems } from '@/data/mockData';
import { InventoryCategory, InventoryItem } from '@/types/hostel';
import { cn } from '@/lib/utils';

const getStatus = (item: InventoryItem) => {
  if (item.currentStock <= item.minStock) {
    return { label: 'Low Stock', variant: 'destructive' as const };
  }
  return { label: 'In Stock', variant: 'secondary' as const };
};

const categoryOptions: InventoryCategory[] = [
  'grain',
  'vegetable',
  'fruit',
  'dairy',
  'spice',
  'meat',
  'seafood',
  'beverage',
  'other',
];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [draftItem, setDraftItem] = useState<InventoryItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return inventoryItems;
    return inventoryItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier?.toLowerCase().includes(query)
      );
    });
  }, [inventoryItems, searchQuery]);

  const handleAddItem = () => {
    setDraftItem({
      id: `inv-${Date.now()}`,
      name: '',
      category: 'grain',
      unit: 'kg',
      currentStock: 0,
      minStock: 0,
      supplier: '',
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setIsItemDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setDraftItem({ ...item, supplier: item.supplier ?? '' });
    setIsItemDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!draftItem || !draftItem.name.trim()) return;
    const updatedItem: InventoryItem = {
      ...draftItem,
      name: draftItem.name.trim(),
      supplier: draftItem.supplier?.trim() || undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setInventoryItems((prev) => {
      const exists = prev.some((item) => item.id === updatedItem.id);
      if (exists) {
        return prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      }
      return [updatedItem, ...prev];
    });

    setIsItemDialogOpen(false);
    setDraftItem(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setInventoryItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    setIsDeleteOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="animate-fade-in">
      <Header title="Inventory" subtitle="Track kitchen stock and suppliers." />

      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Search items, categories, suppliers..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="md:max-w-sm"
              />
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredItems.length} items
                </div>
                <Button onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Min Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const status = getStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell>{item.supplier ?? '—'}</TableCell>
                        <TableCell className="text-right">
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.minStock} {item.unit}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={status.variant}
                            className={cn(
                              status.variant === 'secondary' && 'bg-success/10 text-success',
                            )}
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditItem(item)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setItemToDelete(item);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No inventory items match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {draftItem && inventoryItems.some((item) => item.id === draftItem.id)
                ? 'Edit Item'
                : 'Add Item'}
            </DialogTitle>
          </DialogHeader>
          {draftItem && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="inventory-name">Item Name</Label>
                <Input
                  id="inventory-name"
                  value={draftItem.name}
                  onChange={(event) =>
                    setDraftItem({ ...draftItem, name: event.target.value })
                  }
                  placeholder="e.g. Wheat Flour"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={draftItem.category}
                  onValueChange={(value) =>
                    setDraftItem({ ...draftItem, category: value as InventoryCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="inventory-unit">Unit</Label>
                  <Input
                    id="inventory-unit"
                    value={draftItem.unit}
                    onChange={(event) =>
                      setDraftItem({ ...draftItem, unit: event.target.value })
                    }
                    placeholder="kg, liters, packets"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inventory-supplier">Supplier</Label>
                  <Input
                    id="inventory-supplier"
                    value={draftItem.supplier ?? ''}
                    onChange={(event) =>
                      setDraftItem({ ...draftItem, supplier: event.target.value })
                    }
                    placeholder="Supplier name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="inventory-stock">Current Stock</Label>
                  <Input
                    id="inventory-stock"
                    type="number"
                    min={0}
                    value={draftItem.currentStock}
                    onChange={(event) =>
                      setDraftItem({
                        ...draftItem,
                        currentStock: Number(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inventory-min">Minimum Stock</Label>
                  <Input
                    id="inventory-min"
                    type="number"
                    min={0}
                    value={draftItem.minStock}
                    onChange={(event) =>
                      setDraftItem({
                        ...draftItem,
                        minStock: Number(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsItemDialogOpen(false);
                setDraftItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveItem}
              disabled={!draftItem || !draftItem.name.trim()}
            >
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove {itemToDelete?.name ?? 'this item'} from inventory.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setItemToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
