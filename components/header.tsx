"use client";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  CircleIcon,
  Home,
  LogOut,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Search,
  MessageCircle,
  PhoneCall,
} from "lucide-react";

// Import UserMenu from the layout file
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/schema";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignOut() {
    await signOut();
    mutate("/api/user");
    router.push("/");
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-white hover:text-orange-500"
        >
          Pricing
        </Link>
        <Button
          asChild
          className="rounded-full bg-orange-500 hover:bg-orange-600"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-white hover:text-orange-500"
        >
          Pricing
        </Link>
        <Button
          asChild
          className="rounded-full bg-orange-500 hover:bg-orange-600"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ""} />
          <AvatarFallback>
            {user.name && user.name.trim()
              ? user.name
                  .trim()
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n) => n[0]?.toUpperCase() || "")
                  .join("")
              : user.email && user.email.includes("@")
              ? (user.email.split("@")[0][0] || "U").toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  return (
    <div className="relative">
      {/* Header Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex items-center flex-wrap gap-6">
              <div className="flex items-center gap-2 group hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="font-medium">
                  Mon - Sat: 7:00 AM - 7:00 PM
                </span>
              </div>
              <div className="flex items-center gap-2 group hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium">
                  123 Main Street, Los Angeles, CA
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 mr-2">Follow Us:</span>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header Middle + Navigation - Combined Sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Header Middle */}
        <div className="py-5 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    <span className="text-primary">AUTO</span>
                    <span className="text-gray-900">LOGIC</span>
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    Expert Auto Care
                  </p>
                </div>
              </Link>

              {/* Contact Info & CTA */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Phone */}
                <div className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <PhoneCall className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Call Us 24/7
                    </p>
                    <a
                      href="tel:+18001234567"
                      className="text-lg font-bold text-gray-900 hover:text-primary transition-colors"
                    >
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Email Us
                    </p>
                    <a
                      href="mailto:info@autologic.com"
                      className="text-lg font-bold text-gray-900 hover:text-primary transition-colors"
                    >
                      info@autologic.com
                    </a>
                  </div>
                </div>

                {/* Book Now Button */}
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105"
                  onClick={() => (window.location.href = "/booking")}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>

                {/* User Menu */}
                <Suspense
                  fallback={
                    <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                  }
                >
                  <UserMenu />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Header Navigation */}
        <header className="bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <nav className="hidden lg:flex items-center space-x-1">
                <Link
                  href="/"
                  className="relative px-4 py-2 text-primary font-semibold group"
                >
                  <span>Home</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                </Link>
                <Link
                  href="/about"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors group"
                >
                  <span>About</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/services"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors group"
                >
                  <span>Services</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/pricing"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors group"
                >
                  <span>Pricing</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/contact"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors group"
                >
                  <span>Contact</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center group transition-colors">
                  <Search className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                </button>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm">Open Now</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
