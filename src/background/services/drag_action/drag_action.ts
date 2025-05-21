import { DragActionMessagePayload } from '../../../content/services/message/message_types';

export interface DragAction {
    execute(payload: DragActionMessagePayload): Promise<void>;
} 