
import React, { useState } from "react";
import { Report, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SendEmail } from "@/integrations/Core";

import QuickReportForm from "../components/reports/QuickReportForm";

export default function SubmitReport() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // Redirect to login if not authenticated
        User.loginWithRedirect(window.location.href);
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const newReport = await Report.create(formData);
      
      // Send notification email to user
      try {
        if (user && user.email) {
          await SendEmail({
            to: user.email,
            subject: "Report Submitted Successfully - Samadhan Setu",
            body: `Dear ${user.full_name || 'Citizen'},

Thank you for submitting your civic report through Samadhan Setu!

Report Details:
- Title: ${formData.title}
- Category: ${formData.category}
- Description: ${formData.description}
- Status: Submitted
- Report ID: ${newReport.id}

Your report has been received and will be reviewed by the relevant municipal department. You will receive email updates as your report progresses through our system.

Thank you for helping improve our community!

Best regards,
Samadhan Setu Team`
          });
        } else {
          console.warn("User email not available for sending notification.");
        }
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail the entire submission if email fails
      }
      
      setIsSubmitted(true);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate(createPageUrl("CityMap"));
      }, 3000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("CityMap"))}
            className="bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Report an Issue</h1>
            <p className="text-slate-600 mt-1">Help improve your community by reporting civic issues</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuickReportForm 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Report Submitted Successfully!</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Thank you for helping improve our community. Your report has been received and will be reviewed by the relevant municipal department.
                </p>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 font-medium">
                    📧 You'll receive email updates as your report progresses through our system.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(createPageUrl("CityMap"))}
                    className="flex-1"
                  >
                    View on Map
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setIsSubmitting(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Submit Another Report
                  </Button>
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  Redirecting to map in 3 seconds...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
