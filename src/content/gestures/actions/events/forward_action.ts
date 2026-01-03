import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 進むアクション
 */
export const forwardAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ForwardAction', '履歴を進む');

    window.history.forward();
  },
};

