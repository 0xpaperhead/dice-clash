import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

// In-memory store for challenges (in production, use Redis or similar)
const CHALLENGES: Record<string, { message: string; publicKey: string; createdAt: number }> = {}

// Challenge expiration time (5 minutes)
const CHALLENGE_EXPIRATION = 5 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const { publicKey } = await request.json()

    if (!publicKey) {
      return NextResponse.json({ error: "Public key is required" }, { status: 400 })
    }

    // Generate a unique challenge message
    const challengeId = nanoid()
    const timestamp = Date.now()
    const message = `Sign this message to verify your wallet ownership: ${challengeId}`

    // Store the challenge
    CHALLENGES[challengeId] = {
      message,
      publicKey,
      createdAt: timestamp,
    }

    // Clean up expired challenges
    Object.keys(CHALLENGES).forEach((id) => {
      if (timestamp - CHALLENGES[id].createdAt > CHALLENGE_EXPIRATION) {
        delete CHALLENGES[id]
      }
    })

    return NextResponse.json({
      challengeId,
      message,
    })
  } catch (error) {
    console.error("Error generating challenge:", error)
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}

// Export the challenges for verification
export { CHALLENGES }
