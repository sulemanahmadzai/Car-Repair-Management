import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import StatsSection from "@/components/sections/StatsSection";
import WorkProcessSection from "@/components/sections/WorkProcessSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <WorkProcessSection />
      <TestimonialSection />
      <BlogSection />
      <ContactSection />

      {/* Client Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-12 opacity-50">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center"
              >
                <span className="text-gray-400 font-bold">LOGO</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
