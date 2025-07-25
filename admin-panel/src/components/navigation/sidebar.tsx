"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileBarChart,
  Menu,
  X,
  Car,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Car,
  },
  {
    title: "Parking Lots",
    href: "/dashboard/parking",
    icon: MapPin,
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Reports", 
    href: "/dashboard/reports",
    icon: FileBarChart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings", 
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="flex h-screen">
      {/* Modern Sidebar */}
      <motion.div
        animate={{ 
          width: isCollapsed ? 80 : 280 
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        className={cn(
          "relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600/10 before:to-purple-600/10 before:opacity-50",
          "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_50%)]",
          className
        )}
        style={{
          backdropFilter: 'blur(20px)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          {/* Header with collapse button */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
            <motion.div 
              className="flex items-center gap-3"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Car className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-sm opacity-60 -z-10"></div>
                </div>
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ParkAdmin
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">Management System</p>
                </motion.div>
              )}
            </motion.div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  onHoverStart={() => setHoveredItem(item.href)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        "relative group overflow-hidden rounded-xl transition-all duration-300",
                        isActive 
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30" 
                          : "hover:bg-slate-700/30 border border-transparent"
                      )}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        boxShadow: isActive 
                          ? '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                          : hoveredItem === item.href 
                            ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                            : 'none'
                      }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30 
                          }}
                        />
                      )}
                      
                      {/* Background glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{
                          background: isActive 
                            ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
                            : 'linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))'
                        }}
                      />

                      <div className={cn(
                        "relative z-10 flex items-center gap-4 p-4 transition-all duration-200",
                        isCollapsed ? "justify-center" : "justify-start"
                      )}>
                        <motion.div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                            isActive 
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg" 
                              : "text-slate-400 group-hover:text-white group-hover:bg-slate-600/50"
                          )}
                          whileHover={{ 
                            rotate: [0, -10, 10, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <item.icon className="h-4 w-4" />
                        </motion.div>
                        
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1"
                            >
                              <span className={cn(
                                "font-medium text-sm transition-colors duration-200",
                                isActive 
                                  ? "text-white" 
                                  : "text-slate-300 group-hover:text-white"
                              )}>
                                {item.title}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        <AnimatePresence>
                          {isCollapsed && hoveredItem === item.href && (
                            <motion.div
                              initial={{ opacity: 0, x: -10, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -10, scale: 0.9 }}
                              className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-600 z-50"
                              style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95))',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <span className="text-sm font-medium">{item.title}</span>
                              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-slate-800"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700/50 p-4 bg-gradient-to-r from-slate-800/30 to-slate-700/20">
            <AnimatePresence>
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="font-medium">Admin Dashboard</p>
                    <p className="text-slate-500">v2.0.0 • 2025</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
