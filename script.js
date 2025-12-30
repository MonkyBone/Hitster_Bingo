const categoryTitle = document.getElementById("categoryTitle");
const categoryDescription = document.getElementById("categoryDescription");
const history = document.getElementById("history");
const spinButton = document.getElementById("spinButton");
const boardInputs = document.querySelectorAll("input[name='board']");
const spinnerPointer = document.getElementById("spinnerPointer");
const spinnerBoard = document.querySelector(".spinner-board");
const spinnerSegments = document.querySelectorAll(".category-segment");

const categories = {
  A: [
    {
      title: "Gruppe oder Solokünstler",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/Grupo-o-solista-300x270.png",
      color: "#7fd39a",
      description:
        "Schreibt auf, ob der Song von einem Solokünstler oder einer Band gesungen/gespielt wird. Die Antwort zeigt 👥, wenn es eine Gruppe ist. Duette oder Gastauftritte zählen als Gruppe.",
    },
    {
      title: "Vor 2000?",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/2000-300x270.png",
      color: "#f1b6f2",
      description:
        "Notiert „Ja“, wenn der Song vor 2000 veröffentlicht wurde, sonst „Nein“.",
    },
    {
      title: "4 Jahre früher oder später",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/4-300x270.png",
      color: "#f5d36c",
      description:
        "Schreibt das Veröffentlichungsjahr auf. Ein Punkt, wenn ihr innerhalb von ±4 Jahren liegt. Exakt richtig: Kreuz eines Mitspielers löschen.",
    },
    {
      title: "Jahrzehnt",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/Decada-300x270.png",
      color: "#9f87ff",
      description:
        "Schreibt das Jahrzehnt auf, z. B. 1960er oder Achtziger Jahre.",
    },
    {
      title: "2 Jahre früher oder später",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/2-300x270.png",
      color: "#8fc0ff",
      description:
        "Notiert das Veröffentlichungsjahr. Ein Punkt, wenn ihr innerhalb von ±2 Jahren liegt. Exakt richtig: Kreuz eines Mitspielers löschen.",
    },
  ],
  B: [
    {
      title: "Titel des Songs",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/notas-neon-300x270.png",
      color: "#7fd39a",
      description:
        "Notiert den Titel des Songs. Wenn der Titel fast, aber nicht ganz richtig ist, entscheiden die Mitspieler, ob es einen Punkt gibt.",
    },
    {
      title: "Genaues Erscheinungsjahr",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/ano-exacto-300x270.png",
      color: "#f1b6f2",
      description:
        "Notiert das Jahr, in dem der Song veröffentlicht wurde. Exakt richtig gibt einen Punkt. Hinweis: Es zählt das Veröffentlichungsjahr oder die erste öffentliche Aufführung.",
    },
    {
      title: "Name der Band oder des Künstlers",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/Nombre-del-Grupo-o-solista-300x270.png",
      color: "#f5d36c",
      description:
        "Notiert den Namen! Bei Zusammenarbeit mehrerer Künstler zählt der wichtigste Solokünstler als korrekt.",
    },
    {
      title: "Jahrzehnt",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/Decada-300x270.png",
      color: "#9f87ff",
      description:
        "Schreibt das Jahrzehnt auf, z. B. 1960er oder Achtziger Jahre.",
    },
    {
      title: "3 Jahre früher oder später",
      symbol:
        "https://hitstergame.com/wp-content/uploads/2024/03/3-300x270.png",
      color: "#8fc0ff",
      description:
        "Notiert das Veröffentlichungsjahr. Ein Punkt, wenn ihr innerhalb von ±3 Jahren liegt.",
    },
  ],
};

let historyEntries = [];
let isSpinning = false;
let currentAngle = 0;
let recentIndices = [];

const getRandomIndex = (max) => {
  if (max <= 0) return 0;
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
};

const getRandomFloat = (min, max) => {
  if (max <= min) return min;
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return min + (values[0] / 0xffffffff) * (max - min);
  }
  return min + Math.random() * (max - min);
};

const pickIndexAvoidingRecent = (length) => {
  if (length <= 1) return 0;
  const blocked = new Set(recentIndices.slice(0, Math.min(2, length)));
  if (blocked.size >= length) {
    blocked.clear();
    if (recentIndices[0] !== undefined) {
      blocked.add(recentIndices[0]);
    }
  }
  let index = getRandomIndex(length);
  let attempts = 0;
  while (blocked.has(index) && attempts < 10) {
    index = getRandomIndex(length);
    attempts += 1;
  }
  if (blocked.has(index)) {
    for (let i = 0; i < length; i += 1) {
      if (!blocked.has(i)) {
        return i;
      }
    }
  }
  return index;
};

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
  const sliceAngle = 360 / list.length;
  spinnerSegments.forEach((segment, index) => {
    const label = segment.querySelector(".segment-label");
    const icon = segment.querySelector(".segment-icon");
    const entry = list[index];
    if (!entry || !label || !icon) {
      return;
    }
    label.textContent = entry.title ?? "–";
    icon.src = entry.symbol ?? "";
    icon.alt = entry.title ?? "";
    const angle = index * sliceAngle + sliceAngle / 2;
    segment.style.setProperty("--segment-angle", `${angle}deg`);
  });
  if (spinnerBoard) {
    const gradientStops = list
      .map((entry, index) => {
        const start = index * sliceAngle;
        const end = start + sliceAngle;
        return `${entry.color ?? "#444"} ${start}deg ${end}deg`;
      })
      .join(", ");
    spinnerBoard.style.background = `conic-gradient(${gradientStops})`;
  }
  updateDisplay();
};

const spinCategory = () => {
  if (isSpinning) return;
  const board = getSelectedBoard();
  const list = categories[board];
  const randomIndex = pickIndexAvoidingRecent(list.length);
  const picked = list[randomIndex];
  const sliceAngle = 360 / list.length;
  const targetAngle = randomIndex * sliceAngle + sliceAngle / 2;
  const extraSpins = 3 * 360;
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;
  const delta = (targetAngle - normalizedAngle + 360) % 360;
  currentAngle = currentAngle + extraSpins + delta;
  const spinDuration = getRandomFloat(5, 10).toFixed(2);

  isSpinning = true;
  spinButton.disabled = true;
  spinnerPointer.style.transition = `transform ${spinDuration}s cubic-bezier(0.12, 0.9, 0.12, 1)`;
  spinnerPointer.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;

  const onStop = () => {
    spinnerPointer.removeEventListener("transitionend", onStop);
    historyEntries = [picked.title, ...historyEntries].slice(0, 8);
    recentIndices = [randomIndex, ...recentIndices].slice(0, 2);
    updateDisplay(picked);
    isSpinning = false;
    spinButton.disabled = false;
  };
  spinnerPointer.addEventListener("transitionend", onStop);
};

boardInputs.forEach((input) => {
  input.addEventListener("change", () => {
    historyEntries = [];
    recentIndices = [];
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
