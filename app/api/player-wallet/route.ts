import { type NextRequest, NextResponse } from "next/server"
import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"

// In-memory store for player wallets (in production, use a database)
const PLAYER_WALLETS: Record<string, { playerWallet: string; playerSecretKey: string }> = {}

export async function GET(request: NextRequest) {
  try {
    // The middleware has already verified the JWT and added the public key to headers
    const userPublicKey = request.headers.get("x-user-public-key")

    if (!userPublicKey) {
      console.error("No user public key found in request headers")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log(`Fetching player wallet for user: ${userPublicKey.slice(0, 4)}...${userPublicKey.slice(-4)}`)

    // Check if the user already has a player wallet
    if (PLAYER_WALLETS[userPublicKey]) {
      console.log("Existing player wallet found")
      return NextResponse.json({
        playerWallet: PLAYER_WALLETS[userPublicKey].playerWallet,
      })
    }

    console.log("Generating new player wallet")
    // Generate a new player wallet
    const playerKeypair = Keypair.generate()
    const playerWallet = playerKeypair.publicKey.toString()
    const playerSecretKey = bs58.encode(playerKeypair.secretKey)

    // Store the player wallet (in production, save to database)
    PLAYER_WALLETS[userPublicKey] = {
      playerWallet,
      playerSecretKey,
    }

    console.log(`New player wallet generated: ${playerWallet.slice(0, 4)}...${playerWallet.slice(-4)}`)
    return NextResponse.json({
      playerWallet,
    })
  } catch (error) {
    console.error("Error in player wallet API:", error)
    return NextResponse.json({ error: "Failed to process player wallet request" }, { status: 500 })
  }
}
