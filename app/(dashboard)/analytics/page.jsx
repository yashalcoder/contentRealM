import AnalyticsOverview from "../../components/AnalyticsOverview"
import ContentPerformance from "../../components/ContentPerformance"
import EngagementMetrics from "../../components/EngagementMetrics"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function Analytics() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
            <p className="text-lg text-muted-foreground">
              Track your content performance and rule your digital kingdom
            </p>
          </div>

          <AnalyticsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContentPerformance />
            <EngagementMetrics />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
