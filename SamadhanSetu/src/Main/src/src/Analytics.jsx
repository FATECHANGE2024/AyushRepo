import React, { useState, useEffect } from "react";
import { Report, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

export default function Analytics() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

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

      const data = await Report.list("-created_date", 200);
      setReports(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getAnalyticsData = () => {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    const lastMonth = subDays(now, 30);

    // Time-based metrics
    const thisWeek = reports.filter(r => new Date(r.created_date) >= lastWeek).length;
    const thisMonth = reports.filter(r => new Date(r.created_date) >= lastMonth).length;
    
    // Status breakdown
    const statusBreakdown = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});

    // Category breakdown
    const categoryBreakdown = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {});

    // Priority breakdown
    const priorityBreakdown = reports.reduce((acc, report) => {
      acc[report.priority] = (acc[report.priority] || 0) + 1;
      return acc;
    }, {});

    // Resolution time analysis
    const resolvedReports = reports.filter(r => r.status === 'resolved' && r.resolved_date);
    const avgResolutionTime = resolvedReports.length > 0 ? 
      resolvedReports.reduce((sum, report) => {
        const created = new Date(report.created_date);
        const resolved = new Date(report.resolved_date);
        return sum + (resolved - created) / (1000 * 60 * 60 * 24); // days
      }, 0) / resolvedReports.length : 0;

    // Weekly trend
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const dayReports = reports.filter(r => {
        const reportDate = new Date(r.created_date);
        return reportDate.toDateString() === date.toDateString();
      }).length;
      weeklyData.push({
        date: format(date, 'MMM dd'),
        reports: dayReports
      });
    }

    return {
      thisWeek,
      thisMonth,
      statusBreakdown,
      categoryBreakdown,
      priorityBreakdown,
      avgResolutionTime,
      weeklyData,
      totalReports: reports.length,
      resolvedCount: statusBreakdown.resolved || 0,
      pendingCount: (statusBreakdown.submitted || 0) + (statusBreakdown.acknowledged || 0),
      inProgressCount: statusBreakdown.in_progress || 0
    };
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You need admin privileges to access analytics.</p>
        </div>
      </div>
    );
  }

  const analytics = getAnalyticsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              Analytics & Insights
            </h1>
            <p className="text-slate-600 mt-1">Performance metrics and trends analysis</p>
          </div>
          
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Last Updated: {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{analytics.totalReports}</div>
                  <div className="text-sm text-slate-500">Total Reports</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{analytics.resolvedCount}</div>
                  <div className="text-sm text-slate-500">Resolved</div>
                  <div className="text-xs text-green-600 font-medium">
                    {((analytics.resolvedCount / analytics.totalReports) * 100).toFixed(1)}% rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {analytics.avgResolutionTime.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-500">Avg Resolution</div>
                  <div className="text-xs text-orange-600 font-medium">days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{analytics.thisWeek}</div>
                  <div className="text-sm text-slate-500">This Week</div>
                  <div className="text-xs text-purple-600 font-medium">
                    +{((analytics.thisWeek / analytics.totalReports) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Breakdowns */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Status Breakdown */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.statusBreakdown).map(([status, count]) => {
                  const percentage = ((count / analytics.totalReports) * 100).toFixed(1);
                  const statusColors = {
                    submitted: 'bg-blue-500',
                    acknowledged: 'bg-yellow-500',
                    assigned: 'bg-purple-500',
                    in_progress: 'bg-orange-500',
                    resolved: 'bg-green-500',
                    closed: 'bg-gray-500'
                  };
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="capitalize font-medium">{status.replace('_', ' ')}</span>
                        <span className="text-slate-600">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${statusColors[status]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.categoryBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([category, count]) => {
                    const percentage = ((count / analytics.totalReports) * 100).toFixed(1);
                    const categoryIcons = {
                      pothole: '🕳️',
                      streetlight: '💡',
                      trash: '🗑️',
                      water_leak: '💧',
                      graffiti: '🎨',
                      traffic_signal: '🚦',
                      sidewalk: '🚶',
                      noise: '🔊',
                      other: '❓'
                    };
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryIcons[category]}</span>
                          <span className="capitalize font-medium text-sm">
                            {category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{count}</div>
                          <div className="text-xs text-slate-500">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Weekly Report Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-40">
              {analytics.weeklyData.map((day, index) => {
                const maxReports = Math.max(...analytics.weeklyData.map(d => d.reports));
                const height = maxReports > 0 ? (day.reports / maxReports) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs text-slate-500 font-medium">{day.reports}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-md transition-all duration-300 min-h-[4px]"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="text-xs text-slate-600 font-medium">{day.date}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Priority Analysis */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Priority Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => {
                const percentage = ((count / analytics.totalReports) * 100).toFixed(1);
                const priorityColors = {
                  low: 'border-gray-300 text-gray-700 bg-gray-50',
                  medium: 'border-blue-300 text-blue-700 bg-blue-50',
                  high: 'border-orange-300 text-orange-700 bg-orange-50',
                  urgent: 'border-red-300 text-red-700 bg-red-50'
                };
                
                return (
                  <div key={priority} className={`p-4 rounded-lg border-2 ${priorityColors[priority]}`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm font-medium capitalize">{priority}</div>
                      <div className="text-xs opacity-75">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
