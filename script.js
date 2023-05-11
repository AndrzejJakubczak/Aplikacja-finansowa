const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const money_plus_euro = document.getElementById('money-plus-euro');
const money_minus_euro = document.getElementById('money-minus-euro');
const balance_eur = document.getElementById('balance-eur');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const currency = document.getElementById('currency');
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Proszę dodać nazwę transakcji i kwotę.');
    } else {
        const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value,
        currency: currency.value
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  if (transaction.currency === 'EUR') {
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}€</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
  } else {
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}zł</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
  }
  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amountsPLN = [];
  const amountsEUR = [];

  transactions.forEach(transaction => {
    if (transaction.currency === 'EUR') {
      amountsEUR.push(transaction.amount);
    } else {
      amountsPLN.push(transaction.amount);
    }
  });

  const totalPLN = amountsPLN.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const totalEUR = amountsEUR.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const incomePLN = amountsPLN
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expensePLN = (
    amountsPLN.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);
  const incomeEUR = amountsEUR
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expenseEUR = (
    amountsEUR.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);
  
  balance.innerText = `${totalPLN} zł`;
  money_plus.innerText = `${incomePLN} zł`;
  money_minus.innerText = `${expensePLN} zł`;
  balance_eur.innerText = `${totalEUR} €`;
  money_plus_euro.innerText = `${incomeEUR} €`;
  money_minus_euro.innerText = `${expenseEUR} €`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener('submit', addTransaction);

// Funkcja aktualizująca wartości przychodów i wydatków po zmianie waluty
function updateCurrency() {
  const selectedCurrency = currency.value;
  if (selectedCurrency === 'EUR') {
    const amountsEUR = transactions
      .filter(transaction => transaction.currency === 'EUR')
      .map(transaction => transaction.amount);

    const totalEUR = amountsEUR.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const incomeEUR = amountsEUR
      .filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const expenseEUR = (
      amountsEUR.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance_eur.innerText = `${totalEUR} €`;
    money_plus_euro.innerText = `${incomeEUR} €`;
    money_minus_euro.innerText = `${expenseEUR} €`;
  } else {
    updateValues();
  }
}

currency.addEventListener('change', updateCurrency);
