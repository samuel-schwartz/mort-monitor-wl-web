"use client";

import { UserWithRole } from "@/types/models";
import React, { createContext, useContext } from "react";


const UserContext = createContext<UserWithRole | null>(null);

export function UserProvider({ value, children }: { value: UserWithRole | null; children: React.ReactNode }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function getUserFromContext() {
  return useContext(UserContext);
}
