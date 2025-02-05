"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  fetchUserProfile,
  clearUserListings,
  clearSavedListings,
} from "@/app/store/userSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setIsLoading(true);
      const resultAction = await dispatch(fetchUserProfile());
      if (fetchUserProfile.rejected.match(resultAction)) {
        router.push("/");
      }
      setIsLoading(false);
    };

    fetchUserProfileData();
  }, [router, dispatch]);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      dispatch(clearUserListings());
      dispatch(clearSavedListings());
      router.push("/");
    }
  };

  const handleDelete = async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchUserProfile());
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user.avatarUrl || "/placeholder-avatar.png"}
                alt={user.name}
              />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardHeader>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Listings</h2>
          <Link href="/profile/create-listing">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Listing
            </Button>
          </Link>
        </div>
        {user.listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.listings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader>
                  <img
                    src={
                      listing.imageUrls.length > 0
                        ? listing.imageUrls[0]
                        : "/placeholder.jpg"
                    }
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{listing.description}</p>
                  <p className="text-lg font-bold text-orange-600">
                    ${listing.price}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/profile/edit-listing/${listing.id}`}>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No listings found</p>
              <Link href="/profile/create-listing">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
