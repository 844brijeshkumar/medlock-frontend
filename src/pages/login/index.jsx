import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/ThemeProvider";
import { useToast } from "../../utils/ToastContext";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [eyePassword, setEyePassword] = useState(false);
  
  // Dynamic portal state
  const [portalConfig, setPortalConfig] = useState({
    name: "Medlock",
    role: "user",
    dashboardRoute: null,
  });

  const { refreshTheme, logo } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // The O(1) Speed dynamic prefix detector
  const detectPortalType = (id) => {
    // Check if ID exists, is long enough, and has a hyphen at the exact 3rd position
    if (!id || id.length < 3 || id[2] !== '-') {
      return { name: "Medlock", role: "user", dashboardRoute: null };
    }

    // Extract exactly the 2-character prefix (e.g., "DR")
    const prefix = id.substring(0, 2).toUpperCase();

    return {
      name: prefix,
      role: prefix,
      dashboardRoute: `/${prefix.toLowerCase()}/dashboard`, // e.g., /dr-/dashboard
    };
  };

  // Update UI dynamically as user types their ID
  const handleIdChange = (e) => {
    setPortalConfig(detectPortalType(e.target.value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prevent submission if the ID format is invalid
    if (!portalConfig.dashboardRoute) {
      showToast({
        title: "Error",
        message: "Invalid ID format",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      id: formData.get("userId"),
      password: formData.get("password"),
      role: portalConfig.role, // Send the prefix (e.g., "DR-") to Django so it knows which table to check
    };

  try {
    // Dynamic API URL
    const apiUrl = `http://127.0.0.1:8000/api/${portalConfig.role.toLowerCase()}/login/`;
    console.log("API URL =>", apiUrl);
    console.log("Credentials =>", credentials);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();

    // Check if Django returned a success (200 OK) and status is true
    if (response.ok && data.status === true) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", portalConfig.role);
      localStorage.setItem("dashboardName", data.name);
      e.target.reset();
      await refreshTheme();
      showToast({
        title: "Success",
        message: `Welcome to the ${portalConfig.name} Portal!`,
        type: "success",
      });

      // Navigate dynamically
      setTimeout(() => {
        navigate(portalConfig.dashboardRoute);
      }, 800);
    } else {
      showToast({
        title: "Error",
        message: data.message || "Invalid Credentials",
        type: "error",
      });
    }
  } catch (error) {
    console.log("FULL ERROR =>", error);
    showToast({
      title: "Error",
      message: "Server connection failed. Is the Django server running?",
      type: "error",
    });
  }
};

  return (
    <div className="bg-gradient-to-r from-primary via-primary/70 to-primary/50 min-h-screen flex flex-col justify-center items-center p-4 text-black transition-colors duration-500">
      
      {/* --- LOGO SECTION --- */}
      <div className="flex justify-center mb-6 ">
        <img
          src={logo ? logo : "/medlock.png"}
          alt="App Logo"
          className="w-26 h-24"
        />
      </div>

      <div className="w-full max-w-md p-8 m-4 space-y-8 bg-white rounded-xl shadow-2xl transition-all duration-300">
        <div className="text-center">
          {/* Title changes dynamically to "AD- Login" or "DR- Login" */}
          <h2 className="text-3xl font-bold tracking-tight text-primary transition-colors duration-300">
            {portalConfig.name === "Medlock" ? "Login" : `${portalConfig.name} Login`}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to the {portalConfig.name.toLowerCase()} portal.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-black transition-all"
            >
              {portalConfig.name === "Medlock" ? "User ID" : `${portalConfig.name} ID`}
            </label>
            <div className="mt-1 relative">
              <input
                id="userId"
                name="userId" 
                type="text"
                required
                onChange={handleIdChange}
                className="relative block w-full appearance-none rounded-md border border-primary px-3 py-2 text-gray-900 placeholder-secondary focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm uppercase"
                placeholder="e.g. DR-10045"
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
                `Login as ${portalConfig.name === "Medlock" ? "User" : portalConfig.name}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}