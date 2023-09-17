import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const ProfileEdit = () => {
  const [profileData, setProfileData] = useState(null);
  const token = Cookies.get("token") || null;

  const { register, handleSubmit, getValues, setValue, control } = useForm({});

  const {
    fields,
    append: appendHobbies,
    remove,
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

  const [image, setImage] = useState(null);
  const [freeImage, setFreeImage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setProfileData(response.data);
        setValue("name", response.data.user.name);
        setValue("birthday", response.data.user.birthday);
        setValue("comment", response.data.user.comment);
        setValue("title", response.data.freePosts[0].title);
        setValue("description", response.data.freePosts[0].description);
        setValue("otherName", response.data.otherData[0].newOtherName);
        setNewOtherName(response.data.otherData[0].newOtherName || "その他");

        console.log("Before removing:", fields, fieldsOther);
        fields.length && fields.forEach((_, index) => remove(index));
        fieldsOther.length &&
          fieldsOther.forEach((_, index) => removeOther(index));
        console.log("After removing:", fields, fieldsOther);

        console.log(image);

        // hobbiesデータのセット
        console.log("Before appending hobbies:", fields);
        if (response.data.hobbies && response.data.hobbies.length > 0) {
          for (const hobby of response.data.hobbies) {
            appendHobbies({ hobby: hobby.hobby });
          }
        }
        console.log("After appending hobbies:", fields);

        console.log("Before appending otherData:", fieldsOther);
        if (response.data.otherData && response.data.otherData.length > 0) {
          for (const other of response.data.otherData) {
            appendOther({ name: other.name });
          }
        }
        console.log("After appending otherData:", fieldsOther);
        console.log(response.data.otherData[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
  }, [setValue, token, appendHobbies, appendOther]);

  const onImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    // setImage("profile_image_path", response.data.image_url);

    // setImage(file);
  };

  const onFreeImageChange = (event) => {
    const file = event.target.files[0];
    setFreeImage(file);
  };

  //   const [newOtherName, setNewOtherName] = useState("その他");
  const [newOtherName, setNewOtherName] = useState(
    profileData?.otherData[0]?.newOtherName || "その他"
  );

  const handleOtherNameChange = () => {
    const updatedOtherName = getValues("otherName");
    setNewOtherName(updatedOtherName);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
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

    console.log([...formData.entries()]);

    try {
      await axios.post("http://localhost/api/profile/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT", // PUTに置き換える記述を書く
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
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
          <label htmlFor="image">プロフィール画像</label>
          <input type="file" accept="image/*" onChange={onImageChange} />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="プロフィール画像"
              style={{ width: "200px", height: "200px" }}
            />
          ) : (
            profileData && (
              <img
                src={`http://localhost/${profileData.user.profile_image_path}`}
                alt="プロフィール画像"
                style={{ width: "200px", height: "200px" }}
              />
            )
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
                <button type="button" onClick={() => remove(index)}>
                  削除
                </button>{" "}
                {/* 削除ボタンを追加 */}
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
              </div>
            ))}
          <button type="button" onClick={() => appendOther({ name: "" })}>
            {/* <button type="button" onClick={() => appendOther({ other: "" })}> */}
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
          <p>フリー投稿画像:</p>
          <div>
            <label htmlFor="image">フリー画像</label>
            <input type="file" accept="image/*" onChange={onFreeImageChange} />
            {freeImage ? (
              <img
                src={URL.createObjectURL(freeImage)}
                alt="プロフィール画像"
                style={{ width: "200px", height: "200px" }}
              />
            ) : (
              profileData && (
                <img
                  src={`http://localhost/${profileData.freePosts[0].image_path}`}
                  alt="プロフィール画像"
                  style={{ width: "200px", height: "200px" }}
                />
              )
            )}
          </div>
        </div>

        <div>
          <button type="submit">送信</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
