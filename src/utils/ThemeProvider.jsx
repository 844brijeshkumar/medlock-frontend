import { useState, useEffect, createContext, useContext } from "react";
import FallBack from "../components/fallBack";
import { getTheme } from "../api/auth";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [logo, setLogo] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      const config = JSON.parse(saved);
      return config.logo || null; // Return the logo URL or null
    }
    return null;
  });
  const [themeConfig, setThemeConfig] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(!themeConfig);

  const applyThemeToCSSVars = (config) => {
    if (!config) return;
    const root = document.documentElement;
    root.style.setProperty("--color-primary", config.primaryColor);
    root.style.setProperty("--color-secondary", config.secondaryColor);
    root.style.setProperty("--color-hover", config.hoverColor);
  };

  // 1. ADD: Function to fetch theme manually (Call this in Login)
  const refreshTheme = async () => {
    const activeToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!activeToken || role == "patient") return;

    try {
      const result = await getTheme(activeToken);
      if (result.status && result.themeConfig) {
        setThemeConfig(result.themeConfig);
        setLogo(result?.themeConfig?.logo);
        localStorage.setItem("theme", JSON.stringify(result.themeConfig));
        applyThemeToCSSVars(result.themeConfig);
      }
    } catch (err) {
      console.error("Theme refresh failed:", err);
    }
  };

  const refreshThemeForPatient = async (result) => {
    if (!result) return;

    try {
      if (result) {
        setThemeConfig(result);
        setLogo(result?.logo);
        localStorage.setItem("theme", JSON.stringify(result));
        applyThemeToCSSVars(result);
      }
    } catch (err) {
      console.error("Theme refresh failed:", err);
    }
  };

  // 2. ADD: Function to clear theme (Call this in Logout)
  const resetTheme = () => {
    localStorage.removeItem("theme");
    setThemeConfig(null);
    const root = document.documentElement;
    // Remove the styles so it falls back to your :root CSS defaults
    ["--color-primary", "--color-secondary", "--color-hover"].forEach((prop) =>
      root.style.removeProperty(prop),
    );
  };

  useEffect(() => {
    if (themeConfig) {
      applyThemeToCSSVars(themeConfig);
    }

    const initialToken = localStorage.getItem("token");
    if (!initialToken) {
      setLoading(false);
      return;
    }

    // This handles the background sync if the user is already logged in
    async function initLoad() {
      await refreshTheme();
      setLoading(false);
    }
    initLoad();
  }, []);

  if (loading && !themeConfig) {
    return <FallBack />;
  }

  // 3. IMPORTANT: Pass the functions in the value object
  return (
    <ThemeContext.Provider
      value={{
        themeConfig,
        refreshTheme,
        resetTheme,
        logo,
        setLogo,
        refreshThemeForPatient,
      }}
    >
      <div className={themeConfig?.themeName || "default"}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export const useTheme = () => useContext(ThemeContext);
