"use client";
import React, { useState } from "react";
import {
  User,
  Users,
  Share2,
  Key,
  CreditCard,
  FileText,
  Save,
  Crown,
  Edit,
  Eye,
  Shield,
  Music,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [email, setEmail] = useState("yashalrafique@gmail.com");
  const [fullName, setFullName] = useState("");
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "team", label: "Team", icon: Users },
    { id: "social", label: "Social", icon: Share2 },
    { id: "api", label: "API", icon: Key },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "plan", label: "Plan", icon: FileText },
  ];

  const copyApiKey = () => {
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account, integrations, and billing
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {activeTab === "account" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Account Information
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your account details
                </p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="pt-4">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors shadow-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Role Permissions
                </h2>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {/* Owner Role */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Owner</h3>
                    </div>
                    <span className="w-6 h-6 bg-blue-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      0
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Full access to all features and team management
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Permissions:
                    </p>
                    {[
                      "Create Content",
                      "Edit Content",
                      "Publish Content",
                      "Manage Team",
                      "Billing Access",
                      "Analytics",
                    ].map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center gap-2 text-xs text-gray-700"
                      >
                        <Check className="w-3 h-3 text-green-600" />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editor Role */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Editor</h3>
                    </div>
                    <span className="w-6 h-6 bg-gray-200 text-gray-700 text-xs rounded-full flex items-center justify-center font-medium">
                      0
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Can create, edit, and publish content
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Permissions:
                    </p>
                    {[
                      "Create Content",
                      "Edit Content",
                      "Publish Content",
                      "View Analytics",
                    ].map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center gap-2 text-xs text-gray-700"
                      >
                        <Check className="w-3 h-3 text-green-600" />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Role */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Creator</h3>
                    </div>
                    <span className="w-6 h-6 bg-gray-200 text-gray-700 text-xs rounded-full flex items-center justify-center font-medium">
                      0
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Can create and edit content, but cannot publish
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Permissions:
                    </p>
                    {["Create Content", "Edit Content", "View Analytics"].map(
                      (perm) => (
                        <div
                          key={perm}
                          className="flex items-center gap-2 text-xs text-gray-700"
                        >
                          <Check className="w-3 h-3 text-green-600" />
                          {perm}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Viewer Role */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Viewer</h3>
                    </div>
                    <span className="w-6 h-6 bg-gray-200 text-gray-700 text-xs rounded-full flex items-center justify-center font-medium">
                      0
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Read-only access to content and analytics
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Permissions:
                    </p>
                    {["View Content", "View Analytics"].map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center gap-2 text-xs text-gray-700"
                      >
                        <Check className="w-3 h-3 text-green-600" />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Team Members
                </h2>
                <p className="text-sm text-gray-600 mb-4">0 members</p>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Social Media Integrations
                </h2>
                <p className="text-sm text-gray-600">
                  Connect your social media accounts for automatic posting
                </p>
              </div>

              <div className="space-y-4 max-w-4xl">
                {/* TikTok */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">TikTok</h3>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Connect
                  </button>
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Instagram</h3>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Connect
                  </button>
                </div>

                {/* YouTube */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Youtube className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">YouTube</h3>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Connect
                  </button>
                </div>

                {/* Twitter/X */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Twitter/X</h3>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Connect
                  </button>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">LinkedIn</h3>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  API Keys
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your API keys for programmatic access
                </p>
              </div>

              <div className="max-w-4xl">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Use this API key to access ContentRealm's API
                    programmatically. Keep it secure!
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-700 font-mono">
                      sk_live_••••••••••••••••••
                    </code>
                    <div className="flex gap-2">
                      <button
                        onClick={copyApiKey}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Copy API key"
                      >
                        {apiKeyCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Show API key"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Regenerate API Key
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  This will invalidate your current API key. Update your
                  applications immediately.
                </p>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Payment Method
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your payment information
                </p>
              </div>

              <div className="max-w-4xl mb-8">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Visa ending in 4242
                      </h3>
                      <p className="text-sm text-gray-600">Expires 12/2025</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors">
                    Update
                  </button>
                </div>

                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors">
                  Add Payment Method
                </button>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Invoice History
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  View and download your invoices
                </p>

                <div className="space-y-3 max-w-4xl">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">INV-001</h3>
                      <p className="text-sm text-gray-600">2025-09-01</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-gray-900">
                        $49.00
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Paid
                      </span>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors">
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">INV-002</h3>
                      <p className="text-sm text-gray-600">2025-08-01</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-gray-900">
                        $49.00
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Paid
                      </span>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "plan" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Current Plan
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your subscription plan
                </p>
              </div>

              <div className="max-w-4xl">
                <div className="border-2 border-yellow-400 rounded-lg p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Professional
                      </h3>
                      <p className="text-gray-600">
                        $49/month - Billed monthly
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next billing date</p>
                      <p className="font-semibold text-gray-900">
                        October 1, 2025
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>25 Videos Per Month</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Unlimited AI-Generated Clips</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Priority Processing</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors">
                    Change Plan
                  </button>
                  <button className="px-6 py-2.5 text-gray-700 hover:bg-gray-50 border border-gray-300 font-medium rounded-lg transition-colors">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
