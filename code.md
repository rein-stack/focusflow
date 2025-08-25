# **Paste this into index.html (single page; sections for Tasks + Timer):**



<!DOCTYPE html>

<html lang="en">

<head>

&nbsp; <meta charset="UTF-8" />

&nbsp; <title>FocusFlow (MVP)</title>

&nbsp; <link rel="stylesheet" href="./style.css" />

</head>

<body>

&nbsp; <header class="container">

&nbsp;   <h1>FocusFlow</h1>

&nbsp; </header>



&nbsp; <main class="container grid">

&nbsp;   <!-- Tasks -->

&nbsp;   <section id="tasks">

&nbsp;     <h2>Tasks</h2>



&nbsp;     <form id="task-form" autocomplete="off">

&nbsp;       <input id="task-input" type="text" placeholder="Add a task..." />

&nbsp;       <label class="today-inline">

&nbsp;         <input id="task-today" type="checkbox" />

&nbsp;         Add to Today

&nbsp;       </label>

&nbsp;       <button type="submit">Add</button>

&nbsp;     </form>



&nbsp;     <div class="lists">

&nbsp;       <div class="list-block">

&nbsp;         <h3>All Tasks</h3>

&nbsp;         <ul id="all-list"></ul>

&nbsp;       </div>



&nbsp;       <div class="list-block">

&nbsp;         <h3>Today's Focus</h3>

&nbsp;         <ul id="today-list"></ul>

&nbsp;       </div>

&nbsp;     </div>

&nbsp;   </section>



&nbsp;   <!-- Timer -->

&nbsp;   <section id="timer">

&nbsp;     <h2>Timer</h2>



&nbsp;     <div id="clock">40:00</div>



&nbsp;     <div class="controls">

&nbsp;       <button id="start">Start</button>

&nbsp;       <button id="pause">Pause</button>

&nbsp;       <button id="reset">Reset</button>

&nbsp;     </div>



&nbsp;     <div class="settings">

&nbsp;       <label>Work (min)

&nbsp;         <input id="work-min" type="number" min="1" value="40" />

&nbsp;       </label>

&nbsp;       <label>Break (min)

&nbsp;         <select id="break-min">

&nbsp;           <option value="5">5</option>

&nbsp;           <option value="15">15</option>

&nbsp;         </select>

&nbsp;       </label>

&nbsp;       <label>Mode

&nbsp;         <select id="mode">

&nbsp;           <option value="work">Work</option>

&nbsp;           <option value="break">Break</option>

&nbsp;         </select>

&nbsp;       </label>

&nbsp;     </div>



&nbsp;     <audio id="beep" src="" preload="auto"></audio>

&nbsp;   </section>

&nbsp; </main>



&nbsp; <script src="./app.js"></script>

</body>

</html>





**We’ll plug an alarm sound later; for now leave src="" on the <audio>.**



# **Step 2 — Minimal CSS (just enough to see things)**



##### **Paste into style.css:**



\* { box-sizing: border-box; }

body { margin: 0; font-family: system-ui, Arial, sans-serif; color: #111; background: #f7f7fb; }

.container { max-width: 960px; margin: 0 auto; padding: 16px; }

header h1 { margin: 8px 0 0; }



.grid { display: grid; gap: 24px; grid-template-columns: 1fr 1fr; }

@media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }



