"use client";
import { useEffect, useState } from "react";
import { FaFileAlt, FaVideo, FaHeadphones } from "react-icons/fa";
import Link from "next/link";
export default function ContentLibrary({ userId, filter, searchTerm }) {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${endpoint}/my-posts/${userId}`);
        const data = await res.json();

        if (data.status === "success") {
          const mappedContent = data.posts.map((post) => ({
            id: post.id,
            title: post.title,
            type: post.FileType, // document, video, audio etc.
            date: "N/A",
            outputs: 1,
            status: "Completed",
            thumbnail: "/placeholder.svg?height=100&width=100",
            formats: ["Original Post"],
            url: post.url,
            content: post.PostContent,
          }));

          setContentItems(mappedContent);
        } else {
          setError(data.message || "Failed to fetch posts");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter by type
  const filteredByType =
    filter === "all"
      ? contentItems
      : contentItems.filter(
          (item) => item.type.toLowerCase() === filter.toLowerCase()
        );

  // Further filter by search term (case insensitive)
  const filteredItems = filteredByType.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card hover:border-primary transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg object-cover bg-input text-white flex items-center justify-center text-2xl">
                {item.type === "Video" ? (
                  <FaVideo />
                ) : item.type === "Audio" ? (
                  <FaHeadphones />
                ) : (
                  <FaFileAlt />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.type} • {item.date}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "Completed"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-yellow-900/30 text-yellow-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                {item.outputs} content pieces generated:
              </p>
              <div className="flex flex-wrap gap-1">
                {item.formats.map((format, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-muted-foreground border border-border"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Link href={`/view-content/${item.id}`}>
                <div className="flex-1 btn-primary text-sm py-2 text-center">
                  View Content
                </div>
              </Link>

              <button className="px-3 py-2 text-muted-foreground hover:text-white border border-border rounded-lg hover:border-ring">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
