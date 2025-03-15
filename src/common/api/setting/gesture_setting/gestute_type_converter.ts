import { Gesture, GestureType } from './gesture_type';

export default class GestureTypeConverter {
    static readonly gestureTypeValueToKey = Object.entries(Gesture).reduce((acc, [key, value]) => {
        acc[value] = key as keyof typeof Gesture;
        return acc;
      }, {} as Record<string, keyof typeof Gesture>);

    
    static convert(str: string): GestureType {
        if (str in this.gestureTypeValueToKey) {
            return this.gestureTypeValueToKey[str];
        }
        throw new Error(`不正なキーです: ${str}`);
    }
}