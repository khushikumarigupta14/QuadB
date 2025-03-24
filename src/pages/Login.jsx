import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login, clearError } from "../redux/authSlice";
import { Loader2, Sun, Moon } from "lucide-react";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated)
      navigate(location.state?.from || "/", { replace: true });
  }, [isAuthenticated, navigate, location.state]);

  // Clear errors when unmounting
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  // Handle theme change

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      dispatch(clearError());
      return;
    }
    await dispatch(login(credentials));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-all duration-300 relative">
        {/* Glassmorphism effect in dark mode */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-lg"></div>

        <div className="relative z-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />

              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 transition-all"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
            <p>Demo credentials:</p>
            <p className="font-mono">username: demo</p>
            <p className="font-mono">password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
