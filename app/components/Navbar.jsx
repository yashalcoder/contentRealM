"use client";
import { ArrowBigRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/home", icon: "🏠" },
    { name: "Upload", href: "/upload", icon: "📤" },
    { name: "Content", href: "/content", icon: "📝" },
    // { name: "Analytics", href: "/analytics", icon: "📊" },
    // { name: "Calendar", href: "/calendar", icon: "📅" },
    // { name: "Team", href: "/team", icon: "👥" },
    { name: "Brand Kit", href: "/brandkit", icon: "🤖" },
    { name: "Ai Tools", href: "/aiTools", icon: "🤖" },
    { name: "Pricing", href: "/pricing", icon: "🤖" },
    { name: "Settings", href: "/settings", icon: "🤖" },
  ];

  const navItemsLogout = [{ name: "Pricing", href: "/pricing", icon: "🤖" }];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUserName(payload.email?.slice(0, 5) || "User");
      } catch (e) {
        console.error("Invalid token format", e);
      }
    }
  }, []);

  // Close sidebar on window resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest("#sidebar") &&
        !e.target.closest("#hamburger-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetch(`${endpoint}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="bg-background shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">👑</span>
                </div>
                <span className="text-xl font-bold text-white">
                  ContentRealm™
                </span>
              </Link>
            </div>

            {/* Navigation Links (always visible for dashboard pages) */}
            {isLoggedIn ? (
              <div className="hidden md:flex text-white items-center space-x-1 ml-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={
                      pathname === item.href ||
                      (item.href === "/home" &&
                        pathname.startsWith("/dashboard"))
                        ? "nav-link-active"
                        : "nav-link"
                    }
                  >
                    {/* <span className="mr-2">{item.icon}</span> */}
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="hidden md:flex items-center text-white space-x-1 ml-auto">
                {navItemsLogout.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={
                      pathname === item.href ||
                      (item.href === "/home" &&
                        pathname.startsWith("/dashboard"))
                        ? "nav-link-active"
                        : "nav-link"
                    }
                  >
                    {/* <span className="mr-2">{item.icon}</span> */}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Conditional Rendering for Auth/User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center text-white space-x-4">
                {/* <button className="p-2 text-muted-foreground hover:text-primary-foreground rounded-lg">
                  <span className="text-xl">🔔</span>
                </button> */}

                {/* <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {userName}
                  </span>
                </div> */}

                {/* 🔴 Logout button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex text-white text-sm text-white font-bold ml-3 flex hover:bg-primary rounded-md p-2"
                >
                  <ArrowBigRight size={20} />
                  Logout
                </button>
              </div>
            ) : (
              // User is not logged in: Show Sign Up and Login buttons
              <div className="hidden md:flex items-center space-x-4">
                {/* <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link> */}
                <Link href="/login" className=" nav-link">
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button (Hamburger) */}
            <div className="md:hidden flex items-center">
              <button
                id="hamburger-btn"
                className="p-2 text-white"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 " : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Mobile Sidebar - LEFT SIDE */}
      <div
        id="sidebar"
        className={`fixed top-0 bg-background left-0 h-full pb-10 w-72 bg-navbar shadow-lg shadow-gray z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">👑</span>
              </div>
              <span className="text-lg font-bold text-white">
                ContentRealm™
              </span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {(isLoggedIn ? navItems : navItemsLogout).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href ||
                    (item.href === "/home" && pathname.startsWith("/dashboard"))
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {/* <span className="text-xl">{item.icon}</span> */}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4">
            {isLoggedIn ? (
              <>
                {/* <div className="flex items-center space-x-3 px-4 py-3 mb-3 bg-white/5 rounded-lg">
                  <div className=" bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {userName}
                  </span>
                </div> */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-all"
                >
                  <ArrowBigRight size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeSidebar}
                className="w-full block text-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
