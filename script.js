
const btnAddCategory = document.querySelector(".btn__add-category");
const btnAddExpense = document.querySelector(".btn__add-expense");
const searchExpense = document.querySelector(".search__expense");
const addCategory = document.querySelector(".add__category");
const categoryOverlay = document.querySelector(".category__overlay");
const addExpense = document.querySelector(".add__expense");
const expenseOverlay = document.querySelector(".expense__overlay");
const closeIcon = document.querySelector(".expense__close--icon");
const expenseList = document.querySelector(".expense__list");
const expenseTotal = document.querySelector(".total__expense--value");

const form = document.querySelector(".form__add--expense");
const expenseName = document.querySelector(".name-input");
const amount = document.querySelector(".amount-input");
const date = document.querySelector(".date-input");
const category = document.querySelector(".category-select");
const inputs = document.querySelectorAll(".expense-input");
const errors = document.querySelectorAll(".error__text");
const errorName = document.querySelector(".error__text--name");
const errorAmount = document.querySelector(".error__text--amount");
const errorDate = document.querySelector(".error__text--date");
const errorCategory = document.querySelector(".error__text--category");
const btnSubmitExpense = document.querySelector(".btn__submit-expense");

const addCategoryForm = document.querySelector(".form__category--add");
const categoryInput = document.getElementById("category");
const errorNewCategory = document.querySelector(".error-new-category");
const pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
const numberPattern = /^[0-9]+$/;
const datePattern = /^(0?[1-9]|[12][0-9]|3[01])[-](0?[1-9]|1[0-2])[-]\d{4}$/;
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
console.log(expenses);
console.log(categories);
// localStorage.removeItem("expenses");
let totalAmount = 0;
let formattedDate = "";

const closeExpense = function () {
  document.querySelector(".expense__overlay").classList.remove("overlay__show");
  addExpense.classList.remove("add__expense--show");
};

const hideCategoryForm = function () {
  document
    .querySelector(".category__overlay")
    .classList.remove("overlay__show");
  addCategory.classList.remove("add__category--show");
};

function showCategorySelect() {
  category.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "Please select your category";
  category.appendChild(defaultOption);

  //add all category in select option
  categories.forEach(function (cat) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    category.appendChild(option);
  });
}
showCategorySelect();

// save Category in local Storage
function saveCategory(category) {
  categories.push(category);
  localStorage.setItem("categories", JSON.stringify(categories));
}
// save expense in local storage
function saveExpense(expense) {
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

//display expenses
function displayExpenses() {
  expenseList.innerHTML = "";
  totalAmount = 0;

  if (expenses.length === 0) {
    const row = document.createElement("tr");
    row.classList.add("no-expense");
    row.innerHTML = "<td>No Expense</td>";
    expenseList.appendChild(row);
    expenseTotal.innerHTML = `₹0`;
    return;
  }

  expenses.forEach(function (ex, i) {
    const row = document.createElement("tr");
    row.classList.add("expense__row", `expense__row--${i}`);
    row.dataset.expense = i;
    totalAmount += Number(ex.amount);
    row.innerHTML = `
            <td class='expense__item'>${ex.name}</td>
            <td class='expense__item'>₹${ex.amount}</td>
            <td class='expense__item'>${ex.date}</td>
            <td class='expense__item'>${ex.category}</td>
            <td class='edit-icon expense__item'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          </td>
            <td class='delete-icon expense__item'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          </td>
        `;
    expenseList.insertBefore(row, expenseList.firstChild);
    expenseTotal.innerHTML = `₹${totalAmount}`;
  });
}
displayExpenses();

// Delete Expense
function setDeleteIcons() {
  const deleteExpense = document.querySelectorAll(".delete-icon");

  deleteExpense.forEach((delBtn, i) => {
    delBtn.addEventListener("click", function (e) {
      const dataExpense = e.target.closest(".expense__row").dataset.expense;
      if (confirm("Are you sure you want to delete this expense?")) {
        expenses.splice(dataExpense, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        displayExpenses();
        setDeleteIcons();
        setEditIcons();
      }
    });
  });
}
setDeleteIcons();

//edit expense

function setEditIcons() {
  const editExpense = document.querySelectorAll(".edit-icon");

  editExpense.forEach((editBtn, i) => {
    editBtn.addEventListener("click", function (e) {
      const dataExpense = e.target.closest(".expense__row").dataset.expense;
      const expenseToEdit = expenses[dataExpense];
      expenseName.value = expenseToEdit.name;
      amount.value = expenseToEdit.amount;
      const dateParts = expenseToEdit.date.split("-");
      formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      date.value = formattedDate;
      category.value = expenseToEdit.category;

      document.querySelector(".expense__title").textContent =
        "Edit Expense here";
      btnSubmitExpense.textContent = "Edit Expense";

      document
        .querySelector(".expense__overlay")
        .classList.add("overlay__show");
      addExpense.classList.add("add__expense--show");

      form.removeEventListener("submit", handleAddExpenseSubmit);
      form.removeEventListener("submit", handleEditExpenseSubmit);

      form.addEventListener("submit", function (e) {
        handleEditExpenseSubmit(e, dataExpense);
        location.reload();
      });
    });
  });
}

function handleEditExpenseSubmit(e, dataExpense) {
  e.preventDefault();
  clearErrors();
  validateName();
  validateAmount();
  validateDate();
  validateCategory();
  console.log("edit expense");

  const hasError = document.querySelector(".error:not(.hidden)");

  if (!hasError) {
    const updatedExpense = {
      name: expenseName.value,
      amount: amount.value,
      date: formattedDate,
      category: category.value,
    };
    expenses[dataExpense] = updatedExpense;
    localStorage.setItem("expenses", JSON.stringify(expenses));

    closeExpense();

    document.querySelector(".expense__title").textContent =
      "Enter your expense here";
    btnSubmitExpense.textContent = "Add Expense";

    displayExpenses();
    setEditIcons();
    setDeleteIcons();
    form.removeEventListener("submit", handleEditExpenseSubmit);
  }
}

setEditIcons();

//Search expense

searchExpense.addEventListener("input", function () {
  const search = searchExpense.value.toLowerCase().trim();
  const filterExpense = expenses.filter((expense) => {
    return (
      expense.name.toLowerCase().includes(search) ||
      expense.category.toLowerCase().includes(search)
    );
  });
  displaySearchExpense(filterExpense);
});

function displaySearchExpense(filterExpense) {
  expenseList.innerHTML = "";
  totalAmount = 0;
  // console.log(filterExpense);

  if (filterExpense.length === 0) {
    const row = document.createElement("tr");
    row.classList.add("no-expense");
    row.innerHTML = "<td>No matching expenses</td>";
    expenseList.appendChild(row);
    expenseTotal.innerHTML = `₹0`;
    return;
  }

  filterExpense.forEach(function (ex, i) {
    const row = document.createElement("tr");
    row.classList.add("expense__row", `expense__row--${i}`);
    row.dataset.expense = i;
    totalAmount += Number(ex.amount);
    row.innerHTML = `
            <td class='expense__item'>${ex.name}</td>
            <td class='expense__item'>₹${ex.amount}</td>
            <td class='expense__item'>${ex.date}</td>
            <td class='expense__item'>${ex.category}</td>
            <td class='edit-icon expense__item'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          </td>
            <td class='delete-icon expense__item'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>  
          </td>
        `;
    expenseList.insertBefore(row, expenseList.firstChild);
    expenseTotal.innerHTML = `₹${totalAmount}`;
    setDeleteIcons();
    setEditIcons();
  });
}

// Validation Expnese form

function clearInput() {
  expenseName.value = "";
  amount.value = "";
  category.value = "default";
  date.value = "";
}

function clearErrors() {
  errors.forEach((item) => item.classList.add("hidden"));
  inputs.forEach((item) => item.classList.remove("error"));
}

function validateName() {
  if (!expenseName.value.match(pattern) && expenseName.value.length == 0) {
    expenseName.classList.add("error");
    errorName.classList.remove("hidden");
    formIsValid = false;
  } else {
    errorName.classList.add("hidden");
    expenseName.classList.remove("error");
  }
}
expenseName.addEventListener("input", function () {
  if (expenseName.classList.contains("error")) {
    validateName();
  }
});

function validateAmount() {
  if (!amount.value.match(numberPattern)) {
    amount.classList.add("error");
    errorAmount.classList.remove("hidden");
    formIsValid = false;
  } else {
    errorAmount.classList.add("hidden");
    amount.classList.remove("error");
  }
}
amount.addEventListener("input", function () {
  if (amount.classList.contains("error")) {
    validateAmount();
  }
});

function validateDate() {
  const Date = date.value;
  const parts = Date.split("-");
  formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  if (!formattedDate.match(datePattern)) {
    date.classList.add("error");
    errorDate.classList.remove("hidden");
    formIsValid = false;
  } else {
    errorDate.classList.add("hidden");
    date.classList.remove("error");
  }
}
date.addEventListener("input", function () {
  if (date.classList.contains("error")) {
    validateDate();
  }
});
function validateCategory() {
  if (category.value === "default") {
    category.classList.add("error");
    errorCategory.classList.remove("hidden");
    formIsValid = false;
  } else {
    errorCategory.classList.add("hidden");
    category.classList.remove("error");
  }
}
category.addEventListener("change", function () {
  if (category.classList.contains("error")) {
    validateCategory();
  }
});

function handleAddExpenseSubmit(e) {
  e.preventDefault();
  clearErrors();

  validateName();
  validateAmount();
  validateDate();
  validateCategory();
  console.log("add new expense");

  const hasError = document.querySelector(".error:not(.hidden)");

  if (!hasError) {
    let formattedDate = `${date.value.split("-")[2]}-${
      date.value.split("-")[1]
    }-${date.value.split("-")[0]}`;

    const expense = {
      name: expenseName.value,
      amount: amount.value,
      date: formattedDate,
      category: category.value,
    };
    saveExpense(expense);
    closeExpense();
    form.reset();
    clearErrors();
    displayExpenses();
    setEditIcons();
    setDeleteIcons();

    // form.removeEventListener("submit", handleEditExpenseSubmit);
    // form.addEventListener("submit", handleAddExpenseSubmit);
  }
}

// validation catogory form

addCategoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newCategory = categoryInput.value.trim();
  if (newCategory === "") {
    categoryInput.classList.add("error");
    errorNewCategory.classList.remove("hidden");
  } else {
    saveCategory(newCategory);
    categoryInput.value = "";
    errorNewCategory.classList.add("hidden");
    hideCategoryForm();
    alert("Category added successfully");
  }
});

btnAddCategory.addEventListener("click", function () {
  document.querySelector(".category__overlay").classList.add("overlay__show");
  addCategory.classList.add("add__category--show");
});
categoryOverlay.addEventListener("click", function (e) {
  const clicked = e.target.closest(".add__category");
  if (!clicked) {
    hideCategoryForm();
  }
});

btnAddExpense.addEventListener("click", function () {
  document.querySelector(".expense__overlay").classList.add("overlay__show");
  addExpense.classList.add("add__expense--show");
  document.querySelector(".expense__title").textContent =
    "Enter your expense here";
  btnSubmitExpense.textContent = "Add Expense";
  showCategorySelect();
  form.reset();
  clearErrors();

  form.removeEventListener("submit", handleEditExpenseSubmit);
  form.addEventListener("submit", handleAddExpenseSubmit);
});
expenseOverlay.addEventListener("click", function (e) {
  const clicked = e.target.closest(".add__expense");
  if (!clicked) {
    closeExpense();
  }
});
closeIcon.addEventListener("click", () => {
  closeExpense();
});
