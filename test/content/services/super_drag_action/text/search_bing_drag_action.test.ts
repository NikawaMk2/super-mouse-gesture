/**
 * @jest-environment jsdom
 */
import { SearchBingDragAction } from '../../../../../src/content/services/super_drag_action/text/search_bing_drag_action';

const openMock = jest.fn();
const loggerDebugMock = jest.fn();
const loggerWarnMock = jest.fn();
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: (...args: any[]) => loggerDebugMock(...args),
        warn: (...args: any[]) => loggerWarnMock(...args),
    },
}));

describe('SearchBingDragAction', () => {
    beforeAll(() => {
        // @ts-ignore
        global.window.open = openMock;
    });
    beforeEach(() => {
        openMock.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
    });

    it('executeでBing検索URLでwindow.openが呼ばれること', async () => {
        const action = new SearchBingDragAction();
        await action.execute({
            type: 'text',
            direction: 'right',
            actionName: 'searchBing',
            params: { text: 'テスト' },
        });
        expect(openMock).toHaveBeenCalledWith('https://www.bing.com/search?q=%E3%83%86%E3%82%B9%E3%83%88', '_blank');
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('text未指定時はwindow.openされず警告ログが出ること', async () => {
        const action = new SearchBingDragAction();
        await action.execute({
            type: 'text',
            direction: 'right',
            actionName: 'searchBing',
            params: {},
        });
        expect(openMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 