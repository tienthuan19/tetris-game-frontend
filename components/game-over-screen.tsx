"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { useAuth } from "@/lib/hooks/useAuth";
// import HighScoreInput from "./high-score-input";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
  onLeaderboard?: () => void;
  onLogin?: () => void;
}

// HÀM HELPER: Lưu điểm vào localStorage cho người chơi khách
const addGuestScore = (score: number) => {
  if (score <= 0) return;
  try {
    const guestScoresRaw = localStorage.getItem("tetris_guest_scores");
    const guestScores = guestScoresRaw ? JSON.parse(guestScoresRaw) : [];
    guestScores.push(score);
    localStorage.setItem("tetris_guest_scores", JSON.stringify(guestScores));
  } catch (error) {
    console.error("Lỗi khi lưu điểm của khách:", error);
  }
};

export default function GameOverScreen({
  score,
  onRestart,
  onMainMenu,
  onLeaderboard,
  onLogin,
}: GameOverScreenProps) {
  const { fetchLeaderboard, addScore, leaderboard } = useLeaderboard();

  const { user, isLoading } = useAuth();

  // Chỉ cần 2 state này để quản lý toàn bộ logic
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Chờ cho đến khi xác định xong trạng thái đăng nhập
    if (isLoading) {
      return;
    }

    // Logic cho người chơi chưa đăng nhập
    if (!user && score > 0) {
      addGuestScore(score);
    }

    // Một useEffect duy nhất để xử lý tất cả logic một cách rõ ràn

    // Logic tự động lưu điểm cho người chơi ĐÃ ĐĂNG NHẬP
    const savePlayerScore = async () => {
      // Điều kiện chạy: Đã đăng nhập, có điểm, và chưa gửi lần nào
      if (user && score > 0 && !hasSubmitted) {
        setHasSubmitted(true); // Đánh dấu đã gửi để tránh gọi lại
        setSaveMessage("Đang lưu điểm của bạn...");
        try {
          await addScore(score);
          setSaveMessage("Đã lưu điểm thành công!");
          await fetchLeaderboard(); // Cập nhật lại bảng xếp hạng mini
        } catch (error) {
          setSaveMessage("Lỗi: Không thể lưu điểm.");
        }
      }
    };

    savePlayerScore();
  }, [isLoading, user, score, hasSubmitted, addScore, fetchLeaderboard]);

  // const handleSubmitScore = (name: string) => {
  //   const rank = addScore(name, score);
  //   setNewRank(rank);
  //   setShowHighScoreInput(false);
  // };

  // const handleSkipScore = () => {
  //   setShowHighScoreInput(false);
  // };

  // if (showHighScoreInput) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <HighScoreInput
  //         score={score}
  //         rank={1} // Sẽ được tính chính xác khi submit
  //         onSubmit={handleSubmitScore}
  //         onSkip={handleSkipScore}
  //       />
  //     </div>
  //   );
  // }
  return (
    // cac animation
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-8 p-8 bg-yellow-300 border-4 border-black shadow-xl max-w-4xl w-full"
    >
      {/* Game over */}
      <h1
        className="text-4xl font-bold text-center text-black tracking-wider"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        GAME OVER
      </h1>

      {/* thong bao rank moi */}
      {/* {newRank && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 border-4 border-black p-4 w-full text-center rounded-xl shadow-2xl"
        >
          {user ? (
            <div className="space-y-1">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                🎉 CONGRATULATIONS 🎉
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-yellow-300 font-bold text-lg"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {user.name}
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="bg-yellow-300 text-black px-3 py-2 rounded-lg inline-block border-2 border-yellow-500"
              >
                <span
                  className="font-bold text-sm"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  RANK #{newRank}
                </span>
              </motion.div>
            </div>
          ) : (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-white font-bold text-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              NEW RANK: #{newRank}!
            </motion.span>
          )}
        </motion.div>
      )} */}

      {/* diem so */}
      <div className="bg-black p-4 w-full">
        <h2
          className="text-white text-center mb-2 text-sm"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          YOUR SCORE
        </h2>
        <p className="text-4xl font-bold font-mono text-center text-[#00ff00]">
          {score.toString().padStart(6, "0")}
        </p>
      </div>

      {/* layout 2 cot cho bang xep hang va cac hanh dong */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* cot trai - bang xep hang mini */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 border-4 border-black p-5 rounded-lg shadow-xl"
          >
            <h3
              className="text-yellow-300 text-center mb-4 text-sm tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ⭐ TOP PLAYERS ⭐
            </h3>
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((entry, index) => {
                const isCurrentPlayer = user && entry.name === user.name;
                const rankColors = [
                  "from-yellow-400 to-yellow-500", // vang - vi tri nhat
                  "from-gray-300 to-gray-400", // bac - vi tri nhi
                  "from-amber-600 to-amber-700", // dong - vi tri ba
                ];
                const rankNumbers = ["1ST", "2ND", "3RD"];

                return (
                  <motion.div
                    key={`${entry.rank}-${entry.name}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    className={`flex items-center justify-between p-3 rounded-lg border-3 transition-all hover:scale-[1.02] ${
                      isCurrentPlayer
                        ? "bg-gradient-to-r from-yellow-300 to-yellow-400 border-yellow-600 text-black shadow-lg"
                        : "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColors[index]} border-2 border-black flex items-center justify-center shadow-md flex-shrink-0`}
                      >
                        <span
                          className="text-black text-xs font-bold"
                          style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span
                          className={`text-xs font-bold truncate ${
                            isCurrentPlayer ? "text-black" : "text-white"
                          }`}
                          style={{ fontFamily: "'Press Start 2P', monospace" }}
                          title={entry.name}
                        >
                          {entry.name}
                        </span>
                        <span
                          className={`text-xs opacity-75 ${
                            isCurrentPlayer ? "text-black" : "text-gray-300"
                          }`}
                          style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                          {rankNumbers[index]} PLACE
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span
                        className={`font-bold ${
                          isCurrentPlayer ? "text-black" : "text-yellow-300"
                        } ${entry.score >= 1000000 ? "text-xs" : "text-sm"}`}
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        {entry.score >= 1000000
                          ? `${Math.floor(entry.score / 1000)}K`
                          : entry.score.toLocaleString()}
                      </span>
                      <div
                        className={`text-xs opacity-75 ${
                          isCurrentPlayer ? "text-black" : "text-gray-300"
                        }`}
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        POINTS
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* hien thi rank hien tai neu khong trong top 3 */}
            {/* {newRank && newRank > 3 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mt-4 pt-4 border-t-2 border-yellow-300/50"
              >
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 border-3 border-emerald-700 text-white shadow-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-400 border-2 border-black flex items-center justify-center shadow-md flex-shrink-0">
                      <span
                        className="text-black text-xs font-bold"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        {newRank}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className="text-xs font-bold text-white truncate"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                        title={user?.name || "YOU"}
                      >
                        {user?.name || "YOU"}
                      </span>
                      <span
                        className="text-xs opacity-75 text-emerald-100"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        YOUR RANK
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span
                      className={`font-bold text-yellow-300 ${
                        score >= 1000000 ? "text-xs" : "text-sm"
                      }`}
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {score >= 1000000
                        ? `${Math.floor(score / 1000)}K`
                        : score.toLocaleString()}
                    </span>
                    <div
                      className="text-xs opacity-75 text-emerald-100"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      POINTS
                    </div>
                  </div>
                </div>
              </motion.div>
            )} */}
          </motion.div>
        )}

        {/* cot phai - cac hanh dong va dang nhap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          {/* khuyen khich nguoi dung chua dang nhap */}
          {!isLoading && !user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 border-4 border-black p-4 rounded-lg shadow-xl"
            >
              <div className="text-center space-y-3">
                <div
                  className="text-white font-bold text-sm"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  🎯 WANT TO COMPETE?
                </div>
                <div
                  className="text-cyan-100 text-xs leading-relaxed"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  LOGIN TO SAVE YOUR SCORES & TRACK PROGRESS!
                </div>
                {onLogin && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogin}
                    className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold border-3 border-yellow-600 hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg rounded-lg"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    🔐 LOGIN NOW
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* cac nut hanh dong */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold border-4 border-black hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg rounded-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              🎮 PLAY AGAIN
            </motion.button>
            {onLeaderboard && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLeaderboard}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold border-4 border-black hover:from-purple-400 hover:to-purple-500 transition-all shadow-lg rounded-lg"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                🏆 VIEW FULL TOP PLAYER
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMainMenu}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-black font-bold border-4 border-black hover:from-orange-300 hover:to-orange-400 transition-all shadow-lg rounded-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              🏠 MAIN MENU
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
