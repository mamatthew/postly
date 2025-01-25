"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchUserProfile, editListing } from "@/app/store/userSlice";
import { Category, Location } from "@prisma/client";

export default function EditListing() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { listingId } = useParams();
  const listing = useSelector((state: RootState) =>
    state.user.listings.find((listing) => listing.id === listingId)
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrls: [],
    city: "",
    postalCode: "",
    email: "",
    location: Location.CITY_OF_VANCOUVER,
    category: Category.MISCELLANEOUS,
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        imageUrls: listing.imageUrls,
        city: listing.city || "",
        postalCode: listing.postalCode,
        email: listing.email,
        location: listing.location,
        category: listing.category,
      });
    } else {
      dispatch(fetchUserProfile());
    }
  }, [listing, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    await dispatch(editListing({ listingId, updatedData: formData }));
    router.push("/profile");
  };

  return (
    <div>
      <h1>Edit Listing</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            {Object.values(Location).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Image URLs</label>
          <input
            type="text"
            name="imageUrls"
            value={formData.imageUrls.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                imageUrls: e.target.value.split(", "),
              })
            }
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
