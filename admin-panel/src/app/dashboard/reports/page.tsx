"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  PieChart,
  FileText,
  Users,
  DollarSign,
  Activity
} from "lucide-react"

const reportTypes = [
  {
    id: 1,
    title: "User Analytics",
    description: "Comprehensive user behavior and engagement metrics",
    icon: Users,
    lastGenerated: "2 hours ago",
    status: "Ready",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Revenue Report",
    description: "Financial performance and revenue breakdown",
    icon: DollarSign,
    lastGenerated: "1 day ago",
    status: "Ready",
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "Activity Logs",
    description: "System activity and user action logs",
    icon: Activity,
    lastGenerated: "6 hours ago",
    status: "Processing",
    size: "5.2 MB"
  },
  {
    id: 4,
    title: "Performance Metrics",
    description: "System performance and uptime statistics",
    icon: TrendingUp,
    lastGenerated: "3 days ago",
    status: "Ready",
    size: "945 KB"
  }
]

const quickStats = [
  {
    title: "Total Reports Generated",
    value: "247",
    period: "This month",
    trend: "+15%"
  },
  {
    title: "Data Processed",
    value: "12.5 GB",
    period: "Last 30 days",
    trend: "+8%"
  },
  {
    title: "Average Generation Time",
    value: "2.3 min",
    period: "Current average",
    trend: "-12%"
  },
  {
    title: "Storage Used",
    value: "45.2 GB",
    period: "Of 100 GB limit",
    trend: "+5%"
  }
]

export default function ReportsPage() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive system reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stat.period}</span>
                  <span className="text-green-600 font-medium">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Last generated: {report.lastGenerated}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Size: {report.size}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button size="sm" disabled={report.status === "Processing"}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Templates</CardTitle>
          <CardDescription>
            Pre-built visualization templates for quick insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">Bar Chart</h3>
                  <p className="text-sm text-muted-foreground">Compare categories</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Create Chart
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <PieChart className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-medium">Pie Chart</h3>
                  <p className="text-sm text-muted-foreground">Show proportions</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Create Chart
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <h3 className="font-medium">Line Chart</h3>
                  <p className="text-sm text-muted-foreground">Track trends</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Create Chart
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
