"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import SettingsMenu from "@/components/settings-menu"
import TetrisBackground from "@/components/tetris-background"
import TetorisLogo from "@/components/tetris-logo"
import TetorisButton from "@/components/tetris-button"
import { useAudioManager } from "@/lib/hooks/useAudioManager"
import { useAuth } from "@/lib/hooks/useAuth"

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isMusicEnabled, musicVolume, handleMusicToggle, handleVolumeChange } = useAudioManager()

  const returnToMenu = () => {
    router.push('/')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* User info */}
      {user && (
        <div className="absolute top-6 right-6 z-50">
          <div className="flex items-center gap-2 bg-black/70 px-3 py-1 rounded">
            <span className="text-yellow-300 font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Xin chào, {user.name}
            </span>
          </div>
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden">
        <TetrisBackground />
      </div>

      {/* Settings content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
          className="mb-12"
        >
          <TetorisLogo />
        </motion.div>

        {/* Settings Menu */}
        <div className="w-full max-w-md">
          <SettingsMenu
            onClose={returnToMenu}
            isMusicEnabled={isMusicEnabled}
            musicVolume={musicVolume}
            onMusicToggle={handleMusicToggle}
            onVolumeChange={handleVolumeChange}
            isModal={false}
          />
        </div>

        {/* Back button */}
        <div className="mt-8">
          <TetorisButton onClick={returnToMenu} label="BACK TO MENU" color="purple" />
        </div>
      </div>
    </div>
  )
}
