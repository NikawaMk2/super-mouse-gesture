import { SuperDragActionType } from "../super_drag_action_type";
import { SuperDragActionName } from "./super_drag_action_name";
import { SearchGoogleSuperDragActionName } from "./search_google_super_drag_action_name";
import { SearchBingSuperDragActionName } from "./search_bing_super_drag_action_name";
import { OpenAsUrlSuperDragActionName } from "./open_as_url_super_drag_action_name";
import { CopyTextSuperDragActionName } from "./copy_text_super_drag_action_name";
import { OpenInBackgroundTabSuperDragActionName } from "./open_in_background_tab_super_drag_action_name";
import { OpenInForegroundTabSuperDragActionName } from "./open_in_foreground_tab_super_drag_action_name";
import { CopyLinkUrlSuperDragActionName } from "./copy_link_url_super_drag_action_name";
import { OpenImageInNewTabSuperDragActionName } from "./open_image_in_new_tab_super_drag_action_name";

import { SearchImageGoogleSuperDragActionName } from "./search_image_google_super_drag_action_name";
import { CopyImageUrlSuperDragActionName } from "./copy_image_url_super_drag_action_name";

export class SuperDragActionNameMap {
    private static readonly map: Map<SuperDragActionType, SuperDragActionName> = new Map([
        [SuperDragActionType.SEARCH_GOOGLE, new SearchGoogleSuperDragActionName()],
        [SuperDragActionType.SEARCH_BING, new SearchBingSuperDragActionName()],
        [SuperDragActionType.OPEN_AS_URL, new OpenAsUrlSuperDragActionName()],
        [SuperDragActionType.COPY_TEXT, new CopyTextSuperDragActionName()],
        [SuperDragActionType.OPEN_IN_BACKGROUND_TAB, new OpenInBackgroundTabSuperDragActionName()],
        [SuperDragActionType.OPEN_IN_FOREGROUND_TAB, new OpenInForegroundTabSuperDragActionName()],
        [SuperDragActionType.COPY_LINK_URL, new CopyLinkUrlSuperDragActionName()],
        [SuperDragActionType.OPEN_IMAGE_IN_NEW_TAB, new OpenImageInNewTabSuperDragActionName()],

        [SuperDragActionType.SEARCH_IMAGE_GOOGLE, new SearchImageGoogleSuperDragActionName()],
        [SuperDragActionType.COPY_IMAGE_URL, new CopyImageUrlSuperDragActionName()],
    ]);

    public static get(actionType: SuperDragActionType): string {
        // 事前条件の検証
        if (!actionType || typeof actionType !== 'string') {
            throw new Error('actionTypeは有効な文字列である必要があります');
        }

        const actionName = this.map.get(actionType);
        if (!actionName) {
            throw new Error(`未対応のSuperDragActionType: ${actionType}`);
        }

        return actionName.getJapaneseName();
    }
}
