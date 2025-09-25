import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  X, 
  Camera, 
  ArrowLeft,
  Type,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile } from "@/integrations/Core";

export default function CreateStoryModal({ user, onClose, onSubmit }) {
  const [step, setStep] = useState(1); // 1: choose type, 2: create story
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleMediaUpload = async (file, type) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setSelectedMedia({ url: file_url, type });
      setMediaPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setIsUploading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      handleMediaUpload(file, type);
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (!selectedMedia) return;

    const newStory = {
      storyId: Date.now(),
      type: selectedMedia.type,
      url: selectedMedia.url,
      duration: 5000 // 5 seconds default
    };

    onSubmit(newStory);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setStep(1)}
                className="w-8 h-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {step === 1 ? "Create Story" : "Your Story"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Share Your Moment
                </h3>
                <p className="text-sm text-slate-600">
                  Create a story to share with your eco-community
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center gap-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Camera</div>
                    <div className="text-sm text-slate-500">Take a photo or video</div>
                  </div>
                </motion.button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-y-auto"
            >
              {/* Media Preview */}
              {mediaPreview && (
                <div className="aspect-[9/16] bg-slate-100 relative">
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="p-4 border-t border-slate-200">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedMedia || isUploading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-semibold"
                >
                  {isUploading ? "Uploading..." : "Share to Story"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
