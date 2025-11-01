export type ClosingCostComponent = {
    id: number,
    title: string,
    amount: number,
    default: number,
    description: string,
    category: string,
    lastUpdated: Date
}
export class ClosingCosts{
    constructor(public components: ClosingCostComponent[]){}
    getSumOfClosingCosts(): number {
        return this.components.reduce((sum: number, component: ClosingCostComponent) => sum + component.amount, 0)
    }

    
}