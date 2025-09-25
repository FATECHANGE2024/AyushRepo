import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  MapPin,
  Award,
  Play,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const levelColors = {
  "Seedling": "bg-green-100 text-green-700",
  "Sprout": "bg-green-200 text-green-800", 
  "Gardener": "bg-blue-100 text-blue-700",
  "Eco-Warrior": "bg-purple-100 text-purple-700",
  "Eco-Guardian": "bg-orange-100 text-orange-700"
};

export default function PostCard({ post, onLike, onBookmark }) {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "GreenThumb123",
      text: "This is amazing! Where exactly did you do this cleanup?",
      time: "2h ago"
    },
    {
      id: 2,
      user: "EcoWarrior99",
      text: "Great work! I'd love to join your next cleanup drive 🌱",
      time: "1h ago"
    }
  ]);
  
  const handleLike = () => {
    onLike(post.id);
  };

  const handleBookmark = () => {
    onBookmark(post.id);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: "You",
      text: newComment,
      time: "now"
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  const truncateCaption = (caption, maxLength = 125) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-white border-b border-slate-100 mb-0"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
              {post.user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              <Badge className={`text-xs px-2 py-0.5 ${levelColors[post.user.level]}`}>
                {post.user.level}
              </Badge>
            </div>
            {post.location && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{post.location}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Media */}
      <div className="relative aspect-square bg-slate-100">
        {post.content.type === 'video' ? (
          <div className="relative w-full h-full">
            <img 
              src={post.content.url} 
              alt="Post content" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-slate-700 ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <img 
            src={post.content.url} 
            alt="Post content" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className="flex items-center gap-1 group"
            >
              <motion.div
                animate={post.isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-6 h-6 ${
                    post.isLiked 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-slate-700 group-hover:text-slate-500'
                  }`} 
                />
              </motion.div>
            </motion.button>
            
            <button 
              className="flex items-center gap-1 group"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-6 h-6 text-slate-700 group-hover:text-slate-500" />
            </button>
            
            <button className="flex items-center gap-1 group">
              <Share2 className="w-6 h-6 text-slate-700 group-hover:text-slate-500" />
            </button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleBookmark}
            className="group"
          >
            <Bookmark 
              className={`w-6 h-6 ${
                post.isBookmarked 
                  ? 'text-slate-900 fill-slate-900' 
                  : 'text-slate-700 group-hover:text-slate-500'
              }`} 
            />
          </motion.button>
        </div>

        {/* Likes Count */}
        <div className="mb-2">
          <span className="font-semibold text-sm text-slate-900">
            {post.engagement.likes.toLocaleString()} likes
          </span>
        </div>

        {/* Caption */}
        <div className="text-sm text-slate-900 leading-relaxed">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span>
            {showFullCaption || post.content.caption.length <= 125
              ? post.content.caption
              : truncateCaption(post.content.caption)
            }
          </span>
          {post.content.caption.length > 125 && !showFullCaption && (
            <button 
              onClick={() => setShowFullCaption(true)}
              className="text-slate-500 ml-1"
            >
              more
            </button>
          )}
        </div>

        {/* Comments Link */}
        {post.engagement.comments > 0 && (
          <div className="mt-2">
            <button 
              className="text-slate-500 text-sm"
              onClick={() => setShowComments(!showComments)}
            >
              View all {post.engagement.comments} comments
            </button>
          </div>
        )}

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border-t border-slate-100 pt-4"
            >
              <div className="space-y-3 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                        {comment.user.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-slate-100 rounded-2xl px-3 py-2">
                        <span className="font-semibold text-sm">{comment.user}</span>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      <span className="text-xs text-slate-500 ml-3">{comment.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Comment */}
              <div className="flex gap-3 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-100 text-green-700">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-none bg-slate-100 rounded-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button
                    size="icon"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="rounded-full w-8 h-8 bg-green-500 hover:bg-green-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp */}
        <div className="mt-2">
          <span className="text-slate-400 text-xs uppercase tracking-wide">
            {post.timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
