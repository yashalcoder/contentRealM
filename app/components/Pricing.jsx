"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("yearly");

  const plans = {
    yearly: {
      starter: { price: 24, original: 29, yearly: 288 },
      professional: { price: 41, original: 49, yearly: 492 },
      pro: { price: 66, original: 79, yearly: 792 },
    },
    monthly: {
      starter: { price: 29, original: 29, yearly: null },
      professional: { price: 49, original: 49, yearly: null },
      pro: { price: 79, original: 79, yearly: null },
    },
  };

  const currentPlans = plans[billingCycle];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "What happens to my content if I cancel?",
      answer:
        "Your content remains accessible for 30 days after cancellation. You can export everything before your access ends.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes! We offer a 30-day money-back guarantee on all paid plans, no questions asked.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-teal-700 font-semibold text-sm uppercase tracking-wide mb-4">
            PRICING
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose The Plan That's Right For You
          </h1>
          <div className="flex items-center justify-center gap-8 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
              </svg>
              <span className="font-medium">30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="font-medium">Cancel Anytime</span>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center item-center bg-gray-200 mx-auto w-[10%] rounded-lg">
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <h3 className="text-xl font-bold text-gray-900">Starter</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">
                  ${currentPlans.starter.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              {billingCycle === "yearly" && (
                <>
                  <p className="text-gray-500 line-through text-sm">
                    ${currentPlans.starter.original}
                  </p>
                  <p className="text-gray-600 text-sm">
                    *paid yearly (${currentPlans.starter.yearly})
                  </p>
                </>
              )}
            </div>
            <button className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-6">
              Start 14-Day Free Trial
            </button>
            <ul className="space-y-3">
              {[
                "10 Videos Per Month",
                "Unlimited Clips Per Video",
                "AI Transcription & Captions",
                "Social Media Post Generation",
                "Basic Analytics",
                "Email Support",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-xl border-2 border-yellow-500 p-8 relative scale-105">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <h3 className="text-xl font-bold text-gray-900">Professional</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">
                  ${currentPlans.professional.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              {billingCycle === "yearly" && (
                <>
                  <p className="text-gray-500 line-through text-sm">
                    ${currentPlans.professional.original}
                  </p>
                  <p className="text-gray-600 text-sm">
                    *paid yearly (${currentPlans.professional.yearly})
                  </p>
                </>
              )}
            </div>
            <button className="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors mb-6">
              Start 14-Day Free Trial
            </button>
            <ul className="space-y-3">
              {[
                "25 Videos Per Month",
                "Unlimited AI-Generated Clips",
                "Advanced AI Transcription",
                "Multi-Platform Post Generation",
                "Advanced Analytics Dashboard",
                "Priority Processing",
                "Custom Caption Styles",
                "Priority Email Support",
                "Brand Kit Customization",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">
                  ${currentPlans.pro.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              {billingCycle === "yearly" && (
                <>
                  <p className="text-gray-500 line-through text-sm">
                    ${currentPlans.pro.original}
                  </p>
                  <p className="text-gray-600 text-sm">
                    *paid yearly (${currentPlans.pro.yearly})
                  </p>
                </>
              )}
            </div>
            <button className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-6">
              Start 14-Day Free Trial
            </button>
            <ul className="space-y-3">
              {[
                "40 Videos Per Month",
                "Unlimited AI-Generated Clips",
                "Advanced AI Transcription",
                "Multi-Platform Post Generation",
                "Advanced Analytics Dashboard",
                "Priority Processing",
                "Custom Caption Styles",
                "Priority Support (24/7)",
                "Content Calendar Integration",
                "White Label Branding",
                "API Access",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
