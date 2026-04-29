// Mock expo and react-native modules
jest.mock('expo', () => ({
  Constants: {
    manifest: {
      extra: {},
    },
  },
  // Add other expo modules as needed
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      ...RN.Platform,
      select: (obj) => obj.default,
    },
  };
});

// Mock expo-constants if used directly
jest.mock('expo-constants', () => ({
  manifest: {
    extra: {},
  },
}));