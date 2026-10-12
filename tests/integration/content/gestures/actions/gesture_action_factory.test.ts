/**
 * gesture_action_factory.ts のインテグレーションテスト
 * 
 * createGestureAction関数が設定システムと統合して動作することを
 * 統合的にテストする。
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// モジュールをモック化（インポートの前に配置）
vi.mock('@/shared/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/shared/utils/settings/settings-storage', () => ({
  loadSettingsFromStorage: vi.fn().mockResolvedValue(undefined),
  saveSettingsToStorage: vi.fn().mockResolvedValue(undefined),
  saveGesturesToStorage: vi.fn().mockResolvedValue(undefined),
  setupStorageListener: vi.fn(),
}));

vi.mock('@/shared/utils/settings/settings-state', () => ({
  getCurrentSettings: vi.fn(() => ({})),
  getCurrentGestures: vi.fn(),
  updateCurrentSettings: vi.fn(),
  updateCurrentGestures: vi.fn(),
  addSettingsChangeListener: vi.fn(),
  addGesturesChangeListener: vi.fn(),
}));

// chrome API をモック化（トップレベルで初期化）
import { setupInitialChromeMock } from '../../../helpers/chrome-mock';

// chrome.storage API をモック化（トップレベルで初期化）
setupInitialChromeMock();

// モック設定後にインポート
import { createGestureAction } from '@/content/gestures/actions/gesture_action_factory';
import { DirectionTrail } from '@/content/gestures/models/direction_trail';
import { GestureDirection } from '@/shared/types/gesture-direction';
import { GestureActionType } from '@/shared/types/gesture-action';
import { settings } from '@/shared/utils/settings';
import * as settingsState from '@/shared/utils/settings/settings-state';
import { DEFAULT_GESTURES } from '@/shared/utils/settings/settings-types';
import { scrollUpAction } from '@/content/gestures/actions/events/scroll_up_action';
import { scrollDownAction } from '@/content/gestures/actions/events/scroll_down_action';
import { backAction } from '@/content/gestures/actions/events/back_action';
import { forwardAction } from '@/content/gestures/actions/events/forward_action';
import { previousTabAction } from '@/content/gestures/actions/events/previous_tab_action';
import { nextTabAction } from '@/content/gestures/actions/events/next_tab_action';
import { closeTabAndGoLeftAction } from '@/content/gestures/actions/events/close_tab_and_go_left_action';
import { closeTabAndGoRightAction } from '@/content/gestures/actions/events/close_tab_and_go_right_action';
import { zoomInAction } from '@/content/gestures/actions/events/zoom_in_action';
import { zoomOutAction } from '@/content/gestures/actions/events/zoom_out_action';
import { newTabAction } from '@/content/gestures/actions/events/new_tab_action';
import { toggleFullscreenAction } from '@/content/gestures/actions/events/toggle_fullscreen_action';
import { scrollToTopAction } from '@/content/gestures/actions/events/scroll_to_top_action';
import { scrollToBottomAction } from '@/content/gestures/actions/events/scroll_to_bottom_action';
import { reloadAction } from '@/content/gestures/actions/events/reload_action';
import { restoreTabAction } from '@/content/gestures/actions/events/restore_tab_action';
import { noopAction } from '@/content/gestures/actions/events/noop_action';

describe('createGestureAction', () => {
  beforeEach(() => {
    // モックをリセット
    vi.clearAllMocks();
    // デフォルトのジェスチャ定義を復元
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue({ ...DEFAULT_GESTURES });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('SCROLL_UPアクションタイプが設定されている場合_scrollUpActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.UP);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(scrollUpAction);
  });

  it('SCROLL_DOWNアクションタイプが設定されている場合_scrollDownActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.DOWN);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(scrollDownAction);
  });

  it('GO_BACKアクションタイプが設定されている場合_backActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.LEFT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(backAction);
  });

  it('GO_FORWARDアクションタイプが設定されている場合_forwardActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.RIGHT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(forwardAction);
  });

  it('PREVIOUS_TABアクションタイプが設定されている場合_previousTabActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.UP);
    trail.add(GestureDirection.LEFT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(previousTabAction);
  });

  it('NEXT_TABアクションタイプが設定されている場合_nextTabActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.UP);
    trail.add(GestureDirection.RIGHT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(nextTabAction);
  });

  it('CLOSE_TAB_AND_GO_LEFTアクションタイプが設定されている場合_closeTabAndGoLeftActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.DOWN);
    trail.add(GestureDirection.LEFT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(closeTabAndGoLeftAction);
  });

  it('CLOSE_TAB_AND_GO_RIGHTアクションタイプが設定されている場合_closeTabAndGoRightActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.DOWN);
    trail.add(GestureDirection.RIGHT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(closeTabAndGoRightAction);
  });

  it('ZOOM_INアクションタイプが設定されている場合_zoomInActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.LEFT);
    trail.add(GestureDirection.UP);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(zoomInAction);
  });

  it('ZOOM_OUTアクションタイプが設定されている場合_zoomOutActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.LEFT);
    trail.add(GestureDirection.DOWN);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(zoomOutAction);
  });

  it('NEW_TABアクションタイプが設定されている場合_newTabActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.RIGHT);
    trail.add(GestureDirection.UP);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(newTabAction);
  });

  it('TOGGLE_FULLSCREENアクションタイプが設定されている場合_toggleFullscreenActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.RIGHT);
    trail.add(GestureDirection.DOWN);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(toggleFullscreenAction);
  });

  it('SCROLL_TO_TOPアクションタイプが設定されている場合_scrollToTopActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.DOWN);
    trail.add(GestureDirection.UP);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(scrollToTopAction);
  });

  it('SCROLL_TO_BOTTOMアクションタイプが設定されている場合_scrollToBottomActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.UP);
    trail.add(GestureDirection.DOWN);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(scrollToBottomAction);
  });

  it('RELOADアクションタイプが設定されている場合_reloadActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.LEFT);
    trail.add(GestureDirection.RIGHT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(reloadAction);
  });

  it('RESTORE_TABアクションタイプが設定されている場合_restoreTabActionが返されること', () => {
    const trail = new DirectionTrail();
    trail.add(GestureDirection.RIGHT);
    trail.add(GestureDirection.LEFT);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(restoreTabAction);
  });

  it.each([
    {
      description: '設定に存在しないジェスチャパスを指定した場合',
      directions: [GestureDirection.UP, GestureDirection.LEFT, GestureDirection.DOWN],
      customGestures: undefined,
      expectedAction: noopAction,
    },
    {
      description: '空のジェスチャパスを指定した場合',
      directions: [],
      customGestures: undefined,
      expectedAction: noopAction,
    },
    {
      description: 'NONEアクションタイプが設定されている場合',
      directions: [GestureDirection.UP, GestureDirection.RIGHT, GestureDirection.DOWN],
      customGestures: {
        ...DEFAULT_GESTURES,
        'URD': GestureActionType.NONE,
      },
      expectedAction: noopAction,
    },
  ])('$description_noopActionが返されること', ({ directions, customGestures, expectedAction }) => {
    if (customGestures) {
      vi.mocked(settingsState.getCurrentGestures).mockReturnValue(customGestures);
    }
    
    const trail = new DirectionTrail();
    directions.forEach(direction => trail.add(direction));
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(expectedAction);
  });

  it('ジェスチャ定義が更新された場合_更新後の定義に基づいてアクションが返されること', () => {
    // カスタムジェスチャ定義を設定
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue({
      ...DEFAULT_GESTURES,
      'UUU': GestureActionType.SCROLL_UP,
    });
    
    const trail = new DirectionTrail();
    trail.add(GestureDirection.UP);
    trail.add(GestureDirection.UP);
    trail.add(GestureDirection.UP);
    
    const action = createGestureAction(trail);
    
    expect(action).toBe(scrollUpAction);
  });

  it('settings.getActionForGestureが正しく呼び出されること', () => {
    const getActionForGestureSpy = vi.spyOn(settings, 'getActionForGesture');
    const trail = new DirectionTrail();
    trail.add(GestureDirection.UP);
    
    createGestureAction(trail);
    
    expect(getActionForGestureSpy).toHaveBeenCalledWith('U');
    expect(getActionForGestureSpy).toHaveBeenCalledTimes(1);
  });
});

