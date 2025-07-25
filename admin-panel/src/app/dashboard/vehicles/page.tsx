"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Truck
} from "lucide-react"
import { motion } from "framer-motion"
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from "@/lib/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-hot-toast"
import { Vehicle, VehicleType } from "@/types/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Loading skeleton for table rows
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    vehicleType: "car" as VehicleType,
    ownerId: 1
  })

  const { 
    data: vehicles, 
    isLoading, 
    error,
    refetch 
  } = useVehicles({
    search: searchTerm || undefined,
    type: typeFilter !== "all" ? typeFilter as VehicleType : undefined,
    isActive: statusFilter !== "all" ? statusFilter === "true" : undefined
  })

  const createVehicleMutation = useCreateVehicle()
  const updateVehicleMutation = useUpdateVehicle()
  const deleteVehicleMutation = useDeleteVehicle()

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVehicleMutation.mutateAsync(newVehicle)
      setIsCreateDialogOpen(false)
      setNewVehicle({
        licensePlate: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        color: "",
        vehicleType: "car" as VehicleType,
        ownerId: 1
      })
      toast.success("Vehicle registered successfully!")
    } catch (error) {
      toast.error("Failed to register vehicle")
    }
  }

  const handleUpdateVehicle = async (vehicleId: number, updates: Partial<Vehicle>) => {
    try {
      await updateVehicleMutation.mutateAsync({ id: vehicleId, ...updates })
      setEditingVehicle(null)
      toast.success("Vehicle updated successfully!")
    } catch (error) {
      toast.error("Failed to update vehicle")
    }
  }

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicleMutation.mutateAsync(vehicleId)
        toast.success("Vehicle deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete vehicle")
      }
    }
  }

    // Search and filtering - use state variables instead of URL params for now
  const filteredVehicles = data?.filter((vehicle: Vehicle) => {
    const matchesSearch = !searchTerm || 
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || vehicle.vehicleType.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || vehicle.isActive.toString() === statusFilter
    return matchesSearch && matchesType && matchesStatus
  }) || []

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vehicles</h1>
            <p className="text-muted-foreground">
              Manage registered vehicles in the parking system.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Failed to load vehicles.</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage registered vehicles in the parking system.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new vehicle to the parking system.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    placeholder="ABC-123"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="Camry"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2024"
                    min="1900"
                    max="2030"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="Blue"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">John Doe</SelectItem>
                    <SelectItem value="2">Jane Smith</SelectItem>
                    <SelectItem value="3">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Register Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by license plate, make, model, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Vehicles ({isLoading ? "Loading..." : filteredVehicles.length})
          </CardTitle>
          <CardDescription>
            A list of all registered vehicles in the parking system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <motion.tr
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell className="font-medium font-mono">
                      {vehicle.licensePlate}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.year} • {vehicle.color}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {vehicle.vehicleType === VehicleType.CAR ? (
                          <Car className="mr-1 h-3 w-3" />
                        ) : (
                          <Truck className="mr-1 h-3 w-3" />
                        )}
                        {vehicle.vehicleType}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.ownerName}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(vehicle.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Vehicle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
          {filteredVehicles.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vehicles found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
