export default function RoleManagement() {
  const roles = [
    {
      name: "Owner",
      description: "Full access to all features and team management",
      permissions: ["Create Content", "Edit Content", "Publish Content", "Manage Team", "Billing Access", "Analytics"],
      color: "text-primary-foreground",
      count: 1,
    },
    {
      name: "Editor",
      description: "Can create, edit, and publish content",
      permissions: ["Create Content", "Edit Content", "Publish Content", "View Analytics"],
      color: "text-green-300",
      count: 2,
    },
    {
      name: "Creator",
      description: "Can create and edit content, but cannot publish",
      permissions: ["Create Content", "Edit Content", "View Analytics"],
      color: "text-blue-300",
      count: 1,
    },
    {
      name: "Viewer",
      description: "Read-only access to content and analytics",
      permissions: ["View Content", "View Analytics"],
      color: "text-muted-foreground",
      count: 1,
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Role Permissions</h3>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <div key={index} className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${role.color}`}>{role.name}</h4>
              <span className="text-xs text-muted-foreground">
                {role.count} member{role.count !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Permissions:</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission, permIndex) => (
                  <span
                    key={permIndex}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-input text-muted-foreground"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