section { background: #fff; border: 1px solid #e7e7ee; border-radius: 12px; padding: 16px; }



\#task-form { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }

\#task-input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; }

.today-inline { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; }

\#task-form button { padding: 10px 14px; border: 0; border-radius: 8px; background: #111; color: #fff; }



.lists { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }

.list-block { border: 1px dashed #e7e7ee; border-radius: 8px; padding: 10px; }

ul { list-style: none; margin: 0; padding: 0; }

li { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #f0f0f3; }

li:last-child { border-bottom: 0; }

li .text { flex: 1; }

li.done .text { text-decoration: line-through; color: #888; }

li button { border: 0; background: transparent; cursor: pointer; padding: 6px 8px; border-radius: 6px; }

li button:hover { background: #f4f4f8; }



\#clock { font-size: 64px; text-align: center; margin: 8px 0 12px; font-variant-numeric: tabular-nums; }

.controls { display: flex; justify-content: center; gap: 10px; margin-bottom: 12px; }

.controls button { padding: 10px 16px; border: 0; border-radius: 8px; background: #111; color: #fff; }

.settings { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

.settings label { display: inline-flex; align-items: center; gap: 6px; background: #f4f4f8; padding: 6px 10px; border-radius: 8px; }



# **Step 3 — Plan the JS (before coding)**



**We’ll keep simple state and small functions.**



**State shape**



// tasks: \[{id, text, done, today}]

let tasks = \[];

// timer: {mode, remaining, workSec, breakSec, intervalID}





**Functions**



loadState() / saveState() – localStorage



addTask(text, today) / toggleDone(id) / toggleToday(id) / removeTask(id)



renderTasks() – updates both lists



formatMMSS(sec) – helper



setMode("work"|"break") – set remaining from settings



renderClock() – draw timer



startTimer() / pauseTimer() / resetTimer()



# **Step 4 — JS: make it work**



**Paste into app.js (it’s commented so you know what each step does):**



/\*\*\*\*\*\*\*\*\*\*\*\*\*\*

&nbsp;\* State

&nbsp;\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

const els = {

&nbsp; // tasks

&nbsp; form: document.getElementById('task-form'),

&nbsp; input: document.getElementById('task-input'),

&nbsp; chkToday: document.getElementById('task-today'),

&nbsp; allList: document.getElementById('all-list'),

&nbsp; todayList: document.getElementById('today-list'),

&nbsp; // timer

&nbsp; clock: document.getElementById('clock'),

&nbsp; btnStart: document.getElementById('start'),

&nbsp; btnPause: document.getElementById('pause'),

&nbsp; btnReset: document.getElementById('reset'),

&nbsp; workMin: document.getElementById('work-min'),

&nbsp; breakMin: document.getElementById('break-min'),

&nbsp; mode: document.getElementById('mode'),

&nbsp; beep: document.getElementById('beep'),

};



let tasks = \[];

let timer = {

&nbsp; mode: 'work',        // 'work' | 'break'

&nbsp; remaining: 40 \* 60,  // seconds

&nbsp; workSec: 40 \* 60,

&nbsp; breakSec: 5 \* 60,

&nbsp; intervalID: null,

};



/\*\*\*\*\*\*\*\*\*\*\*\*\*\*

&nbsp;\* Storage

&nbsp;\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

const LS\_KEY = 'focusflow:v1';



function loadState() {

&nbsp; try {

&nbsp;   const raw = localStorage.getItem(LS\_KEY);

&nbsp;   if (!raw) return;

&nbsp;   const data = JSON.parse(raw);

&nbsp;   tasks = Array.isArray(data.tasks) ? data.tasks : \[];

&nbsp;   if (data.timer) {

&nbsp;     timer.mode = data.timer.mode ?? 'work';

&nbsp;     timer.workSec = Number(data.timer.workSec) || 40 \* 60;

&nbsp;     timer.breakSec = Number(data.timer.breakSec) || 5 \* 60;

&nbsp;     // don't restore active countdown; start fresh at current mode length

&nbsp;     timer.remaining = timer.mode === 'work' ? timer.workSec : timer.breakSec;

&nbsp;   }

&nbsp; } catch (e) {

&nbsp;   console.warn('Bad localStorage, clearing…');

&nbsp;   localStorage.removeItem(LS\_KEY);

&nbsp; }

}



function saveState() {

&nbsp; const toSave = {

&nbsp;   tasks,

&nbsp;   timer: {

&nbsp;     mode: timer.mode,

&nbsp;     workSec: timer.workSec,

&nbsp;     breakSec: timer.breakSec,

&nbsp;   },

&nbsp; };

&nbsp; localStorage.setItem(LS\_KEY, JSON.stringify(toSave));

}



/\*\*\*\*\*\*\*\*\*\*\*\*\*\*

&nbsp;\* Tasks

&nbsp;\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

function addTask(text, today = false) {

&nbsp; const t = text.trim();

&nbsp; if (!t) return;

&nbsp; tasks.push({ id: crypto.randomUUID(), text: t, done: false, today: !!today });

&nbsp; saveState();

&nbsp; renderTasks();

}



function toggleDone(id) {

&nbsp; const t = tasks.find(x => x.id === id);

&nbsp; if (!t) return;

&nbsp; t.done = !t.done;

&nbsp; saveState();

&nbsp; renderTasks();

}



function toggleToday(id) {

&nbsp; const t = tasks.find(x => x.id === id);

&nbsp; if (!t) return;

&nbsp; t.today = !t.today;

&nbsp; saveState();

&nbsp; renderTasks();

}



function removeTask(id) {

&nbsp; tasks = tasks.filter(x => x.id !== id);

&nbsp; saveState();

&nbsp; renderTasks();

}



function taskItemTemplate(t) {

&nbsp; const li = document.createElement('li');

&nbsp; if (t.done) li.classList.add('done');



&nbsp; const chk = document.createElement('input');

&nbsp; chk.type = 'checkbox';

&nbsp; chk.checked = t.done;

&nbsp; chk.addEventListener('change', () => toggleDone(t.id));



&nbsp; const span = document.createElement('span');

&nbsp; span.className = 'text';

&nbsp; span.textContent = t.text;



&nbsp; const btnToday = document.createElement('button');

&nbsp; btnToday.title = 'Toggle Today';

&nbsp; btnToday.textContent = t.today ? '★ Today' : '☆ Today';

&nbsp; btnToday.addEventListener('click', () => toggleToday(t.id));



&nbsp; const btnDel = document.createElement('button');

&nbsp; btnDel.title = 'Delete';

&nbsp; btnDel.textContent = '🗑';

&nbsp; btnDel.addEventListener('click', () => removeTask(t.id));



&nbsp; li.append(chk, span, btnToday, btnDel);

&nbsp; return li;

}



function renderTasks() {

&nbsp; els.allList.textContent = '';

&nbsp; els.todayList.textContent = '';



&nbsp; tasks.forEach(t => {

&nbsp;   els.allList.appendChild(taskItemTemplate(t));

&nbsp;   if (t.today) els.todayList.appendChild(taskItemTemplate(t));

&nbsp; });

}



/\*\*\*\*\*\*\*\*\*\*\*\*\*\*

&nbsp;\* Timer

&nbsp;\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

function formatMMSS(sec) {

&nbsp; const m = Math.floor(sec / 60);

&nbsp; const s = sec % 60;

&nbsp; return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

}



function renderClock() {

&nbsp; els.clock.textContent = formatMMSS(timer.remaining);

}



function setMode(mode) {

&nbsp; timer.mode = mode;

&nbsp; timer.remaining = mode === 'work' ? timer.workSec : timer.breakSec;

&nbsp; renderClock();

&nbsp; saveState();

}



function startTimer() {

&nbsp; // sync lengths from inputs

&nbsp; timer.workSec = Math.max(60, Number(els.workMin.value) \* 60 || 40 \* 60);

&nbsp; timer.breakSec = Math.max(60, Number(els.breakMin.value) \* 60 || 5 \* 60);



&nbsp; // if remaining doesn't match current mode length (e.g., changed settings), reset to mode length

&nbsp; const target = timer.mode === 'work' ? timer.workSec : timer.breakSec;

&nbsp; if (timer.remaining > target) timer.remaining = target;



&nbsp; if (timer.intervalID) clearInterval(timer.intervalID);

&nbsp; timer.intervalID = setInterval(() => {

&nbsp;   timer.remaining -= 1;

&nbsp;   if (timer.remaining <= 0) {

&nbsp;     clearInterval(timer.intervalID);

&nbsp;     timer.intervalID = null;

&nbsp;     timer.remaining = 0;

&nbsp;     renderClock();

&nbsp;     // play beep if provided

&nbsp;     if (els.beep.src) {

&nbsp;       els.beep.currentTime = 0;

&nbsp;       els.beep.volume = 0.7;

&nbsp;       els.beep.play().catch(() => {});

&nbsp;     }

&nbsp;     // auto-switch mode

&nbsp;     const next = timer.mode === 'work' ? 'break' : 'work';

&nbsp;     setMode(next);

&nbsp;     // optional: auto-start next session; comment out if you want manual

&nbsp;     startTimer();

&nbsp;     return;

&nbsp;   }

&nbsp;   renderClock();

&nbsp; }, 1000);

}



function pauseTimer() {

&nbsp; if (timer.intervalID) {

&nbsp;   clearInterval(timer.intervalID);

&nbsp;   timer.intervalID = null;

&nbsp; }

}



function resetTimer() {

&nbsp; pauseTimer();

&nbsp; setMode(timer.mode); // reset remaining to current mode length

}



/\*\*\*\*\*\*\*\*\*\*\*\*\*\*

&nbsp;\* Events

&nbsp;\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

els.form.addEventListener('submit', (e) => {

&nbsp; e.preventDefault();

&nbsp; addTask(els.input.value, els.chkToday.checked);

&nbsp; els.input.value = '';

&nbsp; els.chkToday.checked = false;

});



els.mode.addEventListener('change', () => setMode(els.mode.value));

els.start.addEventListener('click', startTimer);

els.pause.addEventListener('click', pauseTimer);

els.reset.addEventListener('click', resetTimer);



/\*\*\*\*\*\*\*\*\*\*\*\*\*\*

&nbsp;\* Init

&nbsp;\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

loadState();



// initialize inputs from state

els.workMin.value = Math.round(timer.workSec / 60);

els.breakMin.value = Math.round(timer.breakSec / 60);

els.mode.value = timer.mode;



renderTasks();

renderClock();



# **Step 5 — Verify the MVP**



Add tasks✔️



Toggle “Today” ✔️



Complete/delete ✔️



Change Work/Break lengths ✔️



Start/Pause/Reset timer ✔️



Auto-switch between Work/Break ✔️



Data persists with localStorage ✔️



# **Step 6 — (Optional now) Alarm sound**



Grab a short MP3 (e.g., from Pixabay Sounds), put it in your project, then set:



<audio id="beep" src="./alarm.mp3" preload="auto"></audio>





**You can adjust volume later with:**



els.beep.volume = 0.5;



# **What’s next (after MVP works)**



Add “current task” selection to work on during a session.



Session stats (sessions completed today).



Nicer UI (animations, theming).



Then plan Phase 2 (React or keep Vanilla + Firebase).



If you want, I can help you add “current task focus” next (click a Today-task → marks it as the active one for the running session, shows below the clock).

