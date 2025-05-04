export interface IDownloadService {
    download(url: string): Promise<void>;
} 