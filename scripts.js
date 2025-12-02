// -----------------------------
//  SELETORES PRINCIPAIS
// -----------------------------
const addItemButton = document.querySelector(".button-add-task");
const input = document.querySelector(".input-task");
const ul = document.querySelector(".list-tasks");

// Array de tarefas
let tasks = [];

// filtro all | active | completed
let currentFilter = "all";

// índice da tarefa que está sendo editada (null = não editando)
let editingIndex = null;

// -----------------------------
//  EXIBIR TAREFAS NA TELA
// -----------------------------
function showTasks() {
  ul.innerHTML = ""; // limpa lista antes de renderizar

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  filteredTasks.forEach((item) => {
    // pega o índice real no array principal
    const index = tasks.indexOf(item);

    const li = document.createElement("li");
    li.className = item.completed ? "task done" : "task";

    // Texto da tarefa
    const p = document.createElement("p");
    p.textContent = item.task;
    p.className = "task-text";

    // Botão concluir
    const checkBtn = document.createElement("img");
    checkBtn.src = "./img/check.png";
    checkBtn.alt = "Concluir";
    checkBtn.className = "icon-check";
    checkBtn.addEventListener("click", () => completeTask(index));

    // Botão editar
    const editBtn = document.createElement("img");
    editBtn.src = "./img/editar.png";
    editBtn.alt = "Editar";
    editBtn.className = "icon-edit";
    editBtn.addEventListener("click", () => editTask(index));

    // Botão deletar
    const deleteBtn = document.createElement("img");
    deleteBtn.src = "./img/delete.png";
    deleteBtn.alt = "Remover";
    deleteBtn.className = "icon-delete";
    deleteBtn.addEventListener("click", () => deleteTask(index));

    // Montar estrutura
    li.appendChild(checkBtn);
    li.appendChild(p);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    ul.appendChild(li);
  });

  updateCounter();
}

// -----------------------------
//  ADICIONAR / SALVAR TAREFA
// -----------------------------
function addNewTask() {
  const text = input.value.trim();
  if (text === "") return;

  // Se estiver editando uma tarefa existente
  if (editingIndex !== null) {
    tasks[editingIndex].task = text;
    editingIndex = null; // volta ao modo "adicionar"
    addItemButton.textContent = "Add";
  } else {
    // Modo normal: adicionar nova tarefa
    tasks.push({
      task: text,
      completed: false,
    });
  }

  input.value = "";
  showTasks();
}

// -----------------------------
//  MARCAR COMO CONCLUÍDA
// -----------------------------
function completeTask(index) {
  tasks[index].completed = !tasks[index].completed;
  showTasks();
}

// -----------------------------
//  DELETAR TAREFA
// -----------------------------
function deleteTask(index) {
  tasks.splice(index, 1);

  // Se deletar a tarefa que estava sendo editada, reseta o estado
  if (editingIndex === index) {
    editingIndex = null;
    addItemButton.textContent = "Add";
    input.value = "";
  }

  showTasks();
}

// -----------------------------
//  EDITAR TAREFA 
// -----------------------------
function editTask(index) {
  const task = tasks[index];

  input.value = task.task;           // coloca o texto no input
  input.focus();                     // foca no input
  editingIndex = index;              // guarda qual tarefa está sendo editada
  addItemButton.textContent = "✅ Save edit"; // feedback visual
}

// -----------------------------
//  CONTADOR
// -----------------------------
function updateCounter() {
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  document.querySelector(".count-active").textContent = activeCount;
  document.querySelector(".count-completed").textContent = completedCount;
}

// -----------------------------
//  EVENTO DO BOTÃO
// -----------------------------
addItemButton.addEventListener("click", addNewTask);

// (opcional) adicionar com Enter no input
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNewTask();
  }
});

// -----------------------------
//  FILTROS
// -----------------------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.getAttribute("data-filter");

    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    showTasks();
  });
});

// -----------------------------
//  Claro ou Escuro
// -----------------------------
const themeToggle = document.querySelector(".theme-toggle");

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";

  localStorage.setItem("theme", theme);
});

loadTheme();

// -----------------------------
//  RELOGIO
// -----------------------------
function updateClock() {
  const now = new Date();

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  document.querySelector(".clock").textContent =
    now.toLocaleDateString("pt-PT", options);
}

setInterval(updateClock, 1000);
updateClock();

// -----------------------------
//  Frases Motivacionais (API)
// -----------------------------
function loadQuote() {
  const quoteText = document.querySelector(".quote");

  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => {
      quoteText.textContent = `"${data.slip.advice}"`;
    })
    .catch((error) => {
      console.log(error);
      quoteText.textContent = "Não foi possível carregar a frase 😔";
    });
}

document.getElementById("new-quote").addEventListener("click", loadQuote);
console.log("new-quote");
console.log("loadQuote");

loadQuote();