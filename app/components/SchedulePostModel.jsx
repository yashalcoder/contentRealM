"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  content_id,
  currentUser,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const availablePlatforms = [
    { id: "facebook", name: "Facebook", color: "bg-blue-800" },
    { id: "instagram", name: "Instagram", color: "bg-pink-600" },
    { id: "linkedin", name: "LinkedIn", color: "bg-blue-600" },
    { id: "twitter", name: "Twitter", color: "bg-blue-400" },
  ];
  const token = localStorage.getItem("access_token") || "";
  // Fetch connected platforms when modal opens
  useEffect(() => {
    if (isOpen && currentUser?.id) {
      fetchConnectedPlatforms();
    }
  }, [isOpen, currentUser]);

  const fetchConnectedPlatforms = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${endpoint}/getConnectedPlatforms?user_id=${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // If you're using JWT
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setConnectedPlatforms(data.platforms || []);
      } else {
        setError("Failed to fetch connected platforms");
      }
    } catch (err) {
      setError("Error fetching platforms: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platform) => {
    if (!currentUser?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${endpoint}/connect-platform/${platform}?user_id=${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Open Ayrshare connection in new window
        const newWindow = window.open(
          data.connect_url,
          "_blank",
          "width=600,height=600"
        );

        // Listen for window close (user completed connection)
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkClosed);
            // Refresh connected platforms after connection
            setTimeout(() => {
              fetchConnectedPlatforms();
            }, 1000);
          }
        }, 1000);
      } else {
        setError(data.message || "Failed to get connection URL");
      }
    } catch (err) {
      setError("Error connecting platform: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformSelection = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms((prev) => prev.filter((p) => p !== platformId));
    } else {
      setSelectedPlatforms((prev) => [...prev, platformId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform");
      return;
    }

    if (!selectedDate || selectedDate <= new Date()) {
      setError("Please select a future date and time");
      return;
    }

    try {
      setLoading(true);

      // Schedule the post
      const scheduleData = {
        content_id: content_id,
        user_id: currentUser.id,
        platforms: selectedPlatforms,
        scheduled_at: selectedDate.toISOString(),
      };

      const response = await fetch(`${endpoint}/schedule-post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();

      if (data.status === "success") {
        onSchedule &&
          onSchedule({
            date: selectedDate,
            platforms: selectedPlatforms,
          });
        onClose();
      } else {
        setError(data.message || "Failed to schedule post");
      }
    } catch (err) {
      setError("Error scheduling post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectPlatform = async (platformId) => {
    try {
      setLoading(true);
      const response = await fetch(`${endpoint}/disconnect-platform`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          platform: platformId,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setConnectedPlatforms((prev) => prev.filter((p) => p !== platformId));
        setSelectedPlatforms((prev) => prev.filter((p) => p !== platformId));
      } else {
        setError(data.message || "Failed to disconnect platform");
      }
    } catch (err) {
      setError("Error disconnecting platform: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Schedule Post
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Platform Connections */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
            Platform Connections
          </h3>

          <div className="space-y-2">
            {availablePlatforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id);

              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${platform.color}`}
                    ></div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {platform.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <>
                        <span className="text-green-600 text-sm font-medium">
                          Connected
                        </span>
                        <button
                          onClick={() => handleDisconnectPlatform(platform.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnectPlatform(platform.id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? "Connecting..." : "Connect"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="mb-6">
          <label className="block mb-2 text-black dark:text-gray-200 font-medium">
            Schedule Date & Time
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="PPpp"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-black text-white dark:bg-gray-700 dark:text-gray-100"
            placeholderText="Select date and time"
            // Enable manual typing
            showTimeInput
            timeInputLabel="Time:"
            // Allow keyboard input
            allowSameDay
          />
        </div>

        {/* Platform Selection for Posting */}
        <div className="mb-6">
          <label className="block mb-3 text-gray-700 dark:text-gray-200 font-medium">
            Select Platforms to Post
          </label>

          <div className="grid grid-cols-2 gap-2">
            {availablePlatforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id);
              const isSelected = selectedPlatforms.includes(platform.id);

              return (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformSelection(platform.id)}
                  disabled={!isConnected || loading}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : isConnected
                      ? "border-gray-300 dark:border-gray-600 hover:border-blue-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      : "border-gray-200 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${platform.color} ${
                        !isConnected && "opacity-30"
                      }`}
                    ></div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  {!isConnected && (
                    <div className="text-xs text-gray-500 mt-1">
                      Not connected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedPlatforms.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Scheduling..." : "Schedule Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
