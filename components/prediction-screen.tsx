"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp, ArrowLeft } from "lucide-react"

interface PredictionScreenProps {
  balance: number
  betAmount: number
  onPlaceBet: (amount: number, prediction: "over" | "under") => void
  onBack: () => void
}

export default function PredictionScreen({
  balance,
  betAmount: initialBetAmount,
  onPlaceBet,
  onBack,
}: PredictionScreenProps) {
  const [betAmount, setBetAmount] = useState(initialBetAmount)
  const [error, setError] = useState("")

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (isNaN(value)) {
      setBetAmount(0)
      return
    }
    setBetAmount(value)
    setError("")
  }

  const validateBet = () => {
    if (betAmount <= 0) {
      setError("Bet amount must be greater than 0")
      return false
    }
    if (betAmount > balance) {
      setError("Bet amount cannot exceed your balance")
      return false
    }
    return true
  }

  const handlePrediction = (prediction: "over" | "under") => {
    if (validateBet()) {
      onPlaceBet(betAmount, prediction)
    }
  }

  const quickBets = [10, 50, 100, 500]

  return (
    <div className="flex flex-col">
      <Button variant="ghost" className="self-start mb-4 text-gray-400 hover:text-white" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h2 className="text-xl font-bold text-white mb-6">Make Your Prediction</h2>

      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Bet Amount</label>
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="flex gap-2 mb-2">
          {quickBets.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(amount)}
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              ${amount}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(Math.max(0, betAmount - 10))}
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            -10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(betAmount + 10)}
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            +10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(Math.floor(balance / 2))}
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Half
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(balance)}
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Max
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <p className="text-gray-300 text-sm">Roll 1-2</p>
            <p className="text-white font-bold">Win 1.8x</p>
          </div>
          <Button
            onClick={() => handlePrediction("under")}
            className="w-full py-8 bg-red-600 hover:bg-red-700 text-white"
          >
            <ArrowDown className="mr-2 h-6 w-6" />
            Under 3
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <p className="text-gray-300 text-sm">Roll 5-6</p>
            <p className="text-white font-bold">Win 1.8x</p>
          </div>
          <Button
            onClick={() => handlePrediction("over")}
            className="w-full py-8 bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowUp className="mr-2 h-6 w-6" />
            Over 4
          </Button>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-white font-medium mb-2">Roll 3 or 4</h3>
        <p className="text-gray-300 text-sm">If the dice shows 3 or 4, you'll get your bet back (1x refund).</p>
      </div>
    </div>
  )
}
