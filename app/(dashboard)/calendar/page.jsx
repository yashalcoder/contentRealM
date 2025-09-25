import ContentCalendar from "../../components/ContentCalendar";
import ScheduledPosts from "../../components/ScheduledPosts";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Calendar() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Content Calendar
            </h1>
            <p className="text-lg text-muted-foreground">
              Plan and schedule your content to rule your digital kingdom
            </p>
          </div>

          <div className="">
            <div>
              <ScheduledPosts />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
