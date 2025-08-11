"use client";
import { useEffect, useState } from "react";
import ContentLibrary from "../../components/ContentLibrary";
import ContentFilters from "../../components/ContentFilters";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Content() {
  const [userId, setUserId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUserId(payload.user_id);
      } catch (e) {
        console.error("Invalid token format", e);
        setUserId(null);
      }
    }
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-white">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Content Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and organize all your generated content
            </p>
          </div>

          <ContentFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ContentLibrary
            userId={userId}
            filter={activeFilter}
            searchTerm={searchTerm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
