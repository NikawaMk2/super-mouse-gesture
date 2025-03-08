import { GestureType } from './gesture_type';

type GestureTypeKey = keyof typeof GestureType;

export default class GestureTypeConverter {

    static convert(str: string): GestureType {
        const gestureTypeKeys = Object.keys(GestureType) as GestureTypeKey[];
        
        if (!gestureTypeKeys.includes(str as GestureTypeKey)) {
            throw new Error(`不正なキーです: ${str}`);
        }
        
        return GestureType[str as GestureTypeKey];
    }
}