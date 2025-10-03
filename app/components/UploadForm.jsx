"use client";
import { FileType } from "lucide-react";
import { useState, useRef } from "react";

export default function UploadForm() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState("video");
  const fileInputRef = useRef(null);
  const [textContent, setTextContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePostNum, setActivePostNum] = useState(null);
  // New states for clips
  const [clips, setClips] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [posts, setPosts] = useState(1);
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      clearResults();
      setYoutubeUrl("");
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    clearResults();
    setYoutubeUrl("");
  };

  const handleUploadTypeChange = (type) => {
    setUploadType(type);
    setSelectedFile(null);
    setYoutubeUrl("");
    clearResults();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
    setSelectedFile(null);
    clearResults();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearResults = () => {
    setTextContent(null);
    setClips([]);
    setHighlights([]);
    setPostContent("");
    setUploadResult(null);
  };

  const debugToken = () => {
    console.log("🔍 === TOKEN DEBUG START ===");
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("❌ No token found in localStorage");
      return;
    }
    console.log("✅ Token found in localStorage");
    // ... rest of debug logic
  };
  const extractTextDocument = async (num) => {
    setIsExtracting(true);
    setActivePostNum(num);
    clearResults();
    const form = new FormData();

    form.append("fileType", uploadType);
    form.append("file", selectedFile);
    form.append("no_of_posts", num);
    console.log("Sending file:", selectedFile.name);
    try {
      console.log("Making request to backend...");
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found in localStorage");
        setTextContent("❌ No authentication token. Please login again.");
        setIsExtracting(false);
        return;
      }

      console.log("📡 Making API request with token...");

      const res = await fetch(`${endpoint}/api/upload`, {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", res.status);
      console.log("📡 Response ok:", res.ok);

      const data = await res.json();
      console.log("📡 Response data:", data);

      if (res.status === 401) {
        console.error("❌ 401 Unauthorized - clearing token");
        localStorage.removeItem("access_token");
        setTextContent("❌ Session expired. Please login again.");
        setIsExtracting(false);
        return;
      }

      if (data.status === "success") {
        // Set all the data from response
        setTextContent(data.text);
        setPostContent(data.post_content || "");
        setHighlights(data.highlights || []);
        setClips(data.clips || []);
        setUploadResult(data);

        console.log("🎬 Clips received:", data.clips);
        console.log("🎯 Highlights received:", data.highlights);

        if (data.clips && data.clips.length > 0) {
          console.log(
            `✅ Successfully generated ${data.clips.length} video clips!`
          );
        }
      } else {
        setTextContent(
          `❌ ${data.message || data.detail || "Error extracting text."}`
        );
      }
    } catch (error) {
      console.error("Request failed:", error);
      setTextContent("❌ Upload failed.");
    } finally {
      setIsExtracting(false);
      setActivePostNum(null);
      setPosts(1);
    }
  };
  const extractText = async () => {
    setIsExtracting(true);
    setActivePostNum(posts);
    clearResults();

    console.log("🚀 Starting upload process...");
    debugToken();

    const form = new FormData();

    if (uploadType === "youtube" && youtubeUrl && youtubeUrl.trim()) {
      form.append("fileType", "youtube");
      form.append("youtubeUrl", youtubeUrl.trim());
      console.log("Sending YouTube URL:", youtubeUrl.trim());
    } else if (selectedFile) {
      form.append("fileType", uploadType);
      form.append("file", selectedFile);

      console.log("Sending file:", selectedFile.name);
    } else {
      const errorMsg =
        uploadType === "youtube"
          ? "❌ Please enter a YouTube URL."
          : "❌ Please select a file.";
      setTextContent(errorMsg);
      setIsExtracting(false);
      setPosts(null);
      return;
    }

    try {
      console.log("Making request to backend...");
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found in localStorage");
        setTextContent("❌ No authentication token. Please login again.");
        setIsExtracting(false);
        return;
      }

      console.log("📡 Making API request with token...");

      const res = await fetch(`${endpoint}/api/upload`, {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", res.status);
      console.log("📡 Response ok:", res.ok);

      const data = await res.json();
      console.log("📡 Response data:", data);

      if (res.status === 401) {
        console.error("❌ 401 Unauthorized - clearing token");
        localStorage.removeItem("access_token");
        setTextContent("❌ Session expired. Please login again.");
        setIsExtracting(false);
        return;
      }

      if (data.status === "success") {
        // Set all the data from response
        setTextContent(data.text);
        setPostContent(data.post_content || "");
        setHighlights(data.highlights || []);
        setClips(data.clips || []);
        setUploadResult(data);

        console.log("🎬 Clips received:", data.clips);
        console.log("🎯 Highlights received:", data.highlights);

        if (data.clips && data.clips.length > 0) {
          console.log(
            `✅ Successfully generated ${data.clips.length} video clips!`
          );
        }
      } else {
        setTextContent(
          `❌ ${data.message || data.detail || "Error extracting text."}`
        );
      }
    } catch (error) {
      console.error("Request failed:", error);
      setTextContent("❌ Upload failed.");
    } finally {
      setIsExtracting(false);
      setActivePostNum(null);
      setPosts(1);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    clearResults();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearYoutubeUrl = () => {
    setYoutubeUrl("");
    clearResults();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    if (!file) return "📄";
    const type = file.type.toLowerCase();
    if (type.includes("video")) return "🎥";
    if (type.includes("audio")) return "🎙️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("text")) return "📝";
    if (type.includes("word")) return "📄";
    return "📄";
  };

  const getUploadTypeInfo = (type) => {
    switch (type) {
      case "video":
        return { icon: "🎥", description: "MP4, AVI, MOV, MKV files" };
      case "audio":
        return { icon: "🎙️", description: "MP3, WAV, M4A, podcast files" };
      case "document":
        return { icon: "📄", description: "PDF, TXT, DOC, DOCX files" };
      case "youtube":
        return { icon: "📺", description: "YouTube video URLs" };
      default:
        return { icon: "📄", description: "Various file formats" };
    }
  };

  // Clip handling functions
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
        console.error("Failed to download clip");
        alert("Failed to download clip");
      }
    } catch (error) {
      console.error("Error downloading clip:", error);
      alert("Error downloading clip");
    }
  };

  const handlePreviewClip = (clipFilename) => {
    const url = `${endpoint}/clips/${clipFilename}`;
    window.open(url, "_blank");
  };

  const typeInfo = getUploadTypeInfo(uploadType);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Upload Content</h3>

      {/* Upload Type Selector */}
      <div className="flex space-x-1 mb-6 bg-secondary p-1 rounded-lg">
        {["video", "audio", "document", "youtube"].map((type) => (
          <button
            key={type}
            onClick={() => handleUploadTypeChange(type)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors ${
              uploadType === type
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {type === "video" && "🎥"}
            {type === "audio" && "🎙️"}
            {type === "document" && "📄"}
            {type === "youtube" && "📺"} {type}
          </button>
        ))}
      </div>

      {/* YouTube URL Input Section */}
      {uploadType === "youtube" ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            YouTube Video URL
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground pr-10"
            />
            {youtubeUrl && (
              <button
                onClick={clearYoutubeUrl}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* YouTube URL Preview */}
          {youtubeUrl && youtubeUrl.trim() && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">YouTube URL:</h4>
                <button
                  onClick={clearYoutubeUrl}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">📺</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {youtubeUrl}
                  </p>
                  <p className="text-muted-foreground text-sm">YouTube Video</p>
                </div>
              </div>

              <button
                onClick={extractText}
                disabled={isExtracting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isExtracting
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isExtracting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing YouTube Video...
                  </span>
                ) : (
                  "🎬 Extract & Generate Clips"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* File Upload Area */
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-border hover:border-ring"
            } ${selectedFile ? "opacity-50" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={selectedFile ? undefined : handleFileButtonClick}
          >
            <div className="text-4xl mb-4 text-primary">{typeInfo.icon}</div>
            <p className="text-lg font-medium text-white mb-2">
              {selectedFile
                ? "File selected"
                : `Drop your ${uploadType} here, or click to browse`}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {typeInfo.description}
            </p>
            {!selectedFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileButtonClick();
                }}
                className="btn-primary"
              >
                Choose {uploadType} file
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={
                uploadType === "video"
                  ? "video/*"
                  : uploadType === "audio"
                  ? "audio/*"
                  : ".pdf,.txt,.doc,.docx"
              }
            />
          </div>

          {/* File Preview Section */}
          {selectedFile && (
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Selected File:</h4>
                <button
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{getFileIcon(selectedFile)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatFileSize(selectedFile.size)} •{" "}
                    {selectedFile.type || "Unknown type"}
                  </p>
                </div>
              </div>
              {uploadType === "document" ? (
                <div className="flex space-x-2 mt-4 justify-between">
                  {[2, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        extractTextDocument(num);
                      }}
                      disabled={isExtracting}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isExtracting
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {isExtracting && activePostNum === num ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <div onClick={() => setPosts(num)}>{num} Post</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={extractText}
                  disabled={isExtracting}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isExtracting
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isExtracting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : uploadType === "video" ? (
                    "🎬 Extract Text & Generate Clips"
                  ) : (
                    "📝 Extract Text"
                  )}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Results Section */}
      {uploadResult && (
        <div className="mt-8 space-y-6">
          {/* Success Message */}
          <div className="p-4 bg-green-900/30 border border-green-600/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span className="text-green-300 font-medium">
                Content processed successfully!
              </span>
            </div>
            {clips.length > 0 && (
              <p className="text-green-200 text-sm mt-1">
                Generated {clips.length} video clips and AI-powered social media
                post
              </p>
            )}
          </div>

          {/* AI Generated Post */}
          {postContent && (
            <div className="p-4 bg-blue-900/30 border border-blue-600/30 rounded-lg">
              <h4 className="text-blue-300 font-medium mb-2">
                🤖 AI Generated Post:
              </h4>
              <div className="text-blue-100 bg-blue-900/50 p-3 rounded-md">
                {postContent}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(postContent);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
              >
                {copied ? "✅ Copied!" : "📋 Copy Post"}
              </button>
            </div>
          )}

          {/* Video Clips Section */}
          {clips && clips.length > 0 && (
            <div className="p-4 bg-purple-900/30 border border-purple-600/30 rounded-lg">
              <h4 className="text-purple-300 font-medium mb-4">
                🎬 Generated Video Clips ({clips.length}):
              </h4>
              <div className="space-y-4">
                {clips.map((clip, index) => (
                  <div key={index} className="bg-purple-900/50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="text-purple-100 font-medium">
                          {clip.reason}
                        </h5>
                        <p className="text-purple-300 text-sm">
                          {clip.start} - {clip.end}
                          {clip.size &&
                            ` • ${(clip.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownloadClip(clip.clip_filename)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 flex items-center space-x-1"
                        >
                          <span>📥</span>
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handlePreviewClip(clip.clip_filename)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <span>👁️</span>
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Video Preview */}
                    <video
                      controls
                      className="w-full max-w-md rounded-md bg-black"
                      src={`${endpoint}/clips/${clip.clip_filename}`}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Text */}
          {textContent && (
            <div className="p-4 bg-gray-900/30 border border-gray-600/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gray-300 font-medium">
                  📝 Extracted Text:
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(textContent);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                  title="Copy to clipboard"
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div className="p-3 bg-gray-900/50 text-gray-100 rounded-md whitespace-pre-wrap max-h-60 overflow-auto text-sm">
                {textContent}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-sm hover:bg-gray-600 transition-colors"
                onClick={() => {
                  const blob = new Blob([textContent], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `extracted_text_${
                    uploadType === "youtube"
                      ? "youtube_video"
                      : selectedFile?.name || "document"
                  }.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
              >
                💾 Download Text
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
