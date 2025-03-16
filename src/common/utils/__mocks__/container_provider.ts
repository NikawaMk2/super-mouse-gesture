import { Container } from 'inversify';

export const TYPES = {
    MessageSender: Symbol.for('MessageSender')
};

const mockGetContentScriptContainer = jest.fn(() => null);
const mockGetBackgroundContainer = jest.fn(() => null);

export default {
    getContentScriptContainer: mockGetContentScriptContainer,
    getBackgroundContainer: mockGetBackgroundContainer
}; 