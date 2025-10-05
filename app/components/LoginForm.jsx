"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { createApiFetch } from "./ApiFetch";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
export default function LoginForm() {
  const router = useRouter();
  const apiFetch = createApiFetch(router);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let errorMessage = ""; // declare here for wider scope

    try {
      const response = await fetch(`${apiEndpoint}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        await Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/home");
        return;
      }

      // handle different status codes
      if (response.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (response.status === 422) {
        errorMessage = "Please fill all required fields correctly";
      } else if (response.status === 500) {
        errorMessage = "Server error, please try again later";
      } else {
        errorMessage = "Login failed";
      }

      Swal.fire({
        icon: "error",
        title: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network error. Please check your connection.",
        confirmButtonColor: "#3085d6",
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
    <div className="bg-white text-black py-8 px-6 shadow-xl rounded-xl ">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-2"
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
            className="w-full px-3 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder-muted-foreground"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black mb-2"
          >
            Password
          </label>
          <div className="w-full relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-3 pr-10 bg-white border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring  placeholder-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? (
                <Eye size={20} className="text-black" />
              ) : (
                <EyeOff size={20} className="text-black" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-ring border-border rounded bg-input"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-black"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-primary hover:text-primary/80"
            >
              Forgot your password?
            </a>
          </div>
        </div>

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
            "Sign in to your realm"
          )}
        </button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              Create your kingdom
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
