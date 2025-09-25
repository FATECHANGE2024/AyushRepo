import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  X, 
  Users, 
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function JoinMovementModal({ user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    interests: [],
    skills: "",
    availability: "weekends",
    motivation: "",
    newsletter: true,
    updates: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    { id: "tree_planting", label: "Tree Planting" },
    { id: "cleanup", label: "Environmental Cleanup" },
    { id: "education", label: "Environmental Education" },
    { id: "conservation", label: "Wildlife Conservation" },
    { id: "renewable", label: "Renewable Energy" },
    { id: "advocacy", label: "Environmental Advocacy" }
  ];

  const handleInterestChange = (interestId, checked) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join the Nature Heroes Movement
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-slate-600 leading-relaxed">
                Join thousands of environmental champions making a real difference. Together, we can create lasting positive change for our planet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Areas of Interest</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {interestOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.interests.includes(option.id)}
                        onCheckedChange={(checked) => handleInterestChange(option.id, checked)}
                      />
                      <Label htmlFor={option.id} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills and Availability */}
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Expertise</Label>
                <Textarea
                  id="skills"
                  placeholder="What skills can you contribute? (e.g., photography, writing, organizing, teaching)"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="weekends">Weekends Only</option>
                  <option value="evenings">Weekday Evenings</option>
                  <option value="flexible">Flexible Schedule</option>
                  <option value="full_time">Full-time Volunteer</option>
                </select>
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to join?</Label>
                <Textarea
                  id="motivation"
                  placeholder="Share what motivates you to be part of the environmental movement..."
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  className="h-24"
                />
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <Label>Communication Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
                    />
                    <Label htmlFor="newsletter" className="text-sm font-normal">
                      Subscribe to monthly newsletter
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="updates"
                      checked={formData.updates}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, updates: checked }))}
                    />
                    <Label htmlFor="updates" className="text-sm font-normal">
                      Receive updates about local events and initiatives
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Joining..." : "Join Movement"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
