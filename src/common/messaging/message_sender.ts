export interface MessageSender {
    sendMessage<T>(message: unknown): Promise<T>;
} 