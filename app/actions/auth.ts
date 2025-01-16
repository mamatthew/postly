import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { createSession, deleteSession } from "../lib/session";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { username, email, password } = validatedFields.data;

  const prisma = new PrismaClient();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      message: "User with the same email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  //await createSession(newUser.id);

  console.log("new user created!", newUser);

  redirect("/profile");
}

export async function logout() {
  //deleteSession();
  redirect("/");
}
