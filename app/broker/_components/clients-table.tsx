"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, Mail, Trash2 } from "lucide-react";
import { deleteClient, reinviteClient } from "@/app/_actions/clients";
import { useRouter } from "next/navigation";
import { ClientSummary } from "@/types/models";

import { useToast } from "@/hooks/use-toast";

type SortField =
  | "fname"
  | "lname"
  | "email"
  | "alerts"
  | "soundingAlerts"
  | "status"
  | "dateInvited";
type SortDirection = "asc" | "desc";

export function ClientsTable({ clients }: { clients: ClientSummary[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("lname");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    let aValue: string | number | boolean;
    let bValue: string | number | boolean;

    switch (sortField) {
      case "fname":
        aValue = `${a.firstName}`.toLowerCase();
        bValue = `${b.firstName}`.toLowerCase();
        break;
      case "lname":
        aValue = `${a.lastName}`.toLowerCase();
        bValue = `${b.lastName}`.toLowerCase();
        break;
      case "email":
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case "alerts":
        aValue = a.activeAlertCount;
        bValue = b.activeAlertCount;
        break;
      case "soundingAlerts":
        aValue = a.soundingAlertCount;
        bValue = b.soundingAlertCount;
        break;
      case "status":
        aValue = a.onboardingStatus;
        bValue = b.onboardingStatus;
        break;
      case "dateInvited":
        aValue = new Date(a.invitedAt).getTime();
        bValue = new Date(b.invitedAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleDeleteClick = (clientId: string, clientName: string) => {
    setClientToDelete({ id: clientId, name: clientName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteClient(clientToDelete.id);
      if (result.success) {
        toast({ description: "Client deleted successfully" });
        router.refresh();
        setDeleteDialogOpen(false);
      } else {
        toast({ description: result.error || "Failed to delete client" });
      }
    } catch (error) {
      toast({ description: "An unexpected error occurred" });
    } finally {
      setIsDeleting(false);
      setClientToDelete(null);
    }
  };

  const handleReinvite = async (clientId: string) => {
    console.log("HandleReinvite");
    toast({ description: "Starting Reinvite" });
    if (!clientId) return;

    try {
      const result = await reinviteClient(clientId);
      if (result.success) {
        toast({ description: "Client reinvited successfully" });
      } else {
        toast({ description: result.error || "Failed to reinvite client" });
      }
    } catch (error) {
      toast({ description: "An unexpected error occurred" });
    } finally {
      setIsDeleting(false);
      setClientToDelete(null);
    }
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <>
      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-auto">
                <SortButton field="fname">First Name</SortButton>
              </TableHead>
              <TableHead className="w-auto">
                <SortButton field="lname">Last Name</SortButton>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <SortButton field="email">Email</SortButton>
              </TableHead>
              <TableHead className="hidden sm:table-cell w-16 text-center">
                <SortButton field="alerts">Alerts</SortButton>
              </TableHead>
              <TableHead className="hidden lg:table-cell w-20 text-center">
                <SortButton field="soundingAlerts">Sounding</SortButton>
              </TableHead>
              <TableHead className="hidden xl:table-cell w-24">
                <SortButton field="status">Status</SortButton>
              </TableHead>
              <TableHead className="hidden lg:table-cell w-32">
                <SortButton field="dateInvited">Date Invited</SortButton>
              </TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              sortedClients.map((client) => {
                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium max-w-[150px] truncate sm:max-w-none">
                      {client.firstName}
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] truncate sm:max-w-none">
                      {client.lastName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.email}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      {client.activeAlertCount}
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">
                      {client.soundingAlertCount}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-center">
                      {client.onboardingStatus == "invited" ? (
                        <Button
                          size="sm"
                          onClick={() => handleReinvite(client.id)}
                          className=""
                        >
                          <Mail className="h-4 w-4" />
                          <span className="">Reinvite</span>
                        </Button>
                      ) : (
                        <>
                          {client.onboardingStatus.charAt(0).toUpperCase() +
                            client.onboardingStatus.slice(1)}
                        </>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(client.invitedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="h-auto p-0 text-xs sm:text-sm"
                        >
                          <Link href={`/dash?viewAsClient=${client.id}`}>
                            View/Edit
                          </Link>
                        </Button>
                        <span className="hidden sm:inline text-muted-foreground">
                          |
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteClick(
                              client.id,
                              `${client.firstName} ${client.lastName}`,
                            )
                          }
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete client</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.name}? This
              action cannot be undone and will remove all associated properties
              and alerts.
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
  );
}
