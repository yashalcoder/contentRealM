export default function TeamMembers() {
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Owner",
      avatar: "JD",
      status: "active",
      lastActive: "2 hours ago",
      permissions: ["Create", "Edit", "Publish", "Manage Team"],
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Editor",
      avatar: "SW",
      status: "active",
      lastActive: "5 minutes ago",
      permissions: ["Create", "Edit", "Publish"],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Viewer",
      avatar: "MJ",
      status: "inactive",
      lastActive: "2 days ago",
      permissions: ["View"],
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Creator",
      avatar: "ED",
      status: "active",
      lastActive: "1 hour ago",
      permissions: ["Create", "Edit"],
    },
  ]

  const getRoleColor = (role) => {
    switch (role) {
      case "Owner":
        return "bg-primary/30 text-primary-foreground"
      case "Editor":
        return "bg-green-900/30 text-green-300"
      case "Creator":
        return "bg-blue-900/30 text-blue-300"
      case "Viewer":
        return "bg-gray-900/30 text-gray-300"
      default:
        return "bg-gray-900/30 text-gray-300"
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Team Members</h3>
        <span className="text-sm text-muted-foreground">{teamMembers.length} members</span>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">{member.avatar}</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-white">{member.name}</h4>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}
                  >
                    {member.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${member.status === "active" ? "bg-green-500" : "bg-muted-foreground"}`}
                  ></div>
                  <span className="text-xs text-muted-foreground/80">Last active {member.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-xs bg-input hover:bg-input/80 text-white rounded transition-colors">
                Edit
              </button>
              <button className="p-1 text-muted-foreground hover:text-white">
                <span className="text-sm">⋯</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
