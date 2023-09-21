import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer">
      <Link to="/">
        <FaHome size={24} />
      </Link>
      <Link to="/profile/list">
        <FaSearch size={24} />
      </Link>
      <Link to="/profile">
        <AiOutlineSetting size={24} />
      </Link>
    </div>
  );
};

export default Footer;
