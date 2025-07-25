"use client"

import { Sidebar } from "@/components/navigation/sidebar"
import { Navbar } from "@/components/navigation/navbar"
import { motion } from "framer-motion"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar - now returns a flex container */}
      <Sidebar />

      {/* Main content area - full width */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <div className="relative z-20">
          <Navbar />
        </div>

        {/* Page content with glass morphism */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Content background with glass effect */}
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl"></div>
          
          {/* Animated background patterns */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
