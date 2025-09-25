import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function StoriesSection({ stories, onViewStory }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="px-4 py-4 bg-white border-b border-slate-100"
    >
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
            onClick={() => onViewStory(story)}
          >
            <div className={`relative p-0.5 rounded-full ${
              story.isOwnStory 
                ? 'bg-slate-200' 
                : story.hasNewStory 
                ? 'bg-gradient-to-tr from-green-400 via-green-500 to-blue-500' 
                : 'bg-slate-200'
            }`}>
              <div className="bg-white p-0.5 rounded-full">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={story.user.avatar} />
                  <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                    {story.isOwnStory ? '+' : story.user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {story.isOwnStory && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-slate-600 text-center max-w-[60px] truncate">
              {story.isOwnStory ? 'Your Story' : story.user.fullName.split(' ')[0]}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
