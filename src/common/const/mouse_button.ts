export const MouseButton = {
    Right: 2,
} as const;

type MouseButton = typeof MouseButton[keyof typeof MouseButton];
