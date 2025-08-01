import TeamMembers from "../../components/TeamMembers"
import TeamInvite from "../../components/TeamInvite"
import RoleManagement from "../../components/RoleManagement"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Team Collaboration</h1>
            <p className="text-lg text-muted-foreground">Manage team members and expand your content kingdom</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TeamInvite />
              <RoleManagement />
            </div>
            <div>
              <TeamMembers />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
