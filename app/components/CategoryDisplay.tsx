"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Laptop,
  Sofa,
  Shirt,
  Wrench,
  BookOpen,
  PawPrint,
  Gamepad2,
  Palette,
  Sparkles,
  Dumbbell,
  Home,
  Package,
  Baby,
  Stethoscope,
} from "lucide-react";

const categoryIcons = {
  ELECTRONICS: Laptop,
  FURNITURE: Sofa,
  CLOTHING: Shirt,
  TOOLS: Wrench,
  BOOKS: BookOpen,
  PETS: PawPrint,
  TOYS: Gamepad2,
  HOBBIES_LEISURE: Palette,
  FASHION_BEAUTY: Sparkles,
  SPORTS: Dumbbell,
  HOME: Home,
  MISCELLANEOUS: Package,
  KIDS_BABY: Baby,
  HEALTH_FITNESS: Stethoscope,
};

export default function CategoryDisplay() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-800">
        Browse Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.keys(categoryIcons).map((category) => {
          const Icon = categoryIcons[category];
          return (
            <Link key={category} href={`/search-listings?category=${category}`}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:bg-orange-50 border-orange-200">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Icon className="w-8 h-8 mb-2 text-orange-500" />
                  <span className="text-sm text-center text-orange-700 font-medium">
                    {category.replace("_", " & ")}
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
