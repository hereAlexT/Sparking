import { THEME_TYPE } from "../shared/types";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { useState, useEffect } from "react";

interface MetaProviderProps {
  children: ReactNode;
}

type MetaContextType = {
  isOnline: boolean;
  theme: THEME_TYPE;
  setTheme: (value: THEME_TYPE) => void;
  isSplitPaneOn: boolean;
  setIsSplitPaneOn: (value: boolean) => void;
};

const MetaContext = createContext<MetaContextType>({
  isOnline: true,
  theme: THEME_TYPE.SYSTEM,
  setTheme: () => {},
  isSplitPaneOn: false,
  setIsSplitPaneOn: () => {},
});

const MetaProvider: React.FC<MetaProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSplitPaneOn, setIsSplitPaneOn] = useState<boolean>(false);
  const [theme, setTheme] = useState<THEME_TYPE>(THEME_TYPE.SYSTEM);

  useEffect(() => {
    console.debug("isSplitPaneOn: ", isSplitPaneOn); // Print the isSplitPaneOn state whenever it changes
  }, [isSplitPaneOn]);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []); // Empty dependency array to run effect only once on mount

  /** Set up Darkmode switch */
  /**Darkmode should change followed by  */
  useEffect(() => {
    if (theme === THEME_TYPE.DARK) {
      document.documentElement.classList.add("dark");
    } else if (theme === THEME_TYPE.LIGHT) {
      document.documentElement.classList.remove("dark");
    } else if (theme === THEME_TYPE.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? THEME_TYPE.DARK
        : THEME_TYPE.LIGHT;

      // Set the theme initially based on the system theme
      if (systemTheme === THEME_TYPE.DARK) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      prefersDark.addEventListener("change", (mediaQuery) => {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      });
    }
  }, [theme]);

  return (
    <MetaContext.Provider
      value={{ isOnline, isSplitPaneOn, setIsSplitPaneOn, theme, setTheme }}
    >
      {children}
    </MetaContext.Provider>
  );
};

const useMeta = () => {
  const context = useContext(MetaContext);
  if (context === undefined) {
    throw new Error("useMeta must be used within a MetaProvider");
  }
  return context;
};

export { MetaProvider, useMeta };
