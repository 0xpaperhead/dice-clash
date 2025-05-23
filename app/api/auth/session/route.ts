import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Get JWT secret from environment variable
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    console.error("JWT_SECRET is not set or is too short (should be at least 32 characters)")
    throw new Error("Invalid JWT configuration")
  }
  return new TextEncoder().encode(secret)
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  try {
    // Get JWT secret
    const JWT_SECRET = getJwtSecret()

    // Verify the JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return NextResponse.json({
      authenticated: true,
      publicKey: payload.publicKey,
    })
  } catch (error) {
    console.error("JWT verification failed:", error)
    return NextResponse.json({ authenticated: false })
  }
}
