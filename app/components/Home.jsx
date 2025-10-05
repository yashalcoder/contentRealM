// Updated HomePage.js
"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardStats from "./DashboardStats";
import QuickActions from "./QuickActions";
import RecentContent from "./RecentContent";
import PerformanceInsights from "./PerformanceInsights";
import AIProfileSetup from "./AiProfileSetup"; // New component
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createApiFetch } from "./ApiFetch";
import { FileText, Maximize, VideoIcon } from "lucide-react";
const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function HomePage() {
  const [userLoggedin, setUserLoggedin] = useState(false);
  const router = useRouter();
  const apiFecth = createApiFetch();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [aiProfileComplete, setAiProfileComplete] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setUserLoggedin(true);
    }
  }, []); // Empty dependency array = runs only once on mount
  useEffect(() => {
    // Check if user has completed AI profile setup
    checkAIProfileStatus();
  }, []);

  const checkAIProfileStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // You can add an API endpoint to check profile status
      const response = await apiFecth(`${endpoint}/api/ai/profile-status`, {
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
  const socialPlatforms = [
    { name: "TikTok", icon: "📱", bgColor: "bg-orange-100" },
    { name: "Instagram", icon: "📷", bgColor: "bg-gray-200" },
    { name: "YouTube", icon: "📺", bgColor: "bg-yellow-100" },
  ];

  const handleProfileComplete = () => {
    setAiProfileComplete(true);
    setShowProfileSetup(false);
  };
  const features = [
    {
      id: 1,
      icon: <VideoIcon className="w-8 h-8 text-[#FDB81E]" />,
      iconBg: "bg-yellow-50",
      title: "Auto Highlights",
      description:
        "AI finds the most engaging moments in your videos automatically",
      buttonColor: "bg-[#003A56] hover:bg-[#004A6B] text-white",
      borderColor: "border-t-[#FDB81E]",
    },
    {
      id: 2,
      icon: <FileText className="w-8 h-8 text-[#003A56]" />,
      iconBg: "bg-blue-50",
      title: "Auto Captions",
      description: "Generate perfectly timed captions with speaker detection",
      buttonColor: "bg-[#003A56] hover:bg-[#004A6B] text-white",
      borderColor: "border-t-[#003A56]",
    },
    {
      id: 3,
      icon: <Maximize className="w-8 h-8 text-[#FDB81E]" />,
      iconBg: "bg-yellow-50",
      title: "Smart Framing",
      description:
        "Auto-crop to vertical format with intelligent face tracking",
      buttonColor: "bg-[#003A56] hover:bg-[#004A6B] text-white",
      borderColor: "border-t-[#FDB81E]",
    },
  ];
  const cards = [
    {
      title: "Total Clip Views",
      value: "847K",
      change: "↑ 23% this month",
      color: "border-yellow-400",
    },
    {
      title: "Clips Created",
      value: "342",
      change: "↑ 15% this month",
      color: "border-blue-600",
    },
    {
      title: "Avg. Virality Score",
      value: "8.4/10",
      change: "↑ 0.8 this month",
      color: "border-yellow-400",
    },
  ];
  return (
    <div className=" flex flex-col ">
      <Navbar />
      <div className="flex-1 bg-white">
        {/* Hero Section */}
        <div className="hero-gradient py-16 w-full bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* AI Status Indicator */}
            <div className="flex justify-center space-x-4">
              <div className="inline-flex items-center space-x-2 bg-secondary px-4 py-2 rounded-full border border-border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary">
                  AI-Powered Content Creation
                </span>
              </div>

              {aiProfileComplete && (
                <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-primary">AI Personalized</span>
                </div>
              )}
            </div>
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">Build Your </span>
                <span className="text-white">Content </span>
                <span className="text-white">Kingdom </span>
                <br />
                <span className="text-3xl text-primary">Rule Your </span>
                <span className="text-3xl text-primary">Influence</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                ContentRealm™ is your gateway to turning every word you speak
                into content that dominates the digital realm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {userLoggedin ? (
                  <Link
                    href="/upload"
                    className="btn-primary text-lg px-8 py-2 hover:scale-105 transition-transform duration-200"
                  >
                    Start Creating clips
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="btn-primary text-lg px-8 py-2 hover:scale-105 transition-transform duration-200"
                  >
                    Get Started
                  </Link>
                )}

                <Link
                  href="/pricing"
                  className="border border-gray-500 rounded-md text-lg px-8 py-2 hover:scale-105 transition-transform duration-200 hover:text-black"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
          {/* AI Profile Setup */}
          {/* {showProfileSetup && (
            <AIProfileSetup onComplete={handleProfileComplete} />
          )} */}

          {/* Your Voice Deserves a Throne Section */}
          <div className="text-center mb-16">
            {/* <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
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
            )} */}
            <div>
              <h1 className="text-background font-bold text-3xl p-4">
                Upload Your Videos
              </h1>
              <h2 className="text-background text-lg p-4">
                Transform your long-form content into viral short clips in
                minutes
              </h2>
              <div className="relative w-[60%] m-auto border-2  text-background border-dashed rounded-2xl p-12 transition-all duration-300 hover:text-primary hover:border-primary hover:shadow-lg hover:text-primary">
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Video Icon */}
                  <div className="flex items-center justify-center">
                    <VideoIcon
                      size={50}
                      className="  hover:scale-105 transform-transition duration-300"
                    />
                  </div>

                  {/* Upload Text */}
                  <div className="text-center">
                    <p className="text-lg text-gray-700 mb-2">
                      Drag & Drop your video files here (MP4, MOV, AVI)
                    </p>
                  </div>
                  {userLoggedin ? (
                    <Link href="/upload">
                      <div className="bg-[#FDB81E] hover:cursor-pointer hover:bg-[#E5A610] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                        Browse Videos
                      </div>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <div className="bg-[#FDB81E] hover:cursor-pointer hover:bg-[#E5A610] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                        Browse Videos
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats
          <DashboardStats /> */}
          <div className="w-full max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#003A56] mb-4">
                AI-Powered Clip Generation
              </h2>
              <p className="text-lg text-gray-600">
                Our AI analyzes your videos and creates ready-to-post clips with
                intelligent features
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-t-4 ${feature.borderColor} overflow-hidden`}
                >
                  <div className="p-8">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6`}
                    >
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#003A56] mb-3">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Button */}
                    <button
                      className={`w-full ${feature.buttonColor}  font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg `}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Main Content Grid */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
         
            <div className="lg:col-span-1">
              <QuickActions showAITools={aiProfileComplete} />
            </div>

         
            <div className="lg:col-span-2 space-y-8">
              <RecentContent />
              <PerformanceInsights />
            </div>
          </div> */}
          <div className="w-full min-h-screen  from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full ">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#003A56] mb-4">
                  Schedule & Publish Clips
                </h1>
                <p className="text-lg text-gray-600">
                  Distribute your content across all major platforms
                  effortlessly
                </p>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Left Side - Text & Button */}
                  <div className="flex-1">
                    <p className="text-[#003A56] text-lg leading-relaxed mb-6">
                      Post your clips directly to TikTok, Instagram Reels,
                      YouTube Shorts, and more with our integrated publishing
                      tools.
                    </p>

                    <button className="bg-[#FDB81E] hover:bg-[#E5A610] text-[#003A56] font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                      Connect Social Accounts
                    </button>
                  </div>

                  {/* Right Side - Platform Icons */}
                  <div className="flex gap-4">
                    {socialPlatforms.map((platform, index) => (
                      <div
                        key={index}
                        className={`${platform.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300 shadow-md`}
                      >
                        {platform.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* AI Tools Preview (if profile complete) */}
          {/* {aiProfileComplete && (
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
          )} */}

          {/* Main Content */}
          <div className="max-w-7xl ">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-3">
                Clip Analytics
              </h2>
              <p className="text-slate-600">
                Track views, engagement, and virality scores of your clips in
                real-time
              </p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-8 border-l-4 ${card.color} hover:shadow-lg  hover:scale-105 transition-all duration-300`}
                >
                  <h3 className="text-slate-600 font-medium text-sm mb-4">
                    {card.title}
                  </h3>
                  <div className="text-4xl font-bold text-yellow-500 mb-2">
                    {card.value}
                  </div>
                  <div className="text-slate-500 text-sm">{card.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
