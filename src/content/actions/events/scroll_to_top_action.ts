import { logger } from '../../../shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * ページトップへスクロールアクション
 */
export const scrollToTopAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ScrollToTopAction', 'ページトップへスクロール');

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  },
};

