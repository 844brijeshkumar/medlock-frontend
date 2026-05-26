import { Eye, EyeClosed, CheckCircle, LayoutDashboard } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/ThemeProvider";
import { loginReceptionist } from "../../../api/auth";
import { useToast } from "../../../utils/ToastContext";

// Main Receptionist Login Component
export default function ReceptionistLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [eyePassword, setEyePassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const { refreshTheme, logo } = useTheme();
  const { showToast } = useToast();

  // Navigation State (Replaces useNavigate for Preview)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardName, setDashboardName] = useState("");

  // --- THEME CONFIGURATION ---
  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      receptionist_id: formData.get("receptionistId"),
      password: formData.get("password"),
    };

    try {
      const data = await loginReceptionist(credentials);

      if (data.status === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "receptionist");
        localStorage.setItem("dashboardName", data.name);
        setDashboardName(data.name);

        await refreshTheme();

        showToast({
          title: "Success",
          message: "Login successful! Redirecting...",
          type: "success",
        });

        // Simulate Navigation Delay
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 100);
        setTimeout(() => {
          navigate("/receptionist/dashboard");
        }, 500);
      } else {
        showToast({
          title: "Error",
          message: "Invalid Credentials",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: "Invalid Credentials",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- DASHBOARD VIEW (Shown after login in Preview) ---
  if (isLoggedIn) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
        style={{
          "--primary": theme.primary,
          "--secondary": theme.secondary,
          "--accent": theme.accent,
        }}
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto text-[var(--secondary)] mb-4">
            <LayoutDashboard size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {dashboardName}
          </h2>
          <p className="text-gray-500">You have successfully logged in.</p>
          <div className="p-4 bg-[var(--accent)]/30 text-[var(--primary)] text-sm rounded-lg font-medium border border-[var(--secondary)]/20">
            Redirecting to Dashboard Route...
            <br />
            <span className="text-xs opacity-75">
              (/receptionist/dashboard)
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-400 hover:text-gray-600 underline mt-4"
          >
            Log Out / Reset Preview
          </button>
        </div>
      </div>
    );
  }

  // --- LOGIN FORM VIEW ---
  return (
    <div
      className="bg-gradient-to-r from-primary via-primary/70 to-primary/50 min-h-screen flex flex-col justify-center items-center p-4 text-black font-sans"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      {/* --- LOGO SECTION --- */}
      <div className="flex justify-center mb-8">
        <img
          src={logo ? logo : "/medlock.png"}
          alt="App Logo"
          className="w-26 h-24"
        />
      </div>

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to the portal.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* Input field for Receptionist ID */}
          <div>
            <label
              htmlFor="receptionistId"
              className="block text-sm font-medium text-black mb-1"
            >
              Receptionist ID
            </label>
            <div className="relative">
              <input
                id="receptionistId"
                name="receptionistId"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="REC-001"
              />
            </div>
          </div>

          {/* Input field for Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={eyePassword ? "text" : "password"}
                required
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
              <div className="absolute right-3 top-2.5 z-10">
                {eyePassword ? (
                  <Eye
                    onClick={() => setEyePassword(!eyePassword)}
                    className="h-5 w-5 text-primary cursor-pointer hover:text-secondary transition-colors"
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setEyePassword(!eyePassword)}
                    className="h-5 w-5 text-primary cursor-pointer hover:text-secondary transition-colors"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-br from-primary to-primary/60 py-2 px-4 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:ring-offset-2 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
