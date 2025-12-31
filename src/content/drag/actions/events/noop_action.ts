import { logger } from '@/shared/logger';
import { DragActionEvent } from './drag_action';

/**
 * 何もしない空のアクション
 */
export const noopAction: DragActionEvent = {
  execute(_data?: string): void {
    logger.debug('DragAction', '何もしない');
    // 何もしない
  },
};

