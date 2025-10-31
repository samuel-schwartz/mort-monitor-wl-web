import type React from "react";
import { getCurrentUser, getUser } from "@/app/_actions/auth";
import { getUserProperties } from "@/app/_actions/properties";
import { getBroker } from "@/app/_actions/brokers";
import { Property } from "@/types/models";
import { UserProvider } from "../_providers/user-provider";
import { BrokerProvider } from "../_providers/broker-provider";
import { DashboardNavClient } from "./_components/dashboard-nav-client";

export default async function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: Promise<{ viewAsBroker?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const viewAsBroker = params?.viewAsBroker;
  const user = await getUser();
  const brokerId = viewAsBroker || user.brokerId;
  console.log("[v0] BrokerLayout - userId:", user.id);
  console.log("[v0] BrokerLayout - viewAsBroker:", viewAsBroker);
  console.log("[v0] BrokerLayout - brokerId:", brokerId);
  if (!brokerId) return;
  const brokerResult = await getBroker(brokerId);
  const broker = brokerResult.success ? brokerResult.data : null;

  let properties: Property[] = [];

  if (user) {
    const propertiesResult = await getUserProperties(user.id);
    properties = propertiesResult.success ? propertiesResult.data || [] : [];
  }

  return (

    <div>
          <UserProvider value={user}>
            <BrokerProvider value={broker}>
              
            <DashboardNavClient user={user} properties={properties} broker={broker} isSpyView={!!viewAsBroker} />
              <main className="p-4 sm:p-6 lg:p-10 lg:pl-72">{children}</main>
            </BrokerProvider>
          </UserProvider>
        </div>
  );
}
