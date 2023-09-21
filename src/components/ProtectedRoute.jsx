import { Navigate } from "react-router-dom";
import { getTokenFromCookie } from "../utils/cookies";

function ProtectedRoute({ children, redirectTo }) {
  const token = getTokenFromCookie();

  if (!token) {
    return <Navigate to={redirectTo} />;
  }

  return children;
}

export default ProtectedRoute;
