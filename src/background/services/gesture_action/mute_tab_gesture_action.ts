import { IGestureAction } from './gesture_action';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import Logger from '../../../common/logger/logger';
import { inject } from 'inversify';

export class MuteTabGestureAction implements IGestureAction {
    constructor(@inject('ITabOperator') private tabOperator: ITabOperator) {}

    async execute(): Promise<void> {
        Logger.debug('MuteTabGestureAction: execute() が呼び出されました');
        await this.tabOperator.toggleMuteActiveTab();
    }
} 