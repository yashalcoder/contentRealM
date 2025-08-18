"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "next/navigation";
import ScheduleModal from "./SchedulePostModel";
export default function ContentDetail({ params }) {
  const paramData = useParams();
  console.log("in view contnet", paramData.id);
  const id = paramData.id; // assuming dynamic route [postId].jsx
  console.log("posrtif", id);
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  // For editing form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null); // For user info
  // For platform selection
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: false,
    // add other platforms later
  });

  const [postingStatus, setPostingStatus] = useState(null);

  // ✅ Get token and user only on client side
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUser(payload);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);
  useEffect(() => {
    async function fetchPost() {
      if (!id) return null; // safety check

      try {
        setLoading(true);

        const res = await fetch(`${endpoint}/posts/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          setPost(data.post);
          setTitle(data.post.title);
          setContent(data.post.PostContent);
        } else {
          setError(data.message || "Failed to load post");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleSave() {
    try {
      setPostingStatus("Saving...");
      const res = await fetch(`${endpoint}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, PostContent: content }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setPostingStatus("Saved successfully!");
      } else {
        setPostingStatus("Failed to save: " + (data.message || ""));
      }
    } catch (err) {
      setPostingStatus("Error: " + err.message);
    }
  }

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 bg-background rounded shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

        <label className="block mb-2 font-semibold" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-input text-white"
        />

        <label className="block mb-2 font-semibold" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-input text-white"
        />

        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="btn-primary px-4 py-2 rounded"
          >
            Save Changes
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="btn-primary px-4 py-2 rounded"
          >
            Schedule Post
          </button>
        </div>

        {postingStatus && (
          <p className="mt-4 text-sm text-yellow-300">{postingStatus}</p>
        )}
      </div>
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        content_id={id}
        currentUser={user}
      />
      <Footer />
    </>
  );
}
