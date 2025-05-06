import { IGestureAction } from './gesture_action';
import { ITabOperator } from '../../../common/provider/tab_operator';
import Logger from '../../../common/logger/logger';

export class DuplicateTabGestureAction implements IGestureAction {
    constructor(private tabOperator: ITabOperator) {}

    async execute(): Promise<void> {
        Logger.debug('DuplicateTabGestureAction: execute() が呼び出されました');
        await this.tabOperator.duplicateActiveTab();
    }
} 