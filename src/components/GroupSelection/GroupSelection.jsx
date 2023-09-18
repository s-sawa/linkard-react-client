import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const GroupSelection = ({ API_BASE_URL }) => {
  const [groups, setGroups] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddNewGroup = async (data) => {
    try {
      const response = await axios.post(API_BASE_URL + "/api/groups", {
        name: data.newGroupName,
      });
      setGroups((prevGroups) => [...prevGroups, response.data]);
      reset(); // 入力フィールドをリセット
    } catch (error) {
      console.error("新しいグループの追加に失敗しました: ", error);
    }
  };

  return (
    <div>
      <h2>グループの選択</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.name}
            {/* ここにグループを選択するロジックを追加することもできます。 */}
          </li>
        ))}
      </ul>

      <h2>新しいグループの追加</h2>
      <form onSubmit={handleSubmit(handleAddNewGroup)}>
        <input
          type="text"
          {...register("newGroupName", { required: "グループ名は必須です" })}
          placeholder="新しいグループ名"
        />
        {errors.newGroupName && <p>{errors.newGroupName.message}</p>}
        <button type="submit">新しいグループを追加</button>
      </form>
    </div>
  );
};

export default GroupSelection;
