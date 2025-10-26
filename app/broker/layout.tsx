import type React from "react";
import { BrokerNav } from "./_components/broker-nav";
import { getBroker } from "@/app/_actions/brokers";
import { getUser } from "@/app/_actions/auth";
import { UserProvider } from "../_providers/user-provider";
import { BrokerProvider } from "../_providers/broker-provider";

export default async function BrokerLayout({
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

  return (
    <div>
      <UserProvider value={user}>
        <BrokerProvider value={broker}>
          <BrokerNav isSpyView={!!viewAsBroker} />
          <main className="p-4 sm:p-6 lg:p-10 lg:pl-72">{children}</main>
        </BrokerProvider>
      </UserProvider>
    </div>
  );
}
