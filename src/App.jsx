import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import Register from "./pages/Register/Register";
import Cookies from "js-cookie";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProfileForm from "./pages/ProfileForm/ProfileForm";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import ProfileList from "./pages/ProfileList/ProfileList";
import Footer from "./components/Footer/Footer";
import Modal from "react-modal";

Modal.setAppElement("#root");

function App() {
  const token = Cookies.get("token");

  return (
    <div className="container">
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          path="/register"
          element={token ? <Navigate to="/logout" /> : <Register />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile/setup" element={<ProfileForm />} />
        <Route path="/" element={<ProfilePage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/profile/list" element={<ProfileList />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/profile/:user_id/preview" element={<UserProfilePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
