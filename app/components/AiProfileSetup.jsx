import React, { useState, useEffect } from "react";
import { createApiFetch } from "./ApiFetch";
import { useRouter } from "next/navigation";
const AIProfileSetup = ({ onComplete }) => {
  const router = useRouter();
  const apiFetch = createApiFetch();
  const [profile, setProfile] = useState({
    industry: "",
    specialization: "",
    experience_level: "intermediate",
    goals: [],
    content_types: [],
  });

  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const industries = [
    { value: "coach", label: "Life/Business Coach" },
    { value: "pastor", label: "Pastor/Minister" },
    { value: "business", label: "Business Professional" },
    { value: "educator", label: "Educator/Trainer" },
    { value: "consultant", label: "Consultant" },
    { value: "speaker", label: "Professional Speaker" },
  ];

  const specializations = {
    coach: [
      "Leadership",
      "Motivation",
      "Business Strategy",
      "Personal Development",
      "Sales",
    ],
    pastor: [
      "Sermons",
      "Bible Teaching",
      "Youth Ministry",
      "Counseling",
      "Community Outreach",
    ],
    business: ["Leadership", "Sales", "Marketing", "Strategy", "Innovation"],
    educator: [
      "Training",
      "Workshops",
      "Online Courses",
      "Presentations",
      "Curriculum",
    ],
    consultant: [
      "Strategy",
      "Process Improvement",
      "Change Management",
      "Advisory",
      "Analysis",
    ],
    speaker: [
      "Keynotes",
      "Motivational Speaking",
      "Corporate Training",
      "Conferences",
      "Workshops",
    ],
  };

  const goalOptions = [
    "Improve speaking skills",
    "Grow my audience",
    "Create more content",
    "Book more speaking gigs",
    "Build my reputation",
    "Monetize my content",
    "Engage better with audience",
  ];

  const contentTypeOptions = [
    "Video presentations",
    "Audio/Podcasts",
    "Written content",
    "Live streaming",
    "Social media posts",
    "Course materials",
  ];
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  useEffect(() => {
    checkAIProfileStatus();
  }, []);

  // 2. UPDATE HomePage.js - checkAIProfileStatus function
  const checkAIProfileStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // ✅ FIX: Correct API endpoint
      const response = await apiFetch(`${endpoint}/api/ai/profile-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("AI Profile Status:", data.profile_complete);
        setAiProfileComplete(data.profile_complete);
        setShowProfileSetup(!data.profile_complete);
      } else {
        console.error("Failed to check profile status");
      }
    } catch (error) {
      console.error("Error checking AI profile:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await apiFetch(`${endpoint}/api/ai/setup-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          industry: profile.industry,
          specialization: profile.specialization,
          experience_level: profile.experience_level,
          goals: profile.goals,
          content_types: profile.content_types,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setShowSetup(false);
        onComplete && onComplete();
      }
    } catch (error) {
      console.error("Profile setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalToggle = (goal) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleContentTypeToggle = (type) => {
    setProfile((prev) => ({
      ...prev,
      content_types: prev.content_types.includes(type)
        ? prev.content_types.filter((t) => t !== type)
        : [...prev.content_types, type],
    }));
  };

  // **If setup not shown, render button card**
  if (!showSetup) {
    return (
      <div className="card mb-6 p-4 bg-secondary rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              🤖 Personalized AI Experience
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Set up your profile to get personalized AI responses based on your
              content and expertise
            </p>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors mt-2 md:mt-0"
          >
            Setup AI Profile
          </button>
        </div>
      </div>
    );
  }

  // **Form for profile setup**
  return (
    <div className="card p-6 bg-secondary rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          🤖 AI Profile Setup
        </h2>
        <p className="text-muted-foreground">
          Help our AI assistants understand your expertise and goals for
          personalized responses
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What's your primary industry?
          </label>
          <select
            value={profile.industry}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                industry: e.target.value,
                specialization: "",
              }))
            }
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select your industry</option>
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>

        {/* Specialization */}
        {profile.industry && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              What's your specialization?
            </label>
            <select
              value={profile.specialization}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select specialization</option>
              {specializations[profile.industry]?.map((spec) => (
                <option key={spec} value={spec.toLowerCase()}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What's your experience level?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["beginner", "intermediate", "expert"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setProfile((prev) => ({ ...prev, experience_level: level }))
                }
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  profile.experience_level === level
                    ? "border-primary bg-primary text-white"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What are your main goals? (Select multiple)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => handleGoalToggle(goal)}
                className={`p-2 rounded-lg border text-sm text-left transition-colors ${
                  profile.goals.includes(goal)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {profile.goals.includes(goal) && "✓ "}
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Content Types */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What type of content do you create? (Select multiple)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {contentTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleContentTypeToggle(type)}
                className={`p-2 rounded-lg border text-sm text-left transition-colors ${
                  profile.content_types.includes(type)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {profile.content_types.includes(type) && "✓ "}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || !profile.industry || !profile.specialization}
            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Setting up..." : "Complete Setup"}
          </button>
          <button
            type="button"
            onClick={() => setShowSetup(false)}
            className="px-6 py-3 border border-border text-muted-foreground rounded-lg hover:text-white hover:border-primary transition-colors"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIProfileSetup;
