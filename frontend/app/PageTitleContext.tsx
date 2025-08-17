"use client";

import React, { createContext, useContext, useState } from "react";

const PageTitleContext = createContext<{
  title: string;
  setTitle: (title: string) => void;
}>({
  title: "Default Title",
  setTitle: () => {},
});

export const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState("Default Title");

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => useContext(PageTitleContext);