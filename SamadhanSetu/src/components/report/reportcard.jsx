import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  User,
  Camera,
  Mic,
  ExternalLink,
  ArrowUpCircle,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  acknowledged: "bg-yellow-100 text-yellow-800 border-yellow-200",
  assigned: "bg-purple-100 text-purple-800 border-purple-200",
  in_progress: "bg-orange-100 text-orange-800 border-orange-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700"
};

const categoryIcons = {
  pothole: "🕳️",
  streetlight: "💡",
  trash: "🗑️", 
  water_leak: "💧",
  graffiti: "🎨",
  traffic_signal: "🚦",
  sidewalk: "🚶",
  noise: "🔊",
  other: "❓"
};

export default function ReportCard({ 
  report, 
  onClick, 
  showActions = false, 
  onStatusUpdate,
  className = "" 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm ${className}`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{categoryIcons[report.category]}</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{report.title}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{report.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`border ${statusColors[report.status]} font-medium`}>
              {report.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className={priorityColors[report.priority]}>
              {report.priority} priority
            </Badge>
            {report.upvotes > 0 && (
              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                <ArrowUpCircle className="w-3 h-3 mr-1" />
                {report.upvotes}
              </Badge>
            )}
          </div>

          {/* Location and Time */}
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{report.address || 'Location provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Reported {format(new Date(report.created_date), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>By {report.created_by}</span>
            </div>
          </div>

          {/* Media Indicators */}
          <div className="flex items-center gap-3">
            {report.photo_url && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Camera className="w-3 h-3" />
                <span>Photo</span>
              </div>
            )}
            {report.voice_note_url && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Mic className="w-3 h-3" />
                <span>Voice note</span>
              </div>
            )}
            {(report.photo_url || report.voice_note_url) && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-slate-400 hover:text-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle media view
                }}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Assignment Info */}
          {report.assigned_department && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Assigned to: {report.assigned_department.replace('_', ' ').toUpperCase()}</span>
                {report.assigned_to && (
                  <span>{report.assigned_to}</span>
                )}
              </div>
            </div>
          )}

          {/* Resolution Info */}
          {report.status === 'resolved' && report.resolved_date && (
            <div className="pt-2 border-t border-green-100 bg-green-50 -mx-6 -mb-6 px-6 py-3">
              <div className="text-xs text-green-700">
                <div className="font-medium">✅ Resolved on {format(new Date(report.resolved_date), "MMM d, yyyy")}</div>
                {report.resolution_notes && (
                  <div className="mt-1 text-green-600">{report.resolution_notes}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
