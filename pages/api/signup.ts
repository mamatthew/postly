import { NextApiRequest, NextApiResponse } from "next";
import { SignupFormSchema } from "@/app/lib/definitions";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const validatedFields = SignupFormSchema.safeParse(req.body);

    if (!validatedFields.success) {
      return res.status(400).json({
        errors: validatedFields.error.flatten().fieldErrors,
      });
    }

    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    await createSession(newUser.id, req, res);

    console.log("new user created!", newUser);

    res.status(200).json({ message: "User registered successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
