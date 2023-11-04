import DeleteProfileButton from "../../components/DeleteProfileButton/DeleteProfileButton";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import styles from "./Setting.module.scss";

const Setting = () => {
  return (
    <div className={styles["setting-container"]}>
      <LogoutButton className={styles["setting-container__logout-button"]} />
      <DeleteProfileButton className={styles.button} />
    </div>
  );
};

export default Setting;
