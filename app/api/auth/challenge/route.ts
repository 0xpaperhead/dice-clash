import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import * as nacl from "tweetnacl"
import { redis } from "@/lib/server-utils"

// Challenge expiration time (5 minutes)
const CHALLENGE_EXPIRATION = 5 * 60 // in seconds

export async function POST(request: NextRequest) {
  try {
    const { publicKey } = await request.json()

    if (!publicKey) {
      return NextResponse.json({ error: "Public key is required" }, { status: 400 })
    }

    // Generate a unique challenge message
    const challengeId = nanoid()
    const timestamp = Date.now().toString()
    const challenge = Buffer.from(nacl.randomBytes(32)).toString("hex")

    // Store the challenge
    await redis.set(challengeId, JSON.stringify({
      challenge,
      publicKey,
      createdAt: timestamp,
    }), CHALLENGE_EXPIRATION)

    return NextResponse.json({
      challengeId,
      challenge,
    })
  } catch (error) {
    console.error("Error generating challenge:", error)
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}