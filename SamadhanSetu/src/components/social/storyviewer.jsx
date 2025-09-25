import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export default function StoryViewer({ user, onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const stories = user.stories || [];
  const currentStory = stories[currentStoryIndex];

  const goToNextStory = useCallback(() => {
    setCurrentStoryIndex(prev => (prev < stories.length - 1 ? prev + 1 : prev));
    if (currentStoryIndex >= stories.length - 1) {
      onClose();
    }
  }, [currentStoryIndex, stories.length, onClose]);

  const goToPreviousStory = () => {
    setCurrentStoryIndex(prev => (prev > 0 ? prev - 1 : 0));
  };

  useEffect(() => {
    setProgress(0);
    if (!currentStory) return;

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          goToNextStory();
          return 100;
        }
        return p + 100 / (currentStory.duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, currentStory, goToNextStory]);

  if (!currentStory) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="relative w-full max-w-sm h-full max-h-[95vh] bg-neutral-900 rounded-lg overflow-hidden">
        {/* Story Content */}
        <img src={currentStory.url} className="w-full h-full object-cover" alt="Story content" />

        {/* Overlay with Header and Controls */}
        <div className="absolute inset-0 flex flex-col">
          {/* Progress Bars */}
          <div className="flex gap-1 p-2">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                <div
                  className="h-1 bg-white rounded-full"
                  style={{ width: `${index < currentStoryIndex ? 100 : index === currentStoryIndex ? progress : 0}%` }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 p-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-semibold">{user.fullName}</span>
            <span className="text-white/70 text-xs">now</span>
            <div className="flex-grow" />
            <button onClick={onClose} className="text-white">
              <X size={24} />
            </button>
          </div>

          {/* Click zones for navigation */}
          <div className="flex-grow flex">
            <div className="w-1/3 h-full" onClick={goToPreviousStory}></div>
            <div className="w-2/3 h-full" onClick={goToNextStory}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
