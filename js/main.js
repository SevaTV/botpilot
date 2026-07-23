import { checkBalance, getOpenOrders } from './api.js';

document.getElementById('save-settings').addEventListener('click', async () => {
    const exchange = document.getElementById('exchange-select').value;
    const apiKey = document.getElementById('api-key').value;
    const secretKey = document.getElementById('secret-key').value;

    if (!apiKey || !secretKey) {
        alert('Заповніть API Key та Secret Key');
        return;
    }

    const statusEl = document.getElementById('connection-status');
    const balanceEl = document.getElementById('balance-container');

    statusEl.textContent = 'Підключення...';
    balanceEl.textContent = 'Отримання даних...';

    try {
        const balance = await checkBalance(exchange, apiKey, secretKey);
        balanceEl.innerHTML = `<pre>${JSON.stringify(balance, null, 2)}</pre>`;
        statusEl.textContent = 'Підключено';
        statusEl.style.color = 'var(--success-color)';
    } catch (error) {
        balanceEl.textContent = `Помилка: ${error.message}`;
        statusEl.textContent = 'Помилка підключення';
        statusEl.style.color = 'var(--danger-color)';
    }
});
