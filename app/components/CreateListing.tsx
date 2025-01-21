"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  images: File[];
}

export default function CreateListing() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    category: "MISCELLANEOUS",
    images: [],
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
            <option value="ELECTRONICS">Electronics</option>
            <option value="FURNITURE">Furniture</option>
            <option value="CLOTHING">Clothing</option>
            <option value="TOOLS">Tools</option>
            <option value="BOOKS">Books</option>
            <option value="PETS">Pets</option>
            <option value="TOYS">Toys</option>
            <option value="HOBBIES_LEISURE">Hobbies & Leisure</option>
            <option value="FASHION_BEAUTY">Fashion & Beauty</option>
            <option value="SPORTS">Sports</option>
            <option value="HOME">Home</option>
            <option value="MISCELLANEOUS">Miscellaneous</option>
            <option value="KIDS_BABY">Kids & Baby</option>
            <option value="HEALTH_FITNESS">Health & Fitness</option>
          </select>
        </div>
        <div>
          <label>Images</label>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>
        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
}
