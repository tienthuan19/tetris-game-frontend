"use client"

import { motion } from "framer-motion"

// COMPONENT LOGO TETRIS BANG PIXEL ART
export default function TetrisLogo() {
  const pixelSize = 12 // kich thuoc moi pixel

  // DINH NGHIA CAC CHU CAI BANG MA TRAN PIXEL
  const T = [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ]
  const E = [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ]
  const R = [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ]
  const I = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ]
  const S = [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ]

  // MAU SAC CAU VONG CHO CAC CHU CAI
  const rainbow = ["#FF4D6D", "#FFD600", "#57CC99", "#4EA8DE", "#A06CD5", "#FF7B00"]

  const letterData = [ // Du lieu cac chu cai va mau sac tuong ung
    { letter: T, color: rainbow[0] },
    { letter: E, color: rainbow[1] },
    { letter: T, color: rainbow[2] },
    { letter: R, color: rainbow[3] },
    { letter: I, color: rainbow[4] },
    { letter: S, color: rainbow[5] },
  ]

  return (
    <div className="relative select-none" style={{ userSelect: "none" }}> 
      <div className="flex items-center space-x-2 relative z-10"> 
        {letterData.map((item, letterIndex) => ( // Lap qua tung chu cai trong logo
          <motion.div // Animation cho moi chu cai
            key={letterIndex} 
            initial={{ opacity: 0, y: -20 }} // Bat dau trong suot va o tren
            animate={{ opacity: 1, y: 0 }}    // Ket thuc ro va o vi tri binh thuong
            transition={{ // Cau hinh animation
              delay: 0.1 * letterIndex,  // moi chu cai hien ra cach nhau 0.1s
              duration: 0.3,             // thoi gian thuc hien
              type: "spring",            // kieu animation lò xo
              stiffness: 200,            // do cung cua lo xo
            }}
            className="flex flex-col"
          >
            {item.letter.map((row, rowIndex) => ( // Lap qua tung hang pixel cua chu cai
              <div key={rowIndex} className="flex">
                {row.map((pixel, pixelIndex) => (
                  <motion.div // Animation cho tung pixel
                    key={pixelIndex}
                    initial={{ scale: 0 }}        // Bat dau thu nho
                    animate={{ scale: pixel ? 1 : 0 }} // Phong to neu la pixel co mau
                    transition={{
                      delay: 0.1 * letterIndex + 0.01 * (rowIndex + pixelIndex), // moi pixel hien ra lan luot
                      type: "spring",    // kieu animation lo xo
                      stiffness: 300,    // do cung lo xo
                      damping: 15,       // do giam chan
                    }}
                    style={{
                      width: pixelSize,
                      height: pixelSize,
                      backgroundColor: pixel ? item.color : "transparent", // mau sac pixel
                    }}
                    className={pixel ? "shadow-sm" : ""} // bong cho pixel co mau
                  />
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}