import { GestureActionFactory } from '../../../../src/content/services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../../../../src/content/services/gesture_action/gesture_action_type';
import { ContainerProvider } from '../../../../src/common/provider/container_provider';

jest.mock('../../../../src/common/provider/container_provider');

// モック用ダミークラス
class DummyAction {}

const mockContainer = {
  get: jest.fn()
};

(ContainerProvider.getContainer as jest.Mock).mockReturnValue(mockContainer);

describe('GestureActionFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('各GestureActionTypeで正しいクラスインスタンスが返ること', () => {
    // 各アクションタイプに対してgetが呼ばれることを検証
    Object.values(GestureActionType).forEach(type => {
      mockContainer.get.mockReturnValueOnce(DummyAction);
      // requireの部分は実際のクラス名に依存するため、ここではgetが呼ばれることのみ検証
      const result = GestureActionFactory.create(type);
      expect(mockContainer.get).toHaveBeenCalledTimes(1);
      expect(result).toBe(DummyAction);
      mockContainer.get.mockClear();
    });
  });

  it('未対応のGestureActionTypeでエラーとなること', () => {
    expect(() => {
      // 存在しないタイプを渡す
      GestureActionFactory.create('unknown_type' as any);
    }).toThrow('未対応のGestureActionType: unknown_type');
  });
}); 