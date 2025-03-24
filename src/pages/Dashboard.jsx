import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "../redux/authSlice";
import TaskInput from "../components/ui/TaskInput";
import TaskList from "../components/ui/TaskList";
import { LogOut } from "lucide-react";
import LogoutButton from "./Logout";
import Navbar from "./Navbar";

export default function Dashboard() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  //   const handleLogout = () => {
  //     dispatch(logout());
  //   };

  //   if (!isAuthenticated) {
  //     return null;
  //   }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <TaskInput />
          <TaskList />
        </div>
      </main>
    </div>
  );
}
