"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TetrisGame from "@/components/tetris-game";
// import { useAuth } from "@/lib/hooks/useAuth"
import { useState, useEffect } from "react"; // Import React hooks

// Define an interface for the user object
interface User {
  name: string;
}

// Define an interface for the decoded JWT payload
interface DecodedToken {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

// /**
//  * A simple and safe function to decode a JWT token from the client-side.
//  * It extracts the payload which contains user information.
//  * @param {string} token The JWT token from localStorage.
//  * @returns {DecodedToken|null} The decoded user object or null if decoding fails.
//  */
const decodeToken = (token: string): DecodedToken | null => {
  try {
    // A JWT is split into three parts by dots. The middle part is the payload.
    const base64Url = token.split(".")[1];
    // The payload is Base64Url encoded. We need to convert it to standard Base64.
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode the Base64 string, then parse the resulting JSON string.
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default function GamePage() {
  const router = useRouter();
  // Add state to hold the user's information, with a specific type
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the useEffect hook to run code when the page loads
  useEffect(() => {
    // Get the authentication token saved during login
    const token = localStorage.getItem("authToken");

    if (token) {
      // If a token is found, decode it to get the user's data
      const decodedUser = decodeToken(token);
      if (decodedUser && decodedUser.username) {
        // Based on your backend, the payload has a 'username' field
        setUser({ name: decodedUser.username });
      }
    }
    // Finished checking for a user, no longer in a loading state
    setIsLoading(false);
  }, []); // The empty array [] ensures this effect runs only once on page load

  const returnToMenu = () => {
    // quay ve trang chu
    router.push("/");
  };

  const goToLeaderboard = () => {
    // chuyen den bang xep hang
    router.push("/leaderboard");
  };

  // *** THAY ĐỔI Ở ĐÂY ***
  // Chuyển điểm số tới trang đăng nhập
  const goToLogin = (score: number) => {
    // Truyền điểm số và một trang để quay lại sau khi đăng nhập thành công
    router.push(`/login?score=${score}&redirect=/leaderboard`);
  };

  // choi game khong co user dang nhap

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* hien thi thong tin dang nhap */}
      {user && !isLoading && (
        <div className="absolute top-6 right-6 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-black/80 px-3 py-2 rounded-lg border-2 border-yellow-300"
          >
            <span
              className="text-yellow-300 font-bold text-sm"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              🎮 {user.name}
            </span>
          </motion.div>
        </div>
      )}

      {/* background */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      {/* game */}
      <TetrisGame
        onReturn={returnToMenu}
        onLeaderboard={goToLeaderboard}
        onLogin={goToLogin}
      />
    </div>
  );
}
