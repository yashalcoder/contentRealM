"use client";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createApiFetch } from "./ApiFetch";
function ContentCalendar() {
  const router = useRouter();
  const apiFetch = createApiFetch();
  const endpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8000";

  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPosts, setSelectedPosts] = useState([]);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUserId(payload.user_id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const res = await apiFetch(
          `${endpoint}/scheduled-posts?user_id=${userId}`
        );
        const data = await res.json();

        if (data.status === "success") {
          const pendingPosts = data.scheduled_posts.filter(
            (post) => post.status === "pending"
          );
          setPosts(pendingPosts);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching scheduled posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  // Get posts for a specific date
  const getPostsForDate = (date) => {
    return posts.filter((post) => {
      if (!post.scheduled_at) return false;
      const postDate = new Date(post.scheduled_at);
      return postDate.toDateString() === date.toDateString();
    });
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get calendar days
  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks * 7 days

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const postsForDate = getPostsForDate(date);
    setSelectedPosts(postsForDate);
  };

  // Cancel scheduled post
  const cancelPost = async (postId) => {
    try {
      const res = await apiFetch(
        `${endpoint}/scheduled-posts/${postId}?user_id=${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        setPosts(posts.filter((post) => post.id !== postId));
        setSelectedPosts(selectedPosts.filter((post) => post.id !== postId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error canceling post:", err);
      alert("Failed to cancel post");
    }
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Platform colors
  const platformColors = {
    facebook: "bg-blue-500",
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    twitter: "bg-sky-400",
    linkedin: "bg-blue-600",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Content Calendar</h1>
            <p className="text-gray-400">
              Plan and schedule your content to rule your digital kingdom
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Calendar Section */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Content Calendar</h2>
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="text-xl font-semibold min-w-[200px] text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </div>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Days of the week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-gray-300 py-4"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth;
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();
                  const postsForDate = getPostsForDate(date);
                  const hasContent = postsForDate.length > 0;

                  return (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      className={`
                        h-24 p-3 cursor-pointer rounded-lg border-2 transition-all duration-200 hover:border-yellow-400
                        ${
                          !isCurrentMonth
                            ? "text-gray-500 bg-gray-800/30 border-gray-700/50"
                            : "border-gray-600"
                        }
                        ${isToday ? "border-yellow-400 bg-yellow-400/10" : ""}
                        ${
                          isSelected ? "bg-yellow-400/20 border-yellow-400" : ""
                        }
                        ${hasContent && !isSelected ? "bg-gray-700/50" : ""}
                      `}
                    >
                      <div className="font-semibold text-lg mb-1">
                        {date.getDate()}
                      </div>
                      {hasContent && (
                        <div className="space-y-1">
                          <div className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full inline-block">
                            {postsForDate.length} post
                            {postsForDate.length > 1 ? "s" : ""}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scheduled Posts Section */}
          <div className="w-96">
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">Scheduled Posts</h3>
              </div>

              <div className="mb-6 text-gray-400">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedPosts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No posts scheduled</p>
                    <p className="text-sm">for this date</p>
                  </div>
                ) : (
                  selectedPosts.map((post) => (
                    <div key={post.id} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-yellow-400" />
                          <span className="font-semibold">
                            {formatTime(post.scheduled_at)}
                          </span>
                        </div>
                        <button
                          onClick={() => cancelPost(post.id)}
                          className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded"
                          title="Cancel post"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* <p className="text-gray-300 mb-4 leading-relaxed">
                        {post.content}
                      </p> */}

                      {post.media_url && (
                        <div className="mb-4">
                          <h1>{post.media_url}</h1>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.platforms.map((platform) => (
                          <span
                            key={platform}
                            className={`
                              text-sm px-3 py-1 rounded-full text-white capitalize font-medium
                              ${platformColors[platform] || "bg-gray-500"}
                            `}
                          >
                            {platform}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-sm text-gray-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        Status: {post.status}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Stats */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="font-semibold mb-4 text-gray-300">
                  This Month Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-400">Scheduled</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {
                        posts.filter(
                          (p) => new Date(p.scheduled_at) < new Date()
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-400">Published</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentCalendar;
