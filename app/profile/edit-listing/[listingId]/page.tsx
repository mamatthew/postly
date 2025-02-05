"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchUserProfile, editListing } from "@/app/store/userSlice";
import { Category, Location } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
// Remove sharp import
// import sharp from "sharp";

interface FormData {
  title: string;
  description: string;
  price: string;
  imageUrls: string[];
  newImages: File[];
  city: string;
  postalCode: string;
  email: string;
  location: Location;
  category: Category;
}

export default function EditListing() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { listingId } = useParams();
  const listing = useSelector((state: RootState) =>
    state.user.listings.find((listing) => listing.id === listingId)
  );

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    imageUrls: [],
    newImages: [],
    city: "",
    postalCode: "",
    email: "",
    location: Location.CITY_OF_VANCOUVER,
    category: Category.MISCELLANEOUS,
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        imageUrls: listing.imageUrls,
        newImages: [],
        city: listing.city || "",
        postalCode: listing.postalCode,
        email: listing.email,
        location: listing.location,
        category: listing.category,
      });
      setPreviewImages(listing.imageUrls);
    } else {
      dispatch(fetchUserProfile());
    }
  }, [listing, dispatch]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData({
        ...formData,
        newImages: [...formData.newImages, ...newImages],
      });

      // Generate thumbnail preview URLs for the new images
      const newPreviewUrls = await Promise.all(
        newImages.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const base64String = Buffer.from(arrayBuffer).toString("base64");
          const res = await fetch("/api/processImage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageBuffer: base64String }),
          });
          const { resizedImage } = await res.json();
          return `data:image/jpeg;base64,${resizedImage}`;
        })
      );
      setPreviewImages([...previewImages, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImageUrls = [...formData.imageUrls];
    const updatedNewImages = [...formData.newImages];
    const updatedPreviews = [...previewImages];

    if (index < formData.imageUrls.length) {
      updatedImageUrls.splice(index, 1);
    } else {
      const newImageIndex = index - formData.imageUrls.length;
      updatedNewImages.splice(newImageIndex, 1);
    }

    updatedPreviews.splice(index, 1);

    setFormData({
      ...formData,
      imageUrls: updatedImageUrls,
      newImages: updatedNewImages,
    });
    setPreviewImages(updatedPreviews);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload new images
      if (formData.newImages.length > 0) {
        const res = await fetch("/api/uploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            formData.newImages.map((image) => ({
              fileName: image.name,
              fileType: image.type,
            }))
          ),
        });

        const { presignedUrls, objectUrls } = await res.json();

        await Promise.all(
          formData.newImages.map((image, index) =>
            fetch(presignedUrls[index], {
              method: "PUT",
              headers: {
                "Content-Type": image.type,
              },
              body: image,
            })
          )
        );

        // Combine existing image URLs with new image URLs
        const updatedImageUrls = [...formData.imageUrls, ...objectUrls];

        // Update the listing with new data including new image URLs
        await dispatch(
          editListing({
            listingId,
            updatedData: {
              ...formData,
              imageUrls: updatedImageUrls,
              newImages: undefined, // Remove newImages from the data sent to the server
            },
          })
        );
      } else {
        // If no new images, just update the listing with existing data
        await dispatch(editListing({ listingId, updatedData: formData }));
      }

      router.push("/profile");
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("An error occurred while updating the listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-orange-800">
            Edit Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) =>
                  handleChange({ target: { name: "category", value } })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Category).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="images">Images</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-orange-500" />
                    <p className="mb-2 text-sm text-orange-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={`absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                name="location"
                value={formData.location}
                onValueChange={(value) =>
                  handleChange({ target: { name: "location", value } })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Location).map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Listing...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
