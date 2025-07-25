"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, LogOut, Settings, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export function Navbar() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative border-b border-slate-200/50 dark:border-slate-700/50"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
      
      <div className="relative z-10 flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search parking data..."
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggle />
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg"
              >
                3
              </motion.span>
            </Button>
          </motion.div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 transition-all duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-2xl" 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatars/01.png" alt="@admin" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-slate-500 dark:text-slate-400 mt-1">
                        admin@parkingsystem.com
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                <User className="mr-3 h-4 w-4 text-blue-500" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                <Settings className="mr-3 h-4 w-4 text-purple-500" />
                <span>System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
              <DropdownMenuItem className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
