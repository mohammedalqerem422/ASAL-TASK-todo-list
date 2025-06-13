let taskInput = document.getElementById('task');
let addBtn = document.getElementById('add');
let list = document.getElementById('list');
let deleteAllBtn = document.getElementById('delete-all');
let deleteDoneBtn = document.getElementById('delete-done');
let modal = document.getElementById('modal');
let modalContent = document.getElementById('modal-content');
let tabs = document.querySelectorAll('.tab');

  
  function getTasks() {
  let tasks = localStorage.getItem('tasks');
  if (tasks) {
    return JSON.parse(tasks);
  } else {
    return [];
  }
}

function setTasks(tasks) {
  let tasksString = JSON.stringify(tasks);
  localStorage.setItem('tasks', tasksString);
}

function showError(elementId, message) {
  let element = document.getElementById(elementId);
  element.textContent = message;
}

function clearError(elementId) {
  let element = document.getElementById(elementId);
  element.textContent = '';
}


let currentTab = 'all';

function validateTask(text) {
  if (text.trim() === '') {
    return 'Task cannot be empty.';
  }
  if (text.length < 5) {
    return 'Task must be at least 5 characters.';
  }
  if (text.charAt(0) >= '0' && text.charAt(0) <= '9') {
    return 'Task cannot start with a number.';
  }
  return '';
}

function show() {
  let tasks = getTasks();
  let filteredTasks = [];

  if (currentTab === 'all') {
    filteredTasks = tasks;
  } else if (currentTab === 'done') {
    filteredTasks = tasks.filter(task => task.done);
  } else {
    filteredTasks = tasks.filter(task => !task.done);
  }

  list.innerHTML = '';

  if (filteredTasks.length === 0) {
    list.innerHTML = '<div style="color:#888; text-align:center; margin:24px 0;">No tasks found.</div>';
    deleteAllBtn.disabled = tasks.length === 0;
    deleteDoneBtn.disabled = !tasks.some(task => task.done);
    return;
  }

  for (let i = 0; i < filteredTasks.length; i++) {
    let task = filteredTasks[i];
    let taskIndex = tasks.indexOf(task);

    let taskElement = document.createElement('div');
    taskElement.className = 'item';

    let doneClass = task.done ? ' done' : '';

    taskElement.innerHTML = '<span class="text' + doneClass + '">' + task.text + '</span>' +
      '<div class="actions">' +
      '<button class="btn edit" title="Rename" data-num="' + taskIndex + '">✏️</button>' +
      '<button class="btn delete" title="Delete" data-num="' + taskIndex + '">🗑️</button>' +
      '<input type="checkbox" class="check" data-num="' + taskIndex + '"' + (task.done ? ' checked' : '') + '>' +
      '</div>';

    list.appendChild(taskElement);
  }

  deleteAllBtn.disabled = tasks.length === 0;
  deleteDoneBtn.disabled = !tasks.some(task => task.done);
}

function addTask() {
  let taskText = taskInput.value;
  let errorMessage = validateTask(taskText);
  if (errorMessage !== '') {
    showError('error', errorMessage);
    return;
  }
  clearError('error');
  let tasks = getTasks();
  let newTask = {
    text: taskText.trim(),
    done: false
  };
  tasks.push(newTask);
  setTasks(tasks);
  taskInput.value = '';
  show();
}

function deleteTask(taskNum) {
  if (confirm('Are you sure you want to delete this task?')) {
    let tasks = getTasks();
    tasks.splice(taskNum, 1);
    setTasks(tasks);
    show();
  }
}

function deleteAllTasks() {
  let tasks = getTasks();
  if (tasks.length === 0) {
    showError('delete-error', 'No tasks to delete.');
    return;
  }
  if (confirm('Are you sure you want to delete all tasks?')) {
    setTasks([]);
    show();
  }
}

function deleteDoneTasks() {
  let tasks = getTasks();
  let hasDoneTasks = tasks.some(task => task.done);
  
  if (!hasDoneTasks) {
    showError('delete-error', 'No done tasks to delete.');
    return;
  }
  if (confirm('Are you sure you want to delete all done tasks?')) {
    let remainingTasks = tasks.filter(task => !task.done);
    setTasks(remainingTasks);
    show();
  }
}

function renameTask(taskNum) {
  let tasks = getTasks();
  let newText = prompt('Enter new task name:', tasks[taskNum].text);
  
  if (newText === null) {
    return;
  }
  
  let errorMessage = validateTask(newText);
  if (errorMessage !== '') {
    alert(errorMessage);
    return;
  }
  
  tasks[taskNum].text = newText.trim();
  setTasks(tasks);
  show();
}

function toggleDone(taskNum) {
  let tasks = getTasks();
  tasks[taskNum].done = !tasks[taskNum].done;
  setTasks(tasks);
  show();
}

addBtn.onclick = addTask;

taskInput.onkeydown = function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
};

deleteAllBtn.onclick = deleteAllTasks;
deleteDoneBtn.onclick = deleteDoneTasks;

tabs.forEach(function(tab, index) {
  tab.onclick = function() {
    tabs.forEach(function(t) {
      t.classList.remove('active');
    });
    tab.classList.add('active');
    currentTab = index === 0 ? 'all' : index === 1 ? 'done' : 'todo';
    show();
  };
});

list.onclick = function(event) {
  if (event.target.classList.contains('delete')) {
    let taskNum = parseInt(event.target.getAttribute('data-num'));
    deleteTask(taskNum);
  }

  if (event.target.classList.contains('edit')) {
    let taskNum = parseInt(event.target.getAttribute('data-num'));
    renameTask(taskNum);
  }

  if (event.target.classList.contains('check')) {
    let taskNum = parseInt(event.target.getAttribute('data-num'));
    toggleDone(taskNum);
  }
};

show();













