import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate(); // useNavigateを初期化

  // ログアウト処理を実行する関数
  const handleLogout = async () => {
    const token = Cookies.get("token");

    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/api/logout`, null, {
          headers,
        });

        Cookies.remove("token"); // トークンをCookieから削除
        console.log("ログアウトしました");
        navigate("/login");
      } catch (error) {
        console.log("ログアウトエラー：", error);
      }
    } else {
      console.log("トークンがありません");
    }
  };

  return (
    <div>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  );
};

export default Logout;
