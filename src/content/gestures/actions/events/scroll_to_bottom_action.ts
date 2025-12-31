import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * ページボトムへスクロールアクション
 */
export const scrollToBottomAction: GestureActionEvent = {
  execute(): void {
    const scrollHeight = document.body.scrollHeight;

    logger.debug('ScrollToBottomAction', `ページボトムへスクロール: ${scrollHeight}px`);

    window.scrollTo({
      top: scrollHeight,
      behavior: 'auto',
    });
  },
};
