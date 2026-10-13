const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const importantTasks = [
  "Read Al-Ma'tsurat in the morning and evening",
  "Study for 30 minutes after school",
  "Review 2 pages and read Surah Al-Mulk after Maghrib"
];

const optionalTasks = [
  "Read a book/novel for 15 minutes after Isha",
  "Gadget-free time"
];

let currentSlide = 0;
let currentWeekKey = "";
let currentUsername = "";

/* =========================
   DATE / WEEK HELPERS
   ========================= */
function pad(number) {
  return String(number).padStart(2, "0");
}

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getMonday(date = new Date()) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // Sunday = 0
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getWeekKey(date = new Date()) {
  return dateKey(getMonday(date));
}

function getWeekDates() {
  const monday = getMonday();
  return days.map((_, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    return dateKey(d);
  });
}

function getWeekLabel(weekKey) {
  const start = new Date(`${weekKey}T12:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 5);
  return `${formatDate(weekKey)} – ${formatDate(dateKey(end))}`;
}

/* =========================
   STORAGE
   ========================= */
function getWeekData(weekKey = currentWeekKey) {
  try {
    return JSON.parse(localStorage.getItem(`weekly-progress-${weekKey}`)) || {};
  } catch {
    return {};
  }
}

function saveWeekData(data, weekKey = currentWeekKey) {
  localStorage.setItem(`weekly-progress-${weekKey}`, JSON.stringify(data));
}

function getAllWeekKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("weekly-progress-")) {
      keys.push(key.replace("weekly-progress-", ""));
    }
  }
  return keys.sort((a, b) => b.localeCompare(a));
}

function saveUserAndWeek() {
  const data = getWeekData();
  data.username = currentUsername;
  data.weekStart = currentWeekKey;
  data.updatedAt = new Date().toISOString();
  saveWeekData(data);
  localStorage.setItem("progress-current-week", currentWeekKey);
  localStorage.setItem("progress-username", currentUsername);
}

/* =========================
   OPENING / USERNAME
   ========================= */
function validateUsername() {
  const input = document.getElementById("usernameInput");
  const error = document.getElementById("usernameError");
  const value = input.value.trim();

  if (!value) {
    error.textContent = "Please enter your name first.";
    input.focus();
    return false;
  }

  error.textContent = "";
  currentUsername = value;
  return true;
}

function startCurrentWeek() {
  if (!validateUsername()) return;

  currentWeekKey = getWeekKey();
  saveUserAndWeek();
  goToSlide(1);
}

function startNewWeek() {
  if (!validateUsername()) return;

  const today = new Date();
  const newWeekKey = getWeekKey(today);
  const existing = getAllWeekKeys();

  // If the current calendar week already exists, create/continue it instead
  // of overwriting the previous saved data.
  currentWeekKey = newWeekKey;
  saveUserAndWeek();

  goToSlide(1);
  renderSavedWeeks();
  alert(`Week started for ${currentUsername}. Your saved data is kept automatically.`);
}

function openSavedWeek(weekKey) {
  const data = getWeekData(weekKey);
  currentWeekKey = weekKey;
  currentUsername = data.username || localStorage.getItem("progress-username") || "";

  document.getElementById("usernameInput").value = currentUsername;
  localStorage.setItem("progress-current-week", currentWeekKey);
  localStorage.setItem("progress-username", currentUsername);

  restoreAllData();
  updateSubmitStates();
  goToSlide(1);
}

function renderSavedWeeks() {
  const container = document.getElementById("savedWeeks");
  const count = document.getElementById("savedCount");
  const keys = getAllWeekKeys();

  count.textContent = `${keys.length} saved`;
  container.innerHTML = "";

  if (keys.length === 0) {
    container.innerHTML = `<p class="empty-saved">No saved weeks yet.</p>`;
    return;
  }

  keys.slice(0, 8).forEach((key) => {
    const data = getWeekData(key);
    const row = document.createElement("div");
    row.className = "saved-week-row";

    const info = document.createElement("div");
    info.innerHTML = `
      <strong>${escapeHTML(data.username || "Unnamed User")}</strong>
      <span>${getWeekLabel(key)}</span>
    `;

    const button = document.createElement("button");
    button.className = "btn-open-week";
    button.textContent = "Open";
    button.onclick = () => openSavedWeek(key);

    row.appendChild(info);
    row.appendChild(button);
    container.appendChild(row);
  });
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

/* =========================
   CREATE DAY SLIDES
   ========================= */
function createDaySlides() {
  const weekDates = getWeekDates();

  days.forEach((day, index) => {
    const slide = document.getElementById(`slide-${index + 1}`);
    const dayKey = day.toLowerCase();

    slide.innerHTML = `
      <div class="day-card">
        <div class="day-header">
          <div>
            <p class="small-label mb-1">DAILY PROGRESS</p>
            <h2 class="day-title">${day}</h2>
            <p class="day-date" id="date-${dayKey}">${formatDate(weekDates[index])}</p>
            <p class="day-subtitle">
              Important tasks come first. Optional tasks can add extra progress.
            </p>
            <p class="user-display">User: <strong id="user-${dayKey}">—</strong></p>
          </div>

          <div class="progress-box">
            <span class="progress-number" id="progress-text-${dayKey}">0 / 5 completed</span>
            <div class="progress-track">
              <div class="progress-fill" id="progress-fill-${dayKey}"></div>
            </div>
          </div>
        </div>

        <div class="task-grid">
          <div class="task-column">
            <h3>⭐ Important Tasks</h3>
            <p class="column-note">3 main tasks to prioritize.</p>
            <div class="task-list">
              ${importantTasks.map((task, taskIndex) =>
                createTaskHTML(dayKey, "important", taskIndex, task)
              ).join("")}
            </div>
          </div>

          <div class="task-column">
            <h3>✨ Optional Tasks</h3>
            <p class="column-note">2 extra tasks for additional progress.</p>
            <div class="task-list">
              ${optionalTasks.map((task, taskIndex) =>
                createTaskHTML(dayKey, "optional", taskIndex, task)
              ).join("")}
            </div>
          </div>
        </div>

        <div class="progress-note-box">
          <label for="note-${dayKey}">📝 Daily Progress / Notes</label>
          <textarea
            id="note-${dayKey}"
            class="progress-note"
            data-note-day="${dayKey}"
            placeholder="Write what you achieved, what you learned, or what you need to improve..."
            oninput="handleNoteChange('${dayKey}')"
          ></textarea>
          <small>Saved automatically in your weekly progress.</small>
        </div>

        <div class="submit-area">
          <div class="submit-row">
            <div class="submit-info">
              <div><strong>Submit Status:</strong> the button becomes available at 7:00 PM.</div>
              <div id="submit-status-${dayKey}">Not submitted yet.</div>
            </div>

            <button
              class="btn-submit"
              id="submit-btn-${dayKey}"
              onclick="submitDay('${dayKey}')"
              disabled
            >
              Submit Progress
            </button>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn" onclick="previousSlide()" ${index === 0 ? "disabled" : ""}>
          ← Previous Day
        </button>
        ${index === days.length - 1 ? `
        <button class="nav-btn btn-finish-week" id="finish-week-btn" onclick="finishWeek()" disabled>
          Finish Week
        </button>` : `
        <button class="nav-btn" onclick="nextSlide()">
          Next Day →
        </button>`}
      </div>
    `;
  });

  updateIndicator();
  restoreAllData();
  updateSubmitStates();
  updateUserDisplays();
}

/* =========================
   TASKS + NOTES
   ========================= */
function createTaskHTML(dayKey, type, index, text) {
  const key = `${dayKey}-${type}-${index}`;

  return `
    <label class="task-item" for="${key}">
      <input
        class="task-checkbox"
        type="checkbox"
        id="${key}"
        data-day="${dayKey}"
        onchange="handleTaskChange('${dayKey}')"
      >
      <span class="checkmark"></span>
      <span class="task-content">
        <span class="task-number">${type === "important" ? "IMPORTANT" : "OPTIONAL"} ${index + 1}</span>
        <span class="task-text">${text}</span>
      </span>
    </label>
  `;
}

function handleTaskChange(dayKey) {
  saveDayData(dayKey);
  updateProgress(dayKey);
  updateSubmitStates();
  updateFinishWeekButton();
}

function saveDayData(dayKey) {
  const data = getWeekData();
  data.username = currentUsername;
  data.days = data.days || {};
  data.days[dayKey] = data.days[dayKey] || { tasks: {}, note: "", submitted: false };

  document.querySelectorAll(`input[data-day="${dayKey}"]`).forEach(checkbox => {
    data.days[dayKey].tasks[checkbox.id] = checkbox.checked;
  });

  data.updatedAt = new Date().toISOString();
  saveWeekData(data);
}

function handleNoteChange(dayKey) {
  const data = getWeekData();
  data.username = currentUsername;
  data.days = data.days || {};
  data.days[dayKey] = data.days[dayKey] || { tasks: {}, note: "", submitted: false };
  data.days[dayKey].note = document.getElementById(`note-${dayKey}`).value;
  data.updatedAt = new Date().toISOString();
  saveWeekData(data);
}

function restoreDayData(dayKey) {
  const data = getWeekData();
  const dayData = data.days?.[dayKey];
  if (!dayData) return;

  document.querySelectorAll(`input[data-day="${dayKey}"]`).forEach(checkbox => {
    checkbox.checked = Boolean(dayData.tasks?.[checkbox.id]);
  });

  const note = document.getElementById(`note-${dayKey}`);
  if (note) note.value = dayData.note || "";
}

function restoreAllData() {
  if (!currentWeekKey) return;

  days.forEach(day => {
    const key = day.toLowerCase();
    restoreDayData(key);
    updateProgress(key);
    updateSubmitStateForDay(key);
  });

  updateUserDisplays();
  updateFinishWeekButton();
}

/* =========================
   PROGRESS
   ========================= */
function updateProgress(dayKey) {
  const checkboxes = document.querySelectorAll(`input[data-day="${dayKey}"]`);
  const total = checkboxes.length;
  const done = [...checkboxes].filter(checkbox => checkbox.checked).length;
  const percentage = total === 0 ? 0 : (done / total) * 100;

  const text = document.getElementById(`progress-text-${dayKey}`);
  const fill = document.getElementById(`progress-fill-${dayKey}`);

  if (text) text.textContent = `${done} / ${total} completed`;
  if (fill) fill.style.width = `${percentage}%`;
}

function updateUserDisplays() {
  days.forEach(day => {
    const el = document.getElementById(`user-${day.toLowerCase()}`);
    if (el) el.textContent = currentUsername || "—";
  });
}

/* =========================
   FINISH WEEK
   ========================= */
function areAllImportantTasksComplete() {
  const data = getWeekData();
  return days.every(day => {
    const dayKey = day.toLowerCase();
    const tasks = data.days?.[dayKey]?.tasks || {};
    return importantTasks.every((_, index) => tasks[`${dayKey}-important-${index}`] === true);
  });
}

function areAllDaysSubmitted() {
  const data = getWeekData();
  return days.every(day => data.days?.[day.toLowerCase()]?.submitted === true);
}

function canFinishWeek() {
  return areAllImportantTasksComplete() && areAllDaysSubmitted();
}

function updateFinishWeekButton() {
  const button = document.getElementById("finish-week-btn");
  if (!button) return;

  const importantComplete = areAllImportantTasksComplete();
  const submitted = areAllDaysSubmitted();
  const complete = importantComplete && submitted;
  button.disabled = !complete;
  button.title = complete
    ? "Finish your completed weekly progress"
    : "Complete all important tasks and submit every day from Monday to Saturday";
}

function finishWeek() {
  if (!canFinishWeek()) {
    return;
  }

  const data = getWeekData();
  data.username = currentUsername;
  data.weekStart = currentWeekKey;
  data.completed = true;
  data.completedAt = new Date().toISOString();
  data.updatedAt = new Date().toISOString();
  saveWeekData(data);
  localStorage.setItem("progress-current-week", currentWeekKey);
  localStorage.setItem("progress-username", currentUsername);

  renderSavedWeeks();
  showFinishPopup();
}

function showFinishPopup() {
  const popup = document.getElementById("finishPopup");
  if (!popup) {
    goToSlide(0);
    return;
  }

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    goToSlide(0);
  }, 1500);
}

/* =========================
   SUBMIT
   ========================= */
function isAfter19() {
  const now = new Date();
  return now.getHours() >= 19;
}

function isDaySubmitted(dayKey) {
  return getWeekData().days?.[dayKey]?.submitted === true;
}

function submitDay(dayKey) {
  if (!isAfter19()) {
    alert("Submit becomes available at 7:00 PM.");
    return;
  }

  const data = getWeekData();
  data.username = currentUsername;
  data.days = data.days || {};
  data.days[dayKey] = data.days[dayKey] || { tasks: {}, note: "", submitted: false };
  data.days[dayKey].submitted = true;
  data.days[dayKey].submittedAt = new Date().toISOString();
  data.updatedAt = new Date().toISOString();
  saveWeekData(data);

  updateSubmitStateForDay(dayKey);
  updateFinishWeekButton();
  renderSavedWeeks();
}

function updateSubmitStateForDay(dayKey) {
  const button = document.getElementById(`submit-btn-${dayKey}`);
  const status = document.getElementById(`submit-status-${dayKey}`);
  if (!button || !status) return;

  if (isDaySubmitted(dayKey)) {
    button.disabled = false;
    button.classList.add("done");
    button.textContent = "Completed";
    status.textContent = "This day's progress has been submitted and saved.";
  } else if (isAfter19()) {
    button.disabled = false;
    button.classList.remove("done");
    button.textContent = "Submit Progress";
    status.textContent = "It is after 7:00 PM — ready to submit.";
  } else {
    button.disabled = true;
    button.classList.remove("done");
    button.textContent = "Submit Progress";
    status.textContent = "Waiting until 7:00 PM.";
  }
}

function updateSubmitStates() {
  days.forEach(day => updateSubmitStateForDay(day.toLowerCase()));
  updateFinishWeekButton();
}

/* =========================
   NAVIGATION
   ========================= */
function goToSlide(index) {
  const slides = document.querySelectorAll(".slide");
  if (index < 0 || index >= slides.length) return;

  slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  currentSlide = index;
  updateIndicator();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function previousSlide() {
  goToSlide(currentSlide - 1);
}

function updateIndicator() {
  const indicator = document.getElementById("dayIndicator");
  if (currentSlide === 0) {
    indicator.textContent = "Opening";
    return;
  }
  indicator.textContent = `${days[currentSlide - 1]} • ${currentSlide} / 6`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* =========================
   STARTUP
   ========================= */
function loadSavedSession() {
  const savedWeek = localStorage.getItem("progress-current-week");
  const savedUsername = localStorage.getItem("progress-username");

  document.getElementById("usernameInput").value = savedUsername || "";

  if (savedWeek && getWeekData(savedWeek).username) {
    currentWeekKey = savedWeek;
    currentUsername = getWeekData(savedWeek).username;
  }
}

setInterval(updateSubmitStates, 30000);

createDaySlides();
loadSavedSession();
renderSavedWeeks();
