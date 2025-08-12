import { useState, useEffect } from "react";

// KIEU DU LIEU NGUOI DUNG
interface User {
  name: string; // ten nguoi dung
}

// Define an interface for the decoded JWT payload
interface DecodedToken {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

/**
 * A simple and safe function to decode a JWT token from the client-side.
 * It extracts the payload which contains user information.
 * @param {string} token The JWT token from localStorage.
 * @returns {DecodedToken|null} The decoded user object or null if decoding fails.
 */
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

const AUTH_TOKEN_KEY = "authToken";

// HOOK XU LY DANG NHAP VA QUAN LY NGUOI DUNG
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TAI THONG TIN NGUOI DUNG TU LOCALSTORAGE KHI KHOI TAO
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          const decodedUser = decodeToken(token);
          // Kiem tra token co hop le va con han su dung khong
          if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
            setUser({ name: decodedUser.username });
          } else {
            // Token khong hop le hoac da het han, xoa no di
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        }
      } catch (error) {
        console.error("Loi tai thong tin nguoi dung:", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // HAM DANG XUAT
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // Chuyen ve trang chu de giao dien duoc cap nhat
    window.location.href = "/";
  };

  const isAuthenticated = !!user;

  return {
    user,
    logout,
    isAuthenticated,
    isLoading,
  };
};
