"use client";
import { useState } from "react";

export default function ContentFilters({
  activeFilter,
  setActiveFilter,
  searchTerm,
  setSearchTerm,
}) {
  const filters = [
    { id: "all", name: "All Content", count: 23 },
    { id: "Video", name: "Video", count: 12 },
    { id: "Audio", name: "Audio", count: 8 },
    { id: "Document", name: "Document", count: 3 },
  ];

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-muted-foreground">🔍</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 bg-secondary p-1 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-white"
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
