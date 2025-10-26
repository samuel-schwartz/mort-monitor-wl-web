"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as LUserIcon, Camera, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/app/_actions/users";
import { ChangePassword } from "@/app/account/_components/change-password";
import { User } from "@/types/models";

export function AccountSettings({ user }: { user: User }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.iconUrl || null,
  );

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ firstName, lastName, email, avatarUrl });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickAvatar = () => fileInputRef.current?.click();

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setDraft((d) => ({ ...d, avatarUrl: localUrl }));
  };

  const handleRemoveAvatar = () => {
    if (draft.avatarUrl) URL.revokeObjectURL(draft.avatarUrl);
    setDraft((d) => ({ ...d, avatarUrl: null }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const result = await updateUser(user.id, {
        firstName: draft.firstName,
        lastName: draft.lastName,
      });

      if (result.success) {
        setFirstName(draft.firstName);
        setLastName(draft.lastName);
        setEmail(draft.email);
        setAvatarUrl(draft.avatarUrl);
        setEditing(false);

        toast({
          title: "Settings saved",
          description:
            "Your personal information has been updated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to save",
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to update your settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({ firstName, lastName, email, avatarUrl });
    setEditing(false);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No user data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <LUserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your profile and account details
              </CardDescription>
            </div>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="space-y-3">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-2 overflow-hidden bg-muted flex items-center justify-center">
                {draft.avatarUrl ? (
                  <img
                    src={draft.avatarUrl || "/placeholder.svg"}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <LUserIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePickAvatar}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                  {draft.avatarUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={editing ? draft.firstName : firstName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, firstName: e.target.value }))
                }
                disabled={!editing}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={editing ? draft.lastName : lastName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, lastName: e.target.value }))
                }
                disabled={!editing}
              />
            </div>
          </div>

          {/* Email - Full width */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address (cannot be changed)</Label>
            <Input
              id="email"
              type="email"
              value={editing ? draft.email : email}
              onChange={(e) =>
                setDraft((d) => ({ ...d, email: e.target.value }))
              }
              disabled={true}
            />
          </div>

          {editing && (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-24"
              >
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
      {user.provider == "credentials" && (
        <ChangePassword userEmail={user.email} />
      )}
    </div>
  );
}
