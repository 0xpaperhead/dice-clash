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

// Paths that require authentication
const PROTECTED_PATHS = ["/api/player-wallet"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path requires authentication
  if (PROTECTED_PATHS.some((prefix) => path.startsWith(prefix))) {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    try {
      // Get JWT secret
      const JWT_SECRET = getJwtSecret()

      // Verify the JWT token
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Add the user's public key to the request headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-public-key", payload.publicKey as string)

      // Continue with the modified request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error("JWT verification failed:", error)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  }

  // For non-protected paths, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
