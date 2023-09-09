import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import Register from "./pages/Register/Register";
import Cookies from "js-cookie";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

function App() {
  const token = Cookies.get("token");

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          path="/register"
          element={token ? <Navigate to="/logout" /> : <Register />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
