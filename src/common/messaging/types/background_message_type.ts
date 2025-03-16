const BackgroundMessage = {
    SelectRightTab: 'SelectRightTab',
    SelectLeftTab: 'SelectLeftTab',
    CloseAndSelectRightTab: 'CloseAndSelectRightTab',
    CloseAndSelectLeftTab: 'CloseAndSelectLeftTab',
} as const;

export type BackgroundMessageType = typeof BackgroundMessage[keyof typeof BackgroundMessage];
export default BackgroundMessage;