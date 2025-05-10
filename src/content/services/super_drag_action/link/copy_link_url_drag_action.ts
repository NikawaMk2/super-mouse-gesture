import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import type { IClipboardService } from '../../clipboard/clipboard_service_interface';
import { ClipboardService } from '../../clipboard/clipboard_service';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';

export class CopyLinkUrlDragAction implements SuperDragAction {
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
        Logger.debug('CopyLinkUrlDragAction: execute() called', { options });
        const url = options.selectedValue;
        if (!url) {
            Logger.warn('コピーするリンクURLが指定されていません', { options });
            return;
        }
        try {
            await this.clipboardService.writeText(url);
            Logger.debug('リンクURLをクリップボードにコピーしました', { url });
        } catch (e) {
            Logger.error('リンクURLのコピーに失敗しました', { error: e, url });
        }
    }
} 