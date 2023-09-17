import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate(); // useNavigateを初期化

  // ログアウト処理を実行する関数
  const handleLogout = () => {
    const token = Cookies.get("token");

    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      }; //response サーバーからのデータやHTTPステータスコード、ヘッダー情報などが含まれる

      axios
        .post("http://localhost/api/logout", null, { headers })
        .then((response) => {
          // ログアウト成功時の処理
          Cookies.remove("token"); // トークンをCookieから削除
          console.log("ログアウトしました");
          navigate("/login");
        })
        .catch((error) => {
          // ログアウトエラー時の処理
          console.log("ログアウトエラー：", error);
        });
    } else {
      // トークンが存在しない場合の処理
      console.log("トークンがありません");
    }
  };

  // コンポーネントのレンダリング
  return (
    <div>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  );
};

export default Logout;
