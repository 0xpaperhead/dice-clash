"use client"

import { useState } from "react"
import StartScreen from "./start-screen"
import PredictionScreen from "./prediction-screen"
import ResultScreen from "./result-screen"
import { GamePhase } from "@/lib/types"
import { useLogin, usePrivy, useIdentityToken, useLogout } from '@privy-io/react-auth';

interface GameContainerProps {
  initialBalance: number
}

export default function GameContainer({ initialBalance }: GameContainerProps) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();
  const { identityToken } = useIdentityToken();
  const { logout } = useLogout();

  const [balance, setBalance] = useState(initialBalance)
  const [betAmount, setBetAmount] = useState(10)
  const [prediction, setPrediction] = useState<"over" | "under" | null>(null)
  const [diceRoll, setDiceRoll] = useState<number | null>(null)
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.START)
  const [history, setHistory] = useState<
    Array<{ roll: number; prediction: string; result: string; amount: number; payout: number }>
  >([])

  const handleStartGame = () => {
    setGamePhase(GamePhase.PREDICTION)
  }

  const handlePlaceBet = (amount: number, pred: "over" | "under") => {
    setBetAmount(amount)
    setPrediction(pred)
    setGamePhase(GamePhase.ROLLING)

    // Simulate dice roll
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1
      setDiceRoll(roll)

      // Calculate result
      let result: "win" | "loss" | "refund"
      let payout: number

      if ((pred === "over" && roll >= 5) || (pred === "under" && roll <= 2)) {
        result = "win"
        payout = amount * 1.8
        setBalance((prev) => prev + amount * 0.8) // Add winnings (already have the bet amount)
      } else if (roll === 3 || roll === 4) {
        result = "refund"
        payout = amount
        // Balance stays the same
      } else {
        result = "loss"
        payout = 0
        setBalance((prev) => prev - amount) // Subtract bet amount
      }

      // Add to history
      setHistory((prev) => [
        {
          roll,
          prediction: pred,
          result,
          amount,
          payout,
        },
        ...prev,
      ])

      setGamePhase(GamePhase.RESULT)
    }, 1500)
  }

  const handlePlayAgain = () => {
    setDiceRoll(null)
    setGamePhase(GamePhase.PREDICTION)
  }

  const handleChangeBet = () => {
    setPrediction(null)
    setDiceRoll(null)
    setGamePhase(GamePhase.PREDICTION)
  }

  const handleBackToStart = () => {
    setPrediction(null)
    setDiceRoll(null)
    setGamePhase(GamePhase.START)
  }

  const handleFundGame = (amount: number) => {
    // In a real implementation, this would verify the transaction on Solana
    // For this demo, we'll just add the amount to the balance
    setBalance((prev) => prev + amount * 10) // Converting SOL to game tokens at 1:10 ratio
  }

  const handleVerifyUser = async () => {
    if (!identityToken) {
      console.error('Identity token not available.');
      alert('Identity token not available. Please log in again.');
      return;
    }

    try {
      const response = await fetch('/api/verify-user', {
        headers: {
          'Authorization': `Bearer ${identityToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User verified:', data);
        alert(`User Verified: ${data.userId}`);
      } else {
        console.error('Verification failed:', data);
        alert(`Verification Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error calling verify user API:', error);
      alert('Error verifying user. See console for details.');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Dice Clash</h1>
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <span className="text-gray-300 text-sm">Balance:</span>{" "}
              <span className="text-yellow-400 font-bold">${balance.toFixed(2)}</span>
            </div>
            <button
              disabled={!ready}
              onClick={() => {
                if (authenticated) {
                  logout();
                } else {
                  login({
                    loginMethods: ['wallet'],
                    walletChainType: 'solana-only',
                    disableSignup: false
                  });
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {authenticated ? "Log Out" : "Log In"}
            </button>
            {authenticated && identityToken && (
              <button
                onClick={handleVerifyUser}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-2"
              >
                Verify User
              </button>
            )}
          </div>
        </div>

        {gamePhase === GamePhase.START && <StartScreen onStartGame={handleStartGame} />}

        {gamePhase === GamePhase.PREDICTION && (
          <PredictionScreen
            balance={balance}
            betAmount={betAmount}
            onPlaceBet={handlePlaceBet}
            onBack={handleBackToStart}
          />
        )}

        {(gamePhase === GamePhase.ROLLING || gamePhase === GamePhase.RESULT) && (
          <ResultScreen
            diceRoll={diceRoll}
            prediction={prediction}
            betAmount={betAmount}
            gamePhase={gamePhase}
            onPlayAgain={handlePlayAgain}
            onChangeBet={handleChangeBet}
            onBackToStart={handleBackToStart}
          />
        )}
      </div>

      {history.length > 0 && (
        <div className="border-t border-gray-700 p-4">
          <h3 className="text-gray-300 text-sm font-medium mb-2">Recent Rolls</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {history.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg
                  ${item.result === "win" ? "bg-green-600" : item.result === "loss" ? "bg-red-600" : "bg-gray-600"}`}
              >
                {item.roll}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
