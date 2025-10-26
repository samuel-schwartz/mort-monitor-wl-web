import { Suspense } from "react";
import { notFound } from "next/navigation";
import { InviteAcceptance } from "./_components/invite-acceptance";
import { Skeleton } from "@/components/ui/skeleton";
import { validateToken } from "@/app/_actions/tokens";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const tokenResult = await validateToken(token, "invitation");

  if (!tokenResult.success) {
    notFound();
  }

  const tokenData = tokenResult.data;

  const invitation = {
    token,
    brokerName: "Your Broker", // Will be populated from API
    brokerCompany: "Mortgage Company", // Will be populated from API
    clientEmail: tokenData.email || "",
    expiresAt: tokenData.expiresAt,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <InviteAcceptance invitation={invitation} />
      </Suspense>
    </div>
  );
}
