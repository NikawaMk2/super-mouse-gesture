export const Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    NONE: 'none',
} as const;

export type Direction = typeof Direction[keyof typeof Direction];
