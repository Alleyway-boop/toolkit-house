<script lang="ts">
  import { onMount } from 'svelte';

  let count = 0;
  let name = 'Svelte';

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }

  onMount(() => {
    console.log('Svelte Demo App mounted');
  });
</script>

<svelte:head>
  <title>Svelte Demo - Home</title>
</svelte:head>

<main>
  <div class="container">
    <h1>Welcome to {name} Demo!</h1>
    <p class="subtitle">Modern Svelte 5 application with TypeScript</p>

    <div class="counter-section">
      <h2>Counter Demo</h2>
      <div class="counter">
        <button on:click={decrement} class="btn btn-decrement">-</button>
        <span class="count">{count}</span>
        <button on:click={increment} class="btn btn-increment">+</button>
      </div>
      <p class="counter-text">Current count: {count}</p>
    </div>

    <div class="features">
      <h2>Features</h2>
      <ul>
        <li>✅ Svelte 5 with latest syntax</li>
        <li>✅ TypeScript support</li>
        <li>✅ SvelteKit for routing</li>
        <li>✅ Vite for development</li>
        <li>✅ Workspace integration</li>
      </ul>
    </div>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .subtitle {
    text-align: center;
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 3rem;
  }

  .counter-section {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
  }

  .counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .btn {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-increment {
    background: #4CAF50;
    color: white;
  }

  .btn-increment:hover {
    background: #45a049;
    transform: scale(1.05);
  }

  .btn-decrement {
    background: #f44336;
    color: white;
  }

  .btn-decrement:hover {
    background: #da190b;
    transform: scale(1.05);
  }

  .count {
    font-size: 2rem;
    font-weight: bold;
    min-width: 50px;
    text-align: center;
  }

  .counter-text {
    text-align: center;
    margin-top: 1rem;
    opacity: 0.8;
  }

  .features {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .features ul {
    list-style: none;
    padding: 0;
  }

  .features li {
    margin: 0.5rem 0;
    padding: 0.5rem 0;
  }
</style>