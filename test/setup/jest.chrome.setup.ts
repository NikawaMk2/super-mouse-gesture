let onMessageHandler: ((message: any, sender: any, sendResponse: (response: any) => void) => void) | null = null;
(global as any).chrome = {
  runtime: {
    sendMessage: jest.fn((message: any, callback: (response: any) => void) => {
      if (onMessageHandler) {
        // sender, sendResponseは最低限のモック
        onMessageHandler(message, {}, (response: any) => {
          if (callback) callback(response);
        });
      } else if (callback) {
        callback({});
      }
    }),
    onMessage: {
      addListener: jest.fn((handler: (message: any, sender: any, sendResponse: (response: any) => void) => void) => {
        onMessageHandler = handler;
      }),
      removeListener: jest.fn(() => {
        onMessageHandler = null;
      }),
    },
    lastError: null,
  },
  tabs: {
    create: jest.fn(),
    query: jest.fn(),
    update: jest.fn(),
    duplicate: jest.fn(),
    remove: jest.fn(),
  },
  windows: {
    create: jest.fn(),
    getCurrent: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  sessions: {
    restore: jest.fn(),
  },
}; 