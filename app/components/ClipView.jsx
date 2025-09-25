"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { FaDownload, FaImage, FaPlay } from "react-icons/fa";
import ScheduleModal from "./SchedulePostModel";
import Navbar from "./Navbar";

export default function ViewClipsPage() {
  const { id } = useParams(); // content_id from URL
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewClip, setPreviewClip] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Helper function to extract filename from full path
  const extractFilename = (filePath) => {
    if (!filePath) return null;
    // Handle both Windows and Unix paths
    return filePath.split(/[/\\]/).pop();
  };

  // ✅ Group clips by baseId with debugging
  function groupClips(clips) {
    console.log("🔍 RAW CLIPS DATA:", clips);

    const groups = {};
    clips.forEach((clip, index) => {
      console.log(`🎬 Processing clip ${index}:`, clip);

      const baseId = clip.id.replace(/_(instagram|linkedin|tiktok|x)$/, "");
      console.log(`📍 BaseId for clip ${clip.id}: ${baseId}`);

      if (!groups[baseId]) groups[baseId] = {};

      if (clip.id.endsWith("_instagram")) {
        groups[baseId].instagram = clip;
        console.log(`📱 Added Instagram clip to group ${baseId}`);
      } else if (clip.id.endsWith("_linkedin")) {
        groups[baseId].linkedin = clip;
        console.log(`💼 Added LinkedIn clip to group ${baseId}`);
      } else if (clip.id.endsWith("_tiktok")) {
        groups[baseId].tiktok = clip;
        console.log(`🎵 Added TikTok clip to group ${baseId}`);
      } else if (clip.id.endsWith("_x")) {
        groups[baseId].x = clip;
        console.log(`🐦 Added X clip to group ${baseId}`);
      } else {
        groups[baseId].original = clip;
        console.log(`🎯 Added Original clip to group ${baseId}`);
      }
    });

    const result = Object.entries(groups).map(([baseId, data]) => ({
      baseId,
      ...data,
    }));

    console.log("🏗️ FINAL GROUPED CLIPS:", result);
    return result;
  }

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
    async function fetchClips() {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${endpoint}/api/clips/content/${id}/clips`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        console.log("📡 API RESPONSE:", data);
        console.log("🎬 CLIPS ARRAY:", data.clips);

        setClips(data.clips || []);
      } catch (err) {
        console.error("Error loading clips:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchClips();
  }, [id, endpoint]);

  const handleDownload = async (filename) => {
    try {
      const token = localStorage.getItem("access_token");
      const cleanFilename = extractFilename(filename);
      if (!cleanFilename) {
        alert("Invalid filename");
        return;
      }

      const res = await fetch(
        `${endpoint}/api/clips/download/${cleanFilename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-12 text-white">
        Loading clips...
      </div>
    );

  const groupedClips = groupClips(clips);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="p-6 m-8">
        <h1 className="text-xl font-bold text-white mb-6">
          🎬 View Clips for Content: {title}
        </h1>

        {/* Debug Info
        <div className="mb-4 p-4 bg-red-900/20 rounded-lg border border-red-700">
          <h3 className="text-red-300 font-semibold mb-2">🔍 DEBUG INFO:</h3>
          <p className="text-red-200 text-sm">Total clips: {clips.length}</p>
          <p className="text-red-200 text-sm">
            Grouped clips: {groupedClips.length}
          </p>
          <p className="text-red-200 text-sm">
            Check browser console for detailed logs
          </p>
        </div> */}

        {groupedClips.map((group, groupIndex) => {
          console.log(`🏗️ Rendering group ${groupIndex}:`, group);

          return (
            <div
              key={group.baseId}
              className="mb-10 p-6 bg-purple-800/20 rounded-xl"
            >
              {/* <div className="mb-4 p-2 bg-yellow-900/30 rounded border border-yellow-700">
                <h3 className="text-yellow-300 text-sm font-semibold">
                  Debug Group: {group.baseId}
                </h3>
                <p className="text-yellow-200 text-xs">
                  Has original: {!!group.original} | Has instagram:{" "}
                  {!!group.instagram} | Has linkedin: {!!group.linkedin} | Has
                  tiktok: {!!group.tiktok} | Has x: {!!group.x}
                </p>
              </div> */}

              {/* Original Clip */}
              {group.original && (
                <div className="mb-6">
                  <h2 className="text-white font-semibold mb-3">
                    Original Clip ({group.original.title})
                  </h2>
                  {group.original.clip_filename ? (
                    <video
                      controls
                      className="w-full h-64 rounded bg-black mb-3"
                      crossOrigin="anonymous"
                      onLoadStart={() =>
                        console.log(
                          `🎥 Loading original video: ${group.original.clip_filename}`
                        )
                      }
                      onError={(e) =>
                        console.error(`❌ Original video error:`, e)
                      }
                    >
                      <source
                        src={`${endpoint}/api/clips/serve/${extractFilename(
                          group.original.clip_filename
                        )}`}
                        type="video/mp4"
                      />
                      {group.original.captions && (
                        <track
                          src={`${endpoint}/api/clips/serve/${extractFilename(
                            group.original.captions
                          )}`}
                          kind="subtitles"
                          srcLang="en"
                          label="English"
                          default
                        />
                      )}
                    </video>
                  ) : (
                    <p className="text-red-400">
                      ❌ No clip_filename found in original
                    </p>
                  )}
                </div>
              )}

              {/* Platform Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["instagram", "linkedin", "tiktok", "x"].map((platform) => {
                  const clip = group[platform];
                  console.log(`🔍 Platform ${platform} clip:`, clip);

                  return (
                    <div
                      key={platform}
                      className="p-4 bg-purple-900/30 rounded-xl border border-purple-700"
                    >
                      <h3 className="text-purple-300 font-semibold mb-2">
                        {platform.toUpperCase()}
                      </h3>

                      {/* Debug info for each platform */}
                      {/* <div className="mb-2 p-2 bg-gray-800/50 rounded text-xs">
                        <p className="text-gray-300">
                          Clip exists: {!!clip} | Has clip property:{" "}
                          {!!(clip && clip.clip)} | Clip value:{" "}
                          {clip?.clip || "undefined"}
                        </p>
                      </div> */}

                      {clip && clip.clip && (
                        <>
                          <video
                            controls
                            className="w-full h-56 rounded bg-black mb-3"
                            crossOrigin="anonymous"
                            onLoadStart={() =>
                              console.log(
                                `🎥 Loading ${platform} video: ${clip.clip}`
                              )
                            }
                            onError={(e) =>
                              console.error(`❌ ${platform} video error:`, e)
                            }
                          >
                            <source
                              src={`${endpoint}/api/clips/serve/${extractFilename(
                                clip.clip
                              )}`}
                              type="video/mp4"
                            />
                          </video>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleDownload(clip.clip)}
                              className="px-3 py-2 bg-purple-600 text-white rounded flex items-center gap-1 text-sm"
                            >
                              <FaDownload /> MP4
                            </button>
                            {clip.thumbnail && (
                              <button
                                onClick={() => handleDownload(clip.thumbnail)}
                                className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-1 text-sm"
                              >
                                <FaImage /> Thumbnail
                              </button>
                            )}
                            <button
                              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                              onClick={() => setIsScheduleModalOpen(true)}
                            >
                              📅 Post Schedule
                            </button>
                            <button
                              onClick={() => setPreviewClip(clip)}
                              className="px-3 py-2 bg-orange-600 text-white rounded flex items-center gap-1 text-sm"
                            >
                              <FaPlay /> Preview
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Preview Modal */}
        {previewClip && previewClip.clip && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-black dark:bg-gray-800 p-6 rounded-xl w-[700px] max-h-[150vh] overflow-y-auto shadow-lg relative">
              <button
                onClick={() => setPreviewClip(null)}
                className="absolute top-2 right-2 text-white text-xl "
              >
                ×
              </button>
              <video
                controls
                autoPlay
                className="w-full rounded bg-black"
                crossOrigin="anonymous"
              >
                <source
                  src={`${endpoint}/api/clips/serve/${extractFilename(
                    previewClip.clip
                  )}`}
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        )}
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        content_id={id}
        currentUser={user}
      />
    </div>
  );
}
