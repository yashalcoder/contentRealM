"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { createApiFetch } from "./ApiFetch";

export default function SignupForm() {
  const router = useRouter();
  const apiFetch = createApiFetch(router);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "speaker",
  });
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const handleSubmit = async (e) => {
    setLoading(true);
    localStorage.removeItem("access_token");
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match. Please check and try again.",
        confirmButtonColor: "#3085d6",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch(`${apiEndpoint}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          profession: formData.userType,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.status === 201) {
        // Signup success
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Welcome aboard! Redirecting to login...",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/login");
      } else if (res.status === 409) {
        // Email already exists → redirect to login
        Swal.fire({
          icon: "info",
          title: "Account Exists",
          text: "This email is already registered. Redirecting to login...",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/login");
      } else if (res.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Invalid Data",
          text: data.detail || "Please check your input and try again.",
        });
      } else if (res.status >= 500) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Something went wrong on our end. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.detail || "An unknown error occurred.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please check your internet.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md w-full space-y-8 m-auto top-10 ">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mt-7 mb-6">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-lg">👑</span>
          </div>
          <span className="text-3xl font-bold text-white">ContentRealm™</span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Create Your Kingdom
        </h2>
        <p className="text-muted-foreground">
          Join thousands of content creators transforming their voice into
          content empires
        </p>
      </div>
      <div className="bg-card bg-white py-8 px-6 shadow-xl rounded-xl border border-border">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block  text-sm font-medium text-muted-foreground mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-3 text-black bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
                placeholder="John"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-3 text-black bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              I am a...
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-3 py-3 text-black bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
            >
              <option value="speaker">Speaker</option>
              <option value="coach">Coach</option>
              <option value="pastor">Pastor</option>
              <option value="thought-leader">Thought Leader</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-3 text-black bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Password
            </label>
            {/* <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
              placeholder="Create a strong password"
            /> */}
            <div className="w-full relative">
              <input
                id="password"
                name="password"
                type={show1 ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-3 py-3 text-black bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShow1(!show1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show1 ? (
                  <Eye className="text-black" size={20} />
                ) : (
                  <EyeOff className="text-black" size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Confirm Password
            </label>
            {/* <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
              placeholder="Confirm your password"
            /> */}
            <div className="w-full relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={show ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-3 py-3 text-black bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? (
                  <Eye className="text-black" size={20} />
                ) : (
                  <EyeOff className="text-black" size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-ring border-border rounded bg-input"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-muted-foreground"
            >
              I agree to the{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* <button type="submit" className="w-full btn-primary">
            Create Your Kingdom
          </button> */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 btn-primary ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-red-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing...
              </span>
            ) : (
              "Create Your Kingdom"
            )}
          </button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in to your realm
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
