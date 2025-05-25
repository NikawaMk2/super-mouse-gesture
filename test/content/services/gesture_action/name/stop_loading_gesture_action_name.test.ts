import { StopLoadingGestureActionName } from '../../../../../src/content/services/gesture_action/name/stop_loading_gesture_action_name';

describe('StopLoadingGestureActionName', () => {
    let stopLoadingGestureActionName: StopLoadingGestureActionName;

    beforeEach(() => {
        stopLoadingGestureActionName = new StopLoadingGestureActionName();
    });

    test('getJapaneseName()は"読み込み停止"を返す', () => {
        const result = stopLoadingGestureActionName.getJapaneseName();
        expect(result).toBe('読み込み停止');
    });
}); 