export const TYPES = {
    MessageSender: Symbol.for('MessageSender'),
    ChromeTabOperator: Symbol.for('ChromeTabOperator')
};

const mockGetContentScriptContainer = jest.fn(() => null);
const mockGetBackgroundContainer = jest.fn(() => null);

export default {
    getContentScriptContainer: mockGetContentScriptContainer,
    getBackgroundContainer: mockGetBackgroundContainer
}; 