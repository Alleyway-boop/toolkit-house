import { createSignal } from 'solid-js';

export const name = 'solidjs-demo';
export const version = '1.0.0';

export function greet(name: string): string {
  return `Hello, ${name}! This is ${appName}`;
}

export const appName = 'SolidJS Demo App';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function createCounter(initial = 0, step = 1) {
  const [count, setCount] = createSignal(initial);

  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => c - step);
  const reset = () => setCount(initial);

  return {
    count,
    increment,
    decrement,
    reset,
  };
}
