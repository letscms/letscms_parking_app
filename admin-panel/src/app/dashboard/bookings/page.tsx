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
  Calendar,
  Clock,
  Car,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
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

// Mock data for bookings
const bookings = [
  {
    id: 1,
    bookingNumber: "BK-2024-001",
    userId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    parkingLotId: 1,
    parkingLotName: "Downtown Plaza",
    spotNumber: "A-15",
    vehicleLicense: "ABC-123",
    startTime: "2024-07-25T08:00:00Z",
    endTime: "2024-07-25T17:00:00Z",
    status: "confirmed",
    totalAmount: 45.00,
    paymentStatus: "paid",
    createdAt: "2024-07-24T10:30:00Z"
  },
  {
    id: 2,
    bookingNumber: "BK-2024-002",
    userId: 2,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    parkingLotId: 2,
    parkingLotName: "Central Mall Garage",
    spotNumber: "B-23",
    vehicleLicense: "XYZ-789",
    startTime: "2024-07-25T14:00:00Z",
    endTime: "2024-07-25T18:00:00Z",
    status: "active",
    totalAmount: 14.00,
    paymentStatus: "paid",
    createdAt: "2024-07-25T13:45:00Z"
  },
  {
    id: 3,
    bookingNumber: "BK-2024-003",
    userId: 3,
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    parkingLotId: 1,
    parkingLotName: "Downtown Plaza",
    spotNumber: "C-08",
    vehicleLicense: "DEF-456",
    startTime: "2024-07-26T09:00:00Z",
    endTime: "2024-07-26T12:00:00Z",
    status: "pending",
    totalAmount: 15.00,
    paymentStatus: "pending",
    createdAt: "2024-07-25T16:20:00Z"
  },
  {
    id: 4,
    bookingNumber: "BK-2024-004",
    userId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    parkingLotId: 3,
    parkingLotName: "Airport Long-term",
    spotNumber: "D-42",
    vehicleLicense: "ABC-123",
    startTime: "2024-07-20T06:00:00Z",
    endTime: "2024-07-23T18:00:00Z",
    status: "completed",
    totalAmount: 135.00,
    paymentStatus: "paid",
    createdAt: "2024-07-19T14:15:00Z"
  },
]

// Loading skeleton for table rows
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.vehicleLicense.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.parkingLotName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "cancelled":
        return <XCircle className="h-3 w-3" />
      case "pending":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
    return `${diffHours}h`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage parking reservations and bookings.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>
                Create a manual booking reservation.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">John Doe (john@example.com)</SelectItem>
                      <SelectItem value="2">Jane Smith (jane@example.com)</SelectItem>
                      <SelectItem value="3">Mike Johnson (mike@example.com)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABC-123">ABC-123 (Toyota Camry)</SelectItem>
                      <SelectItem value="XYZ-789">XYZ-789 (Honda Civic)</SelectItem>
                      <SelectItem value="DEF-456">DEF-456 (Ford F-150)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingLot">Parking Lot</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking lot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Downtown Plaza</SelectItem>
                    <SelectItem value="2">Central Mall Garage</SelectItem>
                    <SelectItem value="3">Airport Long-term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spotNumber">Spot Number (Optional)</Label>
                <Input
                  id="spotNumber"
                  placeholder="A-15"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Booking
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
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toFixed(2)}
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
                placeholder="Search by booking number, user, or vehicle..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Bookings ({isLoading ? "Loading..." : filteredBookings.length})
          </CardTitle>
          <CardDescription>
            A list of all parking reservations and bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Parking Details</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell className="font-medium font-mono">
                      {booking.bookingNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.vehicleLicense}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.parkingLotName}</div>
                        <div className="text-sm text-muted-foreground">
                          Spot: {booking.spotNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatDuration(booking.startTime, booking.endTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(booking.startTime)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${booking.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(booking.status)} className="capitalize">
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusColor(booking.paymentStatus)} className="capitalize">
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
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
                            Edit Booking
                          </DropdownMenuItem>
                          {booking.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm Booking
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
          {filteredBookings.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
