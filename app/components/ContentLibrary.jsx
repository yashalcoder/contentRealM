"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FaFileAlt,
  FaVideo,
  FaHeadphones,
  FaDownload,
  FaPlay,
  FaClosedCaptioning,
  FaImage,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createApiFetch } from "./ApiFetch";
import ContentFilters from "./ContentFilters";
export default function ContentLibrary({
  userId,
  filter,
  searchTerm,
  setActiveFilter,
  setSearchTerm,
}) {
  const router = useRouter();
  const apiFetch = createApiFetch();
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track if component is mounted
  const isMountedRef = useRef(true);

  // Session expiry handler
  const handleSessionExpiry = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    alert("Session expired. Please login again.");
    router.push("/login");
  }, [router]);

  // Enhanced fetch with session handling
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        handleSessionExpiry();
        return null;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle 401 Unauthorized (session expired)
      if (response.status === 401) {
        handleSessionExpiry();
        return null;
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`${endpoint}/my-posts/${userId}`);

        if (!res) return; // Session expired

        const data = await res.json();

        if (data.status === "success") {
          const mappedContent = data.posts.map((post) => ({
            id: post.id,
            title: post.title,
            type: post.FileType,
            date: post.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : "N/A",
            outputs: 1,
            status: "Completed",
            thumbnail: "/placeholder.svg?height=100&width=100",
            formats: ["Original Post"],
            url: post.url,
            content: post.PostContent,
            hasVideo: post.FileType === "video" || post.FileType === "youtube",
          }));

          if (isMountedRef.current) {
            setContentItems(mappedContent);
          }
        } else {
          setError(data.message || "Failed to fetch posts");
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    if (userId) {
      fetchPosts();
    }
  }, [userId]); // Removed endpoint dependency to prevent re-fetching

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-gray-600">Loading posts...</span>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );

  // Filter logic
  const filteredByType =
    filter === "all"
      ? contentItems
      : contentItems.filter(
          (item) => item.type.toLowerCase() === filter.toLowerCase()
        );

  const filteredItems = filteredByType.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalVideos = contentItems.filter((item) => item.hasVideo).length;
  const totalClips = contentItems.length;
  const storageUsed = (contentItems.length * 2.5).toFixed(2);

  return (
    <div className=" min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Content Library
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage all your uploaded videos and clips
            </p>
          </div>
          <Link href="/upload">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-background text-white font-medium rounded-lg hover:bg-primary transition-colors">
              <span>↑</span>
              <span>Upload New</span>
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Total Videos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Videos</p>
                <p className="text-4xl font-bold text-gray-800">
                  {totalVideos}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Clips */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clips</p>
                <p className="text-4xl font-bold text-gray-800">{totalClips}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Storage Used */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                <p className="text-4xl font-bold text-gray-800">
                  {storageUsed} MB
                </p>
              </div>
              <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <ContentFilters
          setActiveFilter={setActiveFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-teal-600 transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-2xl">
                    {item.type === "video" || item.type === "youtube" ? (
                      <FaVideo />
                    ) : item.type === "audio" ? (
                      <FaHeadphones />
                    ) : (
                      <FaFileAlt />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.type} • {item.date}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {item.status}
                      </span>
                      {item.hasVideo && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                          🎬 Video Content
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Generated Content:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {item.content || "No content preview available"}
                    </p>
                  </div>
                </div>

                {/* Formats/Outputs */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {item.outputs} content pieces generated:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.formats.map((format, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {format}
                      </span>
                    ))}
                    {item.hasVideo && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-700 border border-purple-200">
                        🎬 Clips Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <Link href={`/view-content/${item.id}`} className="flex-1">
                    <div className="bg-background text-white text-sm py-2 text-center rounded-lg hover:bg-primary transition-colors font-medium">
                      View Content
                    </div>
                  </Link>

                  {item.hasVideo && (
                    <Link href={`/view-clips/${item.id}`}>
                      <button
                        className="px-3 py-2 text-purple-700 hover:text-purple-800 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
                        title="View video clips"
                      >
                        🎬
                      </button>
                    </Link>
                  )}

                  <button className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50">
                    ⋯
                  </button>
                </div>

                {/* Quick Info for Video Content */}
                {item.hasVideo && (
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-700 text-sm">
                        🎬 Video clips ready to view
                      </span>
                      <Link href={`/view-clips/${item.id}`}>
                        <span className="text-purple-700 hover:text-purple-800 text-xs cursor-pointer font-medium">
                          View clips →
                        </span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* URL Preview for YouTube content */}
                {item.type === "youtube" && item.url && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 text-sm">📺</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 text-xs truncate flex-1"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-800 text-lg font-medium mb-2">
                No videos yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first video to get started
              </p>
              <Link href="/upload">
                <button className="flex items-center gap-2 px-6 py-3 bg-background text-white font-medium rounded-lg hover:bg-primary transition-colors mx-auto">
                  <span>↑</span>
                  <span>Upload Video</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
