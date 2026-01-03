import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 下へスクロールアクション
 */
export const scrollDownAction: GestureActionEvent = {
  execute(): void {
    const scrollAmount = window.innerHeight;

    logger.debug('ScrollDownAction', `下へスクロール: ${scrollAmount}px (ページサイズ分)`);

    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth',
    });
  },
};

