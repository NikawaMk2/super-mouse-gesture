import { IGestureAction } from './gesture_action';
import { IWindowOperator } from './i_window_operator';
import Logger from '../../../common/logger/logger';

export class MinimizeWindowGestureAction implements IGestureAction {
    constructor(private windowOperator: IWindowOperator) {}

    async execute(): Promise<void> {
        Logger.debug('MinimizeWindowGestureAction: execute() が呼び出されました');
        await this.windowOperator.minimizeCurrentWindow();
    }
} 