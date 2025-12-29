const currentNumber = document.getElementById("currentNumber");
const drawButton = document.getElementById("drawButton");
const resetButton = document.getElementById("resetButton");
const minInput = document.getElementById("minInput");
const maxInput = document.getElementById("maxInput");
const remaining = document.getElementById("remaining");
const history = document.getElementById("history");

let availableNumbers = [];
let drawnNumbers = [];

const getRange = () => {
  const min = Number(minInput.value);
  const max = Number(maxInput.value);
  return { min, max };
};

const buildRange = () => {
  const { min, max } = getRange();
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min) {
    return [];
  }
  const size = max - min + 1;
  return Array.from({ length: size }, (_, index) => min + index);
};

const updateStatus = () => {
  if (availableNumbers.length === 0) {
    remaining.textContent = "Keine Zahlen mehr verfügbar. Bitte zurücksetzen.";
  } else {
    remaining.textContent = `Noch ${availableNumbers.length} Zahlen verfügbar.`;
  }

  history.textContent = drawnNumbers.length
    ? drawnNumbers.join(", ")
    : "–";
};

const resetRound = () => {
  availableNumbers = buildRange();
  drawnNumbers = [];
  currentNumber.textContent = "–";
  updateStatus();
};

const drawNumber = () => {
  if (availableNumbers.length === 0) {
    updateStatus();
    return;
  }

  const index = Math.floor(Math.random() * availableNumbers.length);
  const [number] = availableNumbers.splice(index, 1);
  drawnNumbers.unshift(number);
  currentNumber.textContent = number;
  updateStatus();
};

minInput.addEventListener("change", resetRound);
maxInput.addEventListener("change", resetRound);
drawButton.addEventListener("click", drawNumber);
resetButton.addEventListener("click", resetRound);

resetRound();
