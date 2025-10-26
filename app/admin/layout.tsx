import type React from "react"
import { AdminNav } from "./_components/admin-nav"
import { getUser } from "@/app/_actions/auth"
import { redirect } from "next/navigation"
import { UserProvider } from "@/app/_providers/user-provider"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getUser()

  if(!user){
    redirect("/login")
  }

  return (
    <div>
      <UserProvider value={user}>
        <AdminNav />
        <main className="p-4 sm:p-6 lg:p-10 lg:pl-72">{children}</main>
      </UserProvider>
    </div>
  )
}
