"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { toggleSaveListing } from "@/app/store/userSlice";
import { useRouter } from "next/navigation";
import { Listing } from "@/app/store/searchResultsSlice";

interface SaveListingButtonProps {
  listing: Listing;
}

export default function SaveListingButton({ listing }: SaveListingButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const savedListings = useSelector(
    (state: RootState) => state.user.savedListings
  );

  const userId = useSelector((state: RootState) => state.user.id);
  const isSaved = savedListings.some(
    (savedListing) => savedListing.id === listing.id
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      await dispatch(toggleSaveListing(listing)).unwrap();
    } catch (error) {
      console.error("Failed to save/unsave listing:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button onClick={handleSave} disabled={saving}>
      {isSaved ? "Unsave" : "Save"}
    </button>
  );
}
