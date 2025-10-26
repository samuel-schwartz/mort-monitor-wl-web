"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Clock,
  TrendingDown,
  Home,
  Calendar,
  PiggyBank,
  Check,
  Bell,
  BellOff,
  Trash2,
  Pencil,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AlertConfig, AlertTemplate, CreatedAlarm, AlertInputs, TemplateKind } from "@/types/alerts"
import { AlertInputFields } from "@/components/shared/alert-input-fields"
import { LoanTermSelector } from "@/components/shared/loan-term-selector"
import { calculateTotalAlertCount, PRICING } from "@/lib/config/pricing"
import { summarizeInputs } from "@/types/alerts"
import { useToast } from "@/hooks/use-toast"

const SNOOZE_DURATIONS = [
  { label: "1 day", days: 1 },
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
  { label: "1 quarter (3 months)", days: 90 },
  { label: "1 year", days: 365 },
]

export default function AlertsPage({ params }: { params: { id: string } }) {
  const loanData = {
    propertyPrice: 450000,
    currentBalance: 378500,
    currentRate: 6.625,
  }

  const calculateLTV = (): number | null => {
    const price = loanData.propertyPrice
    const balance = loanData.currentBalance

    if (price === 0 || isNaN(price) || isNaN(balance)) return null

    return (balance / price) * 100
  }

  const currentLTV = calculateLTV()
  const shouldShowPMI = currentLTV === null || currentLTV > 80

  const alertTemplates: AlertTemplate[] = [
    {
      id: "monthly-savings",
      name: "Monthly Payment Savings",
      description: "Alert me when I can save at least $X per month.",
      icon: DollarSign,
      defaultInputs: { amount: 150 },
    },
    {
      id: "break-even",
      name: "Break-Even by Months",
      description: "Alert me when I break even within M months.",
      icon: Clock,
      defaultInputs: { months: 24 },
    },
    ...(shouldShowPMI
      ? [
          {
            id: "pmi-removal",
            name: "PMI Removal",
            description: "Alert me when LTV reaches 20%, so PMI can be removed.",
            icon: Home,
            defaultInputs: { ltv: 20 },
            noTermSelection: true,
          },
        ]
      : []),
    {
      id: "rate-improvement",
      name: "Better Rate than My Current Loan",
      description: "Alert me when the 15 or 30 year fixed-rate is at least X% lower than my current rate.",
      icon: TrendingDown,
      defaultInputs: { improvement: 0.5 },
    },
    {
      id: "break-even-date",
      name: "Break-Even by Date",
      description: "Alert me if I can break even on refinance costs on or before DD/MM/YYYY.",
      icon: Calendar,
      defaultInputs: { byDate: new Date().toISOString().slice(0, 10) },
    },
    {
      id: "interest-savings",
      name: "Total Lifetime Interest Savings",
      description: "Alert me when total lifetime interest savings would be at least $X.",
      icon: PiggyBank,
      defaultInputs: { lifetimeSavings: 5000 },
    },
  ]

  const [createdAlarms, setCreatedAlarms] = useState<CreatedAlarm[]>([
    {
      id: "alarm-1-30yr",
      templateId: "rate-improvement",
      templateName: "Better Rate than My Current Loan",
      icon: TrendingDown,
      inputs: { kind: "rate-improvement", improvement: 0.5 },
      loanTerm: 30,
      createdAt: Date.now() - 86400000 * 7,
      sounding: true,
    },
    {
      id: "alarm-1-15yr",
      templateId: "rate-improvement",
      templateName: "Better Rate than My Current Loan",
      icon: TrendingDown,
      inputs: { kind: "rate-improvement", improvement: 0.5 },
      loanTerm: 15,
      createdAt: Date.now() - 86400000 * 7,
      sounding: true,
    },
    {
      id: "alarm-2-30yr",
      templateId: "monthly-savings",
      templateName: "Monthly Payment Savings",
      icon: DollarSign,
      inputs: { kind: "monthly-savings", amount: 200 },
      loanTerm: 30,
      createdAt: Date.now() - 86400000 * 14,
      sounding: false,
    },
    {
      id: "alarm-3-15yr",
      templateId: "break-even",
      templateName: "Break-Even by Months",
      icon: Clock,
      inputs: { kind: "break-even", months: 24 },
      loanTerm: 15,
      createdAt: Date.now() - 86400000 * 30,
      snoozed: true,
      snoozeUntil: Date.now() + 86400000 * 7,
      sounding: false,
    },
  ])

  const [selectedAlerts, setSelectedAlerts] = useState<AlertConfig[]>([])
  const [snoozePickerOpen, setSnoozePickerOpen] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [alarmToDelete, setAlarmToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [alarmToEdit, setAlarmToEdit] = useState<CreatedAlarm | null>(null)
  const [editInputs, setEditInputs] = useState<any>({})

  const { toast } = useToast()

  const activeAlarms = createdAlarms.filter((a) => !a.snoozed)
  const snoozedAlarms = createdAlarms.filter((a) => a.snoozed)

  const isAlertSelected = (alertId: string) => {
    return selectedAlerts.some((a) => a.templateId === alertId)
  }

  const getAlertConfig = (alertId: string): AlertConfig | undefined => {
    return selectedAlerts.find((a) => a.templateId === alertId)
  }

  const toggleAlert = (alertId: string) => {
    if (isAlertSelected(alertId)) {
      setSelectedAlerts(selectedAlerts.filter((a) => a.templateId !== alertId))
    } else {
      const alert = alertTemplates.find((t) => t.id === alertId)
      if (alert) {
        setSelectedAlerts([
          ...selectedAlerts,
          {
            templateId: alertId,
            inputs: alert.defaultInputs,
            loanTerms: alert.noTermSelection ? [] : [30, 15],
          },
        ])
      }
    }
  }

  const updateAlertInput = (alertId: string, key: string, value: any) => {
    setSelectedAlerts(
      selectedAlerts.map((alert) =>
        alert.templateId === alertId ? { ...alert, inputs: { ...alert.inputs, [key]: value } } : alert,
      ),
    )
  }

  const updateAlertLoanTerms = (alertId: string, terms: number[]) => {
    setSelectedAlerts(
      selectedAlerts.map((alert) => (alert.templateId === alertId ? { ...alert, loanTerms: terms } : alert)),
    )
  }

  const snoozeAlarm = (alarmId: string, days: number) => {
    setCreatedAlarms(
      createdAlarms.map((alarm) =>
        alarm.id === alarmId
          ? {
              ...alarm,
              snoozed: true,
              snoozeUntil: Date.now() + 86400000 * days,
            }
          : alarm,
      ),
    )
    setSnoozePickerOpen(null)
  }

  const unsnoozeAlarm = (alarmId: string) => {
    setCreatedAlarms(
      createdAlarms.map((alarm) =>
        alarm.id === alarmId
          ? {
              ...alarm,
              snoozed: false,
              snoozeUntil: null,
            }
          : alarm,
      ),
    )
  }

  const deleteAlarm = (alarmId: string) => {
    setCreatedAlarms(createdAlarms.filter((alarm) => alarm.id !== alarmId))
    setDeleteConfirmOpen(false)
    setAlarmToDelete(null)
  }

  const handleEditClick = (alarm: CreatedAlarm) => {
    setAlarmToEdit(alarm)
    setEditInputs({ ...alarm.inputs })
    setEditDialogOpen(true)
  }

  const handleEditSave = () => {
    if (!alarmToEdit) return

    setCreatedAlarms(
      createdAlarms.map((alarm) => (alarm.id === alarmToEdit.id ? { ...alarm, inputs: editInputs } : alarm)),
    )

    setEditDialogOpen(false)
    setAlarmToEdit(null)
    setEditInputs({})

    // Show success toast
    toast({
      title: "Alert Updated",
      description: "Changes in the market will be reflected by the alarm within 24 hours.",
    })
  }

  const updateEditInput = (key: string, value: any) => {
    setEditInputs({ ...editInputs, [key]: value })
  }

  const getAlarmDisplayName = (alarmId: string) => {
    const alarm = createdAlarms.find((a) => a.id === alarmId)
    if (!alarm) return "this alert"

    return alarm.loanTerm ? `${alarm.templateName} (${alarm.loanTerm}-year)` : alarm.templateName
  }

  const handleDeleteClick = (alarmId: string) => {
    setAlarmToDelete(alarmId)
    setDeleteConfirmOpen(true)
  }

  const totalAlertCount = calculateTotalAlertCount(selectedAlerts)
  const annualCost = totalAlertCount * PRICING.pricePerAlertPerYear

  const addNewAlarm = () => {
    const newAlarms: CreatedAlarm[] = []

    selectedAlerts.forEach((config) => {
      const template = alertTemplates.find((t) => t.id === config.templateId)
      if (!template) return

      const alertInputs: AlertInputs = {
        kind: template.id as TemplateKind,
        ...config.inputs,
      } as AlertInputs

      // If the alert has loan terms, create one alarm per term
      if (config.loanTerms.length > 0) {
        config.loanTerms.forEach((term) => {
          const alarmId = `alarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${term}yr`
          newAlarms.push({
            id: alarmId,
            templateId: template.id,
            templateName: template.name,
            icon: template.icon,
            inputs: alertInputs,
            loanTerm: term,
            createdAt: Date.now(),
            sounding: false, // New alarms start in monitoring state
          })
        })
      } else {
        // For alerts without loan terms (like PMI removal)
        const alarmId = `alarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        newAlarms.push({
          id: alarmId,
          templateId: template.id,
          templateName: template.name,
          icon: template.icon,
          inputs: alertInputs,
          createdAt: Date.now(),
          sounding: false,
        })
      }
    })

    // Add new alarms to the created alarms list
    setCreatedAlarms([...createdAlarms, ...newAlarms])

    // Clear selected alerts
    setSelectedAlerts([])

    // Show success toast
    toast({
      title: "Alerts Added",
      description: `Successfully added ${newAlarms.length} alert${newAlarms.length !== 1 ? "s" : ""} to your active alerts.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refinancing Alerts</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your active alerts and add new ones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Active Alerts ({activeAlarms.length})
              </CardTitle>
              <CardDescription>Currently monitoring for refinancing opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlarms.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No active alerts. Add some from the templates on the right.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeAlarms.map((alarm) => {
                    const Icon = alarm.icon
                    return (
                      <div key={alarm.id} className="border rounded-lg p-5 space-y-4 hover:shadow-sm transition-shadow">
                        {/* Header: Name and Status Badge */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base leading-tight">{alarm.templateName}</h4>
                              {alarm.loanTerm && (
                                <p className="text-sm text-muted-foreground mt-0.5">{alarm.loanTerm}-year term</p>
                              )}
                            </div>
                          </div>
                          {alarm.sounding ? (
                            <Badge variant="destructive" className="flex-shrink-0">
                              Sounding
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex-shrink-0">
                              Monitoring
                            </Badge>
                          )}
                        </div>

                        {/* Parameters */}
                        <div className="pl-8">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {summarizeInputs(alarm.inputs)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(alarm.id)}
                            className="h-9 text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            {alarm.sounding && (
                              <div className="relative">
                                {snoozePickerOpen === alarm.id ? (
                                  <div className="absolute left-0 top-full mt-2 z-10 bg-background border rounded-lg shadow-lg p-2 min-w-[200px]">
                                    <p className="text-xs font-semibold mb-2 px-2">Snooze for:</p>
                                    <div className="space-y-1">
                                      {SNOOZE_DURATIONS.map((duration) => (
                                        <Button
                                          key={duration.days}
                                          variant="ghost"
                                          size="sm"
                                          className="w-full justify-start text-xs h-8"
                                          onClick={() => snoozeAlarm(alarm.id, duration.days)}
                                        >
                                          {duration.label}
                                        </Button>
                                      ))}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full mt-2 text-xs h-8"
                                      onClick={() => setSnoozePickerOpen(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSnoozePickerOpen(alarm.id)}
                                    className="h-9"
                                  >
                                    <BellOff className="h-4 w-4 mr-2" />
                                    Snooze
                                  </Button>
                                )}
                              </div>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(alarm)} className="h-9">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {snoozedAlarms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellOff className="h-5 w-5" />
                  Snoozed Alerts ({snoozedAlarms.length})
                </CardTitle>
                <CardDescription>Temporarily paused alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {snoozedAlarms.map((alarm) => {
                    const Icon = alarm.icon
                    const daysUntilUnsnooze = alarm.snoozeUntil
                      ? Math.ceil((alarm.snoozeUntil - Date.now()) / 86400000)
                      : 0
                    return (
                      <div key={alarm.id} className="border rounded-lg p-5 space-y-4 opacity-60">
                        {/* Header: Name and Snooze Info */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base leading-tight">{alarm.templateName}</h4>
                              {alarm.loanTerm && (
                                <p className="text-sm text-muted-foreground mt-0.5">{alarm.loanTerm}-year term</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            Snoozed
                          </Badge>
                        </div>

                        {/* Parameters and Snooze Duration */}
                        <div className="pl-8 space-y-1">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {summarizeInputs(alarm.inputs)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Resumes in {daysUntilUnsnooze} day{daysUntilUnsnooze !== 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(alarm.id)}
                            className="h-9 text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => unsnoozeAlarm(alarm.id)} className="h-9">
                            <Bell className="h-4 w-4 mr-2" />
                            Turn off snooze
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Alerts</CardTitle>
              <CardDescription>Select and configure alerts to monitor refinancing opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertTemplates.map((alert) => {
                  const Icon = alert.icon
                  const isSelected = isAlertSelected(alert.id)
                  const config = getAlertConfig(alert.id)

                  return (
                    <div
                      key={alert.id}
                      onClick={() => toggleAlert(alert.id)}
                      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <h3 className="font-semibold text-sm leading-tight">{alert.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{alert.description}</p>
                        </div>
                      </div>

                      {isSelected && config && (
                        <div
                          className="mt-4 space-y-4 bg-background/50 p-3 rounded-md border border-border/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AlertInputFields
                            templateId={alert.id}
                            inputs={config.inputs}
                            onInputChange={(key, value) => updateAlertInput(alert.id, key, value)}
                          />

                          {!alert.noTermSelection && (
                            <>
                              <Separator />
                              <LoanTermSelector
                                selectedTerms={config.loanTerms}
                                onTermsChange={(terms) => updateAlertLoanTerms(alert.id, terms)}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {selectedAlerts.length > 0 && (
                <>
                  <Button onClick={addNewAlarm} className="w-full mt-6">
                    Add Selected Alerts
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
            <DialogDescription>
              Update the parameters for {alarmToEdit?.templateName}
              {alarmToEdit?.loanTerm && ` (${alarmToEdit.loanTerm}-year)`}
            </DialogDescription>
          </DialogHeader>
          {alarmToEdit && (
            <div className="py-4">
              <AlertInputFields
                templateId={alarmToEdit.templateId}
                inputs={editInputs}
                onInputChange={updateEditInput}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{alarmToDelete && getAlarmDisplayName(alarmToDelete)}</strong>. You
              can always add it back later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alarmToDelete && deleteAlarm(alarmToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
