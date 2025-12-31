import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 戻るアクション
 */
export const backAction: GestureActionEvent = {
  execute(): void {
    logger.debug('BackAction', '履歴を戻る');

    window.history.back();
  },
};

