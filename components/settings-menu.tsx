"use client"

import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import TetorisButton from "@/components/tetris-button"

// INTERFACE CHO PROPS CUA COMPONENT SETTINGS MENU
interface SettingsMenuProps {
  onClose: () => void // ham dong setting
  isMusicEnabled: boolean // trang thai nhac bat/tat
  musicVolume: number // muc am luong hien tai
  onMusicToggle: (enabled: boolean) => void // ham bat/tat nhac
  onVolumeChange: (volume: number) => void // ham thay doi am luong
  isModal?: boolean // dieu khien hien thi modal hay khong
}

// COMPONENT SETTINGS MENU - CAI DAT GAME
export default function SettingsMenu({
  onClose,
  isMusicEnabled,
  musicVolume,
  onMusicToggle,
  onVolumeChange,
  isModal = true,
}: SettingsMenuProps) {
  // NOI DUNG SETTINGS MENU
  const content = (
    <div className="relative w-full max-w-lg mx-4">
      {/* KHUNG CHINH CUA MENU SETTINGS */}
      <div
        className="p-6 border-4 border-black shadow-lg relative"
        style={{ background: "#444b5a" }}
      >
        {/* CAC GOC PIXEL DEN TRANG TRI */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-black" />
        <div className="absolute top-0 right-0 w-4 h-4 bg-black" />
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-black" />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-black" />

        <div className="space-y-6">
          {/* HEADER VOI NUT BACK VA TIEU DE */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-gray-200 hover:text-gray-400"
            >
              <ArrowLeft className="h-6 w-6" />
            </motion.button>
            <h2
              className="text-2xl font-bold text-gray-200 tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              SETTINGS
            </h2>
            <div className="w-6" /> {/* Spacer de can giua */}
          </div>

          {/* PHAN CAI DAT NHAC VA AM LUONG */}
          <div className="space-y-8 p-4 bg-white/10 border-4 border-black">
            {/* CAI DAT BAT/TAT NHAC */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold text-gray-200" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px" }}>Music</Label>
                <p className="text-sm text-gray-400" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}>Enable or disable background music</p>
              </div>
              
              {/* NUT BAT/TAT NHAC KIEU TETRIS BLOCK */}
              <motion.div
                className="relative flex"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Nut ON - khi bat nhac */}
                <motion.button
                  onClick={() => onMusicToggle(true)}
                  className={`px-4 py-2 border-4 border-black font-bold text-xs transition-all ${
                    isMusicEnabled 
                      ? 'bg-green-400 text-black shadow-lg' 
                      : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                  }`}
                  style={{ 
                    fontFamily: "'Press Start 2P', monospace",
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  ON
                </motion.button>
                {/* Nut OFF - khi tat nhac */}
                <motion.button
                  onClick={() => onMusicToggle(false)}
                  className={`px-4 py-2 border-4 border-black font-bold text-xs transition-all ${
                    !isMusicEnabled 
                      ? 'bg-red-400 text-black shadow-lg' 
                      : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                  }`}
                  style={{ 
                    fontFamily: "'Press Start 2P', monospace",
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                  }}
                >
                  OFF
                </motion.button>
              </motion.div>
            </div>
            
            {/* PHAN CHINH AM LUONG NHAC */}
            <div>
              <Label className="text-lg font-semibold text-gray-200" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px" }}>Volume</Label>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}>Adjust music volume</p>
              <div className="flex items-center gap-4 mt-4">
                {/* HIEN THI AM LUONG BANG TETRIS BLOCKS */}
                <div className={`flex-1 flex items-center gap-1 ${!isMusicEnabled ? "opacity-50" : ""}`}>
                  {/* Tao 10 block tetris de hien thi muc am luong */}
                  {Array.from({ length: 10 }, (_, i) => {
                    const blockValue = (i + 1) * 10; // Gia tri am luong cho moi block (10, 20, 30...)
                    const isActive = musicVolume >= blockValue; // Kiem tra block co sang khong
                    return (
                      <motion.button
                        key={i}
                        onClick={() => !isMusicEnabled ? null : onVolumeChange(blockValue)}
                        disabled={!isMusicEnabled}
                        className={`w-6 h-6 border-2 border-black transition-all ${
                          isActive 
                            ? i < 3 ? 'bg-green-400' : i < 7 ? 'bg-yellow-400' : 'bg-red-400' // Mau block theo muc
                            : 'bg-gray-600 hover:bg-gray-500' // Mau block chua kich hoat
                        } ${!isMusicEnabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                        whileHover={isMusicEnabled ? { scale: 1.1 } : {}}
                        whileTap={isMusicEnabled ? { scale: 0.9 } : {}}
                        style={{
                          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* MAN HINH HIEN THI SO AM LUONG KIEU DIGITAL */}
                <div className="flex items-center gap-2">
                  <div 
                    className="bg-black border-2 border-gray-400 px-3 py-2 min-w-[4rem] text-center"
                    style={{ 
                      fontFamily: "'Courier New', monospace",
                      fontSize: "14px",
                      background: 'linear-gradient(45deg, #0a0a0a, #1a1a1a)' // Hieu ung man hinh CRT
                    }}
                  >
                    <span className="text-green-400 font-bold">
                      {musicVolume.toString().padStart(3, '0')} {/* Hien thi am luong 3 chu so */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHAN THONG TIN NHAC DANG PHAT */}
          <div className="p-3 bg-black/20 border-2 border-black">
            <h3
              className="text-sm font-semibold text-gray-400"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.6rem" }}
            >
              MUSIC SETTING
            </h3>
          </div>

          {/* NUT QUAY LAI - CHI HIEN THI KHI LA MODAL */}
          {isModal && (
            <div className="flex justify-center">
              <TetorisButton label="RETURN" onClick={onClose} color="yellow" />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // XU LY HIEN THI MODAL NEU LA POPUP
  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} // Bat dau mo dan va thu nho
        animate={{ opacity: 1, scale: 1 }}     // Ket thuc mo dan va kich thuoc binh thuong
        exit={{ opacity: 0, scale: 0.95 }}     // Dong lai mo dan va thu nho
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {content}
      </motion.div>
    )
  }

  // XU LY HIEN THI BINH THUONG (KHONG PHAI MODAL)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Bat dau trong suot va o vi tri thap hon
      animate={{ opacity: 1, y: 0 }}  // Hien thi ro va di chuyen len vi tri binh thuong
      transition={{ duration: 0.5 }}  // Thoi gian thuc hien animation
    >
      {content}
    </motion.div>
  )
}