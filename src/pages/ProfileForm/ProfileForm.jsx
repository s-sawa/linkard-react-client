import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "./ProfileForm.css"; // CSSファイルのインポート

const ProfileForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { register, handleSubmit, getValues, errors, control } = useForm({
    defaultValues: {
      hobbies: [{ hobby: "" }],
      others: [{ other: "" }],
    },
  });

  const {
    fields,
    append: appendHobbies,
    remove: removeHobby,
  } = useFieldArray({
    control,
    name: "hobbies",
  });
  const {
    fields: fieldsOther,
    append: appendOther,
    remove: removeOther,
  } = useFieldArray({
    control,
    name: "others",
  });

  // profile画像
  const [image, setImage] = useState(null);
  // フリー投稿画像
  const [freeImage, setFreeImage] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || null);

  const onImageChange = (event) => {
    // eventで選択された画像ファイルをfile格納
    const file = event.target.files[0];
    // imageをfileに更新する
    setImage(file);
  };
  const onFreeImageChange = (event) => {
    // eventで選択された画像ファイルをfile格納
    const file = event.target.files[0];
    // imageをfileに更新する
    setFreeImage(file);
  };

  const [newOtherName, setNewOtherName] = useState("その他");

  // その他の項目名変更ボタンがクリックされたときのハンドラ
  const handleOtherNameChange = () => {
    // フォームの新しい項目名を取得
    const updatedOtherName = getValues("otherName"); // getValues を使用して値を取得
    console.log(updatedOtherName);
    setNewOtherName(updatedOtherName);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    // appendを使ってobject形式で、formDataに入れていく
    // ()の中のキー (birthday)はテーブルのカラム名と一致させる
    // バリューのdataはhook-formのregisterで登録した入力値が入っている
    console.log(data);
    formData.append("birthday", data.birthday);
    formData.append("comment", data.comment);

    data.hobbies.forEach((hobbyObj, index) => {
      formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby);
    });

    data.others.forEach((otherObj, index) => {
      formData.append(`others[${index}][name]`, otherObj.name);
    });

    formData.append("newOtherName", newOtherName);

    formData.append("title", data.title);
    formData.append("description", data.description);

    if (image) {
      formData.append("profile_image", image);
    }
    if (freeImage) {
      formData.append("free_image", freeImage);
    }
    console.log([...formData.entries()]);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/profile/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      console.log(response.data.user.id);
      const receivedToken = response.data.token;
      setToken(receivedToken);
      console.log(token);
      Cookies.set("token", receivedToken, { expires: 7 });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>ProfileForm</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>誕生日:</label>
          <input type="date" name="birthday" {...register("birthday")} />
        </div>
        <div>
          <label>一言メッセージ:</label>
          <textarea name="comment" {...register("comment")}></textarea>
        </div>
        <div>
          <label>プロフィール画像:</label>
          {/* 画像が選択されたらonImageChange関数が実行される */}
          <input type="file" accept="image/*" onChange={onImageChange} />
          {/* 選択画像の表示 */}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="プロフィール画像"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>

        <div>
          <hr />
          <label>趣味:</label>
          {fields &&
            fields.map((field, index) => (
              <div key={field.id}>
                <input
                  name={`hobbies[${index}].hobby`}
                  {...register(`hobbies[${index}].hobby`)}
                  defaultValue={field.hobby}
                />
                <button type="button" onClick={() => removeHobby(index)}>
                  削除
                </button>
              </div>
            ))}
          <button type="button" onClick={() => appendHobbies({ hobby: "" })}>
            ＋
          </button>
        </div>
        <div>
          <hr />
          <label>{newOtherName}:</label>
          <input
            type="text"
            name="otherName"
            {...register("otherName")}
            placeholder="好きな項目を追加"
          />
          <button type="button" onClick={handleOtherNameChange}>
            項目名変更
          </button>
          {fieldsOther &&
            fieldsOther.map((field, index) => (
              <div key={field.id}>
                <input
                  name={`others[${index}].name`}
                  {...register(`others[${index}].name`)}
                  defaultValue={field.name}
                />
                <button type="button" onClick={() => removeOther(index)}>
                  削除
                </button>
              </div>
            ))}
          <button type="button" onClick={() => appendOther({ other: "" })}>
            ＋
          </button>
        </div>

        {/* フリー投稿 */}
        <div>
          <hr />
          <label>フリー投稿:</label>
          <p>タイトル</p>
          <input type="text" name="title" {...register("title")} />
          <p>説明</p>
          <textarea name="description" {...register("description")}></textarea>
          <p>プロフィール画像:</p>
          {/* 画像が選択されたらonImageChange関数が実行される */}
          <input type="file" accept="image/*" onChange={onFreeImageChange} />
          {/* 選択画像の表示 */}
          {freeImage && (
            <img
              src={URL.createObjectURL(freeImage)}
              alt="フリー投稿画像"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>

        <div>
          <button type="submit">送信</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
