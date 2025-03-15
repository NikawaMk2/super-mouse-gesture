import DirectionList from '../../../../content/handlers/direcrion/direcrion_list';
import { Direction } from '../../../../content/handlers/direcrion/direction';
import GestureSetting from './gesture_setting';
import { Gesture, GestureType } from './gesture_type';
import GestureTypeConverter from './gestute_type_converter';

export default class GestureSettings {
    private static readonly default: GestureSetting[] = [
        new GestureSetting(Gesture.ScrollUp, new DirectionList([Direction.Up])),
        new GestureSetting(Gesture.ScrollDown, new DirectionList([Direction.Down])),
        new GestureSetting(Gesture.BackToPrevious, new DirectionList([Direction.Left])),
        new GestureSetting(Gesture.GoToNext, new DirectionList([Direction.Right])),
        new GestureSetting(Gesture.ScrollTop, new DirectionList([Direction.Down, Direction.Up])),
        new GestureSetting(Gesture.ScrollBottom, new DirectionList([Direction.Up, Direction.Down])),
        new GestureSetting(Gesture.SelectRightTab, new DirectionList([Direction.Up, Direction.Right])),
        new GestureSetting(Gesture.SelectLeftTab, new DirectionList([Direction.Up, Direction.Right])),
        new GestureSetting(Gesture.CloseAndSelectRightTab, new DirectionList([Direction.Down, Direction.Right])),
        new GestureSetting(Gesture.CloseAndSelectLeftTab, new DirectionList([Direction.Down, Direction.Right])),
    ];

    private gestureSettings: GestureSetting[];

    static emptySettings(): GestureSettings {
        return new GestureSettings();
    }

    static fromLoadedSettings(settings: object[]): GestureSettings {
        return new GestureSettings(settings);
    }

    static defaultSettings(): GestureSettings {
        return new GestureSettings(GestureSettings.default);
    }

    private constructor(settings: GestureSetting[]);
    private constructor(settings?: object[]);
    private constructor(settings: any) {
        if (!settings) {
            this.gestureSettings = [];
            return;
        }

        if (settings instanceof Array && settings[0] instanceof GestureSetting) {
            this.gestureSettings = settings as GestureSetting[];
            return;
        }

        this.gestureSettings = (settings as object[]).map(x => {
            const record = x as {
                gestureType: string;
                directions: string[];
            };
            
            return new GestureSetting(
                GestureTypeConverter.convert(record.gestureType as string),
                new DirectionList(record.directions)
            );
        });
    }

    getGestureType(directionList: DirectionList): GestureType {
        const setting = this.gestureSettings.find(x => x.isDirectionsEqual(directionList));
        if (!setting) {
            return Gesture.None;
        }

        return setting.gestureType;
    }

    isEmpty(): boolean {
        return this.gestureSettings.length === 0;
    }
}
