"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  fetchUserProfile,
  clearUserListings,
  clearSavedListings,
  clearUser,
} from "@/app/store/userSlice";
import Image from "next/image";
import { clearSearchResults } from "../store/searchResultsSlice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = user.id !== "";
  const savedListingsCount = user.savedListings.length;

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isLoggedIn]);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      dispatch(clearUserListings());
      dispatch(clearSavedListings());
      dispatch(clearUser());
      dispatch(clearSearchResults());
      router.push("/");
    }
  };

  const navItems = isLoggedIn
    ? [
        { name: "Home", href: "/" },
        { name: "Profile", href: "/profile" },
        {
          name: `Saved Listings (${savedListingsCount})`,
          href: "/profile/saved-listings",
        },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Login", href: "/login" },
        { name: "Sign up", href: "/signup" },
      ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/postly_logo_with_text.jpg"
                alt=""
                width={125}
                height={125}
              />
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {isLoggedIn && (
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
