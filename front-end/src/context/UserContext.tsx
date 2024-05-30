"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the User type or interface

// Create a context with null as the initial state
export const ModelContext = createContext<
  [ any | null, React.Dispatch<React.SetStateAction<any | null>>]
>([null, () => {}]);

// Define your provider component
export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  return (
    <ModelContext.Provider value={[user, setUser]}>
      {children}
    </ModelContext.Provider>
  );
}

// Create a custom hook to use the context
export function useUserContext() {
  return useContext(ModelContext);
}
