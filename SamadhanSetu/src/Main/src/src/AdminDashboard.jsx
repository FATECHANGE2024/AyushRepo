import React, { useState, useEffect } from "react";
import { Report, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import ReportCard from "../components/reports/ReportCard";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.role !== 'admin') {
        alert("Access denied. Admin privileges required.");
        return;
      }

      const data = await Report.list("-created_date", 100);
      setReports(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (reportId, newStatus, assignedTo = null) => {
    try {
      const updateData = { status: newStatus };
      if (assignedTo) updateData.assigned_to = assignedTo;
      if (newStatus === 'resolved') updateData.resolved_date = new Date().toISOString().split('T')[0];
      
      await Report.update(reportId, updateData);
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => ['submitted', 'acknowledged'].includes(r.status)).length;
    const inProgress = reports.filter(r => r.status === 'in_progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const urgent = reports.filter(r => r.priority === 'urgent').length;
    
    return { total, pending, inProgress, resolved, urgent };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You need admin privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              Municipal Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage and track civic issues across the city</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-xs text-slate-500">Total Reports</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
                  <div className="text-xs text-slate-500">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.inProgress}</div>
                  <div className="text-xs text-slate-500">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.urgent}</div>
                  <div className="text-xs text-slate-500">Urgent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="streetlight">Streetlight</SelectItem>
                  <SelectItem value="trash">Trash</SelectItem>
                  <SelectItem value="water_leak">Water Leak</SelectItem>
                  <SelectItem value="graffiti">Graffiti</SelectItem>
                  <SelectItem value="traffic_signal">Traffic Signal</SelectItem>
                  <SelectItem value="sidewalk">Sidewalk</SelectItem>
                  <SelectItem value="noise">Noise</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Reports Management ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow 
                      key={report.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelectedReport(report)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-slate-500 truncate max-w-xs">
                            {report.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.category?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={report.status}
                          onValueChange={(value) => handleStatusUpdate(report.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="acknowledged">Acknowledged</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            report.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            report.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            report.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }
                        >
                          {report.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {report.created_by}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {format(new Date(report.created_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Report Details Modal/Panel could go here */}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ReportCard
                report={selectedReport}
                onClick={() => {}}
                showActions={true}
                onStatusUpdate={handleStatusUpdate}
                className="shadow-2xl"
              />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
