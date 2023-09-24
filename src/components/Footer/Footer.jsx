import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";
import { FaPeopleGroup } from "react-icons/fa6";

import styles from "./Footer.module.scss";

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;
  console.log(path)

  // 登録・ログイン画面ではフッターを表示させない
  if (path === "/login" || path === "/register" || path === "/profile/setup") {
    return null;
  }

  return (
    <div className={styles["footer"]}>
      <Link to="/" className={styles["footer__link"]}>
        <FaHome size={24} className={styles["link__icon"]} />
        <p className={styles["link__icon-name"]}>ホーム</p>
      </Link>
      <Link to="/profile/list" className={styles["footer__link"]}>
        <FaPeopleGroup size={24} className={styles["link__icon"]} />
        <p className={styles["link__icon-name"]}>フォローリスト</p>
      </Link>
      <Link to="/setting" className={styles["footer__link"]}>
        <AiOutlineSetting size={24} className={styles["link__icon"]} />
        <p className={styles["link__icon-name"]}>設定</p>
      </Link>
    </div>
  );
};

export default Footer;
