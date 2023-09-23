import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";

const AddGroupButton = ({ API_BASE_URL, onGroupAdded }) => {
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token");
      await axios.post(`${API_BASE_URL}/api/groups`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("グループが追加されました！");
      onGroupAdded(); // グループが追加されたらこの関数を呼び出す

      setShowForm(false);
    } catch (error) {
      console.error("グループの追加に失敗しました: ", error);
    }
  };

  return (
    <div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>グループを追加</button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("name")} placeholder="グループ名" required />
          <button type="submit">追加する</button>
        </form>
      )}
    </div>
  );
};

export default AddGroupButton;