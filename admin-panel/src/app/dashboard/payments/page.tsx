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
  Eye,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw
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

// Mock data for payments
const payments = [
  {
    id: 1,
    transactionId: "TXN-2024-001",
    bookingId: 1,
    bookingNumber: "BK-2024-001",
    userId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    amount: 45.00,
    fee: 1.35,
    netAmount: 43.65,
    currency: "USD",
    method: "credit_card",
    provider: "stripe",
    status: "completed",
    description: "Parking fee - Downtown Plaza",
    createdAt: "2024-07-24T10:30:00Z",
    completedAt: "2024-07-24T10:30:15Z",
    cardLast4: "4242"
  },
  {
    id: 2,
    transactionId: "TXN-2024-002",
    bookingId: 2,
    bookingNumber: "BK-2024-002",
    userId: 2,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    amount: 14.00,
    fee: 0.42,
    netAmount: 13.58,
    currency: "USD",
    method: "credit_card",
    provider: "stripe",
    status: "completed",
    description: "Parking fee - Central Mall Garage",
    createdAt: "2024-07-25T13:45:00Z",
    completedAt: "2024-07-25T13:45:08Z",
    cardLast4: "5555"
  },
  {
    id: 3,
    transactionId: "TXN-2024-003",
    bookingId: 3,
    bookingNumber: "BK-2024-003",
    userId: 3,
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    amount: 15.00,
    fee: 0.45,
    netAmount: 14.55,
    currency: "USD",
    method: "credit_card",
    provider: "stripe",
    status: "pending",
    description: "Parking fee - Downtown Plaza",
    createdAt: "2024-07-25T16:20:00Z",
    completedAt: null,
    cardLast4: "1234"
  },
  {
    id: 4,
    transactionId: "TXN-2024-004",
    bookingId: 4,
    bookingNumber: "BK-2024-004",
    userId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    amount: 135.00,
    fee: 4.05,
    netAmount: 130.95,
    currency: "USD",
    method: "credit_card",
    provider: "stripe",
    status: "completed",
    description: "Parking fee - Airport Long-term",
    createdAt: "2024-07-19T14:15:00Z",
    completedAt: "2024-07-19T14:15:12Z",
    cardLast4: "4242"
  },
  {
    id: 5,
    transactionId: "TXN-2024-005",
    bookingId: 5,
    bookingNumber: "BK-2024-005",
    userId: 4,
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    amount: 25.00,
    fee: 0.75,
    netAmount: 24.25,
    currency: "USD",
    method: "credit_card",
    provider: "stripe",
    status: "failed",
    description: "Parking fee - Downtown Plaza",
    createdAt: "2024-07-23T09:20:00Z",
    completedAt: null,
    cardLast4: "9999"
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
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      case "cancelled":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <AlertCircle className="h-3 w-3" />
      case "failed":
        return <XCircle className="h-3 w-3" />
      case "refunded":
        return <RefreshCw className="h-3 w-3" />
      default:
        return <CreditCard className="h-3 w-3" />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-3 w-3" />
      case "debit_card":
        return <CreditCard className="h-3 w-3" />
      case "paypal":
        return <DollarSign className="h-3 w-3" />
      default:
        return <CreditCard className="h-3 w-3" />
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Calculate stats
  const totalRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const totalFees = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.fee, 0)
  const netRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.netAmount, 0)
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage payment transactions and financial data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Payments
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${netRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              After fees: ${totalFees.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === "pending").length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((payments.filter(p => p.status === "completed").length / payments.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === "failed").length} failed
            </p>
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
                placeholder="Search by transaction ID, booking, or customer..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transactions ({isLoading ? "Loading..." : filteredPayments.length})
          </CardTitle>
          <CardDescription>
            A list of all payment transactions in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell className="font-medium font-mono">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.bookingNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${payment.amount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          Net: ${payment.netAmount.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {getMethodIcon(payment.method)}
                        <span className="ml-1">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </Badge>
                      {payment.cardLast4 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          •••• {payment.cardLast4}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payment.status)} className="capitalize">
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatDateTime(payment.createdAt)}
                        </div>
                        {payment.completedAt && (
                          <div className="text-sm text-muted-foreground">
                            Completed: {formatDateTime(payment.completedAt)}
                          </div>
                        )}
                      </div>
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
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          {payment.status === "completed" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setIsRefundDialogOpen(true)
                                }}
                                className="text-orange-600"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refund Payment
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
          {filteredPayments.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      {selectedPayment && (
        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Refund Payment</DialogTitle>
              <DialogDescription>
                Process a refund for transaction {selectedPayment.transactionId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Amount</Label>
                  <p className="text-2xl font-bold">${selectedPayment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedPayment.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedPayment.userEmail}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refundAmount">Refund Amount</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  step="0.01"
                  defaultValue={selectedPayment.amount}
                  max={selectedPayment.amount}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refundReason">Reason for Refund</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_request">Customer Request</SelectItem>
                    <SelectItem value="cancellation">Booking Cancellation</SelectItem>
                    <SelectItem value="system_error">System Error</SelectItem>
                    <SelectItem value="duplicate_charge">Duplicate Charge</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsRefundDialogOpen(false)
                    setSelectedPayment(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">
                  Process Refund
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
