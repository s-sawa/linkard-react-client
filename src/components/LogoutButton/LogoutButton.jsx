import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getTokenFromCookie } from "../../utils/cookies";

const LogoutButton = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getTokenFromCookie();

  const navigate = useNavigate(); // useNavigateを初期化

  // ログアウト処理を実行する関数
  const handleLogout = async () => {
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/api/logout`, null, {
          headers,
        });

        Cookies.remove("token"); // トークンをCookieから削除
        navigate("/login");
      } catch (error) {
        // console.log("ログアウトエラー：", error);
      }
    } else {
      //   console.log("トークンがありません");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        style={{ marginBottom: "10rem" }}
      >
        ログアウト
      </button>
    </div>
  );
};

export default LogoutButton;
