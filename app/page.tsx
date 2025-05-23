import GameContainer from "@/components/game-container"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full">
        <GameContainer initialBalance={1000} />
      </div>
    </main>
  )
}
