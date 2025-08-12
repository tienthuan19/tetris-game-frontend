// Vị trí: lib/hooks/useLeaderboard.ts

import { useState, useEffect, useCallback } from "react";

export interface LeaderboardEntry {
  _id?: string;
  rank?: number;
  name: string;
  score: number;
  username?: string; // <-- Thêm trường này
}

// URL cơ sở của backend API của bạn
const API_BASE_URL = "http://localhost:3001/api/v1";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm lấy dữ liệu leaderboard từ backend
  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/game/leaderboard`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard from backend");
      }
      const data: LeaderboardEntry[] = await response.json();

      // *** THAY ĐỔI QUAN TRỌNG: Chuyển đổi dữ liệu ở đây ***
      const formattedData = data.map((entry, index) => ({
        _id: entry._id,
        rank: index + 1, // Gán rank dựa trên thứ tự đã được sort từ backend
        name: entry.username || "UNKNOWN", // Lấy username và gán vào 'name'
        score: entry.score,
      }));

      setLeaderboard(formattedData);
    } catch (error) {
      console.error("Error loading leaderboard from backend:", error);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tự động gọi fetchLeaderboard khi hook được sử dụng
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Hàm thêm điểm số mới vào backend (yêu cầu token)
  const addScore = useCallback(
    async (score: number): Promise<any | null> => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found, cannot submit score.");
        return null;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/game/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gửi token xác thực
          },
          body: JSON.stringify({ score }), // API của bạn chỉ cần score
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit score");
        }

        const result = await response.json();

        // Sau khi thêm điểm thành công, tải lại leaderboard để cập nhật
        await fetchLeaderboard();

        // Trả về kết quả từ API (có thể chứa rank mới hoặc thông báo thành công)
        return result;
      } catch (error) {
        console.error("Error submitting score:", error);
        return null;
      }
    },
    [fetchLeaderboard]
  );

  // *** THÊM HÀM ĐỒNG BỘ Ở ĐÂY ***
  const syncGuestScores = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("authToken");
    // Nếu không có token, không làm gì cả
    if (!token) {
      return;
    }

    const guestScoresRaw = localStorage.getItem("tetris_guest_scores");
    const guestScores = guestScoresRaw ? JSON.parse(guestScoresRaw) : [];

    // Nếu không có điểm nào để đồng bộ, không làm gì cả
    if (guestScores.length === 0) {
      return;
    }

    console.log("Bắt đầu đồng bộ điểm số của khách:", guestScores);

    try {
      // Gọi đến một API mới chuyên để đồng bộ
      const response = await fetch(`${API_BASE_URL}/auth/game/score/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scores: guestScores }), // Gửi cả mảng điểm
      });

      if (!response.ok) {
        throw new Error("Đồng bộ điểm thất bại.");
      }

      console.log("Đồng bộ thành công!");

      // *** Rất quan trọng: Xóa điểm đã đồng bộ khỏi localStorage ***
      localStorage.removeItem("tetris_guest_scores");

      // Tải lại bảng xếp hạng để cập nhật giao diện
      fetchLeaderboard();
    } catch (error) {
      console.error("Lỗi khi đồng bộ điểm:", error);
    }
  }, [fetchLeaderboard]); // Thêm fetchLeaderboard vào dependencies

  return {
    leaderboard,
    isLoading,
    addScore,
    fetchLeaderboard, // Export thêm hàm này để có thể gọi lại từ bên ngoài
    syncGuestScores, // Export hàm mới
  };
};
