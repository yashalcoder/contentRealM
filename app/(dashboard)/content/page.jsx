import ContentLibrary from "../../components/ContentLibrary"
import ContentFilters from "../../components/ContentFilters"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function Content() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Content Library</h1>
            <p className="text-lg text-muted-foreground">Manage and organize all your generated content</p>
          </div>

          <ContentFilters />
          <ContentLibrary />
        </div>
      </main>
      <Footer />
    </div>
  )
}
