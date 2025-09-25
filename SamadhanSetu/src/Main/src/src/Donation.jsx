import React, { useState, useEffect } from "react";
import { User, Donation, Cause } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Users, 
  TreePine, 
  AlertTriangle,
  IndianRupee,
  History,
  TrendingUp,
  Gift,
  Shield,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import DonationForm from "../components/donations/DonationForm";
import CauseCard from "../components/donations/CauseCard";
import DonationHistory from "../components/donations/DonationHistory";

export default function Donations() {
  const [user, setUser] = useState(null);
  const [causes, setCauses] = useState([]);
  const [donations, setDonations] = useState([]);
  const [selectedCause, setSelectedCause] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [activeTab, setActiveTab] = useState("causes");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const [causesData, donationsData] = await Promise.all([
        Cause.list("-created_date", 50),
        Donation.filter({ created_by: currentUser.email }, "-created_date", 20)
      ]);
      
      setCauses(causesData);
      setDonations(donationsData);
    } catch (error) {
      console.error("Error loading data:", error);
      User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  };

  const handleDonationSuccess = async (donationData) => {
    try {
      await Donation.create(donationData);
      setShowDonationForm(false);
      setSelectedCause(null);
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error saving donation:", error);
    }
  };

  const getStats = () => {
    const totalDonated = donations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);
    const donationCount = donations.filter(d => d.status === 'completed').length;
    const uniqueCauses = new Set(donations.filter(d => d.status === 'completed').map(d => d.cause_id)).size;
    
    return { totalDonated, donationCount, uniqueCauses };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading donation platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/50 via-pink-50/50 to-purple-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Donation & Funding
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Support meaningful causes, help disaster victims, and fund environmental heroes making a difference.
          </p>
        </motion.div>

        {/* User Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">₹{stats.totalDonated.toLocaleString()}</div>
                <div className="text-slate-600">Total Donated</div>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stats.donationCount}</div>
                <div className="text-slate-600">Donations Made</div>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stats.uniqueCauses}</div>
                <div className="text-slate-600">Causes Supported</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="causes" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Support Causes
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <History className="w-4 h-4 mr-2" />
              My Donations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="causes">
            <div className="space-y-8">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" className="bg-white/80 hover:bg-red-50 hover:border-red-200">
                  <Users className="w-4 h-4 mr-2" />
                  All Causes
                </Button>
                <Button variant="outline" className="bg-white/80 hover:bg-green-50 hover:border-green-200">
                  <TreePine className="w-4 h-4 mr-2" />
                  Environmental
                </Button>
                <Button variant="outline" className="bg-white/80 hover:bg-orange-50 hover:border-orange-200">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Disaster Relief
                </Button>
                <Button variant="outline" className="bg-white/80 hover:bg-blue-50 hover:border-blue-200">
                  <Shield className="w-4 h-4 mr-2" />
                  NGO Support
                </Button>
              </div>

              {/* Causes Grid */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {causes.map((cause, index) => (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <CauseCard
                      cause={cause}
                      onDonate={(cause) => {
                        setSelectedCause(cause);
                        setShowDonationForm(true);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <DonationHistory donations={donations} />
          </TabsContent>
        </Tabs>

        {/* Donation Form Modal */}
        <AnimatePresence>
          {showDonationForm && selectedCause && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowDonationForm(false);
                setSelectedCause(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <DonationForm
                  cause={selectedCause}
                  user={user}
                  onSuccess={handleDonationSuccess}
                  onCancel={() => {
                    setShowDonationForm(false);
                    setSelectedCause(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
