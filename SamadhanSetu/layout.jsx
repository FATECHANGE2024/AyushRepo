import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  HomeIcon,
  MapPin, 
  LayoutDashboard, 
  Plus, 
  Settings,
  BarChart3,
  Bell,
  Menu,
  X,
  Shield,
  Sparkles,
  Leaf,
  HeartHandshake, // This icon will now be used for "Nature Heroes"
  MessageSquareWarning,
  Heart // Added Heart icon for Donation & Funding
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import SplashScreen from "../components/SplashScreen";
import { AnimatePresence, motion } from "framer-motion";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Check session storage to see if splash has been shown
    if (sessionStorage.getItem('hasShownSplash')) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasShownSplash', 'true');
      }, 5000); // Show splash for 5 seconds on first visit per session
      return () => clearTimeout(timer);
    }
  }, []);

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      title: "Home",
      url: createPageUrl("Home"),
      icon: HomeIcon,
      description: "Main dashboard",
      color: "gray"
    },
    {
      title: "Civic Reporting",
      url: createPageUrl("CityMap"),
      icon: MessageSquareWarning,
      description: "Report & track issues",
      color: "orange"
    },
    {
      title: "EcoVoice",
      url: createPageUrl("EcoVoice"),
      icon: Leaf,
      description: "Share green actions",
      color: "green"
    },
    {
      title: "Nature Heroes", // Updated title
      url: createPageUrl("NatureHeroes"), // Updated URL
      icon: HeartHandshake, // Icon remains the same as previous "Community Hub"
      description: "Environmental champions", // Updated description
      color: "blue"
    },
    {
      title: "Donation & Funding",
      url: createPageUrl("Donations"),
      icon: Heart,
      description: "Support causes & NGOs",
      color: "red"
    }
  ];

  const adminItems = [
    {
      title: "Admin Dashboard",
      url: createPageUrl("AdminDashboard"), 
      icon: LayoutDashboard,
      description: "Manage all reports",
      color: "green"
    },
    {
      title: "Analytics",
      url: createPageUrl("Analytics"),
      icon: BarChart3,
      description: "Performance insights",
      color: "purple"
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      gray: {
        active: 'from-slate-50 to-slate-100 text-slate-700 border-slate-200 shadow-lg shadow-slate-100',
        hover: 'hover:from-slate-50 hover:to-slate-100 hover:text-slate-700 hover:border-slate-200'
      },
      orange: {
        active: 'from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-lg shadow-orange-100',
        hover: 'hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 hover:border-orange-200'
      },
      green: {
        active: 'from-green-50 to-green-100 text-green-700 border-green-200 shadow-lg shadow-green-100',
        hover: 'hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:border-green-200'
      },
      blue: {
        active: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200 shadow-lg shadow-blue-100',
        hover: 'hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:border-blue-200'
      },
       purple: {
        active: 'from-purple-50 to-purple-100 text-purple-700 border-purple-200 shadow-lg shadow-purple-100',
        hover: 'hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 hover:border-purple-200'
      },
      red: { // Added red color definition
        active: 'from-red-50 to-red-100 text-red-700 border-red-200 shadow-lg shadow-red-100',
        hover: 'hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:border-red-200'
      }
    };
    return isActive ? `bg-gradient-to-r ${colors[color].active}` : colors[color].hover;
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: showSplash ? 0 : 1, scale: showSplash ? 0.98 : 1 }}
        transition={{ duration: 1, delay: showSplash ? 0.2 : 0, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-full h-full">
          <div className="fixed inset-0 z-0">
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, #fef3c7 0%, #f0f9ff 50%, #dcfce7 100%)',
                  'linear-gradient(135deg, #dcfce7 0%, #fef3c7 50%, #f0f9ff 100%)',
                  'linear-gradient(135deg, #f0f9ff 0%, #dcfce7 50%, #fef3c7 100%)',
                  'linear-gradient(135deg, #fef3c7 0%, #f0f9ff 50%, #dcfce7 100%)',
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <SidebarProvider>
            <div className="min-h-screen flex w-full relative z-10">
              <Sidebar className="border-r border-orange-200/30 bg-white/95 backdrop-blur-xl shadow-2xl">
                <SidebarHeader className="border-b border-orange-200/30 p-6 bg-gradient-to-r from-orange-50/50 to-green-50/50">
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="flex items-center gap-3"
                  >
                    <motion.div 
                      className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #22c55e)'
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: [0, -5, 5, 0],
                        boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cbdd395e9cf2fa12b9fc9c/8dda194f6_WhatsAppImage2025-09-18at160440_b448282fe.jpg" alt="Logo" className="w-11 h-11 rounded-[14px] object-cover" />
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-xl bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                        Samadhan Setu
                      </h2>
                      <motion.p 
                        className="text-xs text-slate-600 font-medium"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Connecting Citizens & Solutions
                      </motion.p>
                    </div>
                  </motion.div>
                </SidebarHeader>
                
                <SidebarContent className="p-4">
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Modules
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-2">
                        {menuItems.map((item, index) => (
                          <motion.div
                            key={item.title}
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                            whileHover={{ x: 4 }}
                          >
                            <SidebarMenuItem>
                              <SidebarMenuButton 
                                className={`hover:bg-gradient-to-r transition-all duration-300 rounded-2xl group border border-transparent ${getColorClasses(item.color, location.pathname === item.url)}`}
                              >
                                <Link to={item.url} className="flex items-center gap-4 px-4 py-4 w-full">
                                  <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    <item.icon className="w-6 h-6" />
                                  </motion.div>
                                  <div className="flex-1">
                                    <span className="font-bold text-base">{item.title}</span>
                                    <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                  </div>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </motion.div>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  {isAdmin && (
                    <SidebarGroup>
                      <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-3 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Municipal Portal
                      </SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                          {adminItems.map((item, index) => (
                            <motion.div
                              key={item.title}
                              initial={{ x: -30, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                              whileHover={{ x: 4 }}
                            >
                              <SidebarMenuItem>
                                <SidebarMenuButton 
                                  className={`hover:bg-gradient-to-r transition-all duration-300 rounded-2xl group border border-transparent ${getColorClasses(item.color, location.pathname === item.url)}`}
                                >
                                  <Link to={item.url} className="flex items-center gap-4 px-4 py-4 w-full">
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: -5 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                      <item.icon className="w-6 h-6" />
                                    </motion.div>
                                    <div className="flex-1">
                                      <span className="font-bold text-base">{item.title}</span>
                                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                    </div>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </motion.div>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  )}
                </SidebarContent>

                <SidebarFooter className="border-t border-orange-200/30 p-4 bg-gradient-to-t from-orange-50/30 to-transparent">
                  <div className="flex items-center justify-between">
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    ) : user ? (
                      <Link to={createPageUrl("Profile")} className="flex items-center gap-3 w-full">
                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.email}`} alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-800">{user.email}</p>
                          <Badge variant="outline" className="text-xs mt-1 bg-white">{user.role}</Badge>
                        </div>
                      </Link>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to={createPageUrl("Login")}>Login</Link>
                      </Button>
                    )}
                  </div>
                </SidebarFooter>
              </Sidebar>

              <main className="flex-1 flex flex-col relative">
                <header className="bg-white/95 backdrop-blur-xl border-b border-orange-200/30 px-6 py-4 md:hidden shadow-lg">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <SidebarTrigger>
                        <Menu className="h-6 w-6" />
                      </SidebarTrigger>
                    </Button>
                    <h1 className="text-xl font-bold text-slate-800">{currentPageName || "Dashboard"}</h1>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <Bell className="h-6 w-6" />
                    </Button>
                  </div>
                </header>

                <motion.div 
                  key={location.pathname}
                  className="flex-1 overflow-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </motion.div>
    </>
  );
}
