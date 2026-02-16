import React, { createContext, useState } from "react";

// Create the context
export const LanguageContext = createContext({
  language: "en",       // default language
  setLanguage: () => {}, // placeholder function
});

// Create a provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // default English

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
