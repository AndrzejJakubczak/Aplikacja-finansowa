const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const currency = document.getElementById('currency');
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Exchange rate from EUR to PLN
const exchangeRateEURtoPLN = 4.5; // Przykładowy kurs wymiany, należy dostosować do rzeczywistych danych

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
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}${transaction.currency}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => {
    if (transaction.currency === 'EUR') {
      return transaction.amount * exchangeRateEURtoPLN;
    } else {
      return transaction.amount;
    }
  });
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);
  balance.innerText = `${total} zł`;
  money_plus.innerText = `${income} zł`;
  money_minus.innerText = `${expense} zł`;
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
      const amountsEUR = transactions.map(transaction => {
        if (transaction.currency === 'EUR') {
          return transaction.amount;
        } else {
          return transaction.amount / exchangeRateEURtoPLN;
        }
      });
      const incomeEUR = amountsEUR
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
      const expenseEUR = (
        amountsEUR.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
      ).toFixed(2);
      money_plus.innerText = `${incomeEUR} €`;
      money_minus.innerText = `${expenseEUR} €`;
    } else {
      updateValues(); // Jeśli nie jest wybrana opcja "EUR", aktualizuj wartości w złotych
    }
  }
  
  // Dodaj nasłuchiwanie na zmianę waluty
  currency.addEventListener('change', updateCurrency);
  