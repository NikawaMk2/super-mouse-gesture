import { NewIncognitoWindowGestureActionName } from '../../../../../src/content/services/gesture_action/name/new_incognito_window_gesture_action_name';

describe('NewIncognitoWindowGestureActionName', () => {
    let newIncognitoWindowGestureActionName: NewIncognitoWindowGestureActionName;

    beforeEach(() => {
        newIncognitoWindowGestureActionName = new NewIncognitoWindowGestureActionName();
    });

    test('getJapaneseName()は"新しいプライベートウィンドウを開く"を返す', () => {
        const result = newIncognitoWindowGestureActionName.getJapaneseName();
        expect(result).toBe('新しいプライベートウィンドウを開く');
    });
}); 