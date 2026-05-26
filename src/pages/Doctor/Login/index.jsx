import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { loginDoctor } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/ThemeProvider";
import { useToast } from "../../../utils/ToastContext";

// Main App component
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [eyePassword, setEyePassword] = useState(false);
  const navigate = useNavigate();
  const { refreshTheme, logo } = useTheme();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      doctor_id: formData.get("doctorId"),
      password: formData.get("password"),
    };

    try {
      const data = await loginDoctor(credentials);
      if (data.status === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "doctor");
        localStorage.setItem("dashboardName", data.name);

        showToast({
          title: "Success",
          message: "Login successful!",
          type: "success",
        });

        e.target.reset();
        await refreshTheme();

        setTimeout(() => {
          navigate("/doctor/dashboard");
        }, 800);
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

  // Render the login form or a success message based on login state
  return (
    <div className="bg-gradient-to-r from-primary via-primary/70 to-primary/50 min-h-screen flex flex-col justify-center items-center p-4 text-black">
      {/* --- LOGO MOVED HERE --- */}
      <div className="flex justify-center mb-6 ">
        <img
          src={logo ? logo : "/medlock.png"}
          alt="App Logo"
          className="w-26 h-24"
        />
      </div>
      {/* --- END OF LOGO SECTION --- */}

      <div className="w-full max-w-md p-8 m-4 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to the portal.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="doctorId"
              className="block text-sm font-medium text-black"
            >
              Doctor ID
            </label>
            <div className="mt-1 relative">
              <input
                id="doctorId"
                name="doctorId"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="Enter your Id"
              />
            </div>
          </div>

          {/* Input field for Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={eyePassword ? "text" : "password"}
                required
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="Enter your password"
              />
              <div className="absolute right-3 top-3 z-10">
                {eyePassword ? (
                  <Eye
                    onClick={() => setEyePassword(!eyePassword)}
                    className=" h-5 w-5 text-primary cursor-pointer"
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setEyePassword(!eyePassword)}
                    className=" h-5 w-5 text-primary cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit button with loading indicator */}
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
