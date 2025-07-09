import { vi } from 'vitest';

// Mock fetch globally for all tests
Object.defineProperty(window, 'fetch', {
  value: vi.fn(),
  writable: true,
});

// Mock location for tests that need it
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    assign: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});