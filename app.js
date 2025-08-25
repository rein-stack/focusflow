/**************
 * State
 **************/
const els = {
  // tasks
  form: document.getElementById('task-form'),
  input: document.getElementById('task-input'),
  chkToday: document.getElementById('task-today'),
  allList: document.getElementById('all-list'),
  todayList: document.getElementById('today-list'),
  // timer
  clock: document.getElementById('clock'),
  btnStart: document.getElementById('start'),
  btnPause: document.getElementById('pause'),
  btnFinish: document.getElementById('finish'),
  workMin: document.getElementById('work-min'),
  breakMin: document.getElementById('break-min'),
  mode: document.getElementById('mode'),
  beep: document.getElementById("beep"),
};


// =======================
// Timer elements
// =======================
const startBtn = document.getElementById('start');
const finishBtn = document.getElementById('finish');
const beep = document.getElementById('beep');
const timerSection = document.getElementById('timer');

// =======================
// Cute Finish Quotes
// =======================
const finishQuotes = [
  "You did it! 🌸",
  "Look how smart you are! Keep going! 💖",
  "Smartypants! 😎",
  "Every step counts! 💖",
  "Wow, you are amazing! ✨",
  "Another task conquered! 🏆",
  "You're unstoppable! 🌟",
  "Yay! You made it! 🥳",
  "One task closer to your dreams! 💫",
  "You're on fire! 🔥",
  "Mission accomplished! 🌸",
  "Look at you go! 💖",
  "Tiny wins, big heart! 💕",
  "That’s how it’s done! ✨",
  "Super proud of you! 🌟",
  "You crushed it! 💪",
  "Yay! well done! 🎉",
  "Keep shining, genius! 🌸",
  "Boom! Nailed it! 💖",
  "Every little task matters! 💫",
  "You’re a productivity queen! 👑",
  "High five! 🖐 You did it!",
  "Your brain is glowing today! ✨",
  "You’re amazing, don’t forget that! 🌸",
  "So proud of how focused you are! 💖",
  "You make productivity look cute! 😎",
  "Keep up the amazing work! 🌟",
  "Look at all that focus energy! 💫"
];


// =======================
// Motivational Start Quotes
// =======================
const startQuotes = [
  "Don't look at the number of tasks, just focus on progress! 🌟",
  "Every little step counts! 💖",
  "You got this! Keep going! ✨",
  "Focus on today, not perfection! 🌸",
  "Small progress is still progress! 🌟",
  "Take it one task at a time ! 💖",
  "You can handle this, I believe in you! 🌸",
  "Just start, the rest will follow! 💫",
  "Every action matters, keep moving! ✨",
  "Even a tiny task is a win! 🌟",
  "Focus on what you can do now, not later! 💖",
  "Look at you, ready to slay today! 😎",
  "Start with a smile, and see what happens! 🌸",
  "You’ve got all the skills, just start! ✨",
  "One step is enough to start! 💫",
  "Progress over perfection, always! 🌟",
  "Breathe, focus, start! 💖",
  "Let’s get this day sparkling! ✨",
  "You’re doing better than you think! 🌸",
  "Small steps, big heart! 💖",
  "Start now, and feel proud later! 🌟",
  "Every task you do makes you stronger! 💪",
  "You’re more capable than you know! ✨",
  "Smile and begin! 🌸",
  "Focus on the journey, not just the tasks! 💖",
  "You’ve got this, piece by piece! 💫",
  "Little wins make happy hearts! 🌟",
  "Your progress makes me proud! 💖"
];


