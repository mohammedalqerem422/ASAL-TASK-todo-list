function getTasks() {
  let t = localStorage.getItem('tasks');
  if (t) {
    return JSON.parse(t);
  } else {
    return [];
  }
}

function setTasks(t) {
  let s = JSON.stringify(t);
  localStorage.setItem('tasks', s);
}

function showError(id, msg) {
  let el = document.getElementById(id);
  el.textContent = msg;
}

function clearError(id) {
  let el = document.getElementById(id);
  el.textContent = '';
}
let taskInput = document.getElementById('taskInput');
let addTaskBtn = document.getElementById('addTaskBtn');
let todoList = document.getElementById('todoList');
let deleteAllBtn = document.getElementById('deleteAllBtn');
let deleteDoneBtn = document.getElementById('deleteDoneBtn');
let popupBg = document.getElementById('popupBg');
let popupContent = document.getElementById('popupContent');
let tabBtns = document.querySelectorAll('.tabBtn');

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