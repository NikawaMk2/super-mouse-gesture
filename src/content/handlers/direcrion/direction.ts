export const Direction = {
    Up :  'Up',
    Down :  'Down',
    Left :  'Left',
    Right :  'Right',
    None :  'None'
} as const;

export type DirectionType = typeof Direction[keyof typeof Direction];