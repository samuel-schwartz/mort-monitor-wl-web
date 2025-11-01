export type AccountType = "credentials" | "google"
export type Account = {
    type: AccountType,
    email: string,
    fName?: string,
    lName?: string,
    photoUrl?: string
}
export type UserRole = "client" | "broker" | "admin"
export type Profile = {
    id: number,
    oid: string,
    email: string,
    role: UserRole,
    onboardStatus: string,
    brokerId?: number
    creationDate: Date,
    archiveDate?: Date
}

export type User = Account & Profile