import { createSignal, onMount } from 'solid-js';
import { greet, appName } from './lib';
import './App.css';

function App() {
  const [count, setCount] = createSignal(0);
  const [name] = createSignal('SolidJS');

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(0);

  onMount(() => {
    console.log('SolidJS Demo App mounted');
    console.log(greet('World'));
  });

  return (
    <div class="container">
      <div class="card">
        <h1>Welcome to {name()} Demo!</h1>
        <p class="subtitle">
          Modern SolidJS application with fine-grained reactivity
        </p>

        <div class="counter-section">
          <h2>Counter Demo</h2>
          <div class="counter">
            <button onClick={decrement} class="btn btn-decrement">
              -
            </button>
            <span class="count">{count()}</span>
            <button onClick={increment} class="btn btn-increment">
              +
            </button>
          </div>
          <p class="counter-text">Current count: {count()}</p>
          <button onClick={reset} class="btn btn-reset">
            Reset
          </button>
        </div>

        <div class="features">
          <h2>Features</h2>
          <ul>
            <li>✅ SolidJS with fine-grained reactivity</li>
            <li>✅ TypeScript support</li>
            <li>✅ JSX syntax</li>
            <li>✅ Vite for development</li>
            <li>✅ Workspace integration</li>
          </ul>
        </div>

        <div class="workspace-info">
          <h2>Workspace Integration</h2>
          <p>App Name: {appName}</p>
          <p>Message: {greet('SolidJS Developer')}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
