import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <h1>Vite Template</h1>
  <p>You're ready to build with Vite.</p>
  <button id="count">Count: 0</button>
`;

const button = document.querySelector('#count');
let count = 0;
button.addEventListener('click', () => {
  count += 1;
  button.textContent = `Count: ${count}`;
});

