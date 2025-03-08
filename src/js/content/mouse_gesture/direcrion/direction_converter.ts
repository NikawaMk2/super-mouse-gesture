import { Direction } from './direction';

type DirectionKey = keyof typeof Direction;

export default class DirectionConverter {

    static convert(str: string): Direction {
        const gestureTypeKeys = Object.keys(Direction) as DirectionKey[];
        
        if (!gestureTypeKeys.includes(str as DirectionKey)) {
            throw new Error(`不正なキーです: ${str}`);
        }
        
        return Direction[str as DirectionKey];
    }
}