import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      username: "user123",
      password: "password",
    },
  });

  const listings = [
    {
      title: "iPhone 12",
      description: "A brand new iPhone 12",
      price: 799.99,
      userId: user.id,
      category: "ELECTRONICS",
    },
    {
      title: "Sofa",
      description: "A comfortable sofa",
      price: 299.99,
      userId: user.id,
      category: "FURNITURE",
    },
    {
      title: "Running Shoes",
      description: "A pair of running shoes",
      price: 49.99,
      userId: user.id,
      category: "SPORTS",
    },
    {
      title: "Mountain Bike",
      description: "A high-quality mountain bike",
      price: 499.99,
      userId: user.id,
      category: "SPORTS",
    },
    {
      title: "Laptop",
      description: "A powerful laptop for work and play",
      price: 999.99,
      userId: user.id,
      category: "ELECTRONICS",
    },
    {
      title: "Coffee Table",
      description: "A stylish coffee table",
      price: 89.99,
      userId: user.id,
      category: "FURNITURE",
    },
    {
      title: "Winter Jacket",
      description: "A warm winter jacket",
      price: 129.99,
      userId: user.id,
      category: "CLOTHING",
    },
    {
      title: "Electric Drill",
      description: "A versatile electric drill",
      price: 59.99,
      userId: user.id,
      category: "TOOLS",
    },
    {
      title: "Cookbook",
      description: "A cookbook with delicious recipes",
      price: 19.99,
      userId: user.id,
      category: "BOOKS",
    },
    {
      title: "Dog Bed",
      description: "A comfortable bed for your dog",
      price: 39.99,
      userId: user.id,
      category: "PETS",
    },
    {
      title: "Gaming Console",
      description: "A next-gen gaming console",
      price: 499.99,
      userId: user.id,
      category: "ELECTRONICS",
    },
    {
      title: "Blender",
      description: "A high-speed blender",
      price: 59.99,
      userId: user.id,
      category: "HOME",
    },
    {
      title: "Yoga Mat",
      description: "A non-slip yoga mat",
      price: 29.99,
      userId: user.id,
      category: "HEALTH_FITNESS",
    },
    {
      title: "Desk Lamp",
      description: "An adjustable desk lamp",
      price: 24.99,
      userId: user.id,
      category: "HOME",
    },
    {
      title: "Smart Watch",
      description: "A smart watch with various features",
      price: 199.99,
      userId: user.id,
      category: "ELECTRONICS",
    },
    {
      title: "Backpack",
      description: "A durable backpack for travel",
      price: 49.99,
      userId: user.id,
      category: "FASHION_BEAUTY",
    },
    {
      title: "Electric Kettle",
      description: "A fast-boiling electric kettle",
      price: 39.99,
      userId: user.id,
      category: "HOME",
    },
    {
      title: "Board Game",
      description: "A fun board game for family",
      price: 29.99,
      userId: user.id,
      category: "TOYS",
    },
    {
      title: "Sunglasses",
      description: "Stylish sunglasses for summer",
      price: 19.99,
      userId: user.id,
      category: "FASHION_BEAUTY",
    },
    // Add more listings as needed
  ];

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
