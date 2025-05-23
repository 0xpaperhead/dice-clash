"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface DiceProps {
  value: number | null
  rolling: boolean
  size?: "sm" | "md" | "lg"
}

export default function Dice({ value, rolling, size = "lg" }: DiceProps) {
  const [animationValue, setAnimationValue] = useState(1)

  // Animation effect
  useEffect(() => {
    if (rolling) {
      const interval = setInterval(() => {
        setAnimationValue(Math.floor(Math.random() * 6) + 1)
      }, 100)

      return () => clearInterval(interval)
    }
  }, [rolling])

  const displayValue = rolling ? animationValue : value

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const dotSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div className={cn("relative bg-white rounded-xl shadow-lg", sizeClasses[size], rolling && "animate-bounce")}>
      {/* Dice dots based on value */}
      {displayValue === 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
        </div>
      )}

      {displayValue === 2 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
        </div>
      )}

      {displayValue === 3 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
        </div>
      )}

      {displayValue === 4 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute top-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
        </div>
      )}

      {displayValue === 5 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute top-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
        </div>
      )}

      {displayValue === 6 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute top-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 left-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4">
            <div className={cn("bg-black rounded-full", dotSizeClasses[size])}></div>
          </div>
        </div>
      )}
    </div>
  )
}
