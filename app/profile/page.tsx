"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const result = await response.json();
        setUser(result.user);
      } else {
        router.push("/");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.push("/");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user.username}!</p>
      <p>Email: {user.email}</p>
      <Link href="/create-listing">
        <button>Create New Listing</button>
      </Link>
      <div>Your listings...</div>
      <div>Your Saved Listings...</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
