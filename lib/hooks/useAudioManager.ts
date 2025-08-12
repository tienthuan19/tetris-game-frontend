import { useState, useEffect, useCallback } from "react"

// BIEN XU LY NHAC GLOBAL - QUAN LY AUDIO CONTEXT VA NODES
let audioContext: AudioContext | null = null     // context audio chinh
let audioSource: AudioBufferSourceNode | null = null  // nguon phat nhac
let gainNode: GainNode | null = null            // node dieu chinh am luong
let audioBuffer: AudioBuffer | null = null      // buffer chua du lieu nhac
let isPlaying = false                           // trang thai dang phat nhac

// HOOK QUAN LY AM THANH CUA GAME
export const useAudioManager = () => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(false) // trang thai bat/tat nhac
  const [musicVolume, setMusicVolume] = useState(50)          // muc am luong (0-100)

  // KHOI TAO AUDIO CONTEXT VA TAI NHAC GAME
  useEffect(() => {
    const initAudio = async () => {
      if (!audioContext) {
        // tao audio context moi
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        gainNode = audioContext.createGain() // tao node dieu chinh am luong
        gainNode.connect(audioContext.destination) // ket noi den loa
        try {
          // tai file nhac tu server
          const response = await fetch("/sounds/game music.mp3")
          const arrayBuffer = await response.arrayBuffer()
          audioBuffer = await audioContext.decodeAudioData(arrayBuffer) // giai ma nhac
        } catch (error) {
          console.error("Error loading audio:", error)
        }
      }
    }
    initAudio()
    // cleanup khi component unmount
    return () => {
      if (audioContext) {
        audioContext.close()
        audioContext = null
        audioBuffer = null
        isPlaying = false
      }
    }
  }, [])

  // HAM PHAT NHAC GAME
  const playMusic = useCallback(() => {
    if (!audioContext || !audioBuffer || !gainNode || isPlaying) return
    audioSource = audioContext.createBufferSource() // tao nguon phat nhac
    audioSource.buffer = audioBuffer                // gan buffer nhac
    audioSource.loop = true                         // lap lai vo han
    audioSource.connect(gainNode)                   // ket noi den gain node
    gainNode.gain.value = musicVolume / 100         // set am luong (0.0 - 1.0)
    audioSource.start(0)                           // bat dau phat nhac
    isPlaying = true
    audioSource.onended = () => { // xu ly khi nhac ket thuc
      isPlaying = false
      if (isMusicEnabled) playMusic() // phat lai neu nhac van duoc bat
    }
  }, [musicVolume, isMusicEnabled])

  // HAM DUNG NHAC
  const stopMusic = useCallback(() => {
    if (audioSource) {
      audioSource.stop()    // dung phat nhac
      audioSource = null    // xoa tham chieu
      isPlaying = false     // cap nhat trang thai
    }
  }, [])

  // XU LY BAT/TAT NHAC
  const handleMusicToggle = useCallback(
    (enabled: boolean) => {
      setIsMusicEnabled(enabled) // cap nhat trang thai bat/tat
      if (gainNode) {
        gainNode.gain.value = enabled ? musicVolume / 100 : 0 // set am luong theo trang thai
        if (enabled && !isPlaying) playMusic()  // phat nhac neu bat va chua phat
        else if (!enabled) stopMusic()          // dung nhac neu tat
      }
    },
    [musicVolume, playMusic, stopMusic]
  )

  // XU LY THAY DOI AM LUONG
  const handleVolumeChange = useCallback(
    (volume: number) => {
      setMusicVolume(volume) // cap nhat gia tri am luong
      if (gainNode && isMusicEnabled) gainNode.gain.value = volume / 100 // ap dung am luong moi
    },
    [isMusicEnabled]
  )

  // TU DONG PHAT NHAC KHI DUOC BAT
  useEffect(() => {
    if (isMusicEnabled && !isPlaying) playMusic()
  }, [isMusicEnabled, playMusic])

  return {
    isMusicEnabled,      // trang thai bat/tat nhac
    musicVolume,         // muc am luong hien tai
    handleMusicToggle,   // ham bat/tat nhac
    handleVolumeChange,  // ham thay doi am luong
    playMusic,           // ham phat nhac
    stopMusic            // ham dung nhac
  }
}
