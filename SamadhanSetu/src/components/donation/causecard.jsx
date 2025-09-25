import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Users, 
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  TreePine,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const urgencyColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200", 
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200"
};

const causeTypeIcons = {
  ngo: Shield,
  disaster_relief: AlertTriangle,
  nature_hero: TreePine
};

const causeTypeColors = {
  ngo: "from-blue-500 to-blue-600",
  disaster_relief: "from-orange-500 to-red-500", 
  nature_hero: "from-green-500 to-green-600"
};

export default function CauseCard({ cause, onDonate }) {
  const progress = cause.goal_amount > 0 ? (cause.raised_amount / cause.goal_amount) * 100 : 0;
  const IconComponent = causeTypeIcons[cause.cause_type];
  const gradientClass = causeTypeColors[cause.cause_type];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group h-full"
    >
      <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={cause.image_url || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&h=300&fit=crop"} 
            alt={cause.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Cause Type Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`bg-gradient-to-r ${gradientClass} text-white border-0 shadow-lg`}>
              <IconComponent className="w-3 h-3 mr-1" />
              {cause.cause_type.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Urgency Badge */}
          <div className="absolute top-4 right-4">
            <Badge className={`border ${urgencyColors[cause.urgency]}`}>
              {cause.urgency.toUpperCase()}
            </Badge>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{cause.name}</h3>
            <p className="text-green-200 font-medium">{cause.organization_name}</p>
          </div>
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            <p className="text-slate-600 leading-relaxed line-clamp-3">{cause.description}</p>
            
            {/* Location */}
            {cause.location && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>{cause.location}</span>
              </div>
            )}

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-900">
                  ₹{cause.raised_amount?.toLocaleString() || 0} raised
                </span>
                <span className="text-slate-500">
                  of ₹{cause.goal_amount?.toLocaleString() || 0}
                </span>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{cause.donor_count || 0} donors</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{Math.round(progress)}% funded</span>
                </div>
              </div>
            </div>

            {/* End Date */}
            {cause.end_date && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>Campaign ends {format(new Date(cause.end_date), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 mt-auto">
            <Button
              onClick={() => onDonate(cause)}
              className={`w-full bg-gradient-to-r ${gradientClass} hover:shadow-lg transition-all duration-300 font-semibold`}
              disabled={!cause.is_active}
            >
              <Heart className="w-4 h-4 mr-2" />
              {cause.is_active ? 'Donate Now' : 'Campaign Ended'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
