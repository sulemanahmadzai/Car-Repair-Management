"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Phone, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden min-h-[90vh]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/hero1.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent"></div>

      {/* Animated Orange Accents */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary border-2 border-gray-900 flex items-center justify-center"
                  >
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-300 font-medium">
                Trusted by 5,000+ Happy Customers
              </span>
            </div>

            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Expert Auto Care
                <span className="block text-primary mt-2">
                  That Keeps You Rolling
                </span>
              </h1>
              <p className="text-xl text-gray-300 mt-6 leading-relaxed">
                Professional car repair and maintenance services you can trust.
                From routine maintenance to complex repairs, we've got you
                covered with certified technicians and state-of-the-art
                equipment.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Calendar, text: "Same-Day Service Available" },
                { icon: Phone, text: "24/7 Emergency Support" },
                { icon: MapPin, text: "Mobile Service Available" },
                { icon: Star, text: "Certified Technicians" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-gray-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all duration-300"
                onClick={() => (window.location.href = "/booking")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                onClick={() => (window.location.href = "tel:+18001234567")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-6 border-t border-gray-700">
              {[
                { value: "25+", label: "Years Experience" },
                { value: "50K+", label: "Cars Serviced" },
                { value: "4.9★", label: "Customer Rating" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Featured Services Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Floating Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Quick Quote
                  </h3>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select Service
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                      <option>Oil Change & Filter</option>
                      <option>Brake Inspection & Repair</option>
                      <option>Engine Diagnostics</option>
                      <option>Tire Rotation & Balance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                    onClick={() => (window.location.href = "/booking")}
                  >
                    Get Instant Quote
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-around pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-primary font-bold text-lg">30 Min</div>
                    <div className="text-xs text-gray-600">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-bold text-lg">Free</div>
                    <div className="text-xs text-gray-600">Inspection</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-bold text-lg">
                      Warranty
                    </div>
                    <div className="text-xs text-gray-600">Guaranteed</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -right-4 -bottom-4 w-full h-full bg-primary/20 rounded-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 fill-white"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path d="M0,24 C240,48 480,48 720,24 C960,0 1200,0 1440,24 L1440,48 L0,48 Z"></path>
        </svg>
      </div>
    </section>
  );
}
