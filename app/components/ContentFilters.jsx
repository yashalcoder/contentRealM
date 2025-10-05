"use client";
import { useState } from "react";

export default function ContentFilters({
  activeFilter,
  setActiveFilter,
  searchTerm,
  setSearchTerm,
  counts = { all: 0, video: 0, audio: 0, document: 0 },
}) {
  const filters = [
    { id: "all", name: "All Content", count: counts.all }, // dynamic
    { id: "video", name: "Video", count: counts.video }, // dynamic
    { id: "audio", name: "Audio", count: counts.audio }, // dynamic
    { id: "document", name: "Document", count: counts.document }, // dynamic
  ];
  return (
    <div className="card bg-white mb-4 border border-gray-200 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-ring focus:border-ring  placeholder-muted-foreground"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-muted-foreground">🔍</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 bg-gray-200 text-black p-1 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-primary text-white shadow-sm" // Active: bg-primary + text-white
                  : "text-black hover:bg-primary" // Inactive: text-black + hover effect
              }`}
            >
              {filter.name} ({filter.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
