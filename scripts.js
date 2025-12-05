// -----------------------------
//  SELETORES PRINCIPAIS
// -----------------------------
const addItemButton = document.querySelector(".button-add-task"); // Seleciona o botão "Add"
const input = document.querySelector(".input-task"); // Seleciona o campo de input
const ul = document.querySelector(".list-tasks"); // Seleciona a lista onde os <li> serão adicionados

// Array que guarda TODAS as tarefas como objetos
let tasks = []; // Ex: {task: "Comprar pão", completed: false}

// Filtro atual (all, active ou completed)
let currentFilter = "all";

// Índice da tarefa que está sendo editada (se for null, não está editando)
let editingIndex = null;

// -----------------------------
//  EXIBIR TAREFAS NA TELA
// -----------------------------
function showTasks() {
  ul.innerHTML = ""; // limpa a lista antes de redesenhar

  let filteredTasks = tasks; // inicialmente, mostra todas

  // Se o filtro for "active", mostra apenas tarefas não completadas
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);

    // Se o filtro for "completed", mostra apenas tarefas concluídas
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  // Percorre cada tarefa que será exibida
  filteredTasks.forEach((item) => {
    // Encontra o índice REAL da tarefa no array principal
    const index = tasks.indexOf(item);

    // Cria o elemento <li> para representar a tarefa
    const li = document.createElement("li");
    li.className = item.completed ? "task done" : "task";
    // Se completed = true → aplica "task done"
    // Senão → aplica apenas "task"

    // ------------------------------
    // Texto da tarefa
    // ------------------------------
    const p = document.createElement("p");
    p.textContent = item.task; // texto da tarefa
    p.className = "task-text"; // classe para estilização

    // ------------------------------
    // Botão concluir
    // ------------------------------
    const checkBtn = document.createElement("img");
    checkBtn.src = "./img/check.png";
    checkBtn.alt = "Concluir";
    checkBtn.className = "icon-check";
    checkBtn.addEventListener("click", () => completeTask(index));
    // Quando clicar, chama completeTask(index)

    // ------------------------------
    // Botão editar
    // ------------------------------
    const editBtn = document.createElement("img");
    editBtn.src = "./img/editar.png";
    editBtn.alt = "Editar";
    editBtn.className = "icon-edit";
    editBtn.addEventListener("click", () => editTask(index));
    // Quando clicar, chama editTask(index)

    // ------------------------------
    // Botão deletar
    // ------------------------------
    const deleteBtn = document.createElement("img");
    deleteBtn.src = "./img/delete.png";
    deleteBtn.alt = "Remover";
    deleteBtn.className = "icon-delete";
    deleteBtn.addEventListener("click", () => deleteTask(index));
    // Quando clicar, chama deleteTask(index)

    // ------------------------------
    // Monta a estrutura do <li>
    // ------------------------------
    li.appendChild(checkBtn);
    li.appendChild(p);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // Adiciona o <li> dentro da <ul>
    ul.appendChild(li);
  });

  // Atualiza o contador de tarefas
  updateCounter();
}

// -----------------------------
//  ADICIONAR / SALVAR TAREFA
// -----------------------------
function addNewTask() {
  const text = input.value.trim(); // remove espaços extras

  // Se estiver editando uma tarefa EXISTENTE
  if (editingIndex !== null) {
    // Atualiza o texto da tarefa
    tasks[editingIndex].task = text;

    // Sai do modo edição
    editingIndex = null;

    // Volta o texto do botão para "Add"
    addItemButton.textContent = "Add";
  } else {
    // Se não estiver editando, adiciona nova tarefa
    tasks.push({
      task: text, // texto digitado
      completed: false, // começa como não concluída
    });
  }

  // Limpa o input depois da ação
  input.value = "";

  // Atualiza a lista na tela
  showTasks();
}

// -----------------------------
//  MARCAR COMO CONCLUÍDA
// -----------------------------
function completeTask(index) {
  // Troca completed: se era false vira true, e vice-versa
  tasks[index].completed = !tasks[index].completed;

  // Atualiza a lista na tela
  showTasks();
}

