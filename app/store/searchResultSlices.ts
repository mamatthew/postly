import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Listing {
  imageUrl: string;
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  imageUrls: string[] | null;
  category: string;
  city: string;
  postalCode: string;
  rank: number | null;
}

interface SearchResultState {
  listings: Listing[];
  currentListingIndex: number | undefined;
  status: string;
}

export const fetchSearchResults = createAsyncThunk(
  "searchResults/fetchSearchResults",
  async ({
    query,
    category,
    location,
  }: {
    query: string;
    category: string;
    location: string;
  }) => {
    console.log("Fetching search results with:", { query, category, location });
    const response = await fetch(
      `/api/search?query=${query}&category=${
        category !== "All" ? category : ""
      }&location=${location !== "All" ? location : ""}`
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to fetch search results");
  }
);

const initialState: SearchResultState = {
  listings: [],
  status: "idle",
  currentListingIndex: undefined,
};

const searchResultSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.listings = [];
    },
    setCurrentListingIndex(state, action) {
      state.currentListingIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.listings = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearSearchResults, setCurrentListingIndex } =
  searchResultSlice.actions;

export default searchResultSlice.reducer;
