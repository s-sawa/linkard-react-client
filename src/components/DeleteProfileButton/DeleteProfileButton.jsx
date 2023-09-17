import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DeleteProfileButton = () => {
  const navigate = useNavigate();

  const token = Cookies.get("token");

  const handleDelete = async () => {
    try {
      const response = await axios.delete("http://localhost/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      Cookies.remove("token");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return <button onClick={handleDelete}>プロフィール削除</button>;
};

export default DeleteProfileButton;
