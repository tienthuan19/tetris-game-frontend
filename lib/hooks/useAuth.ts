import { useState, useEffect } from "react"

// KIEU DU LIEU NGUOI DUNG
interface User {
  name: string // ten nguoi dung
}

const USER_STORAGE_KEY = "tetris_user" // key luu trong localStorage

// HOOK XU LY DANG NHAP VA QUAN LY NGUOI DUNG
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null) // thong tin nguoi dung hien tai
  const [isLoading, setIsLoading] = useState(true) // trang thai dang tai

  // TAI THONG TIN NGUOI DUNG TU LOCALSTORAGE KHI KHOI TAO
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY)
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Loi tai thong tin nguoi dung:", error)
        // xoa du lieu loi
        localStorage.removeItem(USER_STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // HAM DANG KY TAI KHOAN MOI
  const register = (name: string, password: string) => {
    // kiem tra du lieu dau vao
    if (!name.trim() || name.trim().length < 3) {
      throw new Error("Ten nguoi dung phai co it nhat 3 ky tu")
    }
    
    if (!password || password.length < 6) {
      throw new Error("Mat khau phai co it nhat 6 ky tu")
    }

    const userData: User = { 
      name: name.trim()
    }
    
    setUser(userData)
    
    // luu vao localStorage
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    } catch (error) {
      console.error("Loi luu thong tin nguoi dung:", error)
      throw new Error("Khong the luu thong tin dang ky")
    }
  }

  // HAM DANG NHAP
  const login = (name: string, password?: string) => {
    const userData: User = { 
      name: name.trim() // loai bo khoang trang dau cuoi
    }
    
    setUser(userData)
    
    // luu vao localStorage
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    } catch (error) {
      console.error("Loi luu thong tin nguoi dung:", error)
    }
  }

  // HAM DANG XUAT
  const logout = () => {
    setUser(null)
    // xoa khoi localStorage
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  // KIEM TRA NGUOI DUNG DA DANG NHAP CHUA
  const isAuthenticated = !!user

  return {
    user, // thong tin nguoi dung hien tai
    login, // ham dang nhap
    register, // ham dang ky
    logout, // ham dang xuat
    isAuthenticated, // da dang nhap chua
    isLoading // trang thai dang tai
  }
}
