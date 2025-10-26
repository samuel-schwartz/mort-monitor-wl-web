import type React from "react"
import { AdminNav } from "./_components/admin-nav"
import { getUser } from "@/app/actions/auth"
import { User } from "@/types/models"
import { redirect } from "next/navigation"

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
      <AdminNav user={user} />
      <main className="p-4 sm:p-6 lg:p-10 lg:pl-72">{children}</main>
    </div>
  )
}
