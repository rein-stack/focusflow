const els = {
  form: document.getElementById('goal-form'),
  input: document.getElementById('goal-input'),
  category: document.getElementById('goal-category'),
  workList: document.getElementById('work-list'),
  studyList: document.getElementById('study-list'),
  healthList: document.getElementById('health-list'),
  lifeList: document.getElementById('life-list'),
};

const custom = document.querySelector('.custom-select');
const selected = custom.querySelector('.selected');
const options = custom.querySelector('.options');
const realSelect = document.getElementById('goal-category');

selected.addEventListener('click', () => {
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

options.querySelectorAll('div').forEach(opt => {
  opt.addEventListener('click', () => {
    selected.textContent = opt.textContent;
    realSelect.value = opt.dataset.value;
    options.style.display = 'none';
  });
});

document.addEventListener('click', e => {
  if (!custom.contains(e.target)) options.style.display = 'none';
});


let goals = [];

function addGoal(text, category) {
  const g = { id: crypto.randomUUID(), text, category, done: false };
  goals.push(g);
  saveGoals();
  renderGoals();
}

function toggleDone(id) {
  const g = goals.find(x => x.id === id);
  if (!g) return;
  g.done = !g.done;
  saveGoals();
  renderGoals();
}

function removeGoal(id) {
  goals = goals.filter(x => x.id !== id);
  saveGoals();
  renderGoals();
}

function goalItemTemplate(g) {
  const li = document.createElement('li');
  if (g.done) li.classList.add('done');

  // Wrap checkbox in a label for custom styling
  const label = document.createElement('label');
  label.classList.add('cute-checkbox');

  // Actual checkbox (hidden)
  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.checked = g.done;
  chk.addEventListener('change', () => toggleDone(g.id));

  // Custom checkmark span
  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark';

  // Goal text
  const span = document.createElement('span');
  span.className = 'text';
  span.textContent = g.text;

  label.append(chk, checkmark, span);

  // Delete button
  const btnDel = document.createElement('button');
  btnDel.textContent = '🗑';
  btnDel.addEventListener('click', () => removeGoal(g.id));

  li.append(label, btnDel);
  return li;
}


function renderGoals() {
  els.workList.textContent = '';
  els.studyList.textContent = '';
  els.healthList.textContent = '';
  els.lifeList.textContent = '';

  goals.forEach(g => {
    const li = goalItemTemplate(g);
    if (g.category === 'work') els.workList.appendChild(li);
    if (g.category === 'study') els.studyList.appendChild(li);
    if (g.category === 'health') els.healthList.appendChild(li);
    if (g.category === 'life') els.lifeList.appendChild(li);
  });
}

function saveGoals() {
  localStorage.setItem('focusflow:goals', JSON.stringify(goals));
}

function loadGoals() {
  const raw = localStorage.getItem('focusflow:goals');
  if (!raw) return;
  try {
    goals = JSON.parse(raw);
  } catch (e) {
    goals = [];
  }
}

els.form.addEventListener('submit', e => {
  e.preventDefault();
  const text = els.input.value.trim();
  const cat = els.category.value;
  if (!text) return;
  addGoal(text, cat);
  els.input.value = '';
});
// Make goal sections collapsible
function makeCollapsible() {
  const blocks = document.querySelectorAll('.list-block');
  blocks.forEach(block => {
    const header = block.querySelector('h3');
    const list = block.querySelector('ul');
    
    // Start collapsed
    list.style.maxHeight = '0';
    list.style.overflow = 'hidden';
    list.style.transition = 'max-height 0.3s ease';

    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      if (list.style.maxHeight === '0px' || list.style.maxHeight === '0') {
        list.style.maxHeight = list.scrollHeight + 'px'; // expand
      } else {
        list.style.maxHeight = '0'; // collapse
      }
    });
  });
}




loadGoals();
renderGoals();
makeCollapsible();


