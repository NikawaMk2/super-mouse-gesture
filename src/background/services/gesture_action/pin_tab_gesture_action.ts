import { IGestureAction } from './gesture_action';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import Logger from '../../../common/logger/logger';
import { inject } from 'inversify';

export class PinTabGestureAction implements IGestureAction {
    constructor(@inject('ITabOperator') private tabOperator: ITabOperator) {}

    async execute(): Promise<void> {
        Logger.debug('PinTabGestureAction: execute() が呼び出されました');
        await this.tabOperator.togglePinActiveTab();
    }
} 