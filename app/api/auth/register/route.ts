import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { validateEmail, validatePassword } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const emailError = validateEmail(typeof email === "string" ? email : "");
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const passwordError = validatePassword(
      typeof password === "string" ? password : ""
    );
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    await User.create({ email: normalizedEmail, password });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register failed", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "An unexpected error occurred while registering";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
