import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Plus,
  Camera,
  Video,
  Send,
  MoreHorizontal,
  Leaf,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StoriesSection from "../components/social/StoriesSection";
import PostCard from "../components/social/PostCard";
import CreatePostModal from "../components/social/CreatePostModal";
import StoryViewer from "../components/social/StoryViewer"; // Import StoryViewer
import CreateStoryModal from "../components/social/CreateStoryModal";
import { Link } from "react-router-dom"; // Import Link
import { createPageUrl } from "@/utils"; // Import createPageUrl

// Sample data - In real app, this would come from API
const samplePosts = [
  {
    id: 1,
    user: {
      id: 1,
      username: "ecowarrior_priya",
      fullName: "Priya Sharma",
      avatar: null,
      isVerified: true,
      level: "Eco-Guardian",
      points: 2450
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=500&fit=crop",
      caption: "Organized a beach cleanup drive this weekend! 🌊 Collected over 50kg of plastic waste with 30+ volunteers. Every small action makes a big difference! #CleanBeaches #CommunityAction #PlasticFree"
    },
    engagement: {
      likes: 234,
      comments: 18,
      shares: 12
    },
    isLiked: false,
    isBookmarked: false,
    timestamp: "2 hours ago",
    location: "Marine Drive Beach"
  },
  {
    id: 2,
    user: {
      id: 2,
      username: "treeplanter_raj",
      fullName: "Raj Kumar",
      avatar: null,
      isVerified: false,
      level: "Eco-Warrior",
      points: 1820
    },
    content: {
      type: "video",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
      caption: "Planted 15 saplings in our neighborhood today 🌱 Join me next Sunday for another tree plantation drive! Let's make our city greener together 💚 #PlantTrees #GreenCity #SundayVibes"
    },
    engagement: {
      likes: 156,
      comments: 24,
      shares: 8
    },
    isLiked: true,
    isBookmarked: true,
    timestamp: "5 hours ago",
    location: "Sector 21 Park"
  },
  {
    id: 3,
    user: {
      id: 3,
      username: "recycling_queen",
      fullName: "Anita Desai",
      avatar: null,
      isVerified: true,
      level: "Eco-Guardian",
      points: 3100
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&h=500&fit=crop",
      caption: "Check out this amazing compost bin I made from old plastic containers! ♻️ Turning kitchen waste into garden gold. Tutorial coming soon! #ZeroWaste #Composting #DIY #Sustainability"
    },
    engagement: {
      likes: 189,
      comments: 31,
      shares: 15
    },
    isLiked: false,
    isBookmarked: false,
    timestamp: "1 day ago",
    location: "Home Garden"
  },
  {
    id: 4,
    user: {
      id: 4,
      username: "water_saver_sam",
      fullName: "Sameer Verma",
      avatar: null,
      isVerified: false,
      level: "Gardener",
      points: 950
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1556947230-058a743c33a9?w=500&h=500&fit=crop",
      caption: "Installed a rainwater harvesting system at home. It's surprising how much water you can collect from just one downpour. Highly recommend it! #WaterConservation #RainwaterHarvesting #GoGreen"
    },
    engagement: { likes: 98, comments: 12, shares: 5 },
    isLiked: false, isBookmarked: false, timestamp: "2 days ago", location: "Rooftop"
  },
  {
    id: 5,
    user: {
      id: 5,
      username: "energy_expert_isha",
      fullName: "Isha Kapoor",
      avatar: null,
      isVerified: true,
      level: "Eco-Warrior",
      points: 1500
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop",
      caption: "Switched all my home lights to LEDs. The energy savings are real, and the light quality is fantastic. A small switch for a big impact on your carbon footprint. #EnergyEfficiency #LEDLights #SustainableLiving"
    },
    engagement: { likes: 132, comments: 19, shares: 9 },
    isLiked: true, isBookmarked: false, timestamp: "3 days ago", location: "At Home"
  },
  {
    id: 6,
    user: {
      id: 6,
      username: "plasticfree_pioneer",
      fullName: "Arjun Mehta",
      avatar: null,
      isVerified: false,
      level: "Eco-Warrior",
      points: 1980
    },
    content: {
      type: "video",
      url: "https://images.unsplash.com/photo-1618215322928-654720953683?w=500&h=500&fit=crop",
      caption: "My journey to a plastic-free lifestyle. Here's a peek inside my pantry. It's all about glass jars and bulk buying. It takes effort but is so worth it. #PlasticFreeLiving #ZeroWasteHome #EcoFriendly"
    },
    engagement: { likes: 280, comments: 45, shares: 22 },
    isLiked: false, isBookmarked: true, timestamp: "3 days ago", location: "My Kitchen"
  },
  {
    id: 7,
    user: {
      id: 7,
      username: "urban_gardener_leela",
      fullName: "Leela Devi",
      avatar: null,
      isVerified: false,
      level: "Gardener",
      points: 1100
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1466692476868-aef6dfb1e735?w=500&h=500&fit=crop",
      caption: "My little balcony garden is thriving! Fresh herbs and veggies right at my doorstep. You don't need a big space to grow your own food. #UrbanGardening #GrowYourOwn #BalconyGarden"
    },
    engagement: { likes: 175, comments: 28, shares: 14 },
    isLiked: false, isBookmarked: false, timestamp: "4 days ago", location: "Apartment Balcony"
  },
  {
    id: 8,
    user: {
      id: 1,
      username: "ecowarrior_priya",
      fullName: "Priya Sharma",
      avatar: null,
      isVerified: true,
      level: "Eco-Guardian",
      points: 2450
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1599664223843-0b064228563d?w=500&h=500&fit=crop",
      caption: "Conducted a workshop on waste segregation in my society. So happy to see the enthusiasm from everyone, young and old! Education is the first step. #WasteManagement #CommunityWorkshop #SwachhBharat"
    },
    engagement: { likes: 310, comments: 35, shares: 18 },
    isLiked: true, isBookmarked: true, timestamp: "5 days ago", location: "Community Hall"
  },
  {
    id: 9,
    user: {
      id: 2,
      username: "treeplanter_raj",
      fullName: "Raj Kumar",
      avatar: null,
      isVerified: false,
      level: "Eco-Warrior",
      points: 1820
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1620714223084-86c8983058c4?w=500&h=500&fit=crop",
      caption: "Documenting local biodiversity. Found this beautiful Painted Grasshopper near the city lake. It's a reminder of the incredible nature that exists all around us, even in urban areas. #Biodiversity #InsectsOfIndia #NatureWatch"
    },
    engagement: { likes: 112, comments: 15, shares: 7 },
    isLiked: false, isBookmarked: false, timestamp: "6 days ago", location: "City Lake"
  },
  {
    id: 10,
    user: {
      id: 3,
      username: "recycling_queen",
      fullName: "Anita Desai",
      avatar: null,
      isVerified: true,
      level: "Eco-Guardian",
      points: 3100
    },
    content: {
      type: "video",
      url: "https://images.unsplash.com/photo-1595184132333-96e67e3a8a3a?w=500&h=500&fit=crop",
      caption: "A quick tutorial on how to make your own eco-friendly cleaning solutions using vinegar and citrus peels. Better for your health and the planet! #DIYCleaner #EcoHacks #GreenCleaning"
    },
    engagement: { likes: 250, comments: 38, shares: 25 },
    isLiked: false, isBookmarked: false, timestamp: "1 week ago", location: "Home"
  },
    {
    id: 11,
    user: {
      id: 4,
      username: "water_saver_sam",
      fullName: "Sameer Verma",
      avatar: null,
      isVerified: false,
      level: "Gardener",
      points: 950
    },
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1611270503419-94f3a8f4b8d7?w=500&h=500&fit=crop",
      caption: "Participated in a 'plogging' event this morning. A good run and a cleaner park! Great way to combine fitness and environmental action. #Plogging #FitIndia #CleanUp"
    },
    engagement: { likes: 140, comments: 22, shares: 11 },
    isLiked: true, isBookmarked: false, timestamp: "1 week ago", location: "City Park"
  }
];

