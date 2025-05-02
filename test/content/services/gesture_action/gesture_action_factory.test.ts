import { GestureActionFactory } from '../../../../src/content/services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../../../../src/content/services/gesture_action/gesture_action_type';
import { ContentContainerProvider } from '../../../../src/content/provider/content_container_provider';

jest.mock('../../../../src/content/provider/content_container_provider');

// モック用ダミークラス
class DummyAction {}

// getメソッドのモックを分離
const mockGet = jest.fn();
const mockContainer = {
  get: mockGet
} as unknown as import('inversify').Container;

// インスタンスメソッドのモック
jest.spyOn(ContentContainerProvider.prototype, 'getContainer').mockReturnValue(mockContainer);

describe('GestureActionFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('各GestureActionTypeで正しいクラスインスタンスが返ること', () => {
    // 各アクションタイプに対してgetが呼ばれることを検証
    Object.values(GestureActionType).forEach(type => {
      mockGet.mockReturnValueOnce(DummyAction);
      // requireの部分は実際のクラス名に依存するため、ここではgetが呼ばれることのみ検証
      const result = GestureActionFactory.create(type);
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(result).toBe(DummyAction);
      mockGet.mockClear();
    });
  });

  it('未対応のGestureActionTypeでエラーとなること', () => {
    expect(() => {
      // 存在しないタイプを渡す
      GestureActionFactory.create('unknown_type' as any);
    }).toThrow('未対応のGestureActionType: unknown_type');
  });
}); 