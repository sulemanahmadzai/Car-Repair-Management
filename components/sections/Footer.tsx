import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  const services = [
    "Engine Diagnostics & Repair",
    "Brake Services",
    "Oil Change & Maintenance",
    "Tire Services",
    "Transmission Repair",
    "AC & Heating",
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "#" },
    { name: "Careers", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        {/* Main Footer Content */}
        <div className="py-16 border-b border-gray-800">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    <span className="text-primary">AUTO</span>LOGIC
                  </h3>
                  <p className="text-xs text-gray-400">Expert Auto Care</p>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner for complete auto care. Professional
                service, honest pricing, and customer satisfaction guaranteed
                since 1998.
              </p>

              {/* Trust Badges */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">ASE Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">BBB A+</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "#" },
                    { icon: Twitter, href: "#" },
                    { icon: Instagram, href: "#" },
                    { icon: Linkedin, href: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all group"
                    >
                      <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary"></span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Our Services
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary"></span>
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href="/services"
                      className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Get In Touch
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary"></span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Address</p>
                    <p className="text-sm text-gray-400">
                      123 Main Street
                      <br />
                      Los Angeles, CA 90001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Phone</p>
                    <a
                      href="tel:+18001234567"
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email</p>
                    <a
                      href="mailto:info@autologic.com"
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      info@autologic.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Hours</p>
                    <p className="text-sm text-gray-400">
                      Mon-Sat: 7AM - 7PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-b border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for tips and special offers
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white placeholder:text-gray-500 flex-1 md:w-80"
              />
              <Button className="bg-primary hover:bg-primary/90 px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2024 AutoLogic. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
