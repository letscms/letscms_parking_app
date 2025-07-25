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
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Car,
  Building
} from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for parking lots
const parkingLots = [
  {
    id: 1,
    name: "Downtown Plaza",
    address: "123 Main St, Downtown",
    totalSpots: 150,
    availableSpots: 45,
    hourlyRate: 5.00,
    dailyRate: 25.00,
    status: "active",
    type: "outdoor",
    amenities: ["Security", "24/7 Access"],
    createdAt: "2024-01-10T08:00:00Z"
  },
  {
    id: 2,
    name: "Central Mall Garage",
    address: "456 Shopping Blvd, Central",
    totalSpots: 300,
    availableSpots: 120,
    hourlyRate: 3.50,
    dailyRate: 20.00,
    status: "active",
    type: "garage",
    amenities: ["Covered", "Electric Charging", "Security"],
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 3,
    name: "Airport Long-term",
    address: "789 Airport Rd, Terminal 1",
    totalSpots: 500,
    availableSpots: 0,
    hourlyRate: 8.00,
    dailyRate: 45.00,
    status: "maintenance",
    type: "outdoor",
    amenities: ["Shuttle Service", "Security", "24/7 Access"],
    createdAt: "2024-02-01T06:15:00Z"
  },
]

// Loading skeleton for table rows
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export default function ParkingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredParkingLots = parkingLots.filter(lot => {
    const matchesSearch = lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lot.status === statusFilter
    const matchesType = typeFilter === "all" || lot.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "maintenance":
        return "secondary"
      case "closed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getOccupancyColor = (available: number, total: number) => {
    const rate = available / total
    if (rate > 0.5) return "text-green-600"
    if (rate > 0.2) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parking Lots</h1>
          <p className="text-muted-foreground">
            Manage parking facilities and their availability.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Parking Lot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Parking Lot</DialogTitle>
              <DialogDescription>
                Add a new parking facility to the system.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Facility Name</Label>
                  <Input
                    id="name"
                    placeholder="Downtown Plaza"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                      <SelectItem value="underground">Underground</SelectItem>
                      <SelectItem value="street">Street Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main St, Downtown"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalSpots">Total Spots</Label>
                  <Input
                    id="totalSpots"
                    type="number"
                    placeholder="150"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.50"
                    placeholder="5.00"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    step="0.50"
                    placeholder="25.00"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Textarea
                  id="amenities"
                  placeholder="Security, 24/7 Access, Electric Charging..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Parking Lot
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingLots.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parkingLots.reduce((sum, lot) => sum + lot.totalSpots, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {parkingLots.reduce((sum, lot) => sum + lot.availableSpots, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((1 - parkingLots.reduce((sum, lot) => sum + lot.availableSpots, 0) / 
                parkingLots.reduce((sum, lot) => sum + lot.totalSpots, 0)) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="garage">Garage</SelectItem>
                <SelectItem value="underground">Underground</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parking Lots Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Parking Facilities ({isLoading ? "Loading..." : filteredParkingLots.length})
          </CardTitle>
          <CardDescription>
            A list of all parking facilities in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                filteredParkingLots.map((lot, index) => (
                  <motion.tr
                    key={lot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{lot.name}</div>
                        <div className="text-sm text-muted-foreground">{lot.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {lot.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={`font-medium ${getOccupancyColor(lot.availableSpots, lot.totalSpots)}`}>
                          {lot.availableSpots} / {lot.totalSpots}
                        </div>
                        <div className="text-sm text-muted-foreground">available</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${lot.hourlyRate}/hr</div>
                        <div className="text-sm text-muted-foreground">${lot.dailyRate}/day</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(lot.status)} className="capitalize">
                        {lot.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
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
                            Edit Facility
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MapPin className="mr-2 h-4 w-4" />
                            View on Map
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
          {filteredParkingLots.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No parking facilities found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