const sampleUserStories = [
  { 
    storyId: 1, 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1527088922573-4d24a99142a5?w=500&h=900&fit=crop', 
    duration: 5000 
  },
  { 
    storyId: 2, 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1618337119994-f0c11d3d63e9?w=500&h=900&fit=crop', 
    duration: 5000 
  },
];

const sampleStories = [
  {
    id: 1,
    user: {
      username: "you",
      fullName: "Your Story",
      avatar: null,
      stories: [] // Placeholder for user's own stories
    },
    isOwnStory: true,
    hasNewStory: false
  },
  {
    id: 2,
    user: {
      username: "ecowarrior_priya",
      fullName: "Priya Sharma",
      avatar: null,
      stories: sampleUserStories // Assign the sample user stories here
    },
    hasNewStory: true
  },
  {
    id: 3,
    user: {
      username: "treeplanter_raj",
      fullName: "Raj Kumar", 
      avatar: null,
      stories: [
        { storyId: 3, type: 'image', url: 'https://images.unsplash.com/photo-150247657159-251f28b78913?w=500&h=900&fit=crop', duration: 4000 },
        { storyId: 4, type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-windmills-at-sunset-4148-large.mp4', duration: 8000 }
      ]
    },
    hasNewStory: true
  },
  {
    id: 4,
    user: {
      username: "recycling_queen",
      fullName: "Anita Desai",
      avatar: null,
      stories: [
        { storyId: 5, type: 'image', url: 'https://images.unsplash.com/photo-1533038622151-5b7226f959c1?w=500&h=900&fit=crop', duration: 6000 }
      ]
    },
    hasNewStory: false
  }
];

export default function EcoVoice() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(samplePosts);
  const [stories, setStories] = useState(sampleStories);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [storyViewerUser, setStoryViewerUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        User.loginWithRedirect(window.location.href);
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          engagement: {
            ...post.engagement,
            likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
          }
        };
      }
      return post;
    }));
  };

  const handleBookmarkPost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  const handleViewStory = (storyUser) => {
    if (storyUser.isOwnStory) {
      setShowCreateStory(true);
    } else if (storyUser.user.stories && storyUser.user.stories.length > 0) {
      setStoryViewerUser(storyUser.user);
      setShowStoryViewer(true);
    }
  };

  const handleCreateStory = (newStory) => {
    // Add story to user's stories
    setStories(prevStories => {
      return prevStories.map(story => {
        if (story.isOwnStory) {
          return {
            ...story,
            user: {
              ...story.user,
              stories: [...(story.user.stories || []), newStory]
            },
            hasNewStory: true
          };
        }
        return story;
      });
    });
    setShowCreateStory(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading eco feed...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Join the Eco Community</h2>
          <p className="text-slate-600 mb-4">Connect with eco-warriors in your area</p>
          <Button onClick={() => User.login()} className="bg-green-600 hover:bg-green-700">
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-green-50/30">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-green-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              EcoVoice
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowCreatePost(true)}
              className="hover:bg-green-50"
            >
              <Plus className="w-5 h-5 text-green-600" />
            </Button>
            <Link to={createPageUrl("Chat")}>
              <Button variant="ghost" size="icon" className="hover:bg-green-50">
                <Send className="w-5 h-5 text-green-600" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Stories Section */}
        <StoriesSection stories={stories} onViewStory={handleViewStory} />

        {/* Create Post Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-3 bg-white border-b border-slate-100"
        >
          <div 
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-full cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setShowCreatePost(true)}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-green-100 text-green-700 text-sm font-semibold">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-slate-500 text-sm flex-1">Share your green action...</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Camera className="w-3 h-3 text-green-600" />
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Video className="w-3 h-3 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="pb-20">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <PostCard
                  post={post}
                  onLike={handleLikePost}
                  onBookmark={handleBookmarkPost}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal
            user={user}
            onClose={() => setShowCreatePost(false)}
            onSubmit={(newPost) => {
              setPosts([newPost, ...posts]);
              setShowCreatePost(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Story Modal */}
      <AnimatePresence>
        {showCreateStory && (
          <CreateStoryModal
            user={user}
            onClose={() => setShowCreateStory(false)}
            onSubmit={handleCreateStory}
          />
        )}
      </AnimatePresence>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {showStoryViewer && storyViewerUser && (
          <StoryViewer
            user={storyViewerUser}
            onClose={() => setShowStoryViewer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
