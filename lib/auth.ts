import { SignJWT, jwtVerify } from "jose";

// Admin credentials
export const ADMIN_CREDENTIALS = {
  email: "admin@example.com",
  password: "123@123Aa",
  name: "Admin",
};

// Get JWT secret from environment
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

// Sign JWT token with user info
export async function signToken(user: { name: string; email: string }, expiresInSeconds?: number) {
  const secret = new TextEncoder().encode(getJWTSecret());
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresInSeconds ?? 24 * 60 * 60);

  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    exp,
    iat: now,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(secret);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(getJWTSecret());
    const { payload } = await jwtVerify(token, secret);
    return payload as { name: string; email: string; exp: number; iat: number };
  } catch (error) {
    return null;
  }
}

// Get token from cookie (for server components)
export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const authCookie = cookies.find((c) => c.startsWith("auth-token="));
  
  if (!authCookie) return null;
  
  return authCookie.split("=")[1];
}

