import { Navigate } from "react-router-dom";
import { getTokenFromCookie } from "../utils/cookies";

// pathとelementを引数に受け取る
const PrivateRoute = ({ children }) => {
  const token = getTokenFromCookie();

  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;