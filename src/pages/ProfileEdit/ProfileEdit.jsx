import axios from "axios";
import Cookies from "js-cookie";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";

const ProfileEdit = () => {
  const [profileData, setProfileData] = useState(null);

  const { register, handleSubmit, getValues, setValue, errors, control } =
    useForm({});

  const {
    fields,
    append: appendHobbies,
    remove: removeHobbies,
  } = useFieldArray({
    control,
    name: "hobbies",
  });
  const {
    fields: fieldsOther,
    append: appendOther,
    remove: removeOthers,
  } = useFieldArray({
    control,
    name: "others",
  });

  // profile画像
  const [image, setImage] = useState(null);
  // フリー投稿画像
  const [freeImage, setFreeImage] = useState(null);

  const [profileImageURL, setProfileImageURL] = useState("");

  const onImageChange = (event) => {
    // eventで選択された画像ファイルをfile格納
    const file = event.target.files[0];
    if (file) {
      // 画像を表示するためにURLを生成して設定
      const imageURL = URL.createObjectURL(file);
      setProfileImageURL(imageURL);
    }
    console.log(file);
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
  const [token, setToken] = useState(Cookies.get("token") || null);

  // その他の項目名変更ボタンがクリックされたときのハンドラ
  const handleOtherNameChange = () => {
    // フォームの新しい項目名を取得
    const updatedOtherName = getValues("otherName"); // getValues を使用して値を取得
    console.log(updatedOtherName);
    setNewOtherName(updatedOtherName);
  };

  const initializeDynamicFields = (data) => {
    // 例: 趣味のデータが `hobbies` というキーで渡されると仮定
    if (data.hobbies && Array.isArray(data.hobbies)) {
      for (let hobby of data.hobbies) {
        appendHobbies(hobby);
      }
    }

    // その他の情報の初期化も同様に行う...
    if (data.otherData && Array.isArray(data.otherData)) {
      console.log("Others data:", data.otherData);

      for (let other of data.otherData) {
        appendOther({ name: other.name }); // appendOther を使用して「その他」のデータを動的に追加
      }
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    // appendを使ってobject形式で、formDataに入れていく
    // ()の中のキー (birthday)はテーブルのカラム名と一致させる
    // バリューのdataはhook-formのregisterで登録した入力値が入っている
    formData.append("name", data.name);
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

    try {
      const response = await axios.put(
        "http://localhost/api/profile/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //   const receivedToken = response.data.token;
      //   setToken(receivedToken);
      //   Cookies.set("token", receivedToken, { expires: 7 });
    } catch (error) {
      console.log(error);
    }
  };
  // 最初にプロフィールデータを取得する
  //
  // 最初にプロフィールデータを取得する
  useEffect(() => {
    const token = Cookies.get("token");
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ここで初めてデータをクリアする
        removeHobbies();
        removeOthers();

        // その後すぐに新しいデータでフィールドを初期化
        setProfileData(response.data);
        setValue("name", response.data.user.name);
        setValue("birthday", response.data.user.birthday);
        setValue("comment", response.data.user.comment);
        setValue("profileImage", response.data.user.profile_image_path);
        setValue("title", response.data.freePosts[0].title);
        setValue("description", response.data.freePosts[0].description);
        setProfileImageURL(response.data.user.profile_image_path);

        if (response.data.otherData[0].newOtherName) {
          setNewOtherName(response.data.otherData[0].newOtherName);
        }

        initializeDynamicFields(response.data);

        console.log(response.data);
      } catch (error) {
        console.log("データの取得に失敗");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>ProfileForm</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>ニックネーム:</label>
          <input type="text" name="name" {...register("name")} />
        </div>
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
          {image || (
            <img
              // ファイルアップロードした画像から表示用のローカルURLを作成する
              src={profileImageURL}
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
                {/* <input
                  name={`others[${index}].name`}
                  {...register(`others[${index}].name`)}
                  defaultValue={field.name}
                /> */}
                <input
                  name={`others[${index}].name`}
                  {...register(`others[${index}].name`)}
                  defaultValue={field.name}
                />
              </div>
            ))}
          {/* <button type="button" onClick={() => appendOther({ name: "" })}> */}
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
    </>
  );
};

export default ProfileEdit;
