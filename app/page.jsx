import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import RecentContent from "./components/RecentContent";
import PerformanceInsights from "./components/PerformanceInsights";
import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Reverted to original dashboard hero */}
        <div className="hero-gradient py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">Build Your </span>

                <span className="text-primary">Content </span>

                <span className="text-primary">Kingdom </span>
                <br />
                <span className="text-white">Rule Your </span>

                <span className="text-white">Influence</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                ContentRealm™ is your gateway to turning every word you speak
                into content that dominates the digital realm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                  👑 Sign Up Now
                </Link>
                <button className="btn-secondary text-lg px-8 py-4">
                  👑 Choose Your Realm
                </button>
              </div>
            </div>

            {/* AI Processing Indicator - Re-added */}
            <div className="inline-flex items-center space-x-2 bg-secondary px-4 py-2 rounded-full border border-border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                AI Processing Content...
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Your Voice Deserves a Throne Section - Re-added */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white">🎯</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Voice Deserves a Throne
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              RealmAmplify is more than a tool—it's a territory. A sovereign
              space where creators command influence through content that works
              while they rest.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for speakers, pastors, coaches, and content creators who
              refuse to serve algorithms—and instead, rule them.
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>

            {/* Right Column - Recent Content & Insights */}
            <div className="lg:col-span-2 space-y-8">
              <RecentContent />
              <PerformanceInsights />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
