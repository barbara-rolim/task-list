// Seletores principais (de acordo com SEU HTML)
const addItemButton = document.querySelector(".button-add-task");
const input = document.querySelector(".input-task");
const ul = document.querySelector(".list-tasks");

// Array de tarefas
let tasks = [];

// filtro all | active | completed
let currentFilter = "all";

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

  filteredTasks.forEach((item, index) => {
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

    // Botão deletar
    const deleteBtn = document.createElement("img");
    deleteBtn.src = "./img/delete.png";
    deleteBtn.alt = "Remover";
    deleteBtn.className = "icon-delete";
    deleteBtn.addEventListener("click", () => deleteTask(index));

    // Montar estrutura
    li.appendChild(checkBtn);
    li.appendChild(p);
    li.appendChild(deleteBtn);

    ul.appendChild(li);

    updateCounter();
  });
}

// -----------------------------
//  ADICIONAR TAREFA
// -----------------------------
function addNewTask() {
  const text = input.value.trim();
  if (text === "") return;

  tasks.push({
    task: text,
    completed: false,
  });

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
  showTasks();
}

// -----------------------------
//  Contador
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

// -----------------------------
//  FILTROS
// -----------------------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Define o filtro atual
    currentFilter = btn.getAttribute("data-filter");

    // Remove active dos outros botões
    filterButtons.forEach((b) => b.classList.remove("active"));

    // Adiciona active no clicado
    btn.classList.add("active");

    // Atualiza a lista conforme o filtro
    showTasks();
  });
});

// -----------------------------
//  Claro ou Escuro
// -----------------------------

const themeToggle = document.querySelector(".theme-toggle");

// Carrega o tema salvo
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
        second: "2-digit"
    };

    document.querySelector(".clock").textContent =
        now.toLocaleDateString("pt-PT", options);
}

// Atualizar a cada 1 segundo
setInterval(updateClock, 1000);

// Mostrar imediatamente ao carregar
updateClock();


// -----------------------------
//  RECARREGAR AO ABRIR A PÁGINA
// -----------------------------
loadTasks();