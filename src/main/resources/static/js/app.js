const container = document.getElementById("employee-list-container");
const form = document.getElementById("employee-form");
const formContainer = document.getElementById("form-container");
const formTitle = document.getElementById("form-title");

const idField = document.getElementById("employee-id");
const firstNameField = document.getElementById("first-name");
const lastNameField = document.getElementById("last-name");
const emailField = document.getElementById("email");
const departmentField = document.getElementById("department");
const roleField = document.getElementById("role");
const cancelBtn = document.getElementById("cancel-btn");

let currentSearch = "";
let currentFilters = { name: "", department: "", role: "" };
let currentSort = "";
let currentPage = 1;
let itemsPerPage = 10;

function renderEmployees(employees) {
  container.innerHTML = "";
  employees.forEach(emp => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.setAttribute("data-id", emp.id);

    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <button class="edit-btn" data-id="${emp.id}">Edit</button>
      <button class="delete-btn" data-id="${emp.id}">Delete</button>
    `;

    container.appendChild(card);
  });

  attachDeleteListeners();
  attachEditListeners();
}

function renderPaginationControls(totalPages) {
  const container = document.getElementById("pagination-controls");
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderAll();
    });
    container.appendChild(btn);
  }
}

function applyFiltersAndSearch(data) {
  return data.filter(emp => {
    const nameMatch = emp.firstName.toLowerCase().includes(currentFilters.name.toLowerCase());
    const deptMatch = emp.department.toLowerCase().includes(currentFilters.department.toLowerCase());
    const roleMatch = emp.role.toLowerCase().includes(currentFilters.role.toLowerCase());
    const searchMatch = (
      emp.firstName.toLowerCase().includes(currentSearch.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(currentSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(currentSearch.toLowerCase())
    );
    return nameMatch && deptMatch && roleMatch && searchMatch;
  });
}

function applySort(data) {
  if (currentSort === "firstName") {
    return [...data].sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (currentSort === "department") {
    return [...data].sort((a, b) => a.department.localeCompare(b.department));
  }
  return data;
}

function renderAll() {
  let result = applyFiltersAndSearch(mockEmployees);
  result = applySort(result);

  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = result.slice(start, start + itemsPerPage);

  renderEmployees(paginated);
  renderPaginationControls(totalPages);
}

function attachDeleteListeners() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees.splice(index, 1);
        renderAll();
      }
    });
  });
}

function attachEditListeners() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      openEditForm(id);
    });
  });
}

function openEditForm(id) {
  const emp = mockEmployees.find(e => e.id === id);
  if (!emp) return;
  formTitle.innerText = "Edit Employee";
  formContainer.style.display = "block";
  idField.value = emp.id;
  firstNameField.value = emp.firstName;
  lastNameField.value = emp.lastName;
  emailField.value = emp.email;
  departmentField.value = emp.department;
  roleField.value = emp.role;
}

function openAddForm() {
  formTitle.innerText = "Add Employee";
  formContainer.style.display = "block";
  form.reset();
  idField.value = "";
}

function closeForm() {
  formContainer.style.display = "none";
  form.reset();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const id = idField.value ? parseInt(idField.value) : Date.now();
  const newEmployee = {
    id,
    firstName: firstNameField.value.trim(),
    lastName: lastNameField.value.trim(),
    email: emailField.value.trim(),
    department: departmentField.value.trim(),
    role: roleField.value.trim(),
  };

  if (!validateEmployee(newEmployee)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const index = mockEmployees.findIndex(e => e.id === id);
  if (index !== -1) {
    mockEmployees[index] = newEmployee;
  } else {
    mockEmployees.push(newEmployee);
  }

  closeForm();
  renderAll();
});

function validateEmployee(emp) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    emp.firstName &&
    emp.lastName &&
    emailPattern.test(emp.email) &&
    emp.department &&
    emp.role
  );
}

cancelBtn.addEventListener("click", () => {
  closeForm();
});

// Filter, Search, Sort, Pagination Handlers
document.getElementById("search-input").addEventListener("input", e => {
  currentSearch = e.target.value.trim();
  renderAll();
});

document.getElementById("apply-filter-btn").addEventListener("click", () => {
  currentFilters.name = document.getElementById("filter-name").value.trim();
  currentFilters.department = document.getElementById("filter-department").value.trim();
  currentFilters.role = document.getElementById("filter-role").value.trim();
  renderAll();
});

document.getElementById("clear-filter-btn").addEventListener("click", () => {
  currentFilters = { name: "", department: "", role: "" };
  document.getElementById("filter-name").value = "";
  document.getElementById("filter-department").value = "";
  document.getElementById("filter-role").value = "";
  renderAll();
});

document.getElementById("sort-select").addEventListener("change", e => {
  currentSort = e.target.value;
  renderAll();
});

document.getElementById("items-per-page").addEventListener("change", e => {
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderAll();
});

renderAll();
