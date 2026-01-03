import { DragActionEvent } from './events/drag_action';
import { openLinkAction } from './events/open_link_action';
import { searchTextAction } from './events/search_text_action';
import { noopAction } from './events/noop_action';

/**
 * ドラッグデータの種類
 */
export enum DragDataType {
  /** リンク */
  LINK = 'link',
  /** テキスト */
  TEXT = 'text',
}

/**
 * ドラッグアクションを作成する
 * @param dataType ドラッグデータの種類
 * @returns ドラッグアクション
 */
export function createDragAction(dataType: DragDataType): DragActionEvent {
  switch (dataType) {
    case DragDataType.LINK:
      return openLinkAction;
    case DragDataType.TEXT:
      return searchTextAction;
    default:
      return noopAction;
  }
}

