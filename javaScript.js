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
