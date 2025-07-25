"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Save, 
  Trash2, 
  Shield, 
  Bell,
  Database,
  Mail,
  Key,
  Globe,
  Users,
  Eye,
  Lock
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const settingSections = [
  {
    id: "general",
    title: "General Settings",
    icon: Globe,
    description: "Basic application configuration"
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: Shield,
    description: "Authentication and security settings"
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Email and push notification preferences"
  },
  {
    id: "database",
    title: "Database",
    icon: Database,
    description: "Database configuration and backups"
  }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general")
  const [settings, setSettings] = useState({
    siteName: "Admin Panel",
    siteDescription: "Modern responsive admin dashboard",
    language: "en",
    timezone: "UTC",
    twoFactorAuth: true,
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily"
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={settings.siteName}
            onChange={(e) => updateSetting("siteName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="siteDescription">Site Description</Label>
        <Input
          id="siteDescription"
          value={settings.siteDescription}
          onChange={(e) => updateSetting("siteDescription", e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="EST">Eastern Time</SelectItem>
              <SelectItem value="PST">Pacific Time</SelectItem>
              <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3 pt-6">
          <Label htmlFor="theme">Theme</Label>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Key className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>
        <Switch
          checked={settings.twoFactorAuth}
          onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Maintenance Mode</p>
            <p className="text-sm text-muted-foreground">
              Temporarily disable public access to the system
            </p>
          </div>
        </div>
        <Switch
          checked={settings.maintenanceMode}
          onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active login sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Chrome on MacOS</p>
                <p className="text-sm text-muted-foreground">
                  192.168.1.100 • Current session
                </p>
              </div>
              <Badge variant="default">Current</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-sm text-muted-foreground">
                  192.168.1.101 • 2 hours ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive important updates via email
            </p>
          </div>
        </div>
        <Switch
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-muted-foreground">
              Get instant notifications in your browser
            </p>
          </div>
        </div>
        <Switch
          checked={settings.pushNotifications}
          onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              "New user registrations",
              "System alerts",
              "Security warnings",
              "Backup completed",
              "Performance issues"
            ].map((notification) => (
              <div key={notification} className="flex items-center justify-between">
                <span className="text-sm">{notification}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Automatic Backups</p>
            <p className="text-sm text-muted-foreground">
              Automatically backup your database
            </p>
          </div>
        </div>
        <Switch
          checked={settings.autoBackup}
          onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
        />
      </div>

      <div className="space-y-2">
        <Label>Backup Frequency</Label>
        <Select 
          value={settings.backupFrequency} 
          onValueChange={(value) => updateSetting("backupFrequency", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Actions</CardTitle>
          <CardDescription>
            Perform database maintenance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              Create Manual Backup
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              View Backup History
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Old Backups
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings()
      case "security":
        return renderSecuritySettings()
      case "notifications":
        return renderNotificationSettings()
      case "database":
        return renderDatabaseSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and configuration
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent transition-colors ${
                      activeSection === section.id ? "bg-accent" : ""
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {settingSections.find(s => s.id === activeSection)?.title}
                </CardTitle>
                <CardDescription>
                  {settingSections.find(s => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCurrentSection()}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
