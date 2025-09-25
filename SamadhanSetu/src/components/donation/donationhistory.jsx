import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Download, 
  Search,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200"
};

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  failed: AlertCircle,
  refunded: RefreshCw
};

export default function DonationHistory({ donations = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDonations = donations.filter(donation =>
    donation.cause_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonated = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  const DonationCard = ({ donation, index }) => {
    const StatusIcon = statusIcons[donation.status];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{donation.cause_name}</h3>
                <p className="text-slate-600 text-sm mb-2">
                  {donation.cause_type.replace('_', ' ').toUpperCase()}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(donation.created_date), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  ₹{donation.amount.toLocaleString()}
                </div>
                <Badge className={`border ${statusColors[donation.status]}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="capitalize">{donation.payment_method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono text-xs">{donation.transaction_id}</span>
              </div>
              {donation.is_recurring && (
                <div className="flex justify-between">
                  <span>Recurring:</span>
                  <span className="capitalize">{donation.recurring_frequency}</span>
                </div>
              )}
              {donation.anonymous && (
                <div className="text-blue-600 text-xs">
                  👤 Anonymous Donation
                </div>
              )}
            </div>

            {donation.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 italic">"{donation.notes}"</p>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-3 h-3" />
                Download Receipt
              </Button>
              {donation.tax_receipt_generated && (
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  Tax Receipt
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <IndianRupee className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No Donations Yet</h3>
        <p className="text-slate-500">Start supporting causes to see your donation history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">₹{totalDonated.toLocaleString()}</h2>
              <p className="text-green-100">Total amount donated</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">{donations.filter(d => d.status === 'completed').length}</div>
              <p className="text-green-100">Successful donations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search donations by cause name or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.map((donation, index) => (
          <DonationCard key={donation.id} donation={donation} index={index} />
        ))}
      </div>

      {filteredDonations.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-slate-500">No donations found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
