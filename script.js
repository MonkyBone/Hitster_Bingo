const categoryTitle = document.getElementById("categoryTitle");
const categoryDescription = document.getElementById("categoryDescription");
const history = document.getElementById("history");
const spinButton = document.getElementById("spinButton");
const boardInputs = document.querySelectorAll("input[name='board']");
const spinnerPointer = document.getElementById("spinnerPointer");
const spinnerSegments = document.querySelectorAll(".category-segment");

const categories = {
  A: [
    {
      title: "Gruppe oder Solokünstler",
      short: "Gruppe/Solo",
      description:
        "Schreibt auf, ob der Song von einem Solokünstler oder einer Band gesungen/gespielt wird. Die Antwort zeigt 👥, wenn es eine Gruppe ist. Duette oder Gastauftritte zählen als Gruppe.",
    },
    {
      title: "Vor 2000?",
      short: "Vor 2000?",
      description:
        "Notiert „Ja“, wenn der Song vor 2000 veröffentlicht wurde, sonst „Nein“.",
    },
    {
      title: "4 Jahre früher oder später",
      short: "Jahr ±4",
      description:
        "Schreibt das Veröffentlichungsjahr auf. Ein Punkt, wenn ihr innerhalb von ±4 Jahren liegt. Exakt richtig: Kreuz eines Mitspielers löschen.",
    },
    {
      title: "Jahrzehnt",
      short: "Jahrzehnt",
      description:
        "Schreibt das Jahrzehnt auf, z. B. 1960er oder Achtziger Jahre.",
    },
    {
      title: "2 Jahre früher oder später",
      short: "Jahr ±2",
      description:
        "Notiert das Veröffentlichungsjahr. Ein Punkt, wenn ihr innerhalb von ±2 Jahren liegt. Exakt richtig: Kreuz eines Mitspielers löschen.",
    },
  ],
  B: [
    {
      title: "Titel des Songs",
      short: "Songtitel",
      description:
        "Notiert den Titel des Songs. Wenn der Titel fast, aber nicht ganz richtig ist, entscheiden die Mitspieler, ob es einen Punkt gibt.",
    },
    {
      title: "Genaues Erscheinungsjahr",
      short: "Exakt Jahr",
      description:
        "Notiert das Jahr, in dem der Song veröffentlicht wurde. Exakt richtig gibt einen Punkt. Hinweis: Es zählt das Veröffentlichungsjahr oder die erste öffentliche Aufführung.",
    },
    {
      title: "Name der Band oder des Künstlers",
      short: "Künstler",
      description:
        "Notiert den Namen! Bei Zusammenarbeit mehrerer Künstler zählt der wichtigste Solokünstler als korrekt.",
    },
    {
      title: "Jahrzehnt",
      short: "Jahrzehnt",
      description:
        "Schreibt das Jahrzehnt auf, z. B. 1960er oder Achtziger Jahre.",
    },
    {
      title: "3 Jahre früher oder später",
      short: "Jahr ±3",
      description:
        "Notiert das Veröffentlichungsjahr. Ein Punkt, wenn ihr innerhalb von ±3 Jahren liegt.",
    },
  ],
};

let historyEntries = [];
let isSpinning = false;
let currentAngle = 0;

const getSelectedBoard = () =>
  document.querySelector("input[name='board']:checked")?.value ?? "A";

const updateDisplay = (entry) => {
  if (!entry) {
    categoryTitle.textContent = "–";
    categoryDescription.textContent = "–";
  } else {
    categoryTitle.textContent = entry.title;
    categoryDescription.textContent = entry.description;
  }
  history.textContent = historyEntries.length
    ? historyEntries.join(" · ")
    : "–";
};

const updateSegments = () => {
  const board = getSelectedBoard();
  const list = categories[board];
  spinnerSegments.forEach((segment, index) => {
    segment.textContent = list[index]?.short ?? "–";
  });
  updateDisplay();
};

const spinCategory = () => {
  if (isSpinning) return;
  const board = getSelectedBoard();
  const list = categories[board];
  const randomIndex = Math.floor(Math.random() * list.length);
  const picked = list[randomIndex];
  const sliceAngle = 360 / list.length;
  const targetAngle = 360 - (randomIndex * sliceAngle + sliceAngle / 2);
  const extraSpins = 3 * 360;
  currentAngle = currentAngle + extraSpins + targetAngle;

  isSpinning = true;
  spinButton.disabled = true;
  spinnerPointer.style.transition = "transform 5s cubic-bezier(0.12, 0.9, 0.12, 1)";
  spinnerPointer.style.transform = `rotate(${currentAngle}deg)`;

  const onStop = () => {
    spinnerPointer.removeEventListener("transitionend", onStop);
    historyEntries = [picked.title, ...historyEntries].slice(0, 8);
    updateDisplay(picked);
    isSpinning = false;
    spinButton.disabled = false;
  };
  spinnerPointer.addEventListener("transitionend", onStop);
};

boardInputs.forEach((input) => {
  input.addEventListener("change", () => {
    historyEntries = [];
    updateSegments();
  });
});

spinButton.addEventListener("click", spinCategory);

const params = new URLSearchParams(window.location.search);
const boardParam = params.get("board");
if (boardParam === "A" || boardParam === "B") {
  document.querySelector(`input[name='board'][value='${boardParam}']`).checked =
    true;
}

updateSegments();
