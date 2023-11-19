import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getTokenFromCookie } from "../../utils/cookies";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileEdit.module.scss";
import { CgAddR } from "react-icons/cg";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Modal } from "antd";
import colorThemes from "../../utils/themeColors";

const ProfileEdit = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
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
  // const colorThemes = [
  //   ["#feeedc", "#bde1da", "#f5b5a7"],
  //   ["#dbd2e8", "#dfe8f0", "#fff6a4"],
  //   ["#ded3d6", "#c0e4f2", "#fffcd7"],
  //   ["#555168", "#f5d7d6", "#e06b7b"],
  //   ["#32405f", "#bdc6ca", "#889291"],
  //   ["#dbaba7", "#789485", "#f0d6d4"],
  //   ["#e7e5e3", "#b7ccdd", "#526d98"],
  // ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // response.data.hogehogeがnull またはundefinedなら空文字をセットする (nullが入る対策)
        setProfileData(response.data);
        console.log(response.data);
        setValue("name", response.data.user.name || "");
        // setValue("birthday", response.data.user.birthday);
        setValue("comment", response.data.user.comment || "");
        setValue("themeId", response.data.user.theme_colors.id.toString());
        setValue("title", response.data.freePosts[0].title || "");
        setValue("description", response.data.freePosts[0].description || "");
        setValue("otherName", response.data.otherData[0].newOtherName || "");
        setValue("otherName2", response.data.otherData2[0].newOtherName2 || "");
        setValue("otherName3", response.data.otherData3[0].newOtherName3 || "");
        if (response.data.socialLinks && response.data.socialLinks[0]) {
          setValue("facebook_link", response.data.socialLinks[0].url);
        }

        // setValue("facebook_link", response.data.socialLinks[0]?.url || "");
        if (response.data.socialLinks && response.data.socialLinks[1]) {
          setValue("twitter_link", response.data.socialLinks[1].url);
        }
        if (response.data.socialLinks && response.data.socialLinks[2]) {
          setValue("instagram_link", response.data.socialLinks[2].url);
        }
        setNewOtherName(response.data.otherData[0].newOtherName || "その他");
        setNewOtherName2(response.data.otherData2[0].newOtherName2 || "その他");
        setNewOtherName3(response.data.otherData3[0].newOtherName3 || "その他");

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
  const [newOtherName2, setNewOtherName2] = useState(
    profileData?.otherData2[0]?.newOtherName2 || "その他"
  );
  const [newOtherName3, setNewOtherName3] = useState(
    profileData?.otherData3[0]?.newOtherName3 || "その他"
  );

  const handleOtherNameChange = () => {
    const updatedOtherName = getValues("otherName");
    setNewOtherName(updatedOtherName);
    setIsModalVisible(false);
  };
  const handleOtherNameChange2 = () => {
    const updatedOtherName = getValues("otherName2");
    setNewOtherName2(updatedOtherName);
    setIsModalVisible2(false);
  };
  const handleOtherNameChange3 = () => {
    const updatedOtherName = getValues("otherName3");
    setNewOtherName3(updatedOtherName);
    setIsModalVisible3(false);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("comment", data.comment);
    formData.append("themeId", data.themeId);

    // data.hobbies.forEach((hobbyObj, index) => {
    //   formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby);
    // });
    // data.others.forEach((otherObj, index) => {
    //   formData.append(`others[${index}][id]`, otherObj.id); // もし otherObj が id を持つ場合
    //   formData.append(`others[${index}][name]`, otherObj.name);
    // });
    // data.others2.forEach((otherObj2, index) => {
    //   formData.append(`others2[${index}][name]`, otherObj2.name);
    // });
    // data.others3.forEach((otherObj3, index) => {
    //   formData.append(`others3[${index}][name]`, otherObj3.name);
    // });
    data.hobbies.forEach((hobbyObj, index) => {
      formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby || "");
    });

    data.others.forEach((otherObj, index) => {
      formData.append(`others[${index}][id]`, otherObj.id || "");
      formData.append(`others[${index}][name]`, otherObj.name || "");
    });

    data.others2.forEach((otherObj2, index) => {
      formData.append(`others2[${index}][name]`, otherObj2.name || "");
    });

    data.others3.forEach((otherObj3, index) => {
      formData.append(`others3[${index}][name]`, otherObj3.name || "");
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["form__content"]}>
          <div className={styles["form__group"]}>
            <div className={styles["form__image-wrapper"]}>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="プロフィール画像"
                  className={styles["form__image"]}
                  style={{ width: "100px", height: "100px" }}
                />
              ) : (
                profileData && (
                  <img
                    src={`${API_BASE_URL}/${profileData.user.profile_image_path}`}
                    alt="プロフィール画像"
                    className={styles["form__image"]}
                    style={{ width: "100px", height: "100px" }}
                  />
                )
              )}
              <div className={styles["form__file-wrapper"]}>
                <input
                  // id="fileInput"
                  id="profileFileInput"
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className={styles["form__file-input"]}
                />
                <label
                  htmlFor="profileFileInput"
                  // htmlFor="fileInput"
                  className={styles["form__custom-file-label"]}
                >
                  プロフィール画像を選択
                </label>
              </div>
            </div>
          </div>

          <div className={styles["form__group"]}>
            <label className={styles["form__label"]}>ニックネーム *</label>
            <input
              type="text"
              name="name"
              {...register("name", {
                required: "入力必須です",
                minLength: { value: 2, message: "2文字以上で入力してください" },
              })}
              className={styles["form__input"]}
            />
          </div>
          {/* </div> */}
          <p>{errors.name ? errors.name.message : null}</p>

          <div className={styles["form__group"]}>
            <label className={styles["form__label"]}>コメント *</label>
            <textarea
              name="comment"
              {...register("comment", {
                required: "入力必須です",
              })}
              className={styles["form__textarea"]}
            ></textarea>
            <p>{errors.comment ? errors.comment.message : null}</p>
          </div>

          <div className={styles["form__group"]}>
            <legend className={styles["form__legend"]}>
              テーマカラー選択 *
            </legend>
            <div className={styles["form__label-wrapper"]}>
              {colorThemes.map((theme, index) => (
                <label
                  key={index}
                  className={`${styles["form__label"]} ${styles["form__label-color-wrapper"]}`}
                >
                  {`テーマ${index + 1}`}
                  <input
                    type="radio"
                    value={index + 1}
                    {...register("themeId", { required: true })}
                    className={styles["form__radio"]}
                  />
                  <div className={styles["color-combination"]}>
                    {theme.map((colorCode, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: colorCode,
                          width: "4rem",
                          height: "4rem",
                        }}
                      ></div>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles["form__group"]}>
            <label className={styles["form__label"]}>趣味 *</label>
            {fields &&
              fields.map((field, index) => (
                <div key={field.id} className={styles["form__hobby"]}>
                  <input
                    name={`hobbies[${index}].hobby`}
                    {...register(`hobbies[${index}].hobby`, {
                      required: "入力は必須です",
                    })}
                    defaultValue={field.hobby}
                    className={`${styles["form__input"]} ${styles["form__input-hobby"]}`}
                  />
                  <AiOutlineDelete
                    size={24}
                    type="button"
                    onClick={() => remove(index)}
                    className={styles["form__button-remove"]}
                  />
                  {errors.hobbies && errors.hobbies[index] && (
                    <p className={styles["form__error"]}>
                      {errors.hobbies[index]?.hobby?.message}
                    </p>
                  )}
                </div>
              ))}

            <CgAddR
              size={24}
              type="button"
              onClick={() => appendHobbies({ hobby: "" })}
              className={styles["form__button-append"]}
            />
          </div>

          <div
            className={`${styles["form__group"]} ${styles["form__flex-container"]}`}
          >
            <div className={styles["form__label-icon-wrapper"]}>
              <label
                className={`${styles["form__label"]} ${styles["form__label-other"]}`}
              >
                {newOtherName}:
              </label>
              <AiOutlineEdit
                size={30}
                type="button"
                onClick={() => setIsModalVisible(true)}
                className={styles["form__button-change"]}
              />
            </div>
            <Modal
              title="項目名を変更"
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={handleOtherNameChange}
            >
              <input
                type="text"
                name="otherName"
                {...register("otherName")}
                placeholder="好きな項目を追加"
                className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
              />
            </Modal>

            {fieldsOther &&
              fieldsOther.map((field, index) => (
                <div key={field.id} className={styles["form__other"]}>
                  <input
                    type="hidden"
                    name={`others[${index}].id`}
                    {...register(`others[${index}].id`)}
                    defaultValue={field.id}
                  />
                  <input
                    name={`others[${index}].name`}
                    {...register(`others[${index}].name`)}
                    defaultValue={field.name}
                    className={`${styles["form__input"]} ${styles["form__input-other"]}`}
                  />
                  <AiOutlineDelete
                    size={24}
                    type="button"
                    onClick={() => removeOther(index)}
                    className={styles["form__button-remove"]}
                  />
                </div>
              ))}

            <CgAddR
              size={24}
              type="button"
              onClick={() => appendOther({ name: "" })}
              className={styles["form__button-append"]}
            />
          </div>

          <div className={styles["form__group"]}>
            <div className={styles["form__label-icon-wrapper"]}>
              <label
                className={`${styles["form__label"]} ${styles["form__label-other"]}`}
              >
                {newOtherName2}:
              </label>
              <AiOutlineEdit
                size={30}
                type="button"
                onClick={() => setIsModalVisible2(true)}
                className={styles["form__button-change"]}
              />
            </div>
            <Modal
              title="項目名を変更"
              open={isModalVisible2}
              onCancel={() => setIsModalVisible2(false)}
              onOk={handleOtherNameChange2}
            >
              <input
                type="text"
                name="otherName2"
                {...register("otherName2")}
                placeholder="「その他」を好きな項目名に変更"
                className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
              />
            </Modal>

            {fieldsOther2 &&
              fieldsOther2.map((field, index) => (
                <div key={field.id} className={styles["form__item"]}>
                  <input
                    name={`others2[${index}].name`}
                    {...register(`others2[${index}].name`)}
                    defaultValue={field.name}
                    className={`${styles["form__input"]} ${styles["form__input-other"]}`}
                  />
                  <AiOutlineDelete
                    size={24}
                    type="button"
                    onClick={() => removeOther2(index)}
                    className={styles["form__button-remove"]}
                  />
                </div>
              ))}

            <CgAddR
              size={24}
              type="button"
              onClick={() => appendOther2({ name: "" })}
              className={styles["form__button-append"]}
            />
          </div>

          <div className={styles["form__group"]}>
            <div className={styles["form__label-icon-wrapper"]}>
              <label
                className={`${styles["form__label"]} ${styles["form__label-other"]}`}
              >
                {newOtherName3}:
              </label>
              <AiOutlineEdit
                size={30}
                type="button"
                onClick={() => setIsModalVisible3(true)}
                className={styles["form__button-change"]}
              />
            </div>
            <Modal
              title="項目名を変更"
              open={isModalVisible3}
              onCancel={() => setIsModalVisible3(false)}
              onOk={handleOtherNameChange3}
            >
              <input
                type="text"
                name="otherName3"
                {...register("otherName3")}
                placeholder="「その他」を好きな項目名に変更"
                className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
              />
            </Modal>

            {fieldsOther3 &&
              fieldsOther3.map((field, index) => (
                <div key={field.id} className={styles["form__item"]}>
                  <input
                    name={`others3[${index}].name`}
                    {...register(`others3[${index}].name`)}
                    defaultValue={field.name}
                    className={`${styles["form__input"]} ${styles["form__input-other"]}`}
                  />
                  <AiOutlineDelete
                    size={24}
                    type="button"
                    onClick={() => removeOther3(index)}
                    className={styles["form__button-remove"]}
                  />
                </div>
              ))}

            <CgAddR
              size={24}
              type="button"
              onClick={() => appendOther3({ name: "" })}
              className={styles["form__button-append"]}
            />
          </div>

          {/* フリー投稿 */}
          <div className={styles["form__group"]}>
            <label className={styles["form__label"]}>フリー投稿:</label>

            {/* <p className={styles["form__label-comment"]}>タイトル</p> */}
            <div className={styles["form__image-wrapper"]}>
              {/* <p className={styles["form__label-comment"]}>フリー投稿画像:</p> */}

              {freeImage ? (
                <img
                  src={URL.createObjectURL(freeImage)}
                  alt="フリー投稿画像"
                  className={styles["form__free-image"]}
                  style={{ width: "320px", height: "180px" }}
                />
              ) : (
                profileData &&
                profileData.freePosts[0].image_path && (
                  <img
                    src={`${API_BASE_URL}/${profileData.freePosts[0].image_path}`}
                    alt="フリー投稿画像"
                    className={styles["form__free-image"]}
                    style={{ width: "320px", height: "180px" }}
                  />
                )
              )}
              <div className={styles["form__file-wrapper"]}>
                <input
                  id="freeFileInput"
                  type="file"
                  accept="image/*"
                  onChange={onFreeImageChange}
                  className={styles["form__file-input"]}
                />
                <label
                  htmlFor="freeFileInput"
                  className={styles["form__custom-file-label"]}
                >
                  投稿画像を選択
                </label>
              </div>
            </div>

            <p className={styles["form__sublabel"]}>タイトル</p>
            <input
              type="text"
              name="title"
              {...register("title")}
              className={styles["form__input"]}
            />

            <p className={styles["form__sublabel"]}>内容</p>
            <textarea
              name="description"
              {...register("description")}
              className={styles["form__textarea"]}
            ></textarea>
          </div>

          {/* SNSリンク */}
          <div className={styles["form__group"]}>
            <p className={styles["form__sublabel"]}>Facebook URL:</p>
            <input
              type="text"
              name="facebook_link"
              {...register("facebook_link")}
              placeholder="https://facebook.com/yourname"
              className={styles["form__input"]}
            />

            <p className={styles["form__sublabel"]}>X(Twitter) URL:</p>
            <input
              type="text"
              name="twitter_link"
              {...register("twitter_link")}
              placeholder="https://twitter.com/yourname"
              className={styles["form__input"]}
            />

            <p className={styles["form__sublabel"]}>Instagram URL:</p>
            <input
              type="text"
              name="instagram_link"
              {...register("instagram_link")}
              placeholder="https://instagram.com/yourname"
              className={styles["form__input"]}
            />
          </div>
        </div>

        <div className={styles["button-container"]}>
          {/* <button type="submit">更新する</button> */}
          <button type="submit" className={styles["button--submit"]}>
            更新する
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
