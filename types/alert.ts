import { RateType } from "./rates"

export type AlertOption = {
    title: string,
    type: "money" | number | Date,
    suffix: string,
    description: string
    defaultValue?: number | Date
    spinnerChangeUnit?: number
}
export type AlertTemplate = {
    id: number,
    title: string,
    description: string,
    icon: string,
    options?: AlertOption[]
}
export type AlertRateTypeOption = {
    rateType: RateType,
    checkAsDefault: boolean
}

export type AlertCreationTemplate = AlertTemplate & {rateTypeOptions?: AlertRateTypeOption[]}

export type AlertSettings = AlertTemplate & {propertyId: number, rateType?: RateType}

export type Alert = {
    id: number,
    settings: AlertSettings,
    isSounding?: boolean,
    isSnoozedUntil?: Date
}