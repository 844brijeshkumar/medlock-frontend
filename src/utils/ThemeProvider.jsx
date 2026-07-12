import { useState, useEffect, createContext, useContext } from "react";
import FallBack from "../components/fallBack";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // 1. Initialize synchronously from LocalStorage to prevent UI glitches
  const [themeConfig, setThemeConfig] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : null;
  });

  const [logo, setLogo] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      const config = JSON.parse(saved);
      return config.logo || null;
    }
    return null;
  });

  // Since we no longer fetch on mount, we don't need a loading state
  const [loading, setLoading] = useState(false);

  // 2. Centralized CSS Injection
  const applyThemeToCSSVars = (config) => {
    if (!config) return;
    const root = document.documentElement;
    
    // We check for both your old keys and new Django keys to be safe
    root.style.setProperty("--color-primary", config.primaryColor || config.primary);
    root.style.setProperty("--color-secondary", config.secondaryColor || config.secondary);
    root.style.setProperty("--color-hover", config.hoverColor || config.secondary); 
  };

  // 3. THIS IS CALLED FROM LOGIN.JSX
  // It receives the theme data directly from the Django login response
  const refreshTheme = (newThemeConfig) => {
    if (!newThemeConfig) return;

    setThemeConfig(newThemeConfig);
    setLogo(newThemeConfig.logo || null);
    localStorage.setItem("theme", JSON.stringify(newThemeConfig));
    applyThemeToCSSVars(newThemeConfig);
  };

  // Kept for backward compatibility with your patient flow
  const refreshThemeForPatient = (result) => {
    refreshTheme(result);
  };

  // 4. Called from Logout
  const resetTheme = () => {
    localStorage.removeItem("theme");
    setThemeConfig(null);
    setLogo(null);
    
    const root = document.documentElement;
    ["--color-primary", "--color-secondary", "--color-hover"].forEach((prop) =>
      root.style.removeProperty(prop),
    );
  };

  // 5. Apply theme instantly on F5/Page Refresh
  useEffect(() => {
    if (themeConfig) {
      applyThemeToCSSVars(themeConfig);
    }
  }, [themeConfig]); 

  if (loading) {
    return <FallBack />;
  }

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