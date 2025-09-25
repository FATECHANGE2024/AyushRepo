import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ExternalLink, 
  Award,
  Camera,
  TreePine,
  Users,
  Globe,
  Play,
  Share2,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ShareStoryModal from "@/components/heroes/ShareStoryModal";
import JoinMovementModal from "@/components/heroes/JoinMovementModal";

const HeroCard = ({ hero, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={hero.image} 
            alt={hero.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500/90 text-white border-0">
              <Award className="w-3 h-3 mr-1" />
              Nature Hero
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-1">{hero.name}</h3>
            <p className="text-green-200 font-medium">{hero.organization}</p>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">{hero.description}</p>
            
            {hero.achievements && (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-green-600" />
                  Notable Works
                </h4>
                <div className="space-y-1">
                  {hero.achievements.map((achievement, idx) => (
                    <div key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {hero.impact && (
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Impact
                </h4>
                <p className="text-green-800 text-sm">{hero.impact}</p>
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              {hero.website && (
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Learn More
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-3 h-3" />
                Share Story
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const natureHeroes = [
  {
    id: 1,
    name: "Mike Pandey",
    organization: "Earth Matters Foundation",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce240c9bce2aae0963ec8a/48240f673_WhatsAppImage2025-09-20at101847.jpeg",
    description: "Earth Matters Foundation is a Delhi-based non-profit trust working towards conservation of natural resources, environment, and wildlife conservation, while raising awareness through powerful films.",
    achievements: [
      "Shores of Silence - Whale Sharks in India",
      "Vanishing Vultures",
      "Timeless Traveler - The Horseshoe Crab",
      "Multiple award-winning environmental documentaries"
    ],
    impact: "Their hard-hitting films have made significant differences and proven to act as powerful catalysts in bringing about instrumental environmental changes.",
    website: "https://earthmattersfoundation.org",
    category: "Filmmaker & Conservationist"
  },
  {
    id: 2,
    name: "Sunderlal Bahuguna",
    organization: "Chipko Movement",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
    description: "A legendary environmentalist who led the Chipko movement, advocating for forest conservation and sustainable development in the Himalayas.",
    achievements: [
      "Led the historic Chipko Movement",
      "Padma Vibhushan recipient",
      "Lifelong advocate for forest conservation",
      "Pioneer of environmental activism in India"
    ],
    impact: "His movement saved thousands of trees and inspired global environmental movements, proving that grassroots action can create massive change.",
    category: "Environmental Activist"
  },
  {
    id: 3,
    name: "Vandana Shiva",
    organization: "Navdanya",
    image: "https://images.unsplash.com/photo-1594736797933-d0d3c31b1b66?w=400&h=400&fit=crop",
    description: "An environmental activist and food sovereignty advocate, founder of Navdanya, promoting biodiversity conservation and organic farming.",
    achievements: [
      "Founded Navdanya movement",
      "Author of 20+ books on ecology",
      "Right Livelihood Award winner",
      "Global advocate for seed sovereignty"
    ],
    impact: "Has established over 150 community seed banks across India and trained over 500,000 farmers in sustainable agriculture practices.",
    category: "Food Sovereignty Advocate"
  }
];

export default function NatureHeroes() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareStory, setShowShareStory] = useState(false);
  const [showJoinMovement, setShowJoinMovement] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in, but page is still accessible
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading nature heroes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-blue-50/50 to-purple-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nature Heroes
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating the champions who dedicate their lives to protecting our planet and inspiring environmental change through their extraordinary work.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
              <div className="text-slate-600">Environmental Champions</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">1M+</div>
              <div className="text-slate-600">Lives Impacted</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">25+</div>
              <div className="text-slate-600">Years of Conservation</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Heroes Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {natureHeroes.map((hero, index) => (
            <HeroCard key={hero.id} hero={hero} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 border-0 shadow-2xl text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Become a Nature Hero</h2>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Every action counts. Join our community and share your environmental initiatives to inspire others and create lasting change.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
                  onClick={() => setShowShareStory(true)}
                >
                  Share Your Story
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600 font-semibold"
                  onClick={() => setShowJoinMovement(true)}
                >
                  Join the Movement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nomination Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Nominate a Nature Hero
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Know someone who's making a difference for our planet? Nominate them to be featured as a Nature Hero and help us celebrate their incredible work.
              </p>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold">
                <BookOpen className="w-4 h-4 mr-2" />
                Submit Nomination
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Story Modal */}
        <AnimatePresence>
          {showShareStory && (
            <ShareStoryModal
              user={user}
              onClose={() => setShowShareStory(false)}
              onSubmit={(storyData) => {
                console.log("Story submitted:", storyData);
                setShowShareStory(false);
                alert("Thank you for sharing your story! It will be reviewed and featured soon.");
              }}
            />
          )}
        </AnimatePresence>

        {/* Join Movement Modal */}
        <AnimatePresence>
          {showJoinMovement && (
            <JoinMovementModal
              user={user}
              onClose={() => setShowJoinMovement(false)}
              onSubmit={(movementData) => {
                console.log("Movement registration:", movementData);
                setShowJoinMovement(false);
                alert("Welcome to the Nature Heroes movement! You'll receive updates about upcoming initiatives.");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
