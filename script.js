const display = document.getElementById('display');
const history = document.getElementById('history');
const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

let current = '0';   // number being typed
let previous = null; // stored number
let operator = null;
let justEvaluated = false;

function update() {
  display.textContent = current;
  history.textContent = previous !== null && operator ? `${previous} ${symbols[operator]}` : '';
}

function inputNumber(n) {
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (n === '.' && current.includes('.')) return;
  current = current === '0' && n !== '.' ? n : current + n;
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
  }
}

function format(n) {
  if (!isFinite(n)) return 'Error';
  return String(parseFloat(n.toPrecision(12)));
}

function chooseOperator(op) {
  if (operator && !justEvaluated && previous !== null) equals(true);
  if (current === 'Error') return;
  previous = parseFloat(current);
  operator = op;
  justEvaluated = false;
  current = '0';
}

function equals(chain = false) {
  if (operator === null || previous === null) return;
  const result = calculate(previous, parseFloat(current), operator);
  const text = format(result);
  if (chain) { current = text; }
  else {
    history.textContent = `${previous} ${symbols[operator]} ${current} =`;
    current = text; operator = null; previous = null; justEvaluated = true;
    display.textContent = current;
    return;
  }
  operator = null; previous = null;
}

function clearAll() { current = '0'; previous = null; operator = null; justEvaluated = false; }
function backspace() {
  if (justEvaluated || current === 'Error') { current = '0'; return; }
  current = current.length > 1 ? current.slice(0, -1) : '0';
}
function percent() { current = format(parseFloat(current) / 100); }

document.querySelector('.keys').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.num) inputNumber(b.dataset.num);
  else if (b.dataset.op) chooseOperator(b.dataset.op);
  else if (b.dataset.action === 'equals') { equals(); return; }
  else if (b.dataset.action === 'clear') clearAll();
  else if (b.dataset.action === 'back') backspace();
  else if (b.dataset.action === 'percent') percent();
  update();
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (/^[0-9.]$/.test(e.key)) inputNumber(e.key);
  else if ('+-*/'.includes(e.key)) chooseOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); return; }
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clearAll();
  else if (e.key === '%') percent();
  else return;
  update();
});
update();