// 3. COMPLETE UPDATED AIToolsPage.js component
"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { createApiFetch } from "./ApiFetch";
import { useRouter } from "next/navigation";
export default function AIToolsPage() {
  const router = useRouter();
  const apiFecth = createApiFetch();
  const [selectedBot, setSelectedBot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null); // ✅ ADD THIS STATE
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const bots = [
    {
      id: "coach",
      name: "RealmGPT Coach™",
      description:
        "AI coach to help speakers practice and improve their presentation skills",
      icon: "🎯",
      gradient: "from-blue-500 to-blue-700",
      features: [
        "Speech Analysis",
        "Practice Sessions",
        "Improvement Tips",
        "Confidence Building",
      ],
    },
    {
      id: "drop",
      name: "RealmDrop™",
      description:
        "Automatically repurpose long talks into short clips and social posts",
      icon: "📱",
      gradient: "from-purple-500 to-purple-700",
      features: [
        "Video Clipping",
        "Social Posts",
        "Quote Extraction",
        "Multi-Platform",
      ],
    },
    {
      id: "search",
      name: "RealmSearch™",
      description: "Help speakers find new speaking opportunities and events",
      icon: "🔍",
      gradient: "from-green-500 to-green-700",
      features: [
        "Event Discovery",
        "Podcast Matching",
        "Conference Finder",
        "Networking",
      ],
    },
    {
      id: "rep",
      name: "RealmRep™",
      description: "Manage reviews, bookings, and your professional reputation",
      icon: "⭐",
      gradient: "from-yellow-500 to-yellow-700",
      features: [
        "Booking Management",
        "Review Tracking",
        "Portfolio Building",
        "Client Relations",
      ],
    },
    {
      id: "cast",
      name: "RealmCast™",
      description: "Streaming and recording platform assistant for wider reach",
      icon: "📺",
      gradient: "from-red-500 to-red-700",
      features: [
        "Live Streaming",
        "Recording Setup",
        "Audience Engagement",
        "Platform Selection",
      ],
    },
  ];

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || !selectedBot) return;

    const userMessage = {
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please log in to continue");
      }

      // ✅ FIX: Correct API endpoint and add auth header
      const response = await apiFecth(`${endpoint}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message,
          bot_type: selectedBot.id,
          session_id: currentSessionId, // Now this is defined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        type: "bot",
        content: data.response,
        suggestions: data.suggestions || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Store session ID for future messages
      if (data.session_id) {
        setCurrentSessionId(data.session_id);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to chat
      const errorMessage = {
        type: "bot",
        content: `I'm having trouble connecting right now: ${error.message}. Please try again in a moment.`,
        suggestions: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const selectBot = (bot) => {
    setSelectedBot(bot);
    setCurrentSessionId(null); // ✅ Reset session when switching bots
    setMessages([
      {
        type: "bot",
        content: `👋 Hello! I'm ${bot.name}. ${bot.description}. How can I help you dominate your content realm today?`,
        suggestions: [],
        timestamp: new Date(),
      },
    ]);
  };

  // ✅ REST OF THE COMPONENT REMAINS THE SAME...
  if (selectedBot) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${selectedBot.gradient} rounded-xl p-6 mb-8 text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedBot.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold">{selectedBot.name}</h1>
                  <p className="opacity-90">{selectedBot.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBot(null);
                  setCurrentSessionId(null);
                  setMessages([]);
                }}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to Tools
              </button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Features Sidebar */}
            <div className="lg:col-span-1 ">
              <div className="card bg-white text-black sticky top-8">
                <h3 className="font-semibold text-black mb-4">Key Features</h3>
                <div className="space-y-2">
                  {selectedBot.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-black"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full text-black"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Main */}
            <div className="lg:col-span-3 ">
              <div className="card bg-white text-black">
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6 ">
                  {messages.map((message, index) => (
                    <div key={index}>
                      <div
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-sm lg:max-w-md px-4 py-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-primary text-white"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed text-black">
                            {message.content}
                          </p>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {message.suggestions &&
                        message.suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 bg-gray-200 justify-start">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => sendMessage(suggestion)}
                                className="text-xs px-3 py-2 bg-secondary text-muted-foreground rounded-full hover:bg-primary hover:text-white transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary px-4 py-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-3 pt-4 border-t border-border">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !loading && sendMessage()
                    }
                    placeholder={`Ask ${selectedBot.name} anything...`}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !inputMessage.trim()}
                    className="bg-primary text-black bg-gray-200 px-6 py-3 rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors font-medium"
                  >
                    {loading ? "..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="hero-gradient py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-6">
                <span className="text-white">Realm AI </span>
                <span className="text-primary">Tools Suite</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Five specialized AI assistants to dominate every aspect of your
                content kingdom
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => selectBot(bot)}
                className="card border border-gray-200  shadow-lg hover:scale-105 transition-all duration-300 bg-white  transition-all duration-300 cursor-pointer  group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${bot.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {bot.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  {bot.name}
                </h3>
                <p className="text-muted-foreground mb-4">{bot.description}</p>

                <div className="space-y-2 mb-4">
                  {bot.features.slice(0, 3).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-background text-white py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium">
                  Start Chatting →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
