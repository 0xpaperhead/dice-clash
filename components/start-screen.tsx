"use client"

import { Button } from "@/components/ui/button"
import { Dice5 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"

interface StartScreenProps {
  onStartGame: () => void
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const { connected } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Dice5 className="h-20 w-20 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Dicehead!</h2>
        <p className="text-gray-300 mb-4">Predict if the dice roll will be over 4 or under 3.</p>
        <div className="bg-gray-700 p-4 rounded-lg text-sm text-gray-300 mb-4">
          <p className="mb-2">
            <span className="text-yellow-400 font-bold">Win:</span> Guess correctly and get 1.8x your bet
          </p>
          <p className="mb-2">
            <span className="text-yellow-400 font-bold">Refund:</span> Roll 3 or 4 and get your bet back
          </p>
          <p className="mb-2">
            <span className="text-yellow-400 font-bold">Lose:</span> Guess wrong and lose your bet
          </p>
          {!connected && (
            <p className="mt-4 pt-4 border-t border-gray-600">
              <span className="text-yellow-400 font-bold">💡 Tip:</span> Connect your Solana wallet to fund your game
              balance!
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={onStartGame}
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-6 text-lg"
      >
        Start Game
      </Button>
    </div>
  )
}
