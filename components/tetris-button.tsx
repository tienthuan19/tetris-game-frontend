"use client"

import { motion } from "framer-motion"

// INTERFACE CHO PROPS CUA TETRIS BUTTON
interface TetorisButtonProps {
  label: string                                      // text hien thi tren nut
  onClick: () => void                               // ham xu ly khi click
  color: "blue" | "pink" | "purple" | "yellow" | "green" // mau sac nut (5 lua chon)
}

// COMPONENT NUT TETRIS VOI HIEU UNG 3D
export default function TetorisButton({ label, onClick, color }: TetorisButtonProps) {
  // BANG MAU SAC VA HIEU UNG CHO CAC LOAI NUT
  const colorSchemes = {
    blue:    { bg: "bg-blue-500",    shadow: "shadow-blue-700",    highlight: "bg-blue-400",    text: "text-white" },
    pink:    { bg: "bg-pink-500",    shadow: "shadow-pink-700",    highlight: "bg-pink-400",    text: "text-white" },
    purple:  { bg: "bg-purple-500",  shadow: "shadow-purple-700",  highlight: "bg-purple-400",  text: "text-white" },
    yellow:  { bg: "bg-yellow-400",  shadow: "shadow-yellow-600",  highlight: "bg-yellow-300",  text: "text-gray-800" },
    green:   { bg: "bg-green-500",   shadow: "shadow-green-700",   highlight: "bg-green-400",   text: "text-white" },
  }
  const scheme = colorSchemes[color] // lay bo mau tuong ung voi color prop

  return (
    <motion.div
      className="relative w-64 h-16 group" // container chinh cua nut
      whileHover={{ scale: 1.03 }}         // phong to nhe khi hover
      whileTap={{ scale: 0.97 }}           // thu nho nhe khi click
    >
      {/* LOP NEN NUT - MAU CHINH */}
      <div className={`absolute inset-0 ${scheme.bg} rounded-none border-4 border-black`} />
      
      {/* BONG DO 3D - TAO DO SAU */}
      <div className={`absolute inset-0 translate-y-2 ${scheme.shadow} border-4 border-black z-[-1]`} />
      
      {/* LOP TREN CUNG - CO HIEU UNG NHAN XUONG KHI CLICK */}
      <div
        className={`absolute inset-0 ${scheme.highlight} border-4 border-black translate-y-0 
          group-hover:translate-y-1 group-active:translate-y-2 transition-transform duration-100`}
      >
        {/* CAC GOC PIXEL DEN - TRANG TRI KIEU RETRO */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-black" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-black" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-black" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-black" />
        
        {/* NUT THAT SU - CHUA TEXT VA XU LY CLICK */}
        <button
          onClick={onClick}
          className={`w-full h-full flex items-center justify-center font-bold text-2xl ${scheme.text} tracking-wider`}
          style={{ fontFamily: "'Press Start 2P', monospace", letterSpacing: "0.1em" }} // font retro
        >
          {label}
        </button>
      </div>
    </motion.div>
  )
}