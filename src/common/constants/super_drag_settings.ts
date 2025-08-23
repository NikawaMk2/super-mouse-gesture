import { DragType } from '../../content/models/drag_type';
import { Direction } from '../../content/models/direction';

export type SuperDragSettings = {
  [type in DragType]: {
    [direction in Direction]: {
      action: string;
      params: Record<string, any>;
    };
  };
};

export const DEFAULT_SUPER_DRAG_SETTINGS: SuperDragSettings = {
  text: {
    right: { action: 'copyText', params: {} },
    left: { action: 'openAsUrl', params: { newTab: false } },
    up: { action: 'searchGoogle', params: { url: 'https://www.google.com/search?q=%s' } },
    down: { action: 'searchBing', params: { url: 'https://www.bing.com/search?q=%s' } },
    none: { action: '', params: {} },
  },
  link: {
    right: { action: 'copyLinkUrl', params: {} },
    left: { action: 'openInBackgroundTab', params: {} },
    up: { action: 'openInForegroundTab', params: {} },
    down: { action: 'openInBackgroundTab', params: {} },
    none: { action: '', params: {} },
  },
  image: {
    right: { action: 'copyImageUrl', params: {} },
    left: { action: 'downloadImage', params: {} },
    up: { action: 'openImageInNewTab', params: {} },
    down: { action: 'searchImageGoogle', params: { url: 'https://www.google.com/searchbyimage?image_url=%s' } },
    none: { action: '', params: {} },
  },
  none: {
    right: { action: '', params: {} },
    left: { action: '', params: {} },
    up: { action: '', params: {} },
    down: { action: '', params: {} },
    none: { action: '', params: {} },
  },
}; 