// =======================
// Function to show cute messages
// =======================
function showMessage(message, bgColor = "#fff0f5", duration = 4000) {
  const msgBox = document.createElement('div');
  msgBox.textContent = message;
  msgBox.style.position = 'absolute';
  msgBox.style.top = '10px';
  msgBox.style.left = '50%';
  msgBox.style.transform = 'translateX(-50%)';
  msgBox.style.padding = '0.8rem 1rem';
  msgBox.style.backgroundColor = bgColor;
  msgBox.style.borderRadius = '12px';
  msgBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  msgBox.style.color = '#444';
  msgBox.style.fontWeight = '600';
  msgBox.style.fontSize = '1.1rem';
  msgBox.style.textAlign = 'center';
  msgBox.style.zIndex = '100';
  msgBox.style.opacity = '0';
  msgBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  timerSection.style.position = 'relative';
  timerSection.appendChild(msgBox);
  
  setTimeout(() => {
    msgBox.style.opacity = '1';
    msgBox.style.transform = 'translateX(-50%) translateY(0)';
  }, 50);

  setTimeout(() => {
    msgBox.style.opacity = '0';
    msgBox.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => msgBox.remove(), 300);
  }, duration);
}

// =======================
// Confetti Effect (falls slowly to timer)
// =======================
function showConfetti() {
  const colors = ["#FFD6E0", "#E7C6FF", "#CDE7FF", "#D6F5E7", "#FFB6C1"];
  const numConfetti = 30;
  for (let i = 0; i < numConfetti; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = "✨";
    confetti.style.position = 'absolute';
    confetti.style.left = Math.random() * timerSection.offsetWidth + "px";
    confetti.style.top = '-30px';
    confetti.style.fontSize = (Math.random() * 24 + 12) + "px";
    confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = 0.9;
    confetti.style.pointerEvents = 'none';
    timerSection.appendChild(confetti);

    // Animate falling
    const endPosition = timerSection.offsetHeight - 20 + "px";
    confetti.animate([
      { transform: `translateY(0px)` },
      { transform: `translateY(${endPosition})` }
    ], {
      duration: 2500 + Math.random() * 1500, // 2.5s - 4s
      easing: 'ease-out'
    });

    // Remove after animation
    setTimeout(() => confetti.remove(), 4000);
  }
}

// =======================
// Finish Button
// =======================
finishBtn.addEventListener('click', () => {
  // Play soft alarm
  if (beep.src) {
    beep.currentTime = 0;
    beep.volume = 0.6;
    beep.play().catch(() => {});
  }

  // Show random cute quote
  const randomIndex = Math.floor(Math.random() * finishQuotes.length);
  showMessage(finishQuotes[randomIndex], "#fff0f5", 4000);

  // Show confetti
  showConfetti();

  // TODO: switch to break mode
});

// =======================
// Start Button
// =======================
startBtn.addEventListener('click', () => {
  // Show random motivational start quote
  const randomIndex = Math.floor(Math.random() * startQuotes.length);
  showMessage(startQuotes[randomIndex], "#f0fff0", 4000);

  // TODO: start timer logic
});

// =======================
// Optional: Add fadeUp keyframes if not in CSS
// =======================
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);


let tasks = [];
let timer = {
  mode: 'work',        // 'work' | 'break'
  remaining: 40 * 60,  // seconds
  workSec: 40 * 60,
  breakSec: 5 * 60,
  intervalID: null,
};

/**************
 * Storage
 **************/
const LS_KEY = 'focusflow:v1';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    tasks = Array.isArray(data.tasks) ? data.tasks : [];
    if (data.timer) {
      timer.mode = data.timer.mode ?? 'work';
      timer.workSec = Number(data.timer.workSec) || 40 * 60;
      timer.breakSec = Number(data.timer.breakSec) || 5 * 60;
      // don't restore active countdown; start fresh at current mode length
      timer.remaining = timer.mode === 'work' ? timer.workSec : timer.breakSec;
    }
  } catch (e) {
    console.warn('Bad localStorage, clearing…');
    localStorage.removeItem(LS_KEY);
  }
}

function saveState() {
  const toSave = {
    tasks,
    timer: {
      mode: timer.mode,
      workSec: timer.workSec,
      breakSec: timer.breakSec,
    },
  };
  localStorage.setItem(LS_KEY, JSON.stringify(toSave));
}

/**************
 * Tasks
 **************/
