import '@testing-library/jest-dom';

// Mock import.meta.env for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
  },
  writable: true,
});
