import { logger } from '@/shared/logger';
import { BackgroundAction } from '../../../gestures/actions/events/background_action';

/**
 * 何もしない空のアクション
 */
export const noopAction: BackgroundAction = {
  execute(_payload?: unknown): void {
    logger.debug('BackgroundAction', '何もしない');
    // 何もしない
  },
};

