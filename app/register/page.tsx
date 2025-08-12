"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TetorisLogo from "@/components/tetris-logo";
import TetrisBackground from "@/components/tetris-background";
// import TetorisButton from "@/components/tetris-button"
// import { useAuth } from "@/lib/hooks/useAuth"

// TRANG DANG KY TAI KHOAN MOI
export default function RegisterPage() {
  const router = useRouter();
  const [inputName, setInputName] = useState(""); // ten nguoi dung
  const [inputPassword, setInputPassword] = useState(""); // mat khau
  const [confirmPassword, setConfirmPassword] = useState(""); // xac nhan mat khau
  const [isRegistering, setIsRegistering] = useState(false); // trang thai dang dang ky
  const [registerSuccess, setRegisterSuccess] = useState(false); // dang ky thanh cong
  const [error, setError] = useState(""); // thong bao loi
  // const { register } = useAuth() // ham dang ky tu hook

  // XU LY DANG KY TAI KHOAN
  const handleRegister = async () => {
    // reset loi cu
    setError("");

    // kiem tra du lieu dau vao
    if (!inputName.trim()) {
      setError("Username cannot be empty!");
      return;
    }

    if (inputName.trim().length < 3) {
      setError("Username must be at least 3 characters!");
      return;
    }

    if (!inputPassword) {
      setError("Password cannot be empty!");
      return;
    }

    if (inputPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (inputPassword !== confirmPassword) {
      setError("Password confirmation does not match!");
      return;
    }

    setIsRegistering(true);

    try {
      // *** START OF BACKEND INTEGRATION ***
      // 1. Define your backend API endpoint for registration
      const apiEndpoint = "http://localhost:3001/api/v1/accounts/register";

      // 2. Send the registration data to your backend
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputName.trim(),
          password: inputPassword,
        }),
      });

      // 3. Handle the response from the backend
      if (!response.ok) {
        // If the server returns an error (e.g., 400, 409, 500)
        // We try to parse the error message from the backend's response body
        const errorData = await response.json();
        throw new Error(
          errorData.error || "An error occurred. Please try again."
        );
      }

      // If we get here, the backend registration was successful
      // *** END OF BACKEND INTEGRATION ***
      setRegisterSuccess(true);

      // chuyen ve trang chu sau 2 giay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration!");
      setIsRegistering(false);
    }
  };

  // QUAY VE TRANG DANG NHAP
  const backToLogin = () => {
    router.push("/login");
  };

  // QUAY VE TRANG CHU
  const backToHome = () => {
    router.push("/");
  };

  // GIAO DIEN TRANG DANG KY
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden">
        <TetrisBackground />
      </div>

      {/* NOI DUNG DANG KY */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <TetorisLogo />
        </motion.div>

        {/* FORM DANG KY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/80 p-8 rounded-xl border-4 border-yellow-300 shadow-2xl backdrop-blur-sm max-w-md w-full mx-4"
        >
          {registerSuccess ? (
            // THONG BAO DANG KY THANH CONG
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🎉
              </motion.div>

              <div className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  REGISTRATION SUCCESS!
                </h2>
              </div>

              <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 p-4 rounded-lg border-2 border-yellow-400 mb-4">
                <p
                  className="text-black text-sm font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  🌟 Welcome {inputName}! 🌟
                </p>
              </div>

              <div
                className="flex items-center justify-center gap-2 text-white text-xs"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Redirecting to home...
              </div>
            </motion.div>
          ) : (
            // FORM NHAP THONG TIN
            <div>
              <h2
                className="text-2xl font-bold text-yellow-300 mb-6 text-center"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                CREATE NEW ACCOUNT
              </h2>

              {/* THONG BAO LOI */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500 text-red-300 p-4 rounded-lg mb-4 text-xs text-center backdrop-blur-sm relative overflow-hidden"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-red-400">⚠️</span>
                    <span className="text-red-200 font-bold">ERROR</span>
                    <span className="text-red-400">⚠️</span>
                  </div>
                  <div className="text-red-100">{error}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent animate-pulse"></div>
                </motion.div>
              )}

              {/* NHAP TEN NGUOI DUNG */}
              <div className="mb-4">
                <label
                  className="flex items-center gap-2 text-yellow-300 text-sm font-bold mb-3"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  👤 USERNAME:
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-600 text-white rounded-lg focus:border-yellow-300 focus:bg-gray-700/80 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "12px",
                  }}
                  placeholder="Enter your username..."
                  disabled={isRegistering}
                />
              </div>

              {/* NHAP MAT KHAU */}
              <div className="mb-4">
                <label
                  className="flex items-center gap-2 text-yellow-300 text-sm font-bold mb-3"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  🔒 PASSWORD:
                </label>
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-600 text-white rounded-lg focus:border-yellow-300 focus:bg-gray-700/80 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "12px",
                  }}
                  placeholder="Enter password..."
                  disabled={isRegistering}
                />
              </div>

              {/* XAC NHAN MAT KHAU */}
              <div className="mb-6">
                <label
                  className="flex items-center gap-2 text-yellow-300 text-sm font-bold mb-3"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  🔐 CONFIRM PASSWORD:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-600 text-white rounded-lg focus:border-yellow-300 focus:bg-gray-700/80 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "12px",
                  }}
                  placeholder="Confirm password..."
                  disabled={isRegistering}
                />
              </div>

              {/* CAC NUT HANH DONG */}
              <div className="space-y-4">
                {/* NUT DANG KY CHINH */}
                <motion.button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 text-white font-bold border-4 border-black transition-all text-base rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  whileHover={!isRegistering ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isRegistering ? { scale: 0.98 } : {}}
                >
                  {isRegistering ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      REGISTERING...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      ✨ REGISTER NOW
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </motion.button>

                {/* DUONG PHAN CACH */}
                <div className="flex items-center justify-center my-4">
                  <div className="border-t border-gray-600 flex-grow"></div>
                  <span
                    className="px-4 text-gray-400 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    OR
                  </span>
                  <div className="border-t border-gray-600 flex-grow"></div>
                </div>

                {/* NUT VE TRANG DANG NHAP */}
                <motion.button
                  onClick={backToLogin}
                  disabled={isRegistering}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 text-white font-bold border-3 border-gray-700 transition-all text-sm rounded-lg shadow-md disabled:opacity-50"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  whileHover={!isRegistering ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!isRegistering ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center justify-center gap-2">
                    🔑 ALREADY HAVE ACCOUNT? LOGIN
                  </div>
                </motion.button>

                {/* NUT VE TRANG CHU */}
                <motion.button
                  onClick={backToHome}
                  disabled={isRegistering}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 hover:from-yellow-400 hover:via-yellow-500 hover:to-orange-500 text-black font-bold border-3 border-gray-700 transition-all text-sm rounded-lg shadow-md disabled:opacity-50"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  whileHover={!isRegistering ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!isRegistering ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center justify-center gap-2">
                    🏠 BACK TO HOME
                  </div>
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
