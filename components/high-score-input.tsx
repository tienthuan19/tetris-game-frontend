"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface HighScoreInputProps {
  score: number
  rank: number
  onSubmit: (name: string) => void
  onSkip: () => void
}

export default function HighScoreInput({ score, rank, onSubmit, onSkip }: HighScoreInputProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    const playerName = name.trim() || "ANONYMOUS"
    onSubmit(playerName)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const getRankMessage = () => {
    switch (rank) {
      case 1:
        return "🏆 NEW HIGH SCORE! 🏆"
      case 2:
        return "🥈 SECOND PLACE! 🥈"
      case 3:
        return "🥉 THIRD PLACE! 🥉"
      default:
        return `🎉 TOP ${rank}! 🎉`
    }
  }

  const getRankColor = () => {
    switch (rank) {
      case 1:
        return "text-yellow-300"
      case 2:
        return "text-gray-300"
      case 3:
        return "text-yellow-600"
      default:
        return "text-green-300"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-b from-gray-900 to-black border-4 border-yellow-300 shadow-2xl w-[450px] relative rounded-lg"
      style={{
        boxShadow: "0 0 20px rgba(255, 255, 0, 0.3), inset 0 0 20px rgba(255, 255, 0, 0.1)"
      }}
    >
      {/* Celebration animation - improved */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: [0, 1.2, 1], 
          rotate: [0, 360, 720],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 2, 
          times: [0, 0.6, 1],
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="absolute -top-12 -left-12 text-5xl"
      >
        🏆
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: [0, 1.2, 1], 
          rotate: [0, -360, -720],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 2, 
          delay: 0.5,
          times: [0, 0.6, 1],
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="absolute -top-12 -right-12 text-5xl"
      >
        ⭐
      </motion.div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-yellow-300/20" />
          ))}
        </div>
      </div>

      {/* Rank announcement - improved */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.h1
          className={`text-3xl font-bold tracking-wider mb-2 ${getRankColor()}`}
          style={{ 
            fontFamily: "'Press Start 2P', monospace",
            textShadow: "0 0 10px currentColor"
          }}
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {getRankMessage()}
        </motion.h1>
        <motion.div
          className="w-16 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
      </motion.div>

      {/* Score display - improved */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 p-6 w-full border-4 border-black rounded-lg shadow-lg"
        style={{
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
        }}
      >
        <h2 
          className="text-black text-center mb-3 text-sm tracking-wider" 
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          YOUR SCORE
        </h2>
        <motion.p 
          className="text-4xl font-bold font-mono text-center text-black mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        >
          {score.toString().padStart(6, "0")}
        </motion.p>
        <div className="flex justify-center">
          <div className="w-24 h-1 bg-black/20 rounded-full" />
        </div>
      </motion.div>

      {/* Name input - improved */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-full relative z-10"
      >
        <label
          className="block text-yellow-300 text-center mb-4 text-sm tracking-wider"
          style={{ 
            fontFamily: "'Press Start 2P', monospace",
            textShadow: "0 0 8px currentColor"
          }}
        >
          ENTER YOUR NAME:
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            maxLength={10}
            placeholder="ANONYMOUS"
            className="w-full p-4 text-center text-black font-bold border-4 border-black bg-white focus:outline-none focus:bg-yellow-100 focus:border-yellow-500 transition-all rounded-lg shadow-inner"
            style={{ 
              fontFamily: "'Press Start 2P', monospace", 
              fontSize: "16px",
              letterSpacing: "2px"
            }}
            autoFocus
            disabled={isSubmitting}
          />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="text-center text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full">
              MAX 10 CHARACTERS
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buttons - improved */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="flex flex-col gap-4 w-full relative z-10 mt-4"
      >
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="relative w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold border-4 border-black hover:from-green-400 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg overflow-hidden group"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">
            {isSubmitting ? "SAVING..." : "SAVE SCORE"}
          </span>
        </motion.button>
        
        <motion.button
          onClick={onSkip}
          disabled={isSubmitting}
          className="relative w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold border-4 border-black hover:from-gray-500 hover:to-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded-lg shadow-lg overflow-hidden group"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">SKIP</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
