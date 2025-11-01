import { Profile } from "./user";

export type Brokerage = {
    id: number,
    name: string,
    logoUrl: string,
    brandColor: string,
    employees: Profile[],
    clients?: Profile[]
}