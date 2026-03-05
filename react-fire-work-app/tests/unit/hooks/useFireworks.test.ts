import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFireworks } from '../../../src/hooks/useFireworks';

function createContainerRef() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const ref = { current: container };
  return { ref, container };
}

describe('useFireworks', () => {
  it('launch() appends a rocket <div> to the container', () => {
    const { ref, container } = createContainerRef();
    const { result, unmount } = renderHook(() => useFireworks(ref));

    result.current.launch(200, 200);

    expect(container.querySelector('[data-rocket]')).toBeTruthy();

    unmount();
    container.remove();
  });

  it('clear() removes all child elements from the container', () => {
    const { ref, container } = createContainerRef();
    const { result, unmount } = renderHook(() => useFireworks(ref));

    result.current.launch(200, 200);
    expect(container.children.length).toBeGreaterThan(0);

    result.current.clear();
    expect(container.children.length).toBe(0);

    unmount();
    container.remove();
  });

  it('multiple launch() calls add multiple rockets', () => {
    const { ref, container } = createContainerRef();
    const { result, unmount } = renderHook(() => useFireworks(ref));

    result.current.launch(100, 200);
    result.current.launch(300, 200);
    result.current.launch(500, 200);

    expect(container.querySelectorAll('[data-rocket]').length).toBe(3);

    unmount();
    container.remove();
  });

  it('clear() is idempotent — safe to call multiple times', () => {
    const { ref, container } = createContainerRef();
    const { result, unmount } = renderHook(() => useFireworks(ref));

    result.current.launch(200, 200);
    result.current.clear();
    expect(() => result.current.clear()).not.toThrow();
    expect(container.children.length).toBe(0);

    unmount();
    container.remove();
  });
});
