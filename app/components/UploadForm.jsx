"use client";
import { useState, useRef } from "react";

export default function UploadForm() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState("video");
  const fileInputRef = useRef(null);

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
    console.log("Dropped files:", files);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    console.log("Selected files:", files);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Upload Content</h3>

      {/* Upload Type Selector */}
      <div className="flex space-x-1 mb-6 bg-secondary p-1 rounded-lg">
        {["video", "audio", "document"].map((type) => (
          <button
            key={type}
            onClick={() => setUploadType(type)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors ${
              uploadType === type
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {type === "video" && "🎥"} {type === "audio" && "🎙️"}{" "}
            {type === "document" && "📄"} {type}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-ring"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleFileButtonClick}
      >
        <div className="text-4xl mb-4 text-primary">
          {uploadType === "video" && "🎥"}
          {uploadType === "audio" && "🎙️"}
          {uploadType === "document" && "📄"}
        </div>
        <p className="text-lg font-medium text-white mb-2">
          Drop your {uploadType} here, or click to browse
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {uploadType === "video" && "MP4, YouTube links, Zoom recordings"}
          {uploadType === "audio" && "MP3, WAV, podcast files"}
          {uploadType === "document" && "PDF, TXT, transcripts, outlines"}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // 🔐 Prevents parent div's onClick
            handleFileButtonClick();
          }}
          className="btn-primary"
        >
          Choose {uploadType} file
        </button>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* URL Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Or paste a URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
          />
          <button className="btn-secondary">Import</button>
        </div>
      </div>
    </div>
  );
}
