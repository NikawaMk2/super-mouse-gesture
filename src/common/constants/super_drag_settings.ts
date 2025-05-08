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
    right: { action: 'searchGoogle', params: { url: 'https://www.google.com/search?q=%s' } },
    left: { action: 'searchBing', params: { url: 'https://www.bing.com/search?q=%s' } },
    up: { action: 'copyText', params: {} },
    down: { action: 'openAsUrl', params: { newTab: false } },
    none: { action: '', params: {} },
  },
  link: {
    right: { action: 'openInBackgroundTab', params: {} },
    left: { action: 'openInForegroundTab', params: {} },
    up: { action: 'copyLinkUrl', params: {} },
    down: { action: 'downloadLink', params: {} },
    none: { action: '', params: {} },
  },
  image: {
    right: { action: 'openImageInNewTab', params: {} },
    left: { action: 'searchImageGoogle', params: { url: 'https://www.google.com/searchbyimage?image_url=%s' } },
    up: { action: 'copyImageUrl', params: {} },
    down: { action: 'downloadImage', params: {} },
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