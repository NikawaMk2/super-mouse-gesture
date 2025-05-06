export interface ITabOperator {
    createTab(url: string, active: boolean): Promise<{ id?: number }>;
    updateCurrentTab(url: string): Promise<void>;
    switchToNextTab(): Promise<void>;
    switchToPrevTab(): Promise<void>;
    togglePinActiveTab(): Promise<void>;
    toggleMuteActiveTab(): Promise<void>;
    closeActiveTab(): Promise<void>;
    closeTabsToRight(): Promise<void>;
    closeTabsToLeft(): Promise<void>;
    duplicateActiveTab(): Promise<void>;
    reopenClosedTab(): Promise<void>;
} 