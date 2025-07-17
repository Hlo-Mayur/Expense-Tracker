// Expense Tracker JavaScript
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}
function saveHistory() {
    localStorage.setItem('history', JSON.stringify(history));
}

function renderExpensesTable() {
    const tbody = document.getElementById('expenses-table-body');
    const totalCell = document.getElementById('expenses-table-total');
    tbody.innerHTML = '';
    let total = 0;
    expenses.forEach((expense, index) => {
        const subtotal = parseFloat(expense.amount) * parseInt(expense.quantity);
        total += subtotal;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${expense.description}</td>
            <td>₹${subtotal.toFixed(2)}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
    totalCell.textContent = `₹${total.toFixed(2)}`;
}

function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;
    expenses.forEach((expense, index) => {
        const subtotal = parseFloat(expense.amount) * parseInt(expense.quantity);
        const isCredit = expense.type === 'credit';
        total += isCredit ? subtotal : -subtotal;
        const typeLabel = isCredit ? 'Credit' : 'Debit';
        const typeColor = isCredit ? '#22c55e' : '#ef4444';
        const sign = isCredit ? '+' : '-';
        const li = document.createElement('li');
        li.innerHTML = `
            <span><b style="color:${typeColor}">${typeLabel}</b> ${expense.date} - ${expense.description} (x${expense.quantity}): ₹${subtotal.toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
    totalAmount.textContent = total.toFixed(2);
    renderExpensesTable();
}

function deleteExpense(index) {
    const deleted = expenses.splice(index, 1)[0];
    history.push({ ...deleted, action: 'deleted', timestamp: new Date().toISOString() });
    saveExpenses();
    saveHistory();
    renderExpenses();
}

window.deleteExpense = deleteExpense;

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const quantity = document.getElementById('quantity').value;
    const date = document.getElementById('date').value;
    if (!description || !amount || !date || !quantity || !type) return;
    const newExpense = { type, description, amount, quantity, date };
    expenses.push(newExpense);
    history.push({ ...newExpense, action: 'added', timestamp: new Date().toISOString() });
    saveExpenses();
    saveHistory();
    renderExpenses();
    expenseForm.reset();
    document.getElementById('quantity').value = 1;
});

// Initial render
renderExpenses(); 