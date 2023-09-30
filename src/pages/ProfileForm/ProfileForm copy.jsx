import axios from "axios";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "./ProfileForm.css"; // CSSファイルのインポート
import { useNavigate } from "react-router-dom";
import { getTokenFromCookie } from "../../utils/cookies";

const ProfileForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hobbies: [{ hobby: "" }],
      others: [{ other: "" }],
      others2: [{ other2: "" }],
      others3: [{ other3: "" }],
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

  const {
    fields: fieldsOther2,
    append: appendOther2,
    remove: removeOther2,
  } = useFieldArray({
    control,
    name: "others2",
  });

  const {
    fields: fieldsOther3,
    append: appendOther3,
    remove: removeOther3,
  } = useFieldArray({
    control,
    name: "others3",
  });

  // profile画像
  const [image, setImage] = useState(null);
  // フリー投稿画像
  const [freeImage, setFreeImage] = useState(null);
  const token = getTokenFromCookie();

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

  // その他1
  const [newOtherName, setNewOtherName] = useState("その他");
  // その他2
  const [newOtherName2, setNewOtherName2] = useState("その他");
  // その他3
  const [newOtherName3, setNewOtherName3] = useState("その他");

  // その他の項目名変更ボタンがクリックされたときのハンドラ
  const handleOtherNameChange = () => {
    // フォームの新しい項目名を取得
    const updatedOtherName = getValues("otherName"); // getValues を使用して値を取得
    console.log(updatedOtherName);
    setNewOtherName(updatedOtherName);
  };
  const handleOtherNameChange2 = () => {
    const updatedOtherName = getValues("otherName2");
    setNewOtherName2(updatedOtherName);
  };
  const handleOtherNameChange3 = () => {
    const updatedOtherName = getValues("otherName3");
    setNewOtherName3(updatedOtherName);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    // appendを使ってobject形式で、formDataに入れていく
    // ()の中のキー (birthday)はテーブルのカラム名と一致させる
    // バリューのdataはhook-formのregisterで登録した入力値が入っている
    formData.append("name", data.name);
    // formData.append("birthday", data.birthday);
    formData.append("comment", data.comment);
    formData.append("themeId", data.themeId);

    data.hobbies.forEach((hobbyObj, index) => {
      formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby);
    });

    data.others.forEach((otherObj, index) => {
      formData.append(`others[${index}][name]`, otherObj.name);
    });
    data.others2.forEach((otherObj, index) => {
      formData.append(`others2[${index}][name]`, otherObj.name);
    });
    data.others3.forEach((otherObj, index) => {
      formData.append(`others3[${index}][name]`, otherObj.name);
    });

    formData.append("newOtherName", newOtherName);
    formData.append("newOtherName2", newOtherName2);
    formData.append("newOtherName3", newOtherName3);

    formData.append("title", data.title);
    formData.append("description", data.description);

    if (image) {
      formData.append("profile_image", image);
    }
    if (freeImage) {
      formData.append("free_image", freeImage);
    }
    if (data.facebook_link) {
      formData.append("social_links[0][platform]", "facebook");
      formData.append("social_links[0][url]", data.facebook_link);
    }

    if (data.twitter_link) {
      formData.append("social_links[1][platform]", "twitter");
      formData.append("social_links[1][url]", data.twitter_link);
    }

    if (data.instagram_link) {
      formData.append("social_links[2][platform]", "instagram");
      formData.append("social_links[2][url]", data.instagram_link);
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
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>ProfileForm</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>ニックネーム *</label>
          <input
            type="text"
            name="name"
            {...register("name", {
              required: "入力必須です",
              minLength: { value: 2, message: "2文字以上で入力してください" },
            })}
          />
        </div>
        <p>{errors.name ? errors.name.message : null}</p>

        <div>
          <label>コメント *</label>
          <textarea
            name="comment"
            {...register("comment", {
              required: "入力必須です",
            })}
          ></textarea>
        </div>
        <p>{errors.comment ? errors.comment.message : null}</p>

        <div>
          <label>プロフィール画像:</label>
          {/* 画像が選択されたらonImageChange関数が実行される */}
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            required
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="プロフィール画像"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>

        <div>
          <label>
            テーマ1
            <input
              type="radio"
              value="1"
              {...register("themeId", { required: true })}
            />
          </label>
          <label>
            テーマ2
            <input
              type="radio"
              value="2"
              {...register("themeId", { required: true })}
            />
          </label>
          <label>
            テーマ3
            <input
              type="radio"
              value="3"
              {...register("themeId", { required: true })}
            />
          </label>
        </div>

        <div>
          <hr />
          <label>趣味 *</label>
          {fields &&
            fields.map((field, index) => (
              <div key={field.id}>
                <input
                  name={`hobbies[${index}].hobby`}
                  {...register(`hobbies[${index}].hobby`, {
                    required: "入力は必須です",
                  })}
                  defaultValue={field.hobby}
                />
                <button type="button" onClick={() => removeHobby(index)}>
                  削除
                </button>
                {errors.hobbies && errors.hobbies[index] && (
                  <p>{errors.hobbies[index]?.hobby?.message}</p>
                )}
              </div>
            ))}

          <button type="button" onClick={() => appendHobbies({ hobby: "" })}>
            ＋
          </button>
        </div>
        {/* その他1 */}
        <div>
          <hr />
          <label>{newOtherName}:</label>
          <input
            type="text"
            name="otherName"
            {...register("otherName")}
            placeholder="好きな項目名に変更"
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
        {/* その他2 */}
        <div>
          <hr />
          <label>{newOtherName2}:</label>
          <input
            type="text"
            name="otherName2"
            {...register("otherName2")}
            placeholder="好きな項目名に変更"
          />
          <button type="button" onClick={handleOtherNameChange2}>
            項目名変更
          </button>
          {fieldsOther2 &&
            fieldsOther2.map((field, index) => (
              <div key={field.id}>
                <input
                  name={`others2[${index}].name`}
                  {...register(`others2[${index}].name`)}
                  defaultValue={field.name}
                />
                <button type="button" onClick={() => removeOther2(index)}>
                  削除
                </button>
              </div>
            ))}
          <button type="button" onClick={() => appendOther2({ other2: "" })}>
            ＋
          </button>
        </div>

        {/* その他3 */}
        <div>
          <hr />
          <label>{newOtherName3}:</label>
          <input
            type="text"
            name="otherName3"
            {...register("otherName3")}
            placeholder="好きな項目名に変更"
          />
          <button type="button" onClick={handleOtherNameChange3}>
            項目名変更
          </button>
          {fieldsOther3 &&
            fieldsOther3.map((field, index) => (
              <div key={field.id}>
                <input
                  name={`others3[${index}].name`}
                  {...register(`others3[${index}].name`)}
                  defaultValue={field.name}
                />
                <button type="button" onClick={() => removeOther3(index)}>
                  削除
                </button>
              </div>
            ))}
          <button type="button" onClick={() => appendOther3({ other3: "" })}>
            ＋
          </button>
        </div>

        {/* フリー投稿 */}
        <div>
          <hr />
          <label>フリー入力欄:</label>
          <p>タイトル</p>
          <input type="text" name="title" {...register("title")} />
          <p>内容</p>
          <textarea name="description" {...register("description")}></textarea>
          <p>画像:</p>
          {/* 画像が選択されたらonImageChange関数が実行される */}
          <input type="file" accept="image/*" onChange={onFreeImageChange} />
          {/* 選択画像の表示 */}
          {freeImage && (
            <img
              src={URL.createObjectURL(freeImage)}
              alt="フリー投稿画像"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}
        </div>

        {/* SNSリンク */}
        <div>
          <hr />
          <p>Facebook URL:</p>
          <input
            type="url"
            name="facebook_link"
            {...register("facebook_link")}
            placeholder="https://facebook.com/yourname"
          />
          <p>X(Twitter) URL:</p>
          <input
            type="url"
            name="twitter_link"
            {...register("twitter_link")}
            placeholder="https://twitter.com/yourname"
          />
          <p>Instagram URL:</p>
          <input
            type="url"
            name="instagram_link"
            {...register("instagram_link")}
            placeholder="https://instagram.com/yourname"
          />
        </div>

        <div>
          <button type="submit">送信</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
