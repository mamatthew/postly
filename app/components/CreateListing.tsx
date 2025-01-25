"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, Location } from "@prisma/client";

interface FormData {
  title: string;
  description: string;
  price: string;
  category: Category;
  images: File[];
  city: string;
  postalCode: string;
  email: string;
  location: Location;
  area: string;
}

export default function CreateListing() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    category: Category.MISCELLANEOUS,
    images: [],
    city: "",
    postalCode: "",
    email: "",
    area: "",
    location: Location.CITY_OF_VANCOUVER,
  });
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files),
      });
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          formData.images.map((image) => ({
            fileName: image.name,
            fileType: image.type,
          }))
        ),
      });

      const { presignedUrls, objectUrls } = await res.json();

      await Promise.all(
        formData.images.map((image, index) =>
          fetch(presignedUrls[index], {
            method: "PUT",
            headers: {
              "Content-Type": image.type,
            },
            body: image,
          })
        )
      );

      const listingRes = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: objectUrls,
        }),
      });

      if (listingRes.ok) {
        router.push("/profile");
      } else {
        alert("Failed to create listing");
      }
    } catch (error) {
      console.log("Error uploading images", error);
      return;
    }
  };

  return (
    <div>
      <h1>Create a New Listing</h1>
      <form onSubmit={handleSubmit}>
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
          <label>Images</label>
          <input type="file" multiple onChange={handleImageUpload} />
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
        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
}
