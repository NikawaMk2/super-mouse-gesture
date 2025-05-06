import { IGestureAction } from './gesture_action';
import { ITabOperator } from '../../../common/provider/tab_operator';
import Logger from '../../../common/logger/logger';

export class CloseTabToRightGestureAction implements IGestureAction {
    constructor(private tabOperator: ITabOperator) {}

    async execute(): Promise<void> {
        Logger.debug('CloseTabToRightGestureAction: execute() が呼び出されました');
        await this.tabOperator.closeTabsToRight();
    }
} 