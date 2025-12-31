import { logger } from '../../../shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 上へスクロールアクション
 */
export const scrollUpAction: GestureActionEvent = {
  execute(): void {
    const scrollAmount = window.innerHeight;

    logger.debug('ScrollUpAction', `上へスクロール: ${scrollAmount}px (ページサイズ分)`);

    window.scrollBy({
      top: -scrollAmount,
      behavior: 'smooth',
    });
  },
};
