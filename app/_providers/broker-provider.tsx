"use client";

import { Broker } from "@/types/models";
import React, { createContext, useContext } from "react";

const BrokerContext = createContext<Broker | null>(null);

export function BrokerProvider({
  value,
  children,
}: {
  value: Broker | null;
  children: React.ReactNode;
}) {
  return (
    <BrokerContext.Provider value={value}>{children}</BrokerContext.Provider>
  );
}

export function getBrokerFromContext() {
  return useContext(BrokerContext);
}
