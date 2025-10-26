"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBroker } from "@/app/_actions/brokers";
import { useToast } from "@/hooks/use-toast";
import { X, Mail, UserPlus } from "lucide-react";
import type { Broker } from "@/types/models";

interface TeamMembersProps {
  broker: Broker | null;
}

export function TeamMembers({ broker }: TeamMembersProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emails, setEmails] = useState<string[]>(broker?.emails || []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setEmailError("This email already has access");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setNewEmail("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    if (emails.length === 1) {
      toast({
        title: "Cannot Remove",
        description:
          "At least one email address must have access to the brokerage",
        variant: "destructive",
      });
      return;
    }

    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleSave = async () => {
    if (!broker) return;

    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "At least one email address is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateBroker(broker.id, { emails });

      if (result.success) {
        toast({
          title: "Team Updated",
          description: "Team member access has been updated successfully",
        });
        setIsAdding(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update team members",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEmails(broker?.emails || []);
    setNewEmail("");
    setEmailError("");
    setIsAdding(false);
  };

  if (!broker) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Unable to load team information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Manage who has access to your brokerage account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {emails.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{email}</p>
                  <p className="text-xs text-muted-foreground">Full access</p>
                </div>
              </div>
              {isAdding && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEmail(email)}
                  disabled={isSaving || emails.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {isAdding && (
          <div className="space-y-3 pt-3 border-t">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Add Team Member</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                    placeholder="email@example.com"
                    disabled={isSaving}
                  />
                  {emailError && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {emailError}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleAddEmail}
                  disabled={isSaving}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Team members can log in with their email and manage all clients
              </p>
            </div>
          </div>
        )}

        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Manage Team Access
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
