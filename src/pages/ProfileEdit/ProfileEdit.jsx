import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getTokenFromCookie } from "../../utils/cookies";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const token = getTokenFromCookie();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({});

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

  const [image, setImage] = useState(null);
  const [freeImage, setFreeImage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile/me`, {
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
        setValue("otherName2", response.data.otherData2[0].newOtherName2);
        setValue("otherName3", response.data.otherData3[0].newOtherName3);
        if (response.data.socialLinks && response.data.socialLinks[0]) {
          setValue("facebook_link", response.data.socialLinks[0].url);
        }
        if (response.data.socialLinks && response.data.socialLinks[1]) {
          setValue("twitter_link", response.data.socialLinks[1].url);
        }
        if (response.data.socialLinks && response.data.socialLinks[2]) {
          setValue("instagram_link", response.data.socialLinks[2].url);
        }
        setNewOtherName(response.data.otherData[0].newOtherName || "その他");
        setNewOtherName2(response.data.otherData2[0].newOtherName2 || "その他");
        setNewOtherName3(response.data.otherData3[0].newOtherName3 || "その他");
        console.log(response.data.otherData[0].newOtherName);

        fields.length && fields.forEach((_, index) => remove(index));
        fieldsOther.length &&
          fieldsOther.forEach((_, index) => removeOther(index));

        fieldsOther2.length &&
          fieldsOther2.forEach((_, index) => removeOther2(index));

        fieldsOther3.length &&
          fieldsOther3.forEach((_, index) => removeOther3(index));

        // hobbiesデータのセット
        if (response.data.hobbies && response.data.hobbies.length > 0) {
          for (const hobby of response.data.hobbies) {
            appendHobbies({ hobby: hobby.hobby });
          }
        }
        console.log("response.data.otherData", response.data.otherData);

        // other1データのセット
        if (response.data.otherData && response.data.otherData.length > 0) {
          for (const other of response.data.otherData) {
            appendOther({ name: other.name });
          }
        }

        // other2データのセット
        if (response.data.otherData2 && response.data.otherData2.length > 0) {
          for (const other2 of response.data.otherData2) {
            appendOther2({ name: other2.name });
          }
        }

        // other3データのセット
        if (response.data.otherData3 && response.data.otherData3.length > 0) {
          for (const other3 of response.data.otherData3) {
            appendOther3({ name: other3.name });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
  }, [setValue, token, appendHobbies, appendOther, appendOther2, appendOther3]);

  const onImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const onFreeImageChange = (event) => {
    const file = event.target.files[0];
    setFreeImage(file);
  };

  const [newOtherName, setNewOtherName] = useState(
    profileData?.otherData[0]?.newOtherName || "その他"
  );
  console.log(profileData?.otherData[0]?.newOtherName);
  const [newOtherName2, setNewOtherName2] = useState(
    profileData?.otherData2[0]?.newOtherName2 || "その他"
  );
  const [newOtherName3, setNewOtherName3] = useState(
    profileData?.otherData3[0]?.newOtherName3 || "その他"
  );

  const handleOtherNameChange = () => {
    const updatedOtherName = getValues("otherName");
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
    formData.append("name", data.name);
    // formData.append("birthday", data.birthday);
    formData.append("comment", data.comment);
    data.hobbies.forEach((hobbyObj, index) => {
      formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby);
    });
    // data.others.forEach((otherObj, index) => {
    //   formData.append(`others[${index}][name]`, otherObj.name);
    // });
    data.others.forEach((otherObj, index) => {
      formData.append(`others[${index}][id]`, otherObj.id); // もし otherObj が id を持つ場合
      formData.append(`others[${index}][name]`, otherObj.name);
    });

    data.others2.forEach((otherObj2, index) => {
      formData.append(`others2[${index}][name]`, otherObj2.name);
    });
    data.others3.forEach((otherObj3, index) => {
      formData.append(`others3[${index}][name]`, otherObj3.name);
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
      await axios.post(`${API_BASE_URL}/api/profile/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT", // PUTに置き換える記述を書く
        },
      });
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
          <label>ニックネーム:</label>
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
                src={`${BASE_URL}/${profileData.user.profile_image_path}`}
                // src={`http://localhost/${profileData.user.profile_image_path}`}

                alt="プロフィール画像"
                style={{ width: "200px", height: "200px" }}
              />
            )
          )}
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
                <button type="button" onClick={() => remove(index)}>
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
          {/* あとでもとにもどす */}
          {/* {fieldsOther &&
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

          <button type="button" onClick={() => appendOther({ name: "" })}>
            ＋
          </button> */}
          {fieldsOther &&
            fieldsOther.map((field, index) => (
              <div key={field.id}>
                <input
                  type="hidden"
                  name={`others[${index}].id`} // IDを含める
                  {...register(`others[${index}].id`)}
                  defaultValue={field.id} // field.idはユニークなIDが格納されていると仮定
                />
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

          <button type="button" onClick={() => appendOther({ name: "" })}>
            ＋
          </button>
        </div>

        <div>
          <hr />
          <label>{newOtherName2}:</label>
          <input
            type="text"
            name="otherName2"
            {...register("otherName2")}
            placeholder="好きな項目を追加"
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
          <button type="button" onClick={() => appendOther2({ name: "" })}>
            ＋
          </button>
        </div>

        <div>
          <hr />
          <label>{newOtherName3}:</label>
          <input
            type="text"
            name="otherName3"
            {...register("otherName3")}
            placeholder="好きな項目を追加"
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
          <button type="button" onClick={() => appendOther3({ name: "" })}>
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
          <button type="submit">更新する</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
