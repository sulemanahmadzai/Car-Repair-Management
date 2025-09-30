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
import { useState } from "react";
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
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate("/api/user");
    router.push("/");
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
            {user.email
              .split(" ")
              .map((n) => n[0])
              .join("")}
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
      {/* Header Top */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Mon - Tues : 6.00 am - 10.00 pm</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>150 Street, London, USA</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-orange-500">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-orange-500">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-orange-500">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header Middle + Navigation - Combined Sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Header Middle */}
        <div className="py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="w-full lg:w-auto mb-4 lg:mb-0">
                <Link href="/" className="text-2xl font-bold text-gray-800">
                  <span className="text-orange-500">AUTO</span>LOGIC
                </Link>
              </div>
              <div className="flex flex-wrap items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h5 className="font-semibold text-gray-800">Call Us Now</h5>
                    <span className="text-sm text-gray-600">
                      +(008) 001-234-567
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneCall className="w-8 h-8 text-orange-500" />
                  <div>
                    <h5 className="font-semibold text-gray-800">
                      Mail Us Today
                    </h5>
                    <span className="text-sm text-gray-600">
                      youremail@gmail.com
                    </span>
                  </div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2">
                  Get a Quote
                </Button>
                <Suspense fallback={<div className="h-9" />}>
                  <UserMenu />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Header Navigation */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <nav className="hidden lg:flex space-x-8">
                <Link
                  href="/"
                  className="text-orange-500 font-medium hover:text-orange-600"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-orange-500"
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  className="text-gray-700 hover:text-orange-500"
                >
                  Services
                </Link>
                <a href="#" className="text-gray-700 hover:text-orange-500">
                  Projects
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500">
                  Pages
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500">
                  Blog
                </a>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-orange-500"
                >
                  Contact
                </Link>
              </nav>
              <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
