import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  MapPin,
  Mic,
  Send,
  Upload,
  X,
  MicIcon,
  Square,
  Brain,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; // Added Badge component import

export default function QuickReportForm({ onSubmit, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    latitude: null,
    longitude: null,
    address: "",
    photo_url: "",
    voice_note_url: ""
  });

  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // New state for AI analysis
  const [error, setError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null); // New state for AI suggestions

  const fileInputRef = useRef(null);
  const videoRef = useRef(null); // This is not used in the final version of the code, but kept as it was in original.
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          setError("Unable to get your location. Please enter address manually.");
          setIsGettingLocation(false);
        }
      );
    }
  };

  // AI Issue Detection
  const analyzeImageForIssue = async (fileUrl) => {
    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze this civic issue image and provide structured information about what you see. Look for common civic problems like potholes, broken streetlights, trash/waste issues, water leaks, graffiti, traffic signal problems, sidewalk damage, or other municipal issues.

Please provide:
1. A brief descriptive title for the issue
2. A detailed description of what you observe
3. The most appropriate category from these options: pothole, streetlight, trash, water_leak, graffiti, traffic_signal, sidewalk, noise, other
4. Priority level (low, medium, high, urgent) based on safety and urgency
5. Any additional observations that would help municipal workers

Be specific and professional in your assessment.`,
        file_urls: [fileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Brief title for the civic issue"
            },
            description: {
              type: "string",
              description: "Detailed description of the observed issue"
            },
            category: {
              type: "string",
              enum: ["pothole", "streetlight", "trash", "water_leak", "graffiti", "traffic_signal", "sidewalk", "noise", "other"],
              description: "Most appropriate category for this issue"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Recommended priority level"
            },
            confidence: {
              type: "string",
              enum: ["high", "medium", "low"],
              description: "AI confidence in the analysis"
            },
            additional_notes: {
              type: "string",
              description: "Additional observations or recommendations"
            }
          },
          required: ["title", "description", "category", "priority", "confidence"]
        }
      });

      if (response) {
        setAiSuggestions(response);
        // Auto-fill form with AI suggestions if they are more specific or initial
        setFormData(prev => ({
          ...prev,
          title: response.title || prev.title,
          description: response.description || prev.description,
          category: response.category || prev.category,
          priority: response.priority || prev.priority
        }));
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setError("AI analysis failed, but you can still fill the form manually.");
    }
    setIsAnalyzing(false);
  };

  // Handle file upload
  const handleFileUpload = async (file, type = "photo") => {
    setIsUploading(true);
    setError(""); // Clear any previous errors
    try {
      const { file_url } = await UploadFile({ file });
      if (type === "photo") {
        setFormData(prev => ({ ...prev, photo_url: file_url }));
        setPhotoPreview(URL.createObjectURL(file));

        // Start AI analysis
        await analyzeImageForIssue(file_url);
      } else if (type === "voice") {
        setFormData(prev => ({ ...prev, voice_note_url: file_url }));
      }
    } catch (error) {
      setError("Failed to upload file. Please try again.");
    }
    setIsUploading(false);
  };

  // Handle camera capture (Placeholder, actual capture logic would be more complex)
  const handleCameraCapture = async () => {
    // For a full implementation, you'd integrate with a camera component
    // that allows taking a photo and returns a File object.
    // This is a simplified version just to show the intent.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera for better civic issue photos
      });
      // In a real app, you would then capture a frame from this stream,
      // convert it to a File object, and then call handleFileUpload.
      // For this example, we'll just indicate camera access was successful.
      setError("Camera access granted. (Actual photo capture and upload not fully implemented in this example)");
      stream.getTracks().forEach(track => track.stop()); // Stop stream immediately after showing success
    } catch (error) {
      setError("Unable to access camera. Please upload a photo instead.");
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        const file = new File([blob], 'voice-note.webm', { type: 'audio/webm' });
        await handleFileUpload(file, 'voice');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setError("Unable to access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.photo_url) { // Photo is now required
      setError("Photo is required to submit a report.");
      return;
    }
    if (!formData.title || !formData.category) {
      setError("Please fill in the title and category.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("Please provide location information.");
      return;
    }

    onSubmit(formData);
  };

  const applyAISuggestions = () => {
    if (aiSuggestions) {
      setFormData(prev => ({
        ...prev,
        title: aiSuggestions.title,
        description: aiSuggestions.description,
        category: aiSuggestions.category,
        priority: aiSuggestions.priority
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Quick Report Submission
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* AI Analysis Results */}
          <AnimatePresence>
            {aiSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Analysis Complete</h3>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    {aiSuggestions.confidence} confidence
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-purple-800">
                  <p><span className="font-medium">Detected Issue:</span> {aiSuggestions.title}</p>
                  <p><span className="font-medium">Category:</span> {aiSuggestions.category?.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  <p><span className="font-medium">Priority:</span> {aiSuggestions.priority?.charAt(0).toUpperCase() + aiSuggestions.priority?.slice(1)}</p>
                  {aiSuggestions.additional_notes && (
                    <p><span className="font-medium">Notes:</span> {aiSuggestions.additional_notes}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyAISuggestions}
                  className="mt-3 bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use AI Suggestions
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload - Now Required */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Photo Evidence *
                <span className="text-sm font-normal text-red-600 ml-1">(Required)</span>
              </Label>
              <div className="p-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                <div className="text-center">
                  {!photoPreview && <Camera className="w-12 h-12 text-blue-500 mx-auto mb-3" />}
                  <p className="text-sm text-blue-700 font-medium mb-4">
                    Take or upload a photo of the issue for AI analysis
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isAnalyzing}
                      className="flex items-center gap-2 bg-white hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading ? "Uploading..." : "Upload Photo"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCameraCapture}
                      disabled={isUploading || isAnalyzing}
                      className="flex items-center gap-2 bg-white hover:bg-blue-50"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "photo");
                    }}
                    className="hidden"
                    required
                  />
                </div>
              </div>

              {/* AI Analysis Loading */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 mt-4"
                  >
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-700 font-medium">AI is analyzing your image...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Photo Preview */}
              <AnimatePresence>
                {photoPreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative mt-4"
                  >
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full max-w-md mx-auto h-48 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                      onClick={() => {
                        setPhotoPreview(null);
                        setFormData(prev => ({ ...prev, photo_url: "" }));
                        setAiSuggestions(null); // Clear AI suggestions when photo is removed
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg"
                required
              />
              {aiSuggestions && formData.title === aiSuggestions.title && (
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" />
                  AI suggested
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pothole">🕳️ Pothole</SelectItem>
                  <SelectItem value="streetlight">💡 Streetlight</SelectItem>
                  <SelectItem value="trash">🗑️ Trash/Waste</SelectItem>
                  <SelectItem value="water_leak">💧 Water Leak</SelectItem>
                  <SelectItem value="graffiti">🎨 Graffiti</SelectItem>
                  <SelectItem value="traffic_signal">🚦 Traffic Signal</SelectItem>
                  <SelectItem value="sidewalk">🚶 Sidewalk Issue</SelectItem>
                  <SelectItem value="noise">🔊 Noise Complaint</SelectItem>
                  <SelectItem value="other">❓ Other</SelectItem>
                </SelectContent>
              </Select>
              {aiSuggestions && formData.category === aiSuggestions.category && (
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" />
                  AI suggested
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the issue..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="h-24"
              />
              {aiSuggestions && formData.description === aiSuggestions.description && (
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" />
                  AI suggested
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">🚨 Urgent</SelectItem>
                </SelectContent>
              </Select>
              {aiSuggestions && formData.priority === aiSuggestions.priority && (
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" />
                  AI suggested
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {isGettingLocation ? "Getting Location..." : "Use Current Location"}
                </Button>
              </div>
              {formData.latitude && formData.longitude && ( // Only show input if location is set
                <Input
                  placeholder="Address or location description"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-2"
                />
              )}
            </div>

            {/* Voice Note - Optional */}
            <div className="space-y-4">
              <Label>Additional Voice Note (Optional)</Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 ${isRecording ? 'bg-red-50 text-red-700' : ''}`}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? "Stop Recording" : "Voice Note"}
                </Button>
              </div>

              {/* Voice Note Indicator */}
              {formData.voice_note_url && (
                <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                  <Mic className="w-4 h-4" />
                  Voice note recorded
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 text-red-500"
                    onClick={() => setFormData(prev => ({ ...prev, voice_note_url: "" }))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category || !formData.photo_url || isAnalyzing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
