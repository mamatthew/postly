"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkLoginStatus = async () => {
    const response = await fetch("/api/profile");
    if (response.ok) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    checkLoginStatus();
  }, [pathname]);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      setIsLoggedIn(false);
      router.push("/");
    }
  };

  return (
    <nav>
      <Link href="/">
        <button>Home</button>
      </Link>
      {isLoggedIn ? (
        <>
          <Link href="/profile">
            <button>Your Account</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/signup">
            <button>Sign Up</button>
          </Link>
          <Link href="/login">
            <button>Log In</button>
          </Link>
        </>
      )}
    </nav>
  );
}
