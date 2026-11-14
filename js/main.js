// ---------- Academic planner ----------
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  const count = document.getElementById("taskCount");
  const err = document.getElementById("taskError");
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  function save() {
    try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
  }

  function render() {
    list.innerHTML = "";
    tasks.forEach(function (task, index) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark as completed: " + task.text);
      box.addEventListener("change", function () { toggleTask(index); });
      const text = document.createElement("span");
      text.textContent = task.text;
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", function () { deleteTask(index); });
      li.append(box, text, del);
      list.appendChild(li);
    });
    const left = tasks.filter(function (t) { return !t.done; }).length;
    count.textContent = tasks.length === 0
      ? "No tasks yet. Add your first one above."
      : left + " of " + tasks.length + " tasks left";
  }

  function addTask(text) { tasks.push({ text: text, done: false }); save(); render(); }
  function toggleTask(i) { tasks[i].done = !tasks[i].done; save(); render(); }
  function deleteTask(i) { tasks.splice(i, 1); save(); render(); }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") { err.textContent = "Type a task before adding it."; return; }
    err.textContent = "";
    addTask(text);
    input.value = "";
    input.focus();
  });
  render();
}

// ---------- Contact form validation ----------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const fields = ["name", "email", "phone", "message"];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = /^[0-9]+$/;

  function setError(id, msg) {
    document.getElementById(id + "Err").textContent = msg;
    document.getElementById(id).classList.toggle("invalid", msg !== "");
  }

  function check(id) {
    const value = document.getElementById(id).value.trim();
    let msg = "";
    if (value === "") msg = "This field cannot be empty.";
    else if (id === "email" && !emailPattern.test(value)) msg = "Enter a valid email address, like name@example.com.";
    else if (id === "phone" && !digitsOnly.test(value)) msg = "Use digits only, with no spaces, + or dashes.";
    setError(id, msg);
    return msg === "";
  }

  fields.forEach(function (id) {
    document.getElementById(id).addEventListener("blur", function () { check(id); });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok = fields.map(check).every(Boolean);
    const success = document.getElementById("formSuccess");
    if (ok) {
      success.textContent = "Thanks, " + document.getElementById("name").value.trim() + ". Your message was sent.";
      contactForm.reset();
    } else {
      success.textContent = "";
    }
  });
}