// -----------------------------
//  EDITAR TAREFA
// -----------------------------
function editTask(index) {
  const task = tasks[index]; // pega a tarefa correspondente

  input.value = task.task; // coloca o texto no input
  input.focus(); // coloca o cursor no input

  editingIndex = index; // salva qual tarefa está sendo editada

  addItemButton.textContent = "✅ Save edit"; // muda o texto do botão
}
// -----------------------------
//  DELETAR TAREFA
// -----------------------------
function deleteTask(index) {
  // Remove 1 item do array tasks na posição indicada por "index"
  // Exemplo: splice(2,1) remove a tarefa de índice 2
  tasks.splice(index, 1);

  // Se a tarefa deletada era justamente a que estava sendo editada:
  if (editingIndex === index) {
    // Sai do modo de edição
    editingIndex = null;

    // Volta o texto do botão para "Add"
    addItemButton.textContent = "Add";

    // Limpa o input, já que a tarefa que estava nele foi deletada
    input.value = "";
  }

  // Atualiza a lista na tela para refletir a remoção
  showTasks();
}

// -----------------------------
//  CONTADOR
// -----------------------------
function updateCounter() {
  // Conta quantas tarefas NÃO estão concluídas (ativas)
  const activeCount = tasks.filter((t) => !t.completed).length;

  // Conta quantas tarefas estão concluídas
  const completedCount = tasks.filter((t) => t.completed).length;

  // Atualiza os números no HTML
  document.querySelector(".count-active").textContent = activeCount;
  document.querySelector(".count-completed").textContent = completedCount;
}

// -----------------------------
//  EVENTO DO BOTÃO PRINCIPAL
// -----------------------------
addItemButton.addEventListener("click", addNewTask);

// Permite adicionar a tarefa apertando ENTER
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNewTask();
  }
});
// -----------------------------
//  FILTROS
// -----------------------------
const filterButtons = document.querySelectorAll(".filter-btn");
// Seleciona TODOS os botões que têm a classe .filter-btn (All, Active, Completed)

filterButtons.forEach((btn) => {
  // Para cada botão de filtro...

  btn.addEventListener("click", () => {
    // Quando o botão for clicado:

    currentFilter = btn.getAttribute("data-filter");
    // Lê o valor do atributo data-filter do botão clicado
    // (all, active ou completed) e guarda em currentFilter

    filterButtons.forEach((b) => b.classList.remove("active"));
    // Remove a classe "active" de todos os botões (para limpar)

    btn.classList.add("active");
    // Coloca a classe "active" SOMENTE no botão clicado

    showTasks();
    // Atualiza a lista com o filtro selecionado
  });
});
// -----------------------------
//  Claro ou Escuro
// -----------------------------
const themeToggle = document.querySelector(".theme-toggle");
// Seleciona o botão que troca o tema (ícone do sol/lua)

function loadTheme() {
  // Função que carrega o tema salvo no navegador

  const savedTheme = localStorage.getItem("theme") || "light";
  // Pega o tema salvo no localStorage (dark/light)
  // Se não houver nenhum salvo, usa "light" como padrão

  document.body.classList.add(savedTheme);
  // Aplica a classe dark OU light no <body>

  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  // Troca o ícone para combinar com o tema
}

themeToggle.addEventListener("click", () => {
  // Quando clicar no botão de trocar tema...

  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  // Alterna entre dark e light

  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  // Verifica qual tema está ativo

  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  // Atualiza o ícone (sol para escuro, lua para claro)

  localStorage.setItem("theme", theme);
  // Salva o tema no navegador para manter na próxima visita
});

loadTheme();
// Carrega o tema assim que a página abre
// -----------------------------
//  RELOGIO
// -----------------------------
function updateClock() {
  const now = new Date();
  // Pega data e hora atuais

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  // Define como a data/hora vai ser formatada

  document.querySelector(".clock").textContent = now.toLocaleDateString(
    "pt-PT",
    options
  );
  // Escreve a data formatada dentro do elemento .clock
}

setInterval(updateClock, 1000);
// Atualiza o relógio a cada 1 segundo

updateClock();
// Atualiza imediatamente quando a página carrega

// -----------------------------
//  Frases Motivacionais (API)
// -----------------------------
function loadQuote() {
  const quoteText = document.querySelector(".quote");
  // Seleciona o elemento onde a frase será exibida

  fetch("https://api.adviceslip.com/advice")
    // Faz requisição para a API pública de conselhos

    .then((response) => response.json())
    // Converte a resposta em JSON

    .then((data) => {
      quoteText.textContent = `"${data.slip.advice}"`;
      // Coloca a frase recebida dentro do elemento .quote
    })

    .catch((error) => {
      console.log(error);
      quoteText.textContent = "Não foi possível carregar a frase 😔";
      // Caso a API falhe, mostra uma mensagem de erro
    });
}

document.getElementById("new-quote").addEventListener("click", loadQuote);
// Quando clicar no botão "Nova Frase", chama loadQuote()

loadQuote();
// Carrega uma frase automaticamente ao abrir o site