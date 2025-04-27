import { DragType } from '../../content/drag_type';
import { Direction } from '../../content/direction';

export type SuperDragSettings = {
  [type in DragType]: {
    [direction in Direction]: string;
  };
};

export const DEFAULT_SUPER_DRAG_SETTINGS: SuperDragSettings = {
  text: {
    right: 'searchGoogle',
    left: 'searchBing',
    up: 'copyText',
    down: 'openAsUrl',
    none: '',
  },
  link: {
    right: 'openInBackgroundTab',
    left: 'openInForegroundTab',
    up: 'copyLinkUrl',
    down: 'downloadLink',
    none: '',
  },
  image: {
    right: 'openImageInNewTab',
    left: 'searchImageGoogle',
    up: 'copyImageUrl',
    down: 'downloadImage',
    none: '',
  },
  none: {
    right: '',
    left: '',
    up: '',
    down: '',
    none: '',
  },
}; 