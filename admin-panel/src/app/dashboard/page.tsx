"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Car,
  MapPin
} from "lucide-react"
import { motion } from "framer-motion"
import { useDashboardStats, useRealTimeAnalytics } from "@/lib/react-query"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton component
function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-2" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  )
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-2 h-2 rounded-full" />
            <div>
              <Skeleton className="h-4 w-[100px] mb-1" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-5 w-[60px] mb-1" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: realTimeData, isLoading: realTimeLoading } = useRealTimeAnalytics()

  // Mock recent activity data - this would come from an API
  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "Booked parking space A-12",
      time: "2 minutes ago",
      status: "success"
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Cancelled reservation",
      time: "5 minutes ago",
      status: "warning"
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Payment completed",
      time: "10 minutes ago",
      status: "success"
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "Extended parking duration",
      time: "15 minutes ago",
      status: "info"
    },
  ]

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats?.totalUsers?.toLocaleString() || "0",
      change: dashboardStats?.userGrowth ? `+${dashboardStats.userGrowth}%` : "+0%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Total Revenue",
      value: dashboardStats?.totalRevenue ? `$${dashboardStats.totalRevenue.toLocaleString()}` : "$0",
      change: dashboardStats?.revenueGrowth ? `+${dashboardStats.revenueGrowth}%` : "+0%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Reservations",
      value: dashboardStats?.activeReservations?.toLocaleString() || "0",
      change: dashboardStats?.reservationGrowth ? `+${dashboardStats.reservationGrowth}%` : "+0%",
      changeType: "positive" as const,
      icon: Car,
    },
    {
      title: "Occupancy Rate",
      value: dashboardStats?.occupancyRate ? `${dashboardStats.occupancyRate}%` : "0%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: MapPin,
    },
  ]

  if (statsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your parking system.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Failed to load dashboard data. Please try again.</p>
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your parking system.
          </p>
        </div>
        <Button>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Real-time Alert */}
      {realTimeData?.alerts && realTimeData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">System Alert:</span>
                <span>{realTimeData.alerts[0].message}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          [...Array(4)].map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-1 text-xs">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <ActivitySkeleton />
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            activity.status === "success"
                              ? "default"
                              : activity.status === "warning"
                              ? "secondary"
                              : "outline"
                          }
                          className="mb-1"
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Commonly used admin functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Car className="mr-2 h-4 w-4" />
                View Reservations
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Manage Parking Lots
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status */}
      {realTimeData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Real-time system performance and health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {realTimeData.currentActiveUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {realTimeData.currentReservations}
                  </div>
                  <p className="text-xs text-muted-foreground">Active Reservations</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    realTimeData.systemStatus === 'healthy' ? 'text-green-600' :
                    realTimeData.systemStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {realTimeData.systemStatus.toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">System Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
