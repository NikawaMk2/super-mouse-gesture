(global as any).window = {
    navigator: {
        clipboard: {
            writeText: jest.fn(),
        },
    },
};
