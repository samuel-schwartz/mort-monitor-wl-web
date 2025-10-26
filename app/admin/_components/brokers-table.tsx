"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowUpDown, Trash2 } from "lucide-react"
import { deleteBroker } from "@/app/_actions/brokers"
import { useRouter } from "next/navigation"
import { Broker } from "@/types/models"

import { useToast } from "@/hooks/use-toast"

type SortField = "name" | "company" | "email" | "clients" | "dateAdded"
type SortDirection = "asc" | "desc"

export function BrokersTable({ brokers }: { brokers: Broker[] }) {

    const { toast } = useToast()
  const router = useRouter()
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [brokerToDelete, setBrokerToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedBrokers = [...brokers].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case "company":
        aValue = a.companyName.toLowerCase()
        bValue = b.companyName.toLowerCase()
        break
      case "email":
        aValue = a.emails[0].toLowerCase()
        bValue = b.emails[0].toLowerCase()
        break
      case "dateAdded":
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleDeleteClick = (brokerId: string, brokerName: string) => {
    setBrokerToDelete({ id: brokerId, name: brokerName })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!brokerToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteBroker(brokerToDelete.id)
      if (result.success) {
        toast({description:"Broker deleted successfully"})
        router.refresh()
        setDeleteDialogOpen(false)
      } else {
        toast({description:result.error || "Failed to delete broker"})
      }
    } catch (error) {
      toast({description:"An unexpected error occurred"})
    } finally {
      setIsDeleting(false)
      setBrokerToDelete(null)
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <>
      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">
                <SortButton field="company">Company</SortButton>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <SortButton field="email">Email</SortButton>
              </TableHead>
              <TableHead className="hidden lg:table-cell w-32">
                <SortButton field="dateAdded">Date Added</SortButton>
              </TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBrokers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No brokers found.
                </TableCell>
              </TableRow>
            ) : (
              sortedBrokers.map((broker) => (
                <TableRow key={broker.id}>
                  <TableCell className="hidden md:table-cell">{broker.companyName}</TableCell>
                  <TableCell className="hidden lg:table-cell">{broker.emails[0]}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(broker.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 sm:gap-2">
                      <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs sm:text-sm">
                        <Link href={`/broker?viewAsBroker=${broker.id}`}>View/Edit</Link>
                      </Button>
                      <span className="hidden sm:inline text-muted-foreground">|</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(broker.id, broker.companyName)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete broker</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Broker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {brokerToDelete?.name}? This action cannot be undone and will remove all
              associated clients and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
