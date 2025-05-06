import { IGestureAction } from './gesture_action';
import { ITabOperator } from '../../../common/provider/tab_operator';
import Logger from '../../../common/logger/logger';

export class ReopenClosedTabGestureAction implements IGestureAction {
    constructor(private tabOperator: ITabOperator) {}

    async execute(): Promise<void> {
        Logger.debug('ReopenClosedTabGestureAction: execute() が呼び出されました');
        await this.tabOperator.reopenClosedTab();
    }
} 