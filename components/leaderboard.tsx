"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { LeaderboardEntry } from "@/lib/hooks/useLeaderboard";

interface LeaderboardProps {
  entries: (LeaderboardEntry & { _id?: string })[];
  onBack: () => void;
}

export default function Leaderboard({ entries, onBack }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-yellow-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black border-gray-500";
      case 3:
        return "bg-gradient-to-r from-yellow-600 to-yellow-800 text-white border-yellow-800";
      default:
        return "bg-black text-white border-gray-600";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl mx-auto p-6"
      >
        {/* Header - improved */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl font-bold text-yellow-300 mb-6 tracking-wider relative"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              textShadow:
                "0 0 20px rgba(255, 255, 0, 0.5), 0 0 40px rgba(255, 255, 0, 0.3)",
            }}
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 255, 0, 0.5), 0 0 40px rgba(255, 255, 0, 0.3)",
                "0 0 30px rgba(255, 255, 0, 0.8), 0 0 60px rgba(255, 255, 0, 0.5)",
                "0 0 20px rgba(255, 255, 0, 0.5), 0 0 40px rgba(255, 255, 0, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            RANKING
          </motion.h1>
          <motion.div
            className="flex justify-center items-center gap-4"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <div className="h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent flex-1 max-w-32" />
            <div className="text-3xl">🏆</div>
            <div className="h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent flex-1 max-w-32" />
          </motion.div>
        </motion.div>

        {/* Top 3 Podium - improved */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center items-end gap-6 mb-12"
        >
          {entries.slice(0, 3).map((entry, index) => {
            if (!entry || typeof entry.rank === "undefined") return null; // Kiểm tra nếu entry không tồn tại
            const rankOrder = [1, 0, 2];
            const visualIndex = rankOrder.indexOf(index);
            const heights = ["h-32", "h-40", "h-28"]; // Taller podium
            const podiumColors = [
              "bg-gradient-to-t from-gray-400 to-gray-300", // 2nd place
              "bg-gradient-to-t from-yellow-500 to-yellow-300", // 1st place
              "bg-gradient-to-t from-yellow-700 to-yellow-600", // 3rd place
            ];

            return (
              <motion.div
                key={entry._id || `podium-${entry.rank}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.6 + visualIndex * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                className={`flex flex-col items-center ${
                  visualIndex === 1
                    ? "order-2"
                    : visualIndex === 0
                    ? "order-1"
                    : "order-3"
                }`}
              >
                {/* Crown/Medal above podium */}
                <motion.div
                  className="flex flex-col items-center mb-3"
                  animate={{
                    y: [0, -5, 0],
                    rotate: visualIndex === 1 ? [0, 2, 0, -2, 0] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <div className="text-5xl mb-2 filter drop-shadow-lg">
                    {getRankIcon(entry.rank!)}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      visualIndex === 1
                        ? "text-yellow-300"
                        : visualIndex === 0
                        ? "text-gray-300"
                        : "text-yellow-600"
                    }`}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      textShadow: "0 0 10px currentColor",
                    }}
                  >
                    #{entry.rank}
                  </div>
                </motion.div>

                {/* Podium base */}
                <motion.div
                  className={`relative w-36 ${heights[visualIndex]} ${podiumColors[visualIndex]} border-4 border-black rounded-t-lg shadow-xl overflow-hidden`}
                  style={{
                    boxShadow:
                      "0 8px 16px rgba(0, 0, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-pulse" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end items-center p-3">
                    <div className="text-center mb-2 w-full">
                      <div
                        className="text-xs font-bold text-black mb-2 leading-tight px-1 break-words hyphens-auto"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "10px",
                          lineHeight: "1.3",
                          wordBreak: "break-all",
                        }}
                      >
                        {entry.name}
                      </div>
                      <div
                        className="text-xs font-bold text-black bg-black/15 px-2 py-1 rounded mx-auto"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "9px",
                        }}
                      >
                        {entry.score.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white/50 rounded-full" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/50 rounded-full" />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black/20 rounded-full" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Rest of leaderboard (4-10) - improved */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-gradient-to-b from-gray-900 to-black border-4 border-white p-6 rounded-lg shadow-xl"
          style={{
            boxShadow:
              "0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="space-y-3">
            {entries.slice(3, 10).map((entry, index) => {
              if (!entry || typeof entry.rank === "undefined") return null;
              return (
                <motion.div
                  key={entry._id || entry.rank}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.08 }}
                  className="group relative overflow-hidden"
                >
                  <motion.div
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-2 border-gray-600 hover:border-gray-400 transition-all rounded-lg shadow-lg"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    <div className="flex items-center gap-4 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {getRankIcon(entry.rank!)}
                      </motion.div>
                      <span
                        className="text-yellow-300 text-sm w-8 font-bold"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          textShadow: "0 0 8px currentColor",
                        }}
                      >
                        #{entry.rank}
                      </span>
                      <span
                        className="text-white text-sm flex-1 tracking-wide"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div className="text-right relative z-10">
                      <motion.span
                        className="text-green-400 text-sm font-mono font-bold"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          textShadow: "0 0 8px currentColor",
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {entry.score.toLocaleString()}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Back button - improved */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex justify-center mt-8"
        >
          <motion.button
            onClick={onBack}
            className="relative px-12 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold border-4 border-black hover:from-yellow-300 hover:to-yellow-400 transition-all rounded-lg shadow-lg overflow-hidden group"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 tracking-wider">BACK TO MENU</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
