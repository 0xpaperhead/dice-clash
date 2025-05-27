import { type NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import * as nacl from "tweetnacl"
import { SignJWT } from "jose"
import { redis } from "@/lib/server-utils"

// Get JWT secret from environment variable
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    console.error("JWT_SECRET is not set or is too short (should be at least 32 characters)")
    throw new Error("Invalid JWT configuration")
  }
  return new TextEncoder().encode(secret)
}

// JWT expiration (24 hours)
const JWT_EXPIRATION = "24h"

export async function POST(request: NextRequest) {
  try {
    const { challengeId, signature, publicKey } = await request.json()

    if (!challengeId || !signature || !publicKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Retrieve the challenge
    const challenge = await redis.get(challengeId)
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found or expired" }, { status: 400 })
    }

    // Clean up the used challenge
    await redis.del(challengeId)

    const challengeData = JSON.parse(challenge)

    // Verify the public key matches the one that requested the challenge
    if (challengeData.publicKey !== publicKey) {
      return NextResponse.json({ error: "Public key mismatch" }, { status: 400 })
    }

    // Verify the signature
    try {
      const messageBytes = new TextEncoder().encode(challengeData.challenge)
      const signatureBytes = Buffer.from(signature, "base64")
      const publicKeyBytes = new PublicKey(publicKey).toBytes()

      const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)

      if (!verified) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    } catch (error) {
      console.error("Signature verification error:", error)
      return NextResponse.json({ error: "Signature verification failed" }, { status: 401 })
    }

        

    try {
      // Get JWT secret
      const JWT_SECRET = getJwtSecret()

      // Create a JWT token
      const token = await new SignJWT({ publicKey })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(JWT_SECRET)

      // Set the JWT as an HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
      })

      response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
      })

      return response
    } catch (error) {
      console.error("JWT creation error:", error)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
