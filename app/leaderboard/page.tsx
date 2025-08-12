"use client"

import { useRouter } from "next/navigation"
import Leaderboard from "@/components/leaderboard"
import TetrisBackground from "@/components/tetris-background"
import { useLeaderboard } from "@/lib/hooks/useLeaderboard"

export default function LeaderboardPage() {
  const router = useRouter()
  const { leaderboard, isLoading } = useLeaderboard()

  const handleBack = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <TetrisBackground />
        </div>
        <div className="relative z-10 text-center">
          <div
            className="text-2xl text-yellow-300 mb-4"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            LOADING...
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <TetrisBackground />
      </div>
      
      {/* Leaderboard */}
      <Leaderboard entries={leaderboard} onBack={handleBack} />
    </div>
  )
}
