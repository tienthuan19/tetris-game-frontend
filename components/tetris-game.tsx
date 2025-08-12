"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameOverScreen from "./game-over-screen";
import KeyGuide from "./key-guide";

// CAC HANG SO CUA GAME - CONFIG CHINH
const BOARD_WIDTH = 10; // bang game rong 10 o
const BOARD_HEIGHT = 20; // bang game cao 20 o
const BLOCK_SIZE = 30; // moi o rong 30 pixel
const LEVEL_SPEED = [800, 650, 500, 400, 300, 250, 200, 150, 100, 80, 50]; // toc do roi theo level (ms)
const LINE_CLEAR_SOUND_URL = "/sounds/collect point.mp3"; // am thanh khi xoa dong

// CAC LOAI KHOI TETRIS - 7 HINH DANG CO BAN
const TETRIMINO_KEYS = ["I", "O", "T", "J", "L", "S", "Z"] as const; // danh sach ten khoi
type TetriminoKey = (typeof TETRIMINO_KEYS)[number]; // kieu du lieu cho ten khoi

// DINH NGHIA HINH DANG VA MAU SAC CUA TUNG KHOI
const TETRIMINOS: Record<TetriminoKey, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#4EA8DE",
  }, // khoi thang
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#FFC857",
  }, // khoi vuong
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#A06CD5",
  }, // khoi chu T
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#57CC99",
  }, // khoi chu J
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#FF7B00",
  }, // khoi chu L
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#FF8FA3",
  }, // khoi chu S
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#FF4D6D",
  }, // khoi chu Z
};

// KIEU DU LIEU CHO KHOI TETRIS
type Tetrimino = {
  shape: number[][]; // ma tran hinh dang khoi
  color: string; // mau sac cua khoi
  type: TetriminoKey; // loai khoi (I, O, T, J, L, S, Z)
};

// KIEU DU LIEU CHO O TRONG BANG GAME (trong hoac co khoi)
type BoardCell = 0 | Tetrimino; // 0 = o trong, Tetrimino = co khoi

// TAO BANG GAME RONG 10x20
const createEmptyBoard = (): BoardCell[][] =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0)
  );

// LAY KHOI NGAU NHIEN TU 7 LOAI KHOI
const getRandomTetrimino = () => {
  const type =
    TETRIMINO_KEYS[Math.floor(Math.random() * TETRIMINO_KEYS.length)];
  return { ...TETRIMINOS[type], type };
};

// VI TRI BAT DAU CUA KHOI MOI (GIUA TREN CUNG)
const initialPosition = { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 };

// CAC PROPS TRUYEN VAO COMPONENT TETRIS GAME
type TetrisGameProps = {
  onReturn: () => void; // ham quay ve menu chinh
  onGameOver?: (score: number) => void; // ham xu ly khi game over
  onLeaderboard?: () => void; // ham mo bang xep hang
  onLogin?: (score: number) => void; // ham mo trang dang nhap
};

