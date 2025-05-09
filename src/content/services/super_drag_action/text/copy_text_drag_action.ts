import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import type { IClipboardService } from '../../clipboard/clipboard_service_interface';
import { ClipboardService } from '../../clipboard/clipboard_service';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';

export class CopyTextDragAction implements SuperDragAction {
    private clipboardService: IClipboardService;

    constructor(clipboardService: IClipboardService = new ClipboardService()) {
        this.clipboardService = clipboardService;
    }

    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('CopyTextDragAction: execute() called', { options });
        const text = options.params.text ?? options.selectedValue;
        if (!text) {
            Logger.warn('コピーするテキストが指定されていません', { options });
            return;
        }
        try {
            await this.clipboardService.writeText(text);
            Logger.debug('テキストをクリップボードにコピーしました', { text });
        } catch (e) {
            Logger.error('テキストのコピーに失敗しました', { error: e, text });
        }
    }
} 