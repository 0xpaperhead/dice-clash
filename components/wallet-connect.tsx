"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDownToLine, ArrowUpFromLine, Wallet, Shield, LogOut } from "lucide-react"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

interface WalletConnectProps {
  gameBalance: number
  onFundGame: (amount: number) => void
}

export default function WalletConnect({ gameBalance, onFundGame }: WalletConnectProps) {
  const { publicKey, connected } = useWallet()
  const { isAuthenticated, isAuthenticating, error, authenticate, logout } = useWalletAuth()
  const [fundAmount, setFundAmount] = useState(1)
  const [isDepositing, setIsDepositing] = useState(false)
  const [playerWallet, setPlayerWallet] = useState<string | null>(null)

  // Generate a simulated player wallet when authenticated
  useEffect(() => {
    if (isAuthenticated && !playerWallet) {
      // Generate a random player wallet address for demo purposes
      const demoWallet = `Demo${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
      setPlayerWallet(demoWallet)
    }
  }, [isAuthenticated, playerWallet])

  const handleFundGame = async () => {
    if (!connected || !isAuthenticated || fundAmount <= 0) return

    setIsDepositing(true)
    try {
      // In a real implementation, this would involve a Solana transaction
      // For this demo, we'll just simulate the funding after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onFundGame(fundAmount)
      setFundAmount(1)
    } catch (error) {
      console.error("Error funding game:", error)
    } finally {
      setIsDepositing(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setPlayerWallet(null)
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-300 mb-2">Connect your wallet to fund your game</p>
        <WalletMultiButton className="wallet-adapter-button-custom" />
      </div>
    )
  }

  if (connected && !isAuthenticated) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-yellow-400" />
            <span className="text-gray-300">Wallet Connected:</span>
          </div>
          <span className="text-white font-mono text-sm">
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </span>
        </div>

        <p className="text-gray-300 text-sm">Verify your wallet ownership to continue</p>

        <Button
          onClick={authenticate}
          disabled={isAuthenticating}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"
        >
          <Shield className="mr-2 h-4 w-4" />
          {isAuthenticating ? "Verifying..." : "Verify Wallet Ownership"}
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-yellow-400" />
          <span className="text-gray-300">Personal Wallet:</span>
        </div>
        <span className="text-white font-mono text-sm">
          {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </span>
      </div>

      {playerWallet && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-gray-300">Game Wallet:</span>
          </div>
          <span className="text-white font-mono text-sm">{playerWallet}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={fundAmount}
          onChange={(e) => setFundAmount(Number(e.target.value))}
          min={0.1}
          step={0.1}
          className="bg-gray-700 border-gray-600 text-white"
        />
        <span className="text-gray-300">SOL</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleFundGame}
          disabled={isDepositing || fundAmount <= 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          {isDepositing ? "Processing..." : "Deposit"}
        </Button>

        <Button
          disabled={true} // Implement withdrawal in future
          variant="outline"
          className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </div>

      <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700 mt-2">
        <LogOut className="mr-2 h-4 w-4" />
        Disconnect
      </Button>
    </div>
  )
}
