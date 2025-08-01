"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react"; // Import useState

export default function Navbar() {
  const pathname = usePathname();
  // Simulate login state for demonstration. In a real app, this would come from auth context/session.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to false to show login/signup initially

  const navItems = [
    { name: "Dashboard", href: "/", icon: "🏠" },
    { name: "Upload", href: "/upload", icon: "📤" },
    { name: "Content", href: "/content", icon: "📝" },
    { name: "Analytics", href: "/analytics", icon: "📊" },
    { name: "Calendar", href: "/calendar", icon: "📅" },
    { name: "Team", href: "/team", icon: "👥" },
  ];

  return (
    <nav className="bg-background shadow-lg border-b border-border">
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
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={
                  pathname === item.href ||
                  (item.href === "/" && pathname.startsWith("/dashboard"))
                    ? "nav-link-active"
                    : "nav-link"
                }
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Conditional Rendering for Auth/User Menu */}
          {isLoggedIn ? (
            // User is logged in: Show user menu
            <div className="flex items-center space-x-4">
              <button className="p-2 text-muted-foreground hover:text-primary-foreground rounded-lg">
                <span className="text-xl">🔔</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    JD
                  </span>
                </div>
                <span className="text-sm font-medium text-white">John Doe</span>
              </div>
            </div>
          ) : (
            // User is not logged in: Show Sign Up and Login buttons
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
              <Link href="/login" className="nav-link">
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button className="p-2 text-white hover:text-primary-foreground">
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

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="px-2 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.href ||
                (item.href === "/" && pathname.startsWith("/dashboard"))
                  ? "text-primary-foreground bg-secondary"
                  : "text-muted-foreground hover:text-primary-foreground hover:bg-secondary"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          {/* Mobile conditional rendering for auth links */}
          {!isLoggedIn && (
            <>
              <Link
                href="/signup"
                className="block w-full text-center btn-primary text-base py-2 px-3 mt-2"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="block w-full text-center nav-link mt-2"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
