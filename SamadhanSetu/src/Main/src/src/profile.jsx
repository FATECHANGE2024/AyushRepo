import React, { useState, useEffect, useRef } from 'react';
import { User, Report } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadFile } from "@/integrations/Core";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Phone,
  Mail,
  MapPin,
  Edit,
  Bell,
  Globe,
  Star,
  ShieldAlert,
  BookLock,
  Sparkles,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Loader2,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const ProfileActionItem = ({ icon, text, onClick }) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 hover:bg-slate-50 transition-colors duration-200"
    >
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-slate-500" />
        <span className="text-slate-800 font-medium">{text}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </button>
  );
};

const LanguageModal = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  
  const handleSave = () => {
    localStorage.setItem('language', language);
    alert(`Language changed to ${language === 'en' ? 'English' : 'हिंदी (Hindi)'}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Language</DialogTitle>
          <DialogDescription>
            Select your preferred language for the application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} className="w-full mt-4">Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
};


export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    avatar_url: ""
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setFormData({
          full_name: currentUser.full_name || "",
          phone_number: currentUser.phone_number || "",
          address: currentUser.address || "",
          avatar_url: currentUser.avatar_url || ""
        });
      } catch (error) {
        User.loginWithRedirect(createPageUrl("Profile"));
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ avatar_url: file_url });
      setUser(prev => ({ ...prev, avatar_url: file_url }));
      setFormData(prev => ({ ...prev, avatar_url: file_url }));
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
    setIsUploading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await User.updateMyUserData({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.address,
      });
      setUser(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    navigate(createPageUrl("Home"));
  };

  if (isLoading && !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-green-50/50 to-blue-50/50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("Home"))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900">My Profile</h1>
        </div>

        {/* Profile Header */}
        <div className="text-center p-8">
          <div className="relative inline-block">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback className="bg-gradient-to-tr from-green-400 to-blue-500 text-white text-4xl">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleAvatarUpload(e.target.files[0])}
            />
            <Button
              size="icon"
              className="absolute bottom-1 right-1 rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </Button>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">{user?.full_name || "Active Citizen"}</h2>
          <p className="text-slate-600">{user?.title || 'Swachhata Champion'}</p>
        </div>
        
        {/* Call to Action */}
        <Card className="mx-4 mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-slate-700 mb-2">Post a complaint in your locality to become a Swachhata Champion.</p>
            <p className="text-sm text-slate-500 mb-4">Thank you for your support to Swachh Bharat Mission. Update your profile to experience enhanced features.</p>
            <Link to={createPageUrl("SubmitReport")}>
              <Button variant="link" className="text-orange-600 font-bold">Post a Complaint Now</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Details Section */}
        <Card className="mx-4 mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-slate-800">Your Details</h3>
            <Button variant="link" onClick={() => setIsEditing(!isEditing)} className="text-orange-600 font-bold">
              {isEditing ? 'Cancel' : 'EDIT'}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleUpdate} className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} placeholder="Add your phone number"/>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Add your address"/>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{user?.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{user?.phone_number || <span className="text-slate-400">Add your phone number</span>}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{user?.address || <span className="text-slate-400">Add your address</span>}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Actions Section */}
        <Card className="mx-4 mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm divide-y divide-slate-100">
          <div className="p-4 border-b">
            <h3 className="font-bold text-slate-800">You can also</h3>
          </div>
          <ProfileActionItem icon={Bell} text="Check Notifications" onClick={() => navigate(createPageUrl("Notifications"))} />
          <ProfileActionItem icon={Globe} text="Change Language" onClick={() => setShowLanguageModal(true)} />
          <ProfileActionItem icon={Star} text="Rate Us" onClick={() => window.open('https://play.google.com/store/apps', '_blank')} />
          <ProfileActionItem icon={ShieldAlert} text="Report if something isn't working" onClick={() => navigate(createPageUrl("ReportBug"))} />
          <ProfileActionItem icon={BookLock} text="Read our privacy policy" onClick={() => navigate(createPageUrl("PrivacyPolicy"))}/>
          <ProfileActionItem icon={Sparkles} text="Check What's New" onClick={() => navigate(createPageUrl("WhatsNew"))}/>
          <ProfileActionItem icon={LogOut} text="Logout" onClick={handleLogout} />
        </Card>
      </div>
      <LanguageModal isOpen={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
    </div>
  );
}
