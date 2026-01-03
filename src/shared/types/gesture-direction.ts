/**
 * ジェスチャの方向
 */
export const GestureDirection = {
    /** 上 */
    UP: 'U',
    /** 下 */
    DOWN: 'D',
    /** 左 */
    LEFT: 'L',
    /** 右 */
    RIGHT: 'R',
} as const;

export type GestureDirection = typeof GestureDirection[keyof typeof GestureDirection];
