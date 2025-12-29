const currentCategory = document.getElementById("currentCategory");
const categoryDescription = document.getElementById("categoryDescription");
const history = document.getElementById("history");
const spinButton = document.getElementById("spinButton");
const resetButton = document.getElementById("resetButton");
const boardInputs = document.querySelectorAll("input[name='board']");

const categories = {
  A: [
    {
      title: "Gruppe oder Solokünstler",
      description:
        "Schreibt auf, ob der Song von einem Solokünstler oder einer Band gesungen/gespielt wird. Die Antwort zeigt 👥, wenn es eine Gruppe ist. Duette oder Gastauftritte zählen als Gruppe.",
    },
    {
      title: "Vor 2000?",
      description:
        "Notiert „Ja“, wenn der Song vor 2000 veröffentlicht wurde, sonst „Nein“.",
    },
    {
      title: "4 Jahre früher oder später",
      description:
        "Schreibt das Veröffentlichungsjahr auf. Ein Punkt, wenn ihr innerhalb von ±4 Jahren liegt. Exakt richtig: Kreuz eines Mitspielers löschen.",
    },
    {
      title: "Jahrzehnt",
      description:
        "Schreibt das Jahrzehnt auf, z. B. 1960er oder Achtziger Jahre.",
    },
    {
      title: "2 Jahre früher oder später",
      description:
        "Notiert das Veröffentlichungsjahr. Ein Punkt, wenn ihr innerhalb von ±2 Jahren liegt. Exakt richtig: Kreuz eines Mitspielers löschen.",
    },
  ],
  B: [
    {
      title: "Titel des Songs",
      description:
        "Notiert den Titel des Songs. Wenn der Titel fast, aber nicht ganz richtig ist, entscheiden die Mitspieler, ob es einen Punkt gibt.",
    },
    {
      title: "Genaues Erscheinungsjahr",
      description:
        "Notiert das Jahr, in dem der Song veröffentlicht wurde. Exakt richtig gibt einen Punkt. Hinweis: Es zählt das Veröffentlichungsjahr oder die erste öffentliche Aufführung.",
    },
    {
      title: "Name der Band oder des Künstlers",
      description:
        "Notiert den Namen! Bei Zusammenarbeit mehrerer Künstler zählt der wichtigste Solokünstler als korrekt.",
    },
    {
      title: "Jahrzehnt",
      description:
        "Schreibt das Jahrzehnt auf, z. B. 1960er oder Achtziger Jahre.",
    },
    {
      title: "3 Jahre früher oder später",
      description:
        "Notiert das Veröffentlichungsjahr. Ein Punkt, wenn ihr innerhalb von ±3 Jahren liegt.",
    },
  ],
};

let historyEntries = [];

const getSelectedBoard = () =>
  document.querySelector("input[name='board']:checked")?.value ?? "A";

const updateDisplay = (entry) => {
  if (!entry) {
    currentCategory.textContent = "–";
    categoryDescription.textContent = "–";
    history.textContent = historyEntries.length
      ? historyEntries.join(" · ")
      : "–";
    return;
  }

  currentCategory.textContent = entry.title;
  categoryDescription.textContent = entry.description;
  history.textContent = historyEntries.join(" · ");
};

const spinCategory = () => {
  const board = getSelectedBoard();
  const list = categories[board];
  const randomIndex = Math.floor(Math.random() * list.length);
  const picked = list[randomIndex];
  historyEntries = [picked.title, ...historyEntries].slice(0, 8);
  updateDisplay(picked);
};

const resetHistory = () => {
  historyEntries = [];
  updateDisplay();
};

boardInputs.forEach((input) => {
  input.addEventListener("change", () => {
    resetHistory();
  });
});

spinButton.addEventListener("click", spinCategory);
resetButton.addEventListener("click", resetHistory);

resetHistory();
