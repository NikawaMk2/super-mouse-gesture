import { Direction, DirectionType } from './direction';

export default class DirectionConverter {
    static readonly directionTypeValueToKey = Object.entries(Direction).reduce((acc, [key, value]) => {
        acc[value] = key as keyof typeof Direction;
        return acc;
      }, {} as Record<string, keyof typeof Direction>);

    static convert(str: string): DirectionType {
        if (str in this.directionTypeValueToKey) {
            return this.directionTypeValueToKey[str];
        }
        
        throw new Error(`不正なキーです: ${str}`);
    }
}