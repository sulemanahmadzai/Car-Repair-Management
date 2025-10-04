"use client";

import {
  Clock,
  Shield,
  DollarSign,
  Award,
  Wrench,
  HeartHandshake,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Fast & Reliable Service",
      description:
        "Same-day appointments available. Get your car back on the road quickly without compromising quality.",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "12-Month Warranty",
      description:
        "All repairs backed by our comprehensive warranty. Drive with confidence knowing you're protected.",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description:
        "No hidden fees or surprise charges. Get upfront quotes and only pay for what you need.",
      color: "bg-primary",
      bgColor: "bg-orange-50",
    },
    {
      icon: Award,
      title: "Certified Technicians",
      description:
        "ASE-certified mechanics with years of experience handling all makes and models.",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Wrench,
      title: "Advanced Equipment",
      description:
        "State-of-the-art diagnostic tools and equipment for accurate repairs every time.",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      icon: HeartHandshake,
      title: "Customer First",
      description:
        "Your satisfaction is our priority. Experience friendly, honest service you can trust.",
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            The Benefits of Working With Us
          </h2>
          <p className="text-lg text-gray-600">
            Experience the difference of professional auto care that puts your
            needs first. Here's what sets us apart from the competition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 cursor-pointer overflow-hidden"
            >
              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative">
                {/* Icon */}
                <div
                  className={`inline-flex w-16 h-16 rounded-xl ${feature.bgColor} items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className="w-8 h-8"
                    style={{
                      color:
                        feature.color === "bg-primary"
                          ? "hsl(var(--primary))"
                          : feature.color === "bg-blue-500"
                          ? "#3b82f6"
                          : feature.color === "bg-green-500"
                          ? "#22c55e"
                          : feature.color === "bg-purple-500"
                          ? "#a855f7"
                          : feature.color === "bg-indigo-500"
                          ? "#6366f1"
                          : "#ec4899",
                    }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Still have questions? Our team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-primary font-semibold hover:underline"
          >
            Contact Us Today
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
