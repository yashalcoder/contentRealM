"use client"
import { useState } from "react"

export default function TeamInvite() {
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "viewer",
    message: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle team invite
    console.log("Inviting:", inviteData)
    setInviteData({ email: "", role: "viewer", message: "" })
  }

  const handleChange = (e) => {
    setInviteData({
      ...inviteData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Invite Team Member</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={inviteData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
            placeholder="colleague@example.com"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-muted-foreground mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={inviteData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground"
          >
            <option value="viewer">Viewer - Can view content</option>
            <option value="creator">Creator - Can create and edit</option>
            <option value="editor">Editor - Can create, edit, and publish</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
            Personal Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={inviteData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
            placeholder="Welcome to our content team!"
          />
        </div>

        <button type="submit" className="w-full btn-primary">
          Send Invitation
        </button>
      </form>
    </div>
  )
}
