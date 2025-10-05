"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload as UploadIcon,
  LogOut,
  Save,
  Palette,
  Type,
  Image as ImageIcon,
  Video,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { createApiFetch } from "./ApiFetch";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ============================================================================
// CONSTANTS
// ============================================================================
const FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Merriweather",
  "Arial",
  "Helvetica",
];

const DEFAULT_BRAND_KIT = {
  name: "Default Brand",
  logo_url: null,
  primary_color: "#1E3A5F",
  secondary_color: "#F4A261",
  accent_color: "#E76F51",
  background_color: "#FFFFFF",
  text_color: "#2A2A2A",
  font_family: "Inter",
  font_heading: "Inter",
};

// ============================================================================
// DUMMY MODE FLAG - Set to false when backend is ready
// ============================================================================
const DUMMY_MODE = true;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function BrandKit() {
  const router = useRouter();
  const apiFetch = createApiFetch();
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [brandKit, setBrandKit] = useState(DEFAULT_BRAND_KIT);

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (DUMMY_MODE) {
      // Dummy user for testing
      setUser({ id: "dummy-user-123", email: "test@example.com" });
      return;
    }

    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token:", err);
      router.push("/auth");
    }
  }, [router]);

  // Load brand kit when user is authenticated
  useEffect(() => {
    if (user) {
      loadBrandKit();
    }
  }, [user]);

  // ============================================================================
  // BACKEND: LOAD BRAND KIT
  // Endpoint: GET /api/brand-kits
  // ============================================================================
  const loadBrandKit = async () => {
    try {
      setLoading(true);

      if (DUMMY_MODE) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Load from localStorage if exists
        const saved = localStorage.getItem("dummy_brand_kit");
        if (saved) {
          const data = JSON.parse(saved);
          setBrandKit(data);
          setLogoPreview(data.logo_url);
        }
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");

      // BACKEND CALL: GET /api/brand-kits
      // Expected Response: { brand_kit: { id, name, logo_url, colors, fonts... } }
      const res = await apiFetch(`${endpoint}/api/brand-kits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load brand kit");

      const data = await res.json();

      if (data && data.brand_kit) {
        setBrandKit(data.brand_kit);
        setLogoPreview(data.brand_kit.logo_url);
      }
    } catch (error) {
      console.error("Error loading brand kit:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load brand kit",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // LOGO HANDLING
  // ============================================================================
  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid file",
        text: "Please upload an image file",
      });
      return;
    }

    // Set file and create preview
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setBrandKit({ ...brandKit, logo_url: null });
  };

  // ============================================================================
  // BACKEND: UPLOAD LOGO
  // Endpoint: POST /api/brand-kits/upload-logo
  // ============================================================================
  const uploadLogo = async () => {
    if (!logoFile || !user) return brandKit.logo_url;

    try {
      if (DUMMY_MODE) {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the preview URL (base64) as dummy uploaded URL
        return logoPreview;
      }

      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("logo", logoFile);

      // BACKEND CALL: POST /api/brand-kits/upload-logo
      // Expected Request: FormData with 'logo' file
      // Expected Response: { logo_url: "https://your-cdn.com/logos/xxx.png" }
      const res = await apiFetch(`${endpoint}/api/brand-kits/upload-logo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Don't set Content-Type for FormData, browser will set it automatically
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      return data.logo_url;
    } catch (error) {
      console.error("Error uploading logo:", error);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Failed to upload logo",
      });
      return null;
    }
  };

  // ============================================================================
  // BACKEND: SAVE BRAND KIT
  // Endpoint: POST /api/brand-kits (create) or PUT /api/brand-kits/:id (update)
  // ============================================================================
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      let logoUrl = brandKit.logo_url;

      // Upload logo if new file selected
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const kitData = {
        name: brandKit.name,
        logo_url: logoUrl,
        primary_color: brandKit.primary_color,
        secondary_color: brandKit.secondary_color,
        accent_color: brandKit.accent_color,
        background_color: brandKit.background_color,
        text_color: brandKit.text_color,
        font_family: brandKit.font_family,
        font_heading: brandKit.font_heading,
      };

      if (DUMMY_MODE) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Save to localStorage
        const savedKit = { ...kitData, id: brandKit.id || "dummy-kit-123" };
        localStorage.setItem("dummy_brand_kit", JSON.stringify(savedKit));
        setBrandKit(savedKit);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Brand kit saved successfully (Dummy Mode)",
          timer: 2000,
        });

        setLogoFile(null);
        setSaving(false);
        return;
      }

      const token = localStorage.getItem("access_token");

      // BACKEND CALL: PUT /api/brand-kits/:id or POST /api/brand-kits
      const method = brandKit.id ? "PUT" : "POST";
      const url = brandKit.id
        ? `${endpoint}/api/brand-kits/${brandKit.id}`
        : `${endpoint}/api/brand-kits`;

      // Expected Request Body: { name, logo_url, primary_color, secondary_color, ... }
      // Expected Response: { brand_kit: { id, name, logo_url, colors, fonts, created_at, updated_at } }
      const res = await apiFetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kitData),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();

      if (data && data.brand_kit) {
        setBrandKit(data.brand_kit);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Brand kit saved successfully",
        timer: 2000,
      });

      setLogoFile(null);
    } catch (error) {
      console.error("Error saving brand kit:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save brand kit",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // BACKEND: LOGOUT
  // ============================================================================
  const handleLogout = async () => {
    if (DUMMY_MODE) {
      Swal.fire({
        icon: "info",
        title: "Dummy Mode",
        text: "Logout in dummy mode",
        timer: 1500,
      });
      return;
    }
    localStorage.removeItem("access_token");
    router.push("/auth");
  };

  // ============================================================================
  // COLOR INPUT HANDLER
  // ============================================================================
  const updateColor = (field, value) => {
    setBrandKit({ ...brandKit, [field]: value });
  };

  // Loading state
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Dummy Mode Indicator */}
      {/* {DUMMY_MODE && (
        <div className="bg-yellow-500 text-white py-2 px-4 text-center text-sm font-medium">
          ⚠️ DUMMY MODE - Set DUMMY_MODE = false when backend is ready
        </div>
      )} */}

      {/* Hero Section */}
      <div className="bg-background text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-11">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
                <Palette className="text-white" size={30} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-2xl md:text-6xl font-bold mb-6">
              Brand Kit Manager
            </h1>

            <p className="text-xl md:text-lg text-white/90 max-w-3xl mx-auto">
              Customize your brand identity for all generated content
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <ImageIcon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Custom Logo</h3>
              <p className="text-white/80 text-base leading-relaxed">
                Upload your brand logo for videos and posts
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Brand Colors</h3>
              <p className="text-white/80 text-base leading-relaxed">
                Define your complete color palette
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Type className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Typography</h3>
              <p className="text-white/80 text-base leading-relaxed">
                Choose fonts for headings and body text
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Logo
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload your logo for video clips and posts
                  </p>
                </div>
                <div className="p-6">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <div className="w-48 h-48 border-2 border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                        onClick={handleRemoveLogo}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoSelect}
                        className="hidden"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload logo (PNG, JPG, SVG)
                        </p>
                        <span className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                          Choose File
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Colors Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Brand Colors
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Define your brand color palette
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={brandKit.primary_color}
                          onChange={(e) =>
                            updateColor("primary_color", e.target.value)
                          }
                          className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandKit.primary_color}
                          onChange={(e) =>
                            updateColor("primary_color", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Secondary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={brandKit.secondary_color}
                          onChange={(e) =>
                            updateColor("secondary_color", e.target.value)
                          }
                          className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandKit.secondary_color}
                          onChange={(e) =>
                            updateColor("secondary_color", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Accent Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={brandKit.accent_color}
                          onChange={(e) =>
                            updateColor("accent_color", e.target.value)
                          }
                          className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandKit.accent_color}
                          onChange={(e) =>
                            updateColor("accent_color", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Text Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={brandKit.text_color}
                          onChange={(e) =>
                            updateColor("text_color", e.target.value)
                          }
                          className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandKit.text_color}
                          onChange={(e) =>
                            updateColor("text_color", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fonts Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Typography
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose fonts for your content
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Heading Font */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Heading Font
                      </label>
                      <select
                        value={brandKit.font_heading}
                        onChange={(e) =>
                          setBrandKit({
                            ...brandKit,
                            font_heading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {FONTS.map((font) => (
                          <option
                            key={font}
                            value={font}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Body Font */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Body Font
                      </label>
                      <select
                        value={brandKit.font_family}
                        onChange={(e) =>
                          setBrandKit({
                            ...brandKit,
                            font_family: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {FONTS.map((font) => (
                          <option
                            key={font}
                            value={font}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-6 py-3 bg-background hover:bg-primary disabled:bg-blue-400 text-white rounded-lg font-medium text-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="h-5 w-5" />
                {saving ? "Saving..." : "Save Brand Kit"}
              </button>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Preview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    How your brand will look
                  </p>
                </div>
                <div className="p-6">
                  <div
                    className="rounded-lg p-6 space-y-4"
                    style={{
                      backgroundColor: brandKit.primary_color,
                      color: brandKit.background_color,
                    }}
                  >
                    {logoPreview && (
                      <div className="bg-white/10 rounded p-3 flex items-center justify-center">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="max-h-16 object-contain"
                        />
                      </div>
                    )}

                    <h3
                      className="text-2xl font-bold"
                      style={{ fontFamily: brandKit.font_heading }}
                    >
                      Your Heading
                    </h3>

                    <p
                      className="text-sm opacity-90"
                      style={{ fontFamily: brandKit.font_family }}
                    >
                      This is how your body text will appear in generated
                      content and clips.
                    </p>

                    <div className="flex gap-2 mt-4">
                      <div
                        className="h-8 w-8 rounded"
                        style={{ backgroundColor: brandKit.secondary_color }}
                        title="Secondary Color"
                      />
                      <div
                        className="h-8 w-8 rounded"
                        style={{ backgroundColor: brandKit.accent_color }}
                        title="Accent Color"
                      />
                      <div
                        className="h-8 w-8 rounded border border-white/20"
                        style={{ backgroundColor: brandKit.text_color }}
                        title="Text Color"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
