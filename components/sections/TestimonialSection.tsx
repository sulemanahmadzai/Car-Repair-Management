"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Michael Rodriguez",
      role: "Tesla Model 3 Owner",
      rating: 5,
      text: "I've been bringing my Tesla here for the past year, and I couldn't be happier with the service. They're one of the few shops that truly understands electric vehicles. The technicians are knowledgeable, the prices are fair, and they always explain what needs to be done.",
      image: "MR",
      location: "San Francisco, CA",
    },
    {
      name: "Sarah Johnson",
      role: "Honda Accord Owner",
      rating: 5,
      text: "After a bad experience at another shop, I was skeptical about finding honest mechanics. This place changed my mind completely! They only recommended what was actually needed, saved me money, and had my car ready when promised. Highly recommend!",
      image: "SJ",
      location: "Austin, TX",
    },
    {
      name: "David Chen",
      role: "BMW 5 Series Owner",
      rating: 5,
      text: "Best auto shop in the area, hands down. They diagnosed an issue that two other shops missed, fixed it promptly, and charged a fair price. The waiting area is comfortable, and they kept me updated throughout the entire process. Will never go anywhere else.",
      image: "DC",
      location: "Seattle, WA",
    },
    {
      name: "Jennifer Martinez",
      role: "Toyota Camry Owner",
      rating: 5,
      text: "I'm not mechanically inclined, so I always worried about being taken advantage of. The team here takes time to explain everything in terms I can understand. They're patient, professional, and genuinely care about customer satisfaction. Thank you!",
      image: "JM",
      location: "Denver, CO",
    },
    {
      name: "Robert Thompson",
      role: "Ford F-150 Owner",
      rating: 5,
      text: "I've been a customer for over 10 years, and they've never let me down. From routine maintenance to major repairs, they handle everything with expertise. The staff is friendly, the shop is clean, and they stand behind their work. A+ service every time!",
      image: "RT",
      location: "Dallas, TX",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full mb-4">
            Customer Reviews
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what drivers like you have
            to say about our service.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Large Quote Icon */}
            <div className="absolute top-8 left-8 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Quote className="w-10 h-10 text-primary" />
            </div>

            <div className="p-12 lg:p-16 pt-24">
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {Array.from({ length: currentTestimonial.rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-primary text-primary"
                    />
                  )
                )}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-center mb-10">
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed italic">
                  "{currentTestimonial.text}"
                </p>
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  {currentTestimonial.image}
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-600 font-medium">
                  {currentTestimonial.role}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentTestimonial.location}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
              <Button
                onClick={prevTestimonial}
                size="icon"
                variant="outline"
                className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 border-2 border-gray-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                onClick={nextTestimonial}
                size="icon"
                variant="outline"
                className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 border-2 border-gray-200"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 pb-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "2,500+", label: "5-Star Reviews" },
              { value: "98%", label: "Recommend Us" },
              { value: "50,000+", label: "Happy Customers" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
