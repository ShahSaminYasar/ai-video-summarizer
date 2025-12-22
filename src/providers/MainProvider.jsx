"use client";

import { useSession } from "next-auth/react";

const { createContext, useEffect, useState } = require("react");

export const MainContext = createContext(undefined);

export const MainProvider = ({ children }) => {
  const { status: authStatus } = useSession();

  // States
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "dark";
    setTheme(localTheme);

    if (authStatus !== "loading") {
      setLoading(false);
    }
  }, [authStatus]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const values = {
    loading,
    theme,
    setTheme,
  };

  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
};