function addTask(text, today = false) {
  const t = text.trim();
  if (!t) return;
  tasks.push({ id: crypto.randomUUID(), text: t, done: false, today: !!today });
  saveState();
  renderTasks();
}

function toggleDone(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveState();
  renderTasks();
}

function toggleToday(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.today = !t.today;
  saveState();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  saveState();
  renderTasks();
}

function taskItemTemplate(t) {
  const li = document.createElement('li');
  if (t.done) li.classList.add('done');

  // Wrap checkbox in a label for custom styling
  const label = document.createElement('label');
  label.classList.add('cute-checkbox');

  // Actual checkbox (hidden)
  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.checked = t.done;
  chk.addEventListener('change', () => toggleDone(t.id));

  // Custom checkmark span
  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark';

  // Task text
  const span = document.createElement('span');
  span.className = 'text';
  span.textContent = t.text;

  label.append(chk, checkmark, span);

  // Today button
  const btnToday = document.createElement('button');
  btnToday.title = 'Toggle Today';
  btnToday.textContent = t.today ? '★ Focusing' : '☆ Click to focus on it';
  btnToday.addEventListener('click', () => toggleToday(t.id));

  // Delete button
  const btnDel = document.createElement('button');
  btnDel.title = 'Delete';
  btnDel.textContent = '🗑';
  btnDel.addEventListener('click', () => removeTask(t.id));

  li.append(label, btnToday, btnDel);
  return li;
}



function renderTasks() {
  els.allList.textContent = '';
  els.todayList.textContent = '';

  tasks.forEach(t => {
    els.allList.appendChild(taskItemTemplate(t));
    if (t.today) els.todayList.appendChild(taskItemTemplate(t));
  });
}

/**************
 * Timer
 **************/
function formatMMSS(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderClock() {
  els.clock.textContent = formatMMSS(timer.remaining);
}

function setMode(mode) {
  timer.mode = mode;
  timer.remaining = mode === 'work' ? timer.workSec : timer.breakSec;
  renderClock();
  saveState();
}

function startTimer() {
  // sync lengths from inputs
  timer.workSec = Math.max(60, Number(els.workMin.value) * 60 || 40 * 60);
  timer.breakSec = Math.max(60, Number(els.breakMin.value) * 60 || 5 * 60);

  // if remaining doesn't match current mode length (e.g., changed settings), reset to mode length
  const target = timer.mode === 'work' ? timer.workSec : timer.breakSec;
  if (timer.remaining > target) timer.remaining = target;

  if (timer.intervalID) clearInterval(timer.intervalID);
  timer.intervalID = setInterval(() => {
    timer.remaining -= 1;
    if (timer.remaining <= 0) {
      clearInterval(timer.intervalID);
      timer.intervalID = null;
      timer.remaining = 0;
      renderClock();
      // play beep if provided
      if (els.beep.src) {
        els.beep.currentTime = 0;
        els.beep.volume = 0.7;
        els.beep.play().catch(() => {});
      }
      
    }
    renderClock();
  }, 1000);
}

function pauseTimer() {
  if (timer.intervalID) {
    clearInterval(timer.intervalID);
    timer.intervalID = null;
  }
}

function finishTimer() {
  pauseTimer();   // stop current countdown
  const next = timer.mode === 'work' ? 'break' : 'work';        
  setMode(next);       // switch mode 
  
}

/**************
 * Events
 **************/
els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(els.input.value, els.chkToday.checked);
  els.input.value = '';
  els.chkToday.checked = false;
});

els.mode.addEventListener('change', () => setMode(els.mode.value));
els.btnStart.addEventListener('click', startTimer);
els.btnPause.addEventListener('click', pauseTimer);
els.btnFinish.addEventListener('click', finishTimer);
/**************
 * Init
 **************/
loadState();

// initialize inputs from state
els.workMin.value = Math.round(timer.workSec / 60);
els.breakMin.value = Math.round(timer.breakSec / 60);
els.mode.value = timer.mode;

renderTasks();
renderClock();
