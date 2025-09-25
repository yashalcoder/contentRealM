"use client";
import { useEffect, useState } from "react";
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

export default function ContentLibrary({ userId, filter, searchTerm }) {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [contentClipsData, setContentClipsData] = useState({});
  const [loadingClips, setLoadingClips] = useState({});
  const [previewClip, setPreviewClip] = useState(null); // clip object being previewed
  const router = useRouter();
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${endpoint}/my-posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

          setContentItems(mappedContent);

          // Fetch clips for video content items
          await fetchClipsForAllVideos(mappedContent);
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
  }, [userId, endpoint]);

  const fetchClipsForAllVideos = async (contentList) => {
    try {
      const token = localStorage.getItem("access_token");
      const newContentClipsData = {};

      for (const content of contentList) {
        if (content.hasVideo) {
          try {
            setLoadingClips((prev) => ({ ...prev, [content.id]: true }));

            // Updated API endpoint to match backend
            const clipsRes = await fetch(
              `${endpoint}/api/clips/content/${content.id}/clips`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (clipsRes.ok) {
              const clipsData = await clipsRes.json();
              console.log(`Clips for content ${content.id}:`, clipsData);
              newContentClipsData[content.id] = clipsData;
            } else {
              console.log(
                `No clips found for content ${content.id}:`,
                clipsRes.status
              );
              newContentClipsData[content.id] = { clips: [] };
            }
          } catch (error) {
            console.error(
              `Error fetching clips for content ${content.id}:`,
              error
            );
            newContentClipsData[content.id] = { clips: [] };
          } finally {
            setLoadingClips((prev) => ({ ...prev, [content.id]: false }));
          }
        }
      }

      setContentClipsData(newContentClipsData);
    } catch (error) {
      console.error("Error fetching clips:", error);
    }
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleDownloadClip = async (clipFilename) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${endpoint}/api/clips/download/${clipFilename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = clipFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Download failed:", response.status, response.statusText);
        alert("Failed to download clip");
      }
    } catch (error) {
      console.error("Error downloading clip:", error);
      alert("Error downloading clip");
    }
  };
  const VideoPreview = ({ clip }) => (
    <video controls width={600}>
      <source
        src={`${endpoint}/clips/${clip.clip_filename}`}
        type="video/mp4"
      />
      {clip.captions_filename && (
        <track
          label="English"
          kind="subtitles"
          src={`${endpoint}/clips/${clip.captions_filename}`}
          default
        />
      )}
      Your browser does not support the video tag.
    </video>
  );

  // Enhanced function to properly enable captions
  const handleVideoLoad = (videoElement) => {
    if (!videoElement) return;

    console.log("Video loaded, checking for text tracks...");

    // Wait a moment for tracks to load
    setTimeout(() => {
      const textTracks = videoElement.textTracks;
      console.log(`Found ${textTracks.length} text tracks`);

      if (textTracks.length > 0) {
        const track = textTracks[0];
        track.mode = "showing";
        console.log(`Caption track mode set to: ${track.mode}`);
        console.log(`Track kind: ${track.kind}, language: ${track.language}`);

        // Add event listeners for track events
        track.addEventListener("load", () => {
          console.log("Track loaded successfully");
        });

        track.addEventListener("error", (e) => {
          console.error("Track error:", e);
        });
      } else {
        console.log("No text tracks found");
      }
    }, 500); // Small delay to ensure tracks are loaded
  };

  const getClipsForContent = (contentId) => {
    return contentClipsData[contentId]?.clips || [];
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading posts...</span>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-900/30 border border-red-600/30 rounded-lg">
        <p className="text-red-300">Error: {error}</p>
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

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const itemClips = getClipsForContent(item.id);
          const isLoadingClips = loadingClips[item.id];

          return (
            <div
              key={item.id}
              className="card hover:border-primary transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg object-cover bg-input text-white flex items-center justify-center text-2xl">
                  {item.type === "video" || item.type === "youtube" ? (
                    <FaVideo />
                  ) : item.type === "audio" ? (
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
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300">
                      {item.status}
                    </span>
                    {item.hasVideo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-900/30 text-purple-300">
                        🎬 Video Content
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Generated Content:
                </p>
                <div className="bg-secondary/30 p-3 rounded-md">
                  <p className="text-white text-sm line-clamp-3">
                    {item.content || "No content preview available"}
                  </p>
                </div>
              </div>

              {/* Formats/Outputs */}
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
                  {item.hasVideo && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-900/30 text-purple-300 border border-purple-600/30">
                      {isLoadingClips
                        ? "🔄 Loading clips..."
                        : `🎬 ${itemClips.length} Clips`}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <Link href={`/view-content/${item.id}`}>
                  <div className="flex-1 btn-primary text-sm py-2 text-center">
                    View Content
                  </div>
                </Link>

                {item.hasVideo && (
                  <Link href={`/view-clips/${item.id}`}>
                    <button
                      // onClick={() => toggleExpanded(item.id)}

                      className="px-3 py-2 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg hover:border-purple-500/50 bg-purple-900/20"
                      title="View clips"
                      disabled={isLoadingClips}
                    >
                      {isLoadingClips ? "🔄" : "🎬"}
                    </button>
                  </Link>
                )}

                <button className="px-3 py-2 text-muted-foreground hover:text-white border border-border rounded-lg hover:border-ring">
                  ⋯
                </button>
              </div>

              {/* Expanded Clips Section */}
              {expandedItems.has(item.id) && item.hasVideo && (
                <div className="mt-4 p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
                  <h4 className="text-purple-300 font-medium mb-3 flex items-center space-x-2">
                    <span>🎬</span>
                    <span>Video Clips</span>
                  </h4>

                  {isLoadingClips ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto mb-2"></div>
                      <p className="text-purple-300/70 text-sm">
                        Loading clips...
                      </p>
                    </div>
                  ) : itemClips.length > 0 ? (
                    <div className="space-y-4">
                      {itemClips.slice(0, 3).map((clip, clipIndex) => (
                        <div
                          key={clipIndex}
                          className="bg-purple-900/30 p-4 rounded-md"
                        >
                          {/* Clip Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-purple-100 text-sm font-medium">
                                {clip.reason ||
                                  clip.title ||
                                  `Clip ${clipIndex + 1}`}
                              </p>
                              <p className="text-purple-300 text-xs">
                                {clip.start} - {clip.end} • Duration:{" "}
                                {clip.duration}s
                              </p>
                              {clip.file_size && (
                                <p className="text-purple-300 text-xs">
                                  {(clip.file_size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Video Preview with Captions */}
                          {clip.clip_filename && (
                            <div className="mb-3">
                              <video
                                controls
                                className="w-full h-40 object-cover rounded bg-black"
                                src={`${endpoint}/api/clips/serve/${clip.clip_filename}`}
                                preload="metadata"
                                onLoadedMetadata={(e) =>
                                  handleVideoLoad(e.target)
                                }
                                crossOrigin="anonymous"
                              >
                                {clip.captions_filename && (
                                  <track
                                    key={`${clip.id}-${clip.captions_filename}`} // ✅ force unique track
                                    src={`${endpoint}/api/clips/serve/${clip.captions_filename}`}
                                    kind="subtitles"
                                    srcLang="en"
                                    label="English"
                                    default
                                  />
                                )}
                              </video>

                              {/* Caption Status Indicator */}
                              {clip.captions_filename && (
                                <div className="mt-1 flex items-center text-xs text-purple-300/70">
                                  <FaClosedCaptioning className="mr-1" />
                                  <span>
                                    Captions available - enable in video player
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Thumbnail Preview (smaller, secondary) */}
                          {clip.thumbnail_filename && (
                            <div className="mb-3">
                              <p className="text-xs text-purple-300/70 mb-1">
                                Thumbnail:
                              </p>
                              <img
                                src={`${endpoint}/api/clips/serve/${clip.thumbnail_filename}`}
                                alt={`Thumbnail for ${clip.reason || "Clip"}`}
                                className="w-20 h-12 object-cover rounded bg-gray-800 border border-purple-600/30"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {/* Download Video */}
                            {clip.clip_filename && (
                              <button
                                onClick={() =>
                                  handleDownloadClip(clip.clip_filename)
                                }
                                className="flex-1 min-w-0 p-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center justify-center space-x-1"
                                title="Download video clip"
                              >
                                <FaDownload size={10} />
                                <span>Download MP4</span>
                              </button>
                            )}

                            {/* Download Thumbnail */}
                            {clip.thumbnail_filename && (
                              <button
                                onClick={() =>
                                  handleDownloadClip(clip.thumbnail_filename)
                                }
                                className="flex-1 min-w-0 p-2 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center justify-center space-x-1"
                                title="Download thumbnail"
                              >
                                <FaImage size={10} />
                                <span>Thumbnail</span>
                              </button>
                            )}

                            {/* Download Captions (separate file if needed) */}
                            {clip.captions_filename && (
                              <button
                                onClick={() =>
                                  handleDownloadClip(clip.captions_filename)
                                }
                                className="flex-1 min-w-0 p-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center justify-center space-x-1"
                                title="Download captions file"
                              >
                                <FaClosedCaptioning size={10} />
                                <span>SRT File</span>
                              </button>
                            )}

                            {/* Preview in New Tab */}
                            {clip.clip_filename && (
                              <button
                                onClick={() => setPreviewClip(clip)}
                                className="flex-1 min-w-0 p-2 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 flex items-center justify-center space-x-1"
                                title="Preview video"
                              >
                                <FaPlay size={10} />
                                <span>Preview</span>
                              </button>
                            )}
                          </div>

                          {/* Assets Info */}
                          <div className="mt-2 flex justify-center space-x-4 text-xs text-purple-300/70">
                            {clip.clip_filename && (
                              <span className="flex items-center space-x-1">
                                <FaVideo size={8} />
                                <span>MP4</span>
                              </span>
                            )}
                            {clip.captions_filename && (
                              <span className="flex items-center space-x-1">
                                <FaClosedCaptioning size={8} />
                                <span>Captions</span>
                              </span>
                            )}
                            {clip.thumbnail_filename && (
                              <span className="flex items-center space-x-1">
                                <FaImage size={8} />
                                <span>Thumbnail</span>
                              </span>
                            )}
                          </div>

                          {/* Debug info for development */}
                          {process.env.NODE_ENV === "development" && (
                            <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs text-gray-400">
                              <p>Clip ID: {clip.id}</p>
                              <p>Exists: {clip.exists ? "Yes" : "No"}</p>
                              {clip.clip && <p>Path: {clip.clip}</p>}
                            </div>
                          )}
                        </div>
                      ))}

                      {itemClips.length > 3 && (
                        <div className="text-center">
                          <Link href={`/view-content/${item.id}`}>
                            <span className="text-purple-400 hover:text-purple-300 text-sm">
                              View all {itemClips.length} clips →
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-purple-300/50 mb-2 text-2xl">🎬</div>
                      <p className="text-purple-300/70 text-sm">
                        No clips available
                      </p>
                      <p className="text-purple-400/50 text-xs">
                        Clips are generated during video processing
                      </p>
                    </div>
                  )}
                </div>
              )}
              {/* Video Preview Modal */}
              {previewClip && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
                  <div className="bg-gray-900 rounded-lg p-4 max-w-3xl w-full relative">
                    <button
                      className="absolute top-2 right-2 text-white text-xl font-bold"
                      onClick={() => setPreviewClip(null)}
                    >
                      ×
                    </button>

                    {/* In your preview modal */}
                    <video
                      controls
                      autoPlay
                      className="w-full h-auto bg-red-500 text-black"
                      onLoadedData={(e) => handleVideoLoad(e.target)}
                      onLoadedMetadata={(e) => handleVideoLoad(e.target)} // Additional trigger
                      crossOrigin="anonymous"
                      onError={(e) => console.error("Video error:", e)}
                    >
                      <source
                        src={`${endpoint}/api/clips/serve/${previewClip.clip_filename}`}
                        type="video/mp4"
                      />
                      {previewClip.captions_filename && (
                        <track
                          src={`${endpoint}/api/clips/serve/${previewClip.captions_filename}`}
                          kind="subtitles"
                          srcLang="en"
                          label="English"
                          default
                          onLoad={() => console.log("VTT track loaded")}
                          onError={(e) => console.error("VTT track error:", e)}
                        />
                      )}
                      <div className="bg-white text-black">
                        {previewClip.captions_filename}
                      </div>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* Quick Actions for Video Content */}
              {item.hasVideo &&
                !expandedItems.has(item.id) &&
                itemClips.length > 0 && (
                  <div className="mt-3 p-3 bg-purple-900/10 border border-purple-600/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 text-sm">
                        🎬 {itemClips.length} clips available
                      </span>
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        View clips →
                      </button>
                    </div>
                  </div>
                )}

              {/* URL Preview for YouTube content */}
              {item.type === "youtube" && item.url && (
                <div className="mt-3 p-2 bg-red-900/20 border border-red-600/30 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 text-sm">📺</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-300 hover:text-red-200 text-xs truncate flex-1"
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
        <div className="text-center py-12">
          <div className="text-muted-foreground text-4xl mb-4">📄</div>
          <h3 className="text-white text-lg font-medium mb-2">
            No content found
          </h3>
          <p className="text-muted-foreground">
            {filter === "all"
              ? "Upload some content to get started"
              : `No ${filter} content found. Try a different filter or search term.`}
          </p>
        </div>
      )}
    </div>
  );
}
