import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom no implementa scrollTo ni print: los reemplazamos por funciones espía
beforeEach(() => {
  localStorage.clear();
  window.scrollTo = vi.fn();
  window.print = vi.fn();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
