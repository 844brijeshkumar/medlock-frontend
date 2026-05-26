import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { loginHospital } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/ThemeProvider";
import { useToast } from "../../../utils/ToastContext";

export default function Login() {
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [eyePassword, setEyePassword] = useState(false);
  const navigate = useNavigate();
  const { refreshTheme, logo } = useTheme();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    const formData = new FormData(e.target);

    const credentials = {
      npi_id: formData.get("login-npi-id"),
      password: formData.get("login-password"),
    };

    try {
      const data = await loginHospital(credentials);

      if (data.status === true) {
        // Save JWT token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("dashboardName", data.name);
        localStorage.setItem("role", "hospital");

        showToast({
          title: "Success",
          message: "Login successful!",
          type: "success",
        });
        e.target.reset();
        await refreshTheme();
        // Redirect to dashboard
        setTimeout(() => {
          navigate("/hospital/dashboard");
        }, 1000);
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
      setLoadingLogin(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary via-primary/70 to-primary/50 min-h-screen flex flex-col justify-center items-center p-4 text-black">
      {/* App Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={logo ? logo : "/medlock.png"}
          alt="App Logo"
          className="w-26 h-24"
        />
      </div>

      <div className="w-full max-w-md p-8 m-4 space-y-8 bg-white rounded-xl shadow-2xl">
        {/* Login Form Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to the portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="login-npi-id"
              className="block text-sm font-medium text-black"
            >
              NPI ID
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="login-npi-id"
                name="login-npi-id"
                placeholder="Enter your NPI ID"
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-black"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={eyePassword ? "text" : "password"}
                id="login-password"
                name="login-password"
                placeholder="Enter your password"
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                required
              />
              <div className="absolute right-3 top-3 z-10">
                {eyePassword ? (
                  <Eye
                    onClick={() => setEyePassword(!eyePassword)}
                    className="h-5 w-5 text-primary cursor-pointer"
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setEyePassword(!eyePassword)}
                    className="h-5 w-5 text-primary cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loadingLogin}
              className={`group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-br from-primary to-primary/60 py-2 px-4 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:ring-offset-2 ${
                loadingLogin ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loadingLogin ? (
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
