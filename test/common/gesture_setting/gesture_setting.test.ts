import { GestureSettingsLoader } from '../../../src/common/api/setting/gesture_setting/loader/gesture_settings_loader';
import GestureSettings from '../../../src/common/api/setting/gesture_setting/gesture_settings';
import DirectionList from '../../../src/content/models/direcrion/direcrion_list';
import { Direction } from '../../../src/content/models/direcrion/direction';
import { Gesture } from '../../../src/common/api/setting/gesture_setting/gesture_type';
import * as TypeMoq from 'typemoq';

describe('GestureSettingsクラスのテスト', () => {
    const mockSettingData: TypeMoq.IMock<GestureSettingsLoader> = TypeMoq.Mock.ofType<GestureSettingsLoader>();
    mockSettingData
    .setup(x => x.getSettings())
    .returns(() => Promise.resolve(GestureSettings.defaultSettings()));

    describe('GetGestureTypeのテスト', () => {
        it('引数のDirectionListからGestureTypeを取得できること(Direction1つ)', async () => {
            const direcrionList = new DirectionList([Direction.Down]);

            const settings = await mockSettingData.object.getSettings();
            const gestureType = settings.getGestureType(direcrionList);
            expect(gestureType === Gesture.ScrollDown).toBe(true);
        });

        it('引数のDirectionListからGestureTypeを取得できること(Direction2つ)', async () => {
            const direcrionList = new DirectionList([Direction.Down, Direction.Up]);

            const settings = await mockSettingData.object.getSettings();
            const gestureType = settings.getGestureType(direcrionList);
            expect(gestureType === Gesture.ScrollTop).toBe(true);
        });
    });
});
