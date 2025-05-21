import { IGestureAction } from './gesture_action';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import Logger from '../../../common/logger/logger';
import { inject } from 'inversify';

export class NewTabGestureAction implements IGestureAction {
    constructor(@inject('ITabOperator') private tabOperator: ITabOperator) {}

    async execute(): Promise<void> {
        Logger.debug('NewTabGestureAction: execute() が呼び出されました');
        await this.tabOperator.createTab('chrome://newtab', true);
    }
} 