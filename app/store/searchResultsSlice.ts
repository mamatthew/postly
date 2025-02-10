import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

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
  email: string;
}

interface SearchResultState {
  listings: Listing[];
  currentListingIndex: number | undefined;
  status: string;
  cursor: number | Date | null;
  limit: number;
}

export const fetchSearchResults = createAsyncThunk(
  "searchResults/fetchSearchResults",
  async ({
    query,
    category,
    location,
    cursor = null,
    direction = "next",
    limit = 10,
  }: {
    query: string;
    category: string;
    location: string;
    cursor?: number | Date | null;
    direction?: string;
    limit?: number;
  }) => {
    console.log("Fetching search results with:", {
      query,
      category,
      location,
      cursor,
      direction,
      limit,
    });
    const response = await fetch(
      `/api/search?query=${query}&category=${
        category !== "All" ? category : null
      }&location=${
        location !== "All" ? location : null
      }&cursor=${cursor}&direction=${direction}&limit=${limit}`
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
  cursor: null,
  limit: 10,
};

const searchResultSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.listings = [];
      state.status = "idle";
      state.currentListingIndex = undefined;
      state.cursor = null;
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
        state.listings = action.payload.slice(0, state.limit);
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
