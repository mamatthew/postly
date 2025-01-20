import { SignJWT, jwtVerify } from "jose";
import { setCookie, deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(
  userId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ userId, expiresAt });

  setCookie("session", session, {
    req,
    res,
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  console.log("session", session);
}

export async function updateSession(
  userId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  deleteSession(req, res);
  createSession(userId, req, res);
}

export async function deleteSession(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie("session", { req, res });
}

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}
