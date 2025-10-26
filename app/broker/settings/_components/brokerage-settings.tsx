"use client";

import type React from "react";

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
import { Building2, Palette, TrendingDown } from "lucide-react";
import type { Broker } from "@/types/models";

interface BrokerageSettingsProps {
  broker: Broker | null;
}

export function BrokerageSettings({ broker }: BrokerageSettingsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(broker?.logoUrl || "");

  const [formData, setFormData] = useState({
    companyName: broker?.companyName || "",
    brandColor: broker?.brandColor || "#0066cc",
    defaultRateThreshold: broker?.defaultRateThreshold || 0.5,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!broker) return;

    setIsSaving(true);
    try {
      const updateData: any = { ...formData };

      if (logoFile) {
        updateData.logoUrl = logoPreview;
      }

      const result = await updateBroker(broker.id, updateData);

      if (result.success) {
        toast({
          title: "Settings Updated",
          description: "Brokerage settings have been updated successfully",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update settings",
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
    setFormData({
      companyName: broker?.companyName || "",
      brandColor: broker?.brandColor || "#0066cc",
      defaultRateThreshold: broker?.defaultRateThreshold || 0.5,
    });
    setLogoPreview(broker?.logoUrl || "");
    setLogoFile(null);
    setIsEditing(false);
  };

  if (!broker) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brokerage Settings</CardTitle>
          <CardDescription>
            Unable to load brokerage information
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brokerage Settings</CardTitle>
        <CardDescription>
          Manage your company information and white-label settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                disabled={!isEditing || isSaving}
                className={!isEditing ? "bg-muted pl-10" : "pl-10"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={!isEditing || isSaving}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a logo for white-label branding
                </p>
              </div>
              {logoPreview && (
                <div className="w-16 h-16 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Company logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandColor">Brand Color</Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="brandColor"
                  type="text"
                  value={formData.brandColor}
                  onChange={(e) =>
                    setFormData({ ...formData, brandColor: e.target.value })
                  }
                  disabled={!isEditing || isSaving}
                  className={!isEditing ? "bg-muted pl-10 w-40" : "pl-10 w-40"}
                  placeholder="#0066cc"
                />
              </div>
              <input
                type="color"
                value={formData.brandColor}
                onChange={(e) =>
                  setFormData({ ...formData, brandColor: e.target.value })
                }
                disabled={!isEditing || isSaving}
                className="w-12 h-10 rounded border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: formData.brandColor }}
                title="Preview"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used for white-label client interfaces
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultRateThreshold">
              Default Rate Alert Threshold
            </Label>
            <div className="relative">
              <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="defaultRateThreshold"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.defaultRateThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultRateThreshold: Number.parseFloat(e.target.value),
                  })
                }
                disabled={!isEditing || isSaving}
                className={!isEditing ? "bg-muted pl-10" : "pl-10"}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Default percentage drop to trigger rate improvement alerts (e.g.,
              0.5%)
            </p>
          </div>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
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
        </div>
      </CardContent>
    </Card>
  );
}
