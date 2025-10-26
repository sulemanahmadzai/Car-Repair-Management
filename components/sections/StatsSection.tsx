"use client";

import {
  Users,
  TrendingUp,
  Car,
  Award,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: 50000,
      suffix: "+",
      label: "Happy Customers",
      duration: 2000,
    },
    {
      icon: Car,
      number: 100000,
      suffix: "+",
      label: "Cars Serviced",
      duration: 2500,
    },
    {
      icon: TrendingUp,
      number: 25,
      suffix: "+",
      label: "Years Experience",
      duration: 1500,
    },
    {
      icon: Award,
      number: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      duration: 1800,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-700 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Diagonal Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Drivers
          </h2>
          <p className="text-xl text-white/90">
            Our numbers speak for themselves
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 100} />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t border-white/20">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/90">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" />
              <span className="font-semibold">ASE Certified</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              <span className="font-semibold">BBB Accredited</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <span className="font-semibold">Same-Day Service</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <span className="font-semibold">12-Month Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  number,
  suffix,
  label,
  duration,
  delay,
}: {
  icon: any;
  number: number;
  suffix: string;
  label: string;
  duration: number;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * number));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, number, duration, delay]);

  return (
    <div
      ref={ref}
      className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 group-hover:bg-white/30 transition-colors">
        <Icon className="w-8 h-8" />
      </div>

      {/* Number */}
      <div className="text-5xl font-bold mb-3">
        {count.toLocaleString()}
        {suffix}
      </div>

      {/* Label */}
      <div className="text-lg font-medium text-white/90">{label}</div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none"></div>
    </div>
  );
}
