"use client"

import { Button } from "@/components/ui/button"
import Dice from "./dice"
import { GamePhase } from "@/lib/types"
import { ArrowDown, ArrowUp, RefreshCw, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultScreenProps {
  diceRoll: number | null
  prediction: "over" | "under" | null
  betAmount: number
  gamePhase: GamePhase
  onPlayAgain: () => void
  onChangeBet: () => void
  onBackToStart: () => void
}

export default function ResultScreen({
  diceRoll,
  prediction,
  betAmount,
  gamePhase,
  onPlayAgain,
  onChangeBet,
  onBackToStart,
}: ResultScreenProps) {
  const isRolling = gamePhase === GamePhase.ROLLING

  // Determine result
  let result: "win" | "loss" | "refund" | null = null
  let resultText = ""
  let resultClass = ""

  if (diceRoll !== null && prediction !== null) {
    if ((prediction === "over" && diceRoll >= 5) || (prediction === "under" && diceRoll <= 2)) {
      result = "win"
      resultText = "Nice! You nailed it: x1.8!"
      resultClass = "text-green-400"
    } else if (diceRoll === 3 || diceRoll === 4) {
      result = "refund"
      resultText = "Middle roll! Your bet is refunded."
      resultClass = "text-yellow-400"
    } else {
      result = "loss"
      resultText = "Oops! Better luck next time."
      resultClass = "text-red-400"
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">{isRolling ? "Rolling the dice..." : "Result"}</h2>

        {prediction && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-gray-300">You predicted:</span>
            <span
              className={cn("flex items-center font-bold", prediction === "over" ? "text-green-400" : "text-red-400")}
            >
              {prediction === "over" ? (
                <>
                  Over 4 <ArrowUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Under 3 <ArrowDown className="ml-1 h-4 w-4" />
                </>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <Dice value={diceRoll} rolling={isRolling} />
      </div>

      {!isRolling && result && (
        <div className="mb-8 text-center">
          <p className={`text-2xl font-bold ${resultClass} mb-2`}>{resultText}</p>
          <p className="text-gray-300">
            {result === "win" && `You won $${(betAmount * 0.8).toFixed(2)}!`}
            {result === "refund" && `Your $${betAmount.toFixed(2)} bet was returned.`}
            {result === "loss" && `You lost $${betAmount.toFixed(2)}.`}
          </p>
        </div>
      )}

      {!isRolling && (
        <div className="flex flex-col gap-3 w-full">
          <Button onClick={onPlayAgain} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold">
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again (Same Bet)
          </Button>

          <Button
            onClick={onChangeBet}
            variant="outline"
            className="border-gray-600 text-gray-700 hover:text-white hover:bg-gray-700"
          >
            <Settings className="mr-2 h-4 w-4" />
            Change Bet/Prediction
          </Button>

          <Button onClick={onBackToStart} variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
            Back to Start
          </Button>
        </div>
      )}
    </div>
  )
}
