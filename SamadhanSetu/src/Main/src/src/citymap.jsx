import React, { useState, useEffect } from "react";
import { Report, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, MapPin, TrendingUp, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import InteractiveMap from "../components/map/InteractiveMap";
import ReportCard from "../components/reports/ReportCard";

export default function CityMap() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadReports();
    loadUser();
  }, []);

  const loadReports = async () => {
    try {
      const data = await Report.list("-created_date", 50);
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    }
    setIsLoading(false);
  };

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      // User not logged in
    }
  };

  const getStats = () => {
    const total = reports.length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const inProgress = reports.filter(r => r.status === 'in_progress').length;
    const thisWeek = reports.filter(r => {
      const reportDate = new Date(r.created_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDate > weekAgo;
    }).length;

    return { total, resolved, inProgress, thisWeek };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading city data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-blue-600" />
                City Issues Map
              </h1>
              <p className="text-slate-600 mt-1">Real-time view of civic issues in your community</p>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <Link to={createPageUrl("SubmitReport")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => User.login()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                >
                  Sign In to Report
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-xs text-slate-500">Total Reports</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stats.resolved}</div>
                    <div className="text-xs text-slate-500">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stats.inProgress}</div>
                    <div className="text-xs text-slate-500">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stats.thisWeek}</div>
                    <div className="text-xs text-slate-500">This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 p-4 md:p-6">
          <div style={{ height: '100%' }}>
            <InteractiveMap
              reports={reports}
              onReportSelect={setSelectedReport}
              selectedReport={selectedReport}
            />
          </div>
        </div>

        {/* Selected Report Details */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="w-96 bg-white/90 backdrop-blur-sm border-l border-slate-200 shadow-xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Report Details</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedReport(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </Button>
                </div>
                
                <ReportCard
                  report={selectedReport}
                  onClick={() => {}}
                  className="shadow-none border border-slate-200"
                />

                {/* Additional Actions */}
                <div className="mt-6 space-y-3">
                  {user?.role === 'admin' && (
                    <Link to={createPageUrl("AdminDashboard")}>
                      <Button variant="outline" className="w-full">
                        Manage in Admin Panel
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Handle upvote functionality
                      Report.update(selectedReport.id, {
                        upvotes: (selectedReport.upvotes || 0) + 1
                      }).then(() => {
                        loadReports();
                        setSelectedReport(prev => ({
                          ...prev,
                          upvotes: (prev.upvotes || 0) + 1
                        }));
                      });
                    }}
                  >
                    👍 Support This Report ({selectedReport.upvotes || 0})
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
