export interface ITabOperator {
    createTab(url: string, active: boolean): Promise<{ id?: number }>;
} 