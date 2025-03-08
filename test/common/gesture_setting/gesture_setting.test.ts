import { GestureSettingsLoader } from '../../../src/js/common/setting/gesture_settings/gesture_settings_loader';
import GestureSettings from '../../../src/js/common/setting/gesture_setting/gesture_settings';
import DirectionList from '../../../src/js/content/mouse_gesture/direcrion/direcrion_list';
import { Direction } from '../../../src/js/content/mouse_gesture/direcrion/direction';
import { GestureType } from '../../../src/js/common/setting/gesture_setting/gesture_type';
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
            expect(gestureType === GestureType.ScrollDown).toBe(true);
        });

        it('引数のDirectionListからGestureTypeを取得できること(Direction2つ)', async () => {
            const direcrionList = new DirectionList([Direction.Down, Direction.Up]);

            const settings = await mockSettingData.object.getSettings();
            const gestureType = settings.getGestureType(direcrionList);
            expect(gestureType === GestureType.ScrollTop).toBe(true);
        });
    });
});