export default function TetrisGame({
  onReturn,
  onGameOver,
  onLeaderboard,
  onLogin,
}: TetrisGameProps) {
  // CAC TRANG THAI CHINH CUA GAME
  const [board, setBoard] = useState(createEmptyBoard()); // bang game hien tai
  const [currentPiece, setCurrentPiece] = useState(getRandomTetrimino()); // khoi dang roi
  const [nextPiece, setNextPiece] = useState(getRandomTetrimino()); // khoi tiep theo
  const [position, setPosition] = useState({ ...initialPosition }); // vi tri khoi hien tai
  const [gameOver, setGameOver] = useState(false); // trang thai game over
  const [score, setScore] = useState(0); // diem so hien tai
  const [level, setLevel] = useState(1); // cap do hien tai
  const [lines, setLines] = useState(0); // so dong da xoa
  const [isPaused, setIsPaused] = useState(false); // trang thai tam dung

  // CAC REF DE QUAN LY DOM VA TIMER
  const canvasRef = useRef<HTMLCanvasElement>(null); // tham chieu den canvas
  const lineClearSoundRef = useRef<HTMLAudioElement | null>(null); // am thanh xoa dong
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null); // timer cho khoi roi

  // KHOI TAO AM THANH XOA DONG
  useEffect(() => {
    lineClearSoundRef.current = new Audio(LINE_CLEAR_SOUND_URL);
    return () => {
      if (lineClearSoundRef.current) lineClearSoundRef.current = null;
    };
  }, []);

  // PHAT AM THANH KHI XOA DONG
  const playLineClearSound = useCallback(() => {
    if (lineClearSoundRef.current) {
      lineClearSoundRef.current.currentTime = 0; // reset ve dau
      lineClearSoundRef.current.play().catch(() => {}); // phat am thanh
    }
  }, []);

  // KIEM TRA VA CHAM GIUA KHOI VA TUONG/SAN/KHOI KHAC
  const checkCollision = useCallback(
    (piece: { shape: string | any[] }, pos: { x: number; y: number }) => {
      // duyet qua tung o cua khoi
      for (let y = 0; y < piece.shape.length; y++)
        for (let x = 0; x < piece.shape[y].length; x++)
          if (
            piece.shape[y][x] && // neu o nay co khoi
            (pos.x + x < 0 || // va cham tuong trai
              pos.x + x >= BOARD_WIDTH || // va cham tuong phai
              pos.y + y >= BOARD_HEIGHT || // va cham san
              (pos.y + y >= 0 && board[pos.y + y][pos.x + x])) // va cham khoi khac
          )
            return true; // co va cham
      return false; // khong va cham
    },
    [board]
  );

  // CAP NHAT BANG KHI KHOI ROI XUONG VA CO DINH
  const updateBoard = useCallback(() => {
    const newBoard = board.map((row) => [...row]); // sao chep bang hien tai

    // DAT KHOI HIEN TAI VAO BANG
    for (let y = 0; y < currentPiece.shape.length; y++)
      for (let x = 0; x < currentPiece.shape[y].length; x++)
        if (currentPiece.shape[y][x]) {
          const by = position.y + y;
          const bx = position.x + x;
          if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH)
            newBoard[by][bx] = currentPiece; // dat khoi vao vi tri
        }

    // TIM CAC DONG DA DAY DE XOA
    const completed: number[] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++)
      if (newBoard[y].every((cell) => cell !== 0)) completed.push(y); // dong day

    // XU LY XOA DONG VA TINH DIEM
    if (completed.length) {
      playLineClearSound(); // phat am thanh
      const linePoints = [40, 100, 300, 1200]; // diem cho 1, 2, 3, 4 dong
      setScore((s) => s + linePoints[completed.length - 1] * level); // tang diem theo level
      setLines((l) => {
        const nl = l + completed.length; // tong dong da xoa
        setLevel(Math.floor(nl / 10) + 1); // tang level moi 10 dong
        return nl;
      });

      // XOA CAC DONG DAY VA THEM DONG MOI O TREN
      const filtered = newBoard.filter((_, i) => !completed.includes(i)); // loai dong day
      const newRows: BoardCell[][] = Array.from(
        { length: completed.length },
        () => Array.from({ length: BOARD_WIDTH }, () => 0 as BoardCell)
      );
      setBoard([...newRows, ...filtered]); // them dong moi o tren
    } else setBoard(newBoard);

    // KIEM TRA GAME OVER
    if (position.y <= 0) {
      setGameOver(true);
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      return;
    }

    // CHUAN BI KHOI MOI
    setPosition({ ...initialPosition }); // dat lai vi tri
    setCurrentPiece(nextPiece); // dung khoi tiep theo
    setNextPiece(getRandomTetrimino()); // tao khoi moi cho lan sau
  }, [board, currentPiece, nextPiece, position, level, playLineClearSound]);

  // XOAY KHOI 90 DO THEO CHIEU KIM DONG HO
  const rotate = useCallback(
    (piece: Tetrimino) => ({
      ...piece,
      shape: piece.shape[0].map((_, i) =>
        piece.shape.map((row) => row[i]).reverse()
      ), // phep xoay ma tran
    }),
    []
  );

  // THU XOAY KHOI NEU KHONG VA CHAM
  const tryRotate = useCallback(() => {
    const rotated = rotate(currentPiece);
    if (!checkCollision(rotated, position)) setCurrentPiece(rotated); // chi xoay neu khong va cham
  }, [currentPiece, position, rotate, checkCollision]);

  // DI CHUYEN KHOI SANG TRAI HOAC PHAI
  const moveHorizontal = useCallback(
    (dir: number) => {
      // dir: -1 = trai, 1 = phai
      if (gameOver || isPaused) return; // khong di chuyen khi game over hoac pause
      const newPos = { ...position, x: position.x + dir };
      if (!checkCollision(currentPiece, newPos)) setPosition(newPos); // chi di chuyen neu khong va cham
    },
    [currentPiece, position, checkCollision, gameOver, isPaused]
  );

  // DI CHUYEN KHOI XUONG DUOI (SOFT DROP)
  const moveDown = useCallback(() => {
    if (gameOver || isPaused) return;
    const newPos = { ...position, y: position.y + 1 };
    if (!checkCollision(currentPiece, newPos))
      setPosition(newPos); // roi xuong neu khong va cham
    else updateBoard(); // co dinh khoi neu khong roi duoc nua
  }, [currentPiece, position, checkCollision, gameOver, isPaused, updateBoard]);

  // ROI NHANH KHOI XUONG DUOI CUNG (HARD DROP)
  const hardDrop = useCallback(() => {
    if (gameOver || isPaused) return;
    let newY = position.y;
    // tim vi tri thap nhat co the roi
    while (
      !checkCollision(currentPiece, { x: position.x, y: newY + 1 }) &&
      newY < BOARD_HEIGHT
    )
      newY++;
    setPosition({ x: position.x, y: newY }); // dat khoi xuong vi tri thap nhat
  }, [currentPiece, position, checkCollision, gameOver, isPaused]);

  // TU DONG CO DINH KHOI KHI KHONG THE ROI THEM
  useEffect(() => {
    if (!gameOver && !isPaused && position.y > 0) {
      if (checkCollision(currentPiece, { x: position.x, y: position.y + 1 })) {
        // neu khoi khong the roi them, doi 50ms roi co dinh
        const lockTimeout = setTimeout(updateBoard, 50);
        return () => clearTimeout(lockTimeout);
      }
    }
  }, [
    position.x,
    position.y,
    currentPiece,
    checkCollision,
    updateBoard,
    gameOver,
    isPaused,
  ]);

  // XU LY CAC PHIM BAM
  useEffect(() => {
    const handleKeyDown = (e: { key: string }) => {
      if (gameOver) return; // khong xu ly phim khi game over
      if (e.key === "ArrowLeft") moveHorizontal(-1); // mui ten trai
      else if (e.key === "ArrowRight") moveHorizontal(1); // mui ten phai
      else if (e.key === "ArrowDown") moveDown(); // mui ten xuong
      else if (e.key === "ArrowUp") tryRotate(); // mui ten len
      else if (e.key === " ") hardDrop(); // phim space
      else if (e.key === "p" || e.key === "P") setIsPaused((p) => !p); // phim P
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveHorizontal, moveDown, tryRotate, hardDrop, gameOver]);

  // KHOI DONG LAI GAME TU DAU
  const restartGame = useCallback(() => {
    setBoard(createEmptyBoard()); // tao bang moi
    setCurrentPiece(getRandomTetrimino()); // khoi moi
    setNextPiece(getRandomTetrimino()); // khoi tiep theo moi
    setPosition({ ...initialPosition }); // dat lai vi tri ban dau
    setGameOver(false); // reset trang thai game over
    setScore(0); // reset diem so
    setLevel(1); // reset level
    setLines(0); // reset so dong da xoa
    setIsPaused(false); // reset trang thai pause
  }, []);

  // DIEU KHIEN TOC DO ROI THEO LEVEL
  useEffect(() => {
    if (!gameOver && !isPaused) {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      // tinh toc do roi: level cao hon = roi nhanh hon
      const dropSpeed =
        LEVEL_SPEED[Math.min(level - 1, LEVEL_SPEED.length - 1)];
      dropIntervalRef.current = setInterval(moveDown, dropSpeed); // thiet lap timer roi
    } else if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    };
  }, [level, moveDown, gameOver, isPaused]);

  // XU LY KHI GAME OVER
  useEffect(() => {
    if (gameOver && onGameOver) {
      onGameOver(score); // gui diem so cho component cha
    }
  }, [gameOver, score, onGameOver]);

  // VE CANVAS - HIEN THI TOAN BO GAME
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // XOA CANVAS VA TO MAU DEN
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // VE LUOI BANG GAME
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    // duong doc
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, canvas.height);
      ctx.stroke();
    }
    // duong ngang
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(canvas.width, y * BLOCK_SIZE);
      ctx.stroke();
    }

    // VE CAC KHOI DA CO DINH TREN BANG
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x]) {
          const cell = board[y][x] as Tetrimino;
          ctx.fillStyle = cell.color;
          ctx.fillRect(
            x * BLOCK_SIZE + 1,
            y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );

          // ve vien den cho khoi
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            x * BLOCK_SIZE + 1,
            y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );
        }
      }
    }

    // VE KHOI DANG ROI
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const bx = position.x + x;
          const by = position.y + y;
          if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
            ctx.fillStyle = currentPiece.color;
            ctx.fillRect(
              bx * BLOCK_SIZE + 1,
              by * BLOCK_SIZE + 1,
              BLOCK_SIZE - 2,
              BLOCK_SIZE - 2
            );

            // ve vien den cho khoi
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.strokeRect(
              bx * BLOCK_SIZE + 1,
              by * BLOCK_SIZE + 1,
              BLOCK_SIZE - 2,
              BLOCK_SIZE - 2
            );
          }
        }
      }
    }
  }, [board, currentPiece, position]);

  // GIAO DIEN CHINH CUA GAME
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8">
      {gameOver ? (
        // HIEN THI MAN HINH GAME OVER
        <GameOverScreen
          score={score}
          onRestart={restartGame}
          onMainMenu={onReturn}
          onLeaderboard={onLeaderboard}
          onLogin={() => onLogin?.(score)}
        />
      ) : (
        // HIEN THI GAME DANG CHAY
        <div className="flex flex-col md:flex-row items-start justify-center gap-6">
          {/* BANG GAME CHINH */}
          <div className="bg-black border-4 border-white shadow-2xl relative">
            {/* CANVAS VE GAME */}
            <canvas
              ref={canvasRef}
              width={BOARD_WIDTH * BLOCK_SIZE}
              height={BOARD_HEIGHT * BLOCK_SIZE}
              className="block"
            />
            {/* HIEN THI PAUSED KHI TAM DUNG */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div
                  className="text-white text-3xl font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  PAUSED
                </div>
              </div>
            )}
          </div>
          {/* BANG THONG TIN BEN PHAI */}
          <div className="flex flex-col items-center gap-4">
            {/* KHUNG THONG TIN GAME */}
            <div className="bg-black p-4 border-4 border-black w-48">
              {/* HIEN THI KHOI TIEP THEO */}
              <div className="text-center mb-4">
                <h3
                  className="font-bold uppercase tracking-wide mb-2 text-white"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  NEXT
                </h3>
                <div className="flex justify-center items-center">
                  <div className="relative w-24 h-24 bg-black border-[3px] border-white">
                    <div className="absolute inset-2 border-[3px] border-white">
                      <div className="relative w-full h-full">
                        {/* VE KHOI TIEP THEO */}
                        {nextPiece.shape.map((row: any[], y: number) =>
                          row.map((cell: any, x: number) =>
                            cell ? (
                              <div
                                key={`next-${y}-${x}`}
                                className="absolute border-2 border-black"
                                style={{
                                  width: 18,
                                  height: 18,
                                  backgroundColor: nextPiece.color,
                                  left: x * 18 + 9,
                                  top: y * 18 + 9,
                                }}
                              />
                            ) : null
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* BANG DIEM SO VA THONG TIN */}
              <div className="space-y-4">
                {/* DIEM SO */}
                <div className="bg-black p-3">
                  <h3
                    className="font-bold uppercase tracking-wide text-white mb-1 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    SCORE
                  </h3>
                  <p className="font-mono text-lg text-[#00ff00] leading-none">
                    {score.toString().padStart(6, "0")}
                  </p>
                </div>
                {/* CAP DO */}
                <div className="bg-black p-3">
                  <h3
                    className="font-bold uppercase tracking-wide text-white mb-1 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    LEVEL
                  </h3>
                  <p className="font-mono text-lg text-[#00ff00] leading-none">
                    {level.toString().padStart(2, "0")}
                  </p>
                </div>
                {/* SO DONG DA XOA */}
                <div className="bg-black p-3">
                  <h3
                    className="font-bold uppercase tracking-wide text-white mb-1 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    LINES
                  </h3>
                  <p className="font-mono text-lg text-[#00ff00] leading-none">
                    {lines.toString().padStart(4, "0")}
                  </p>
                </div>
              </div>
            </div>
            {/* CAC NUT DIEU KHIEN */}
            <div className="space-y-3 w-48">
              {/* NUT PAUSE/RESUME */}
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-full py-3 bg-blue-400 text-white font-bold border-4 border-black"
              >
                {isPaused ? "RESUME" : "PAUSE"}
              </button>
              {/* NUT RESTART */}
              <button
                onClick={restartGame}
                className="w-full py-3 bg-pink-400 text-white font-bold border-4 border-black"
              >
                RESTART
              </button>
              {/* NUT VE MENU */}
              <button
                onClick={onReturn}
                className="w-full py-3 bg-yellow-300 text-black font-bold border-4 border-black"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}
      {/* HUONG DAN DIEU KHIEN O DUOI MAN HINH */}
      <KeyGuide />
    </div>
  );
}
