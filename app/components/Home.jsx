// Updated HomePage.js
"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardStats from "./DashboardStats";
import QuickActions from "./QuickActions";
import RecentContent from "./RecentContent";
import PerformanceInsights from "./PerformanceInsights";
import AIProfileSetup from "./AIProfileSetup"; // New component
import Link from "next/link";
import { useState, useEffect } from "react";
const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
export default function HomePage() {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [aiProfileComplete, setAiProfileComplete] = useState(false);

  useEffect(() => {
    // Check if user has completed AI profile setup
    checkAIProfileStatus();
  }, []);

  const checkAIProfileStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // You can add an API endpoint to check profile status
      const response = await fetch(`${endpoint}/api/ai/profile-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("AI Profile Status:", data.profile_complete);
        setAiProfileComplete(data.profile_complete);
        setShowProfileSetup(!data.profile_complete);
      }
    } catch (error) {
      console.error("Error checking AI profile:", error);
    }
  };

  const handleProfileComplete = () => {
    setAiProfileComplete(true);
    setShowProfileSetup(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="hero-gradient py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">Build Your </span>
                <span className="text-primary">Content </span>
                <span className="text-primary">Kingdom </span>
                <br />
                <span className="text-white">Rule Your </span>
                <span className="text-white">Influence</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                ContentRealm™ is your gateway to turning every word you speak
                into content that dominates the digital realm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                  👑 Sign Up Now
                </Link>
                {aiProfileComplete && (
                  <Link
                    href="/ai-tools"
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    🤖 AI Tools Suite
                  </Link>
                )}
              </div>
            </div>

            {/* AI Status Indicator */}
            <div className="flex justify-center space-x-4">
              <div className="inline-flex items-center space-x-2 bg-secondary px-4 py-2 rounded-full border border-border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  AI Processing Content...
                </span>
              </div>

              {aiProfileComplete && (
                <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-primary">AI Personalized</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* AI Profile Setup */}
          {showProfileSetup && (
            <AIProfileSetup onComplete={handleProfileComplete} />
          )}

          {/* Your Voice Deserves a Throne Section */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white">
                {aiProfileComplete ? "🤖" : "🎯"}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              {aiProfileComplete
                ? "Your AI-Powered Content Kingdom"
                : "Your Voice Deserves a Throne"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              {aiProfileComplete
                ? "Your personalized AI assistants are ready to help you dominate every aspect of your content creation and speaking career."
                : "RealmAmplify is more than a tool—it's a territory. A sovereign space where creators command influence through content that works while they rest."}
            </p>

            {aiProfileComplete && (
              <div className="flex justify-center mt-6">
                <Link
                  href="/ai-tools"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium"
                >
                  🚀 Launch AI Tools Suite
                </Link>
              </div>
            )}
          </div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions showAITools={aiProfileComplete} />
            </div>

            {/* Right Column - Recent Content & Insights */}
            <div className="lg:col-span-2 space-y-8">
              <RecentContent />
              <PerformanceInsights />
            </div>
          </div>

          {/* AI Tools Preview (if profile complete) */}
          {aiProfileComplete && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🤖 Your AI Assistant Arsenal
                </h3>
                <p className="text-muted-foreground">
                  Five specialized AI tools trained on your content and
                  expertise
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    name: "Coach™",
                    icon: "🎯",
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "Drop™",
                    icon: "📱",
                    color: "from-purple-500 to-purple-700",
                  },
                  {
                    name: "Search™",
                    icon: "🔍",
                    color: "from-green-500 to-green-700",
                  },
                  {
                    name: "Rep™",
                    icon: "⭐",
                    color: "from-yellow-500 to-yellow-700",
                  },
                  {
                    name: "Cast™",
                    icon: "📺",
                    color: "from-red-500 to-red-700",
                  },
                ].map((tool) => (
                  <div
                    key={tool.name}
                    className="card text-center hover:border-primary transition-colors"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-xl mx-auto mb-3`}
                    >
                      {tool.icon}
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">
                      Realm{tool.name}
                    </h4>
                    <div className="w-full bg-secondary rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-1.5 rounded-full w-full"></div>
                    </div>
                    <span className="text-xs text-primary">Ready</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
