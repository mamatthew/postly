import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Listing } from "./searchResultsSlice";

interface User {
  id: string;
  name: string;
  email: string;
  listings: Listing[];
  savedListings: Listing[];
  status: string;
}

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async () => {
    console.log("fetching user profile from async thunk");
    const response = await fetch("/api/profile");
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to fetch user profile");
  }
);

export const deleteListing = createAsyncThunk(
  "listings/deleteListing",
  async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return listingId;
    }
  }
);

export const editListing = createAsyncThunk(
  "listings/editListing",
  async ({
    listingId,
    updatedData,
  }: {
    listingId: string;
    updatedData: Partial<Listing>;
  }) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
      headers: { "Content-Type": "application/json" },
    });
    return response.json(); // Return the updated listing
  }
);

export const toggleSaveListing = createAsyncThunk<Listing, Listing>(
  "listings/saveListing",
  async (listing) => {
    console.log("entering toggleSaveListing for listing: ", listing);
    const response = await fetch("/api/listings/save", {
      method: "POST",
      body: JSON.stringify({ listingId: listing.id }),
      headers: { "Content-Type": "application/json" },
    });
    return response.json(); // Return the saved listing data
  }
);

// Initial state for listings
const initialState: User = {
  id: "",
  name: "",
  email: "",
  listings: [],
  savedListings: [],
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserListings(state) {
      state.listings = [];
    },
    clearSavedListings(state) {
      state.savedListings = [];
    },
    clearUser(state) {
      state.id = "";
      state.name = "";
      state.email = "";
      state.listings = [];
      state.savedListings = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user listings
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, email, username, listings, saved_listings } =
            action.payload;
          state.id = id;
          state.email = email;
          state.name = username;
          state.listings = listings;
          state.savedListings = saved_listings;
          state.status = "succeeded";
        } else {
          state.status = "failed";
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.status = "failed";
      })

      // Handle delete listing
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.listings = state.listings.filter(
          (listing) => listing.id !== action.payload
        );
      })

      // Handle edit listing
      .addCase(editListing.fulfilled, (state, action) => {
        const index = state.listings.findIndex(
          (listing) => listing.id === action.payload.id
        );
        if (index !== -1) {
          state.listings[index] = action.payload;
        }
      })

      // Handle optimistic updates for toggleSaveListing
      .addCase(toggleSaveListing.pending, (state, action) => {
        console.log("Optimistically updating state for toggleSaveListing");
        const listing = action.meta.arg;
        const isSaved = state.savedListings.some(
          (savedListing) => savedListing.id === listing.id
        );
        if (isSaved) {
          state.savedListings = state.savedListings.filter(
            (savedListing) => savedListing.id !== listing.id
          );
        } else {
          state.savedListings.push(listing);
        }
      })
      .addCase(toggleSaveListing.fulfilled, (state, action) => {
        // No need to update state here as it was already updated optimistically
        console.log("Successfully saved/unsaved listing:", action.payload);
      })
      .addCase(toggleSaveListing.rejected, (state, action) => {
        console.error("Failed to save/unsave listing:", action.error);
        const listing = action.meta.arg;
        const isSaved = state.savedListings.some(
          (savedListing) => savedListing.id === listing.id
        );
        if (!isSaved) {
          state.savedListings.push(listing);
        } else {
          state.savedListings = state.savedListings.filter(
            (savedListing) => savedListing.id !== listing.id
          );
        }
      });
  },
});

export const { clearUserListings, clearSavedListings, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
