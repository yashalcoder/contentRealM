"use client";
import { useState, useRef } from "react";

export default function UploadForm() {
  const endpoint = "http://localhost:4000";
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState("video");
  const fileInputRef = useRef(null);
  const [textContent, setTextContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

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
      setTextContent(null); // Clear previous text content
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setTextContent(null); // Clear previous text content
  };

  const extractText = async () => {
    if (!selectedFile) return;

    setIsExtracting(true);
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("fileType", uploadType);

    try {
      const res = await fetch(`${endpoint}/api/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.status === "success") {
        setTextContent(data.text);
      } else {
        setTextContent("Error extracting text.");
      }
    } catch (error) {
      console.error(error);
      setTextContent("Upload failed");
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

      {/* File Preview Section */}

      {/* Upload Area */}
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
        <div className="text-4xl mb-4 text-primary">
          {uploadType === "video" && "🎥"}
          {uploadType === "audio" && "🎙️"}
          {uploadType === "document" && "📄"}
        </div>
        <p className="text-lg font-medium text-white mb-2">
          {selectedFile
            ? "File selected"
            : `Drop your ${uploadType} here, or click to browse`}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {uploadType === "video" && "MP4, YouTube links, Zoom recordings"}
          {uploadType === "audio" && "MP3, WAV, podcast files"}
          {uploadType === "document" && "PDF, TXT, transcripts, outlines"}
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
              ? "video/*,image/*"
              : uploadType === "audio"
              ? "audio/*"
              : ".pdf,.txt,.doc,.docx,image/*"
          }
        />
      </div>
      {selectedFile && (
        <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border">
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
          <button className="btn-secondary bg-red-500">Import</button>
        </div>
      </div>

      {/* Extracted Text Display */}
      {textContent && (
        <div className="mt-6">
          <h4 className="text-white text-lg font-semibold mb-2">
            Extracted Text:
          </h4>
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
                selectedFile?.name || "document"
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
