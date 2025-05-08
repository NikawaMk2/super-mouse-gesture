export interface IClipboardService {
    writeText(text: string): Promise<void>;
} 