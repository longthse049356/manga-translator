"use server";

import { cookies } from "next/headers";
import { signToken, verifyToken, ADMIN_CREDENTIALS } from "@/lib/auth";

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResponse> {
  // Validate credentials
  if (
    email !== ADMIN_CREDENTIALS.email ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  try {
    // Cookie expiration time (in seconds)
    const maxAge = 86400; // 1 day in seconds
    
    // Generate JWT token with same expiration as cookie
    const token = await signToken(
      {
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
      },
      maxAge // Pass maxAge to sync JWT expiration with cookie
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to create session",
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}

export async function verifyAuthAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return { authenticated: false };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: {
      name: payload.name,
      email: payload.email,
    },
  };
}

