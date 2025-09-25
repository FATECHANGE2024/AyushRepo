import React from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { HomeIcon, MessageSquareWarning, Leaf, HeartHandshake, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description, link, color, delay }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col justify-between rounded-2xl shadow-lg border-2 border-transparent hover:border-${color}-300 transition-all duration-300`}>
        <CardHeader>
          <div className={`w-14 h-14 rounded-xl bg-${color}-100 flex items-center justify-center mb-4`}>
            <Icon className={`w-8 h-8 text-${color}-600`} />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </CardContent>
        <div className="p-6 pt-0">
          <Link to={link}>
            <Button className={`w-full font-bold bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg`}>
              Go to {title} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    User.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-green-50/50 to-blue-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
              Welcome to Samadhan Setu
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Your unified platform for Civic Action, Environmental Stewardship, and Community Support.
          </p>
        </motion.header>

        {/* Core Modules Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={MessageSquareWarning}
            title="Civic Reporting"
            description="Report civic issues like potholes and broken streetlights. Track the resolution process with real-time updates."
            link={createPageUrl("CityMap")}
            color="orange"
            delay={0.2}
          />
          <FeatureCard
            icon={Leaf}
            title="EcoVoice"
            description="Share your positive environmental actions. Plant trees, organize clean-ups, and inspire a green movement."
            link={createPageUrl("EcoVoice")}
            color="green"
            delay={0.4}
          />
          <FeatureCard
            icon={HeartHandshake}
            title="Nature Heroes"
            description="Discover and celebrate environmental champions who are making a difference through conservation and awareness."
            link={createPageUrl("NatureHeroes")}
            color="blue"
            delay={0.6}
          />
        </div>

        {/* My Activity Section (placeholder) */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16"
        >
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Your Recent Activity</h2>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
                <p className="text-slate-500">
                  {user ? "Your recent reports and posts will appear here." : "Log in to see your activity."}
                </p>
                {!user && 
                  <Button onClick={() => User.login()} className="mt-4 bg-orange-500 hover:bg-orange-600">
                    Login to Get Started
                  </Button>
                }
            </div>
        </motion.div>
      </div>
    </div>
  );
}
