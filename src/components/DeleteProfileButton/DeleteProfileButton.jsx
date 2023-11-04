import { Modal } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DeleteProfileButton = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const handleDelete = () => {
    // confirmModal("確認", "アカウントを削除しますか？", )
    Modal.confirm({
      title: "確認",
      content: "アカウントを削除しますか？",
      async onOk() {
        try {
          const response = await axios.delete(
            `${API_BASE_URL}/api/profile/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.message);
          Cookies.remove("token");
          navigate("/login");
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  return <button onClick={handleDelete}>アカウント削除</button>;
};

export default DeleteProfileButton;
