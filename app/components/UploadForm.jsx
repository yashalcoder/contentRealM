"use client";
import { useState, useRef } from "react";

export default function UploadForm() {
  const endpoint =
    "https://9b392beb-d0a9-4419-bdee-49fe1ca2f4f9-00-1jmjo5xjz1ebw.sisko.replit.dev";
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState("video");
  const fileInputRef = useRef(null);
  const [textContent, setTextContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [copied, setCopied] = useState(false);

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
      setTextContent(null);
      setYoutubeUrl(""); // Clear YouTube URL when file is selected
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setTextContent(null);
    setYoutubeUrl(""); // Clear YouTube URL when file is selected
  };

  const handleUploadTypeChange = (type) => {
    setUploadType(type);
    // Clear previous selections when switching tabs
    setSelectedFile(null);
    setYoutubeUrl("");
    setTextContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
    setSelectedFile(null); // Clear file when URL is entered
    setTextContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const extractText = async () => {
    setIsExtracting(true);

    const form = new FormData();

    // Handle different upload types
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
      return;
    }

    try {
      console.log("Making request to backend...");
      const res = await fetch(`${endpoint}/api/upload`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.status === "success") {
        setTextContent(data.text);
      } else {
        setTextContent(`❌ ${data.message || "Error extracting text."}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setTextContent("❌ Upload failed.");
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setTextContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearYoutubeUrl = () => {
    setYoutubeUrl("");
    setTextContent(null);
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

  const typeInfo = getUploadTypeInfo(uploadType);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Upload Content</h3>

      {/* Upload Type Selector - Now includes YouTube */}
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
                    Extracting from YouTube...
                  </span>
                ) : (
                  "Extract Text from YouTube"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* File Upload Area - Only shown for non-YouTube types */
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
            {/* Hidden File Input */}
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
                    Extracting Text...
                  </span>
                ) : (
                  "Extract Text"
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Extracted Text Display */}
      {/* Extracted Text Display */}
      {textContent && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white text-lg font-semibold">
              Extracted Text:
            </h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(textContent);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="text-muted-foreground hover:text-white text-sm"
              title="Copy to clipboard"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <div className="p-4 bg-muted text-foreground rounded-lg whitespace-pre-wrap max-h-80 overflow-auto border border-border">
            {textContent}
          </div>
          <button
            className="btn-secondary mt-4 bg-green-900 flex justify-between"
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
            Download Extracted Text
          </button>
        </div>
      )}
    </div>
  );
}
