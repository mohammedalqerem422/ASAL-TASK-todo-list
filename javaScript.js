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
function renderTasks() {
  let tasks = getTasks();
  let filtered = [];

  if (currentTab === 'all') {
    filtered = tasks;
  } else {
    if (currentTab === 'done') {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].done) {
          filtered.push(tasks[i]);
        }
      }
    } else {
      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].done) {
          filtered.push(tasks[i]);
        }
      }
    }
  }

  todoList.innerHTML = '';

  if (filtered.length === 0) {
    todoList.innerHTML = '<div style="color:#888; text-align:center; margin:24px 0;">No tasks found.</div>';
    deleteAllBtn.disabled = tasks.length === 0;
    deleteDoneBtn.disabled = !tasks.some(function(t) {
      return t.done;
    });
    return;
  }

  for (let j = 0; j < filtered.length; j++) {
    let task = filtered[j];
    let realIdx = tasks.indexOf(task);

    let div = document.createElement('div');
    div.className = 'todoItem';

    let doneClass = '';
    if (task.done) {
      doneClass = ' done';
    }

    div.innerHTML = '<span class="todoText' + doneClass + '">' + task.text + '</span>' +
      '<div class="todoActions">' +
      '<button class="iconBtn edit" title="Rename" data-idx="' + realIdx + '">✏️</button>' +
      '<button class="iconBtn delete" title="Delete" data-idx="' + realIdx + '">🗑️</button>' +
      '<input type="checkbox" class="todoCheckbox" data-idx="' + realIdx + '"' + (task.done ? ' checked' : '') + '>' +
      '</div>';

    todoList.appendChild(div);
  }

  deleteAllBtn.disabled = tasks.length === 0;
  deleteDoneBtn.disabled = !tasks.some(function(t) {
    return t.done;
  });
}

function addTask() {
  let text = taskInput.value;
  let error = validateTask(text);
  if (error !== '') {
    showError('inputError', error);
    return;
  }
  clearError('inputError');
  let tasks = getTasks();
  let newTask = {
    text: text.trim(),
    done: false
  };
  tasks.push(newTask);
  setTasks(tasks);
  taskInput.value = '';
  renderTasks();
}

function deleteTask(idx) {
  let tasks = getTasks();
  tasks.splice(idx, 1);
  setTasks(tasks);
  renderTasks();
}

function deleteAllTasks() {
  let tasks = getTasks();
  if (tasks.length === 0) {
    showError('deleteError', 'No tasks to delete.');
    return;
  }
  showPopup('Confirm Delete', 'Are you sure you want to delete all tasks?', [
    {
      text: 'Cancel',
      class: 'cancel',
      action: closePopup
    },
    {
      text: 'Delete',
      class: 'confirm',
      action: function() {
        setTasks([]);
        renderTasks();
        closePopup();
      }
    }
  ]);
}

function deleteDoneTasks() {
  let tasks = getTasks();
  let hasDone = false;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].done) {
      hasDone = true;
      break;
    }
  }
  if (!hasDone) {
    showError('deleteError', 'No done tasks to delete.');
    return;
  }
  showPopup('Confirm Delete', 'Delete all done tasks?', [
    {
      text: 'Cancel',
      class: 'cancel',
      
      action: closePopup
    },
    {
      text: 'Delete',
      class: 'confirm',
      action: function() {
        let remaining = [];
        for (let i = 0; i < tasks.length; i++) {
          if (!tasks[i].done) {
            remaining.push(tasks[i]);
          }
        }
        setTasks(remaining);
        renderTasks();
        closePopup();
      }
    }
  ]);
}

function renameTask(idx) {
  let tasks = getTasks();
  showPopup('Rename Task',
    '<input id="renameInput" type="text" value="' + tasks[idx].text + '"/><div id="renameError" class="error"></div>',
    [
      {
        text: 'Cancel',
        class: 'cancel',
        action: closePopup
      },
      {
        text: 'Save',
        class: 'confirm',
        action: function() {
          let newText = document.getElementById('renameInput').value;
          let error = validateTask(newText);
          if (error !== '') {
            showError('renameError', error);
            return;
          }
          tasks[idx].text = newText.trim();
          setTasks(tasks);
          renderTasks();
          closePopup();
        }
      }
    ]
  );
}

function toggleDone(idx) {
  let tasks = getTasks();

  tasks[idx].done = !tasks[idx].done;
  setTasks(tasks);
  renderTasks();
}

function showPopup(title, content, actions) {
  popupContent.innerHTML = '<h3 style="margin-top:0;">' + title + '</h3><div>' + content + '</div>' +
    '<div class="popupActions">' +
    actions.map(function(a, i) {
      return '<button class="' + a.class + '" id="popupBtn' + i + '">' + a.text + '</button>';
    }).join('') +
    '</div>';
  popupBg.style.display = 'flex';

  actions.forEach(function(a, i) {
    document.getElementById('popupBtn' + i).onclick = a.action;
  });
}

function closePopup() {
  popupBg.style.display = 'none';
}

addTaskBtn.onclick = addTask;

taskInput.onkeydown = function(e) {
  if (e.key === 'Enter') {
    addTask();
  }
};

deleteAllBtn.onclick = deleteAllTasks;
deleteDoneBtn.onclick = deleteDoneTasks;

tabBtns.forEach(function(btn) {
  btn.onclick = function() {
    tabBtns.forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    currentTab = btn.getAttribute('data-tab');
    renderTasks();
  };
});

todoList.onclick = function(e) {
  if (e.target.classList.contains('delete')) {
    let idx = parseInt(e.target.getAttribute('data-idx'));
    showPopup('Confirm Delete', 'Delete this task?', [
      { text: 'Cancel', class: 'cancel', action: closePopup },
      {
        text: 'Delete',
        class: 'confirm',
        action: function() {
          deleteTask(idx);
          closePopup();
        }
      }
    ]);
  }

  if (e.target.classList.contains('edit')) {
    let idx = parseInt(e.target.getAttribute('data-idx'));
    renameTask(idx);
  }

  if (e.target.classList.contains('todoCheckbox')) {
    let idx = parseInt(e.target.getAttribute('data-idx'));
    toggleDone(idx);
  }
};



renderTasks();
