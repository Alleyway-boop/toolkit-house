export const name = 'svelte-demo';
export const version = '1.0.0';

export function greet(name: string): string {
  return `Hello, ${name}! This is ${appName}`;
}

export const appName = 'Svelte Demo App';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export interface CounterProps {
  initial?: number;
  step?: number;
}

export function createCounter(options: CounterProps = {}) {
  const { initial = 0, step = 1 } = options;

  let count = $state(initial);

  const increment = () => (count += step);
  const decrement = () => (count -= step);
  const reset = () => (count = initial);

  return {
    get count() {
      return count;
    },
    set count(value: number) {
      count = value;
    },
    increment,
    decrement,
    reset,
  };
}
