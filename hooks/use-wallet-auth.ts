"use client"

import { useState, useCallback, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

interface AuthState {
  isAuthenticated: boolean
  isAuthenticating: boolean
  error: string | null
}

export function useWalletAuth() {
  const { publicKey, signMessage, connected } = useWallet()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
  })

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...")
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: data.authenticated,
          }))
        } else {
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: false,
          }))
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
        }))
      }
    }

    if (connected) {
      checkAuth()
    } else {
      setAuthState({
        isAuthenticated: false,
        isAuthenticating: false,
        error: null,
      })
    }
  }, [connected])

  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setAuthState((prev) => ({
        ...prev,
        error: "Wallet not connected or doesn't support message signing",
      }))
      return false
    }

    setAuthState((prev) => ({
      ...prev,
      isAuthenticating: true,
      error: null,
    }))

    try {
      console.log("Starting authentication process...")

      // Step 1: Generate a challenge
      console.log("Requesting challenge from server...")
      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
        }),
      })

      if (!challengeResponse.ok) {
        const errorData = await challengeResponse.json()
        throw new Error(errorData.error || "Failed to generate challenge")
      }

      const { challengeId, message } = await challengeResponse.json()
      console.log("Challenge received:", { challengeId, message })

      // Step 2: Sign the challenge message
      console.log("Signing challenge message...")
      const messageUint8 = new TextEncoder().encode(message)

      let signature: Uint8Array
      try {
        signature = await signMessage(messageUint8)
        console.log("Message signed successfully")
      } catch (signError) {
        console.error("Error signing message:", signError)
        throw new Error(
          signError instanceof Error
            ? signError.message
            : "Failed to sign message with wallet. User may have rejected the request.",
        )
      }

      // Step 3: Verify the signature and get session token
      console.log("Verifying signature with server...")
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for setting cookies
        body: JSON.stringify({
          challengeId,
          signature: Buffer.from(signature).toString("base64"),
          publicKey: publicKey.toString(),
        }),
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        throw new Error(errorData.error || "Signature verification failed")
      }

      const verifyData = await verifyResponse.json()
      console.log("Authentication successful:", verifyData)

      // Step 4: Update state to reflect successful authentication
      setAuthState({
        isAuthenticated: true,
        isAuthenticating: false,
        error: null,
      })

      return true
    } catch (error) {
      console.error("Authentication error:", error)

      let errorMessage = "Authentication failed"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message)
      } else if (typeof error === "string") {
        errorMessage = error
      }

      setAuthState({
        isAuthenticated: false,
        isAuthenticating: false,
        error: errorMessage,
      })
      return false
    }
  }, [publicKey, signMessage])

  const logout = useCallback(async () => {
    console.log("Logging out...")
    
    try {
      // Call logout endpoint to clear the session cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Error during logout:", error)
    }

    // Clear local state regardless of API call success
    setAuthState({
      isAuthenticated: false,
      isAuthenticating: false,
      error: null,
    })
  }, [])

  return {
    ...authState,
    authenticate,
    logout,
  }
}
