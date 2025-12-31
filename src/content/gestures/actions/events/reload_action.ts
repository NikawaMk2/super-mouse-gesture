import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 再読み込みアクション
 */
export const reloadAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ReloadAction', 'ページを再読み込み');

    location.reload();
  },
};
