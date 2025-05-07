import { IGestureAction } from './gesture_action';
import type { IWindowOperator } from './i_window_operator';
import Logger from '../../../common/logger/logger';
import { inject } from 'inversify';

export class MaximizeWindowGestureAction implements IGestureAction {
    constructor(@inject('IWindowOperator') private windowOperator: IWindowOperator) {}

    async execute(): Promise<void> {
        Logger.debug('MaximizeWindowGestureAction: execute() が呼び出されました');
        await this.windowOperator.maximizeCurrentWindow();
    }
} 