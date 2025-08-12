"use client"

import { JSX, useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

//tao ma tran TETRIMINOS 2D
const TETRIMINOS = { // 1 la khoi 0 la khoang trong
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
}

// mau sac cac khoi
const TETORIS_COLORS = [
  "#FF4D6D", "#FF8FA3", "#4EA8DE", "#57CC99", "#FFC857", "#A06CD5", "#FF7B00"
]

interface TetriminoProps {
  type: keyof typeof TETRIMINOS
  color: string
  x: number //vi tri ngang
  delay: number 
}

// roi tu tren xuong
function Tetrimino({ type, color, x, delay }: TetriminoProps) {
  const controls = useAnimation()
  const blockSize = 20 // kich thuoc moi khoi
  const matrix = TETRIMINOS[type] // lay ma tran tuong ung

  useEffect(() => {
    controls.start({
      y: ["0vh", "120vh"], // di chuyen tu tren xuong
      rotate: [0, 90, 180, 270], // xoay khoi
      transition: {
        y: {
          duration: 10 + Math.random() * 5, // thoi gian roi
          ease: "linear",
          delay,
          repeat: Infinity,
          repeatType: "loop",
        },
        rotate: {
          duration: 5 + Math.random() * 10,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    })
  }, [controls, delay])

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: "-100px",
      }}
    >
      <div className="relative">
        {matrix.map((row, rowIdx) => ( // //tao bang chua cac khoi
          <div key={rowIdx} className="flex">
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                style={{
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: cell ? color : "transparent",
                  border: cell ? "2px solid black" : "none",
                  boxShadow: cell ? "inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.3)" : "none",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// nen dong ngoai menu
export default function TetrisBackground() {
  const [tetriminos, setTetriminos] = useState<JSX.Element[]>([])
// luu cac khoi da tao
  useEffect(() => {
    const types = Object.keys(TETRIMINOS) as Array<keyof typeof TETRIMINOS>
    const pieces: JSX.Element[] = []
    for (let i = 0; i < 20; i++) { // tao 20 khoi
      const randomType = types[Math.floor(Math.random() * types.length)] // chon ngau nhien 
      const randomColor = TETORIS_COLORS[Math.floor(Math.random() * TETORIS_COLORS.length)] // chon mau ngau nhien
      const randomX = Math.random() * 90 // vi tri ngang ngau nhien
      const randomDelay = Math.random() * 5 // thoi gian delay ngau nhien
      pieces.push(
        <Tetrimino key={i} type={randomType} color={randomColor} x={randomX} delay={randomDelay} /> // tao khoi moi voi cac thuoc tinh ngau nhien
      )
    }
    setTetriminos(pieces)
  }, [])

  return (
    <div className="w-full h-full absolute overflow-hidden opacity-70 pointer-events-none">
      {tetriminos}
    </div>
  )
}