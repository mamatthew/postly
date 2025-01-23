"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  fetchUserProfile,
  clearUserListings,
  clearSavedListings,
  clearUser,
} from "@/app/store/userSlice";

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
      router.push("/");
    }
  };

  return (
    <nav>
      <Link href="/">
        <button>Home</button>
      </Link>
      {isLoggedIn ? (
        <div>
          <Link href="/profile">
            <button>Your Account</button>
          </Link>
          <Link href="/saved-listings">
            <button>Saved Listings ({savedListingsCount})</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
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
