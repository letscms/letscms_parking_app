"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Eye, EyeOff, Car, Shield, Lock, Mail, ArrowRight, Sparkles } from "lucide-react"
import { useLogin } from "@/lib/react-query"
import { useRouter } from "next/navigation"

// Generate deterministic particle positions
const generateParticles = () => {
  const particles = []
  for (let i = 0; i < 50; i++) {
    // Use seeded values to ensure consistency
    const seed = i * 123.456
    particles.push({
      id: i,
      left: ((seed * 7.1) % 100),
      top: ((seed * 3.7) % 100),
      delay: (seed % 2),
      duration: 3 + (seed % 4)
    })
  }
  return particles
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const router = useRouter()
  const loginMutation = useLogin()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15])
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15])

  // Ensure component is mounted to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginMutation.mutateAsync({ email, password })
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 60, -60, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Particles */}
        {generateParticles().map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl relative"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.6 }
              }}
              style={{
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <Car className="w-10 h-10 text-white drop-shadow-lg" />
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-600 blur opacity-60"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ParkAdmin
            </motion.h1>
            <p className="text-slate-400 text-lg">Advanced Parking Management</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false)
              mouseX.set(0)
              mouseY.set(0)
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card 
              className="relative overflow-hidden border-0 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Card Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0"
                animate={{
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Floating Elements */}
              <motion.div
                className="absolute top-4 right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
                  >
                    <Shield className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-slate-400">Enter your credentials to access the admin panel</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-slate-300 font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@parkingsystem.com"
                        required
                        className="pl-12 h-12 bg-white/5 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loginMutation.isPending}
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="password" className="text-slate-300 font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="pl-12 pr-12 h-12 bg-white/5 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loginMutation.isPending}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 text-slate-400 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loginMutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 transition-all duration-200 group relative overflow-hidden"
                      style={{
                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500"
                        animate={{
                          x: loginMutation.isPending ? ["-100%", "100%"] : "0%",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: loginMutation.isPending ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loginMutation.isPending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </form>

                {/* Demo Credentials */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-6 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-300">Demo Credentials</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Email: <span className="text-blue-400 font-mono">admin@example.com</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Password: <span className="text-blue-400 font-mono">password</span>
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
