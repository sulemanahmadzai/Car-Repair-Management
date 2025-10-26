import ServicesSection from "@/components/sections/ServicesSection";
import StatsSection from "@/components/sections/StatsSection";
import WorkProcessSection from "@/components/sections/WorkProcessSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import BreadcrumbSection from "@/components/sections/BreadcrumbSection";
import { Settings, Car, Wrench, Gauge, Battery } from "lucide-react";

export default function ServicesPage() {
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Services" }];
  const detailedServices = [
    {
      icon: Settings,
      title: "Engine Repair & Maintenance",
      description:
        "Complete engine diagnostics, repair, and regular maintenance services to keep your vehicle running smoothly.",
      features: [
        "Engine Diagnostics",
        "Oil Changes",
        "Tune-ups",
        "Engine Rebuilds",
      ],
    },
    {
      icon: Car,
      title: "Tire Services",
      description:
        "Professional tire installation, balancing, rotation, and replacement services for all vehicle types.",
      features: [
        "Tire Installation",
        "Wheel Balancing",
        "Tire Rotation",
        "Flat Tire Repair",
      ],
    },
    {
      icon: Wrench,
      title: "Transmission Services",
      description:
        "Expert transmission repair, maintenance, and replacement services for manual and automatic transmissions.",
      features: [
        "Transmission Repair",
        "Fluid Changes",
        "Clutch Service",
        "Transmission Rebuilds",
      ],
    },
    {
      icon: Gauge,
      title: "Advanced Diagnostics",
      description:
        "State-of-the-art computer diagnostics to identify and resolve complex vehicle issues quickly.",
      features: [
        "Computer Diagnostics",
        "Error Code Reading",
        "System Analysis",
        "Performance Testing",
      ],
    },
    {
      icon: Battery,
      title: "Electrical Services",
      description:
        "Comprehensive electrical system services including battery, alternator, and starter repairs.",
      features: [
        "Battery Testing",
        "Alternator Repair",
        "Starter Service",
        "Wiring Repairs",
      ],
    },
    {
      icon: Settings,
      title: "Brake Services",
      description:
        "Complete brake system inspection, repair, and replacement to ensure your safety on the road.",
      features: [
        "Brake Inspection",
        "Pad Replacement",
        "Rotor Service",
        "Brake Fluid Change",
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}

      {/* Standard Services Grid */}
      <ServicesSection />

      <Footer />
    </div>
  );
}
