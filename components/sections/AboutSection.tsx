"use client";

import { Button } from "@/components/ui/button";
import { Check, Award, Users, ThumbsUp, Play } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  const achievements = [
    { icon: Award, value: "25+", label: "Years in Business" },
    { icon: Users, value: "50,000+", label: "Happy Customers" },
    { icon: ThumbsUp, value: "98%", label: "Satisfaction Rate" },
  ];

  const benefits = [
    "ASE Certified Master Technicians",
    "Honest, Upfront Pricing - No Hidden Fees",
    "Complimentary Multi-Point Inspection",
    "12-Month / 12,000 Mile Warranty",
    "Free Shuttle Service & Loaner Cars",
    "Online Appointment Scheduling 24/7",
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Image */}
              <div className="col-span-2 relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Award className="w-24 h-24 text-gray-400" />
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-xl p-6 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <ThumbsUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        4.9/5
                      </div>
                      <div className="text-sm text-gray-600">
                        Customer Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Images */}
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-500" />
                </div>
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Award className="w-12 h-12 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Video Play Button Overlay */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <button className="group w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-primary ml-1 group-hover:text-primary/80" />
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full mb-4">
                About Our Garage
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your Trusted Partner for
                <span className="text-primary"> Complete Auto Care</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                For over 25 years, we've been the go-to auto repair shop for
                drivers who demand excellence. Our certified technicians combine
                cutting-edge technology with old-fashioned customer service to
                keep your vehicle running smoothly.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe in transparency, quality workmanship, and building
                lasting relationships with our customers. That's why we provide
                detailed explanations, fair pricing, and warranty protection on
                all our services.
              </p>
            </div>

            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-4 py-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <achievement.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8"
                onClick={() => (window.location.href = "/booking")}
              >
                Schedule Service
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-primary"
                onClick={() => (window.location.href = "/about")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
