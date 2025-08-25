const els = {
  form: document.getElementById('sub-form'),
  name: document.getElementById('sub-name'),
  start: document.getElementById('sub-start'),
  days: document.getElementById('sub-days'),
  list: document.getElementById('sub-list'),
};

let subs = [];

function addSub(name, startDate, days) {
  const start = new Date(startDate);
  const expire = new Date(start);
  expire.setDate(expire.getDate() + days);

  subs.push({
    id: crypto.randomUUID(),
    name,
    start: start.toISOString().split('T')[0],
    expire: expire.toISOString().split('T')[0],
    days,
  });

  saveSubs();
  renderSubs();
}

function removeSub(id) {
  subs = subs.filter(x => x.id !== id);
  saveSubs();
  renderSubs();
}

function renderSubs() {
  els.list.textContent = '';

  subs.forEach(sub => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${sub.name}</strong><br>
      Expires: ${sub.expire}
    `;

    const btnDel = document.createElement('button');
    btnDel.textContent = '🗑 Cancel';
    btnDel.addEventListener('click', () => removeSub(sub.id));

    li.appendChild(btnDel);
    els.list.appendChild(li);
  });
}

function saveSubs() {
  localStorage.setItem('focusflow:subs', JSON.stringify(subs));
}

function loadSubs() {
  const raw = localStorage.getItem('focusflow:subs');
  if (!raw) return;
  try {
    subs = JSON.parse(raw);
  } catch (e) {
    subs = [];
  }
}

els.form.addEventListener('submit', e => {
  e.preventDefault();
  const name = els.name.value.trim();
  const start = els.start.value;
  const days = Number(els.days.value);
  if (!name || !start || !days) return;
  addSub(name, start, days);
  els.name.value = '';
  els.start.value = '';
  els.days.value = '';
});

loadSubs();
renderSubs();
