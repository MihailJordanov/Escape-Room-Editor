let jsonData = null;

let currentLang = 'bg';

const labels = {
  bg: {
    title: "Escape Room JSON Редактор",
    langLabel: "Език на интерфейса:",
    download: "Изтегли редактирания JSON",
    add: "Добави нова загадка",
    type: "Тип ключалка",
    textBg: "Текст (BG)",
    textEn: "Текст (EN)",
    answer: "Отговор",
    delete: "Изтрий",
    puzzle: "Загадка"
  },
  en: {
    title: "Escape Room JSON Editor",
    langLabel: "Interface language:",
    download: "Download Edited JSON",
    add: "Add New Puzzle",
    type: "Lock type",
    textBg: "Text (BG)",
    textEn: "Text (EN)",
    answer: "Answer",
    delete: "Delete",
    puzzle: "Puzzle"
  }
};


document.querySelectorAll('.lang-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentLang = button.dataset.lang;
    updateInterfaceText();
    if (jsonData) displayPuzzles(jsonData.puzzles);
    updateActiveLangButton(); // за визуален ефект
  });
});

function updateActiveLangButton() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active-lang');
    } else {
      btn.classList.remove('active-lang');
    }
  });
}


document.getElementById('addPuzzleBtn').addEventListener('click', () => {
  const newPuzzle = {
    id: Date.now(),
    type: "digit",
    answer: [],
    text: {
      en: "New puzzle text",
      bg: "Текст на нова загадка"
    }
  };
  jsonData.puzzles.push(newPuzzle);
  displayPuzzles(jsonData.puzzles);
});


document.getElementById('fileInput').addEventListener('change', handleFile);

document.getElementById('downloadBtn').addEventListener('click', () => {
  const dataStr = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "edited_escape_room.json";
  a.click();
  URL.revokeObjectURL(url);
});

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
        jsonData = JSON.parse(e.target.result);
        displayPuzzles(jsonData.puzzles);
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('addPuzzleBtn').disabled = false; // ← ново
    } catch (err) {
        alert("Невалиден JSON файл.");
    }
  };

  reader.readAsText(file);
}
function displayPuzzles(puzzles) {
  const container = document.getElementById('puzzleContainer');
  container.innerHTML = '';
  puzzles.forEach((puzzle, index) => {
    const div = document.createElement('div');
    div.className = 'puzzle';

    const l = labels[currentLang];

    const typeOptions = ['digit', 'direction', 'letter', 'color', 'shape']
      .map(type => `<option value="${type}" ${puzzle.type === type ? 'selected' : ''}>${type}</option>`)
      .join('');

    div.innerHTML = `
      <h3>${l.puzzle} ${index + 1}</h3>

      <label>${l.type}:</label>
      <select onchange="updateType(${index}, this.value)">
        ${typeOptions}
      </select><br><br>

      <label>${l.textBg}:</label><br>
      <input type="text" value="${puzzle.text.bg}" onchange="updateText(${index}, 'bg', this.value)"><br><br>

      <label>${l.textEn}:</label><br>
      <input type="text" value="${puzzle.text.en}" onchange="updateText(${index}, 'en', this.value)"><br><br>

      <label>${l.answer}:</label><br>
      <div style="margin-top: 5px;">${visualizeAnswer(puzzle)}</div>
      <input type="text" value="${puzzle.answer.join('-')}" onchange="updateAnswer(${index}, this.value)">
      <button onclick="deletePuzzle(${index})" style="margin-left:10px;color:red;">${l.delete}</button>
    `;
    container.appendChild(div);
  });
}

function visualizeAnswer(puzzle) {
  const symbols = {
    digit: (v) => v,
    direction: (v) => v === 'L' ? '⬅️' : v === 'R' ? '➡️' : v,
    letter: (v) => v,
    color: (v) => {
      const map = { R: '🔴', G: '🟢', B: '🔵', W: '⚪', Y: '🟡' };
      return map[v] || v;
    },
    shape: (v) => {
      const map = { T: '🔺', R: '⬛', C: '⚪', S: '⭐' };
      return map[v] || v;
    }
  };

  return puzzle.answer.map(a => symbols[puzzle.type](a)).join(' ');
}



function updateText(index, lang, value) {
  jsonData.puzzles[index].text[lang] = value;
}

function updateAnswer(index, value) {
  const type = jsonData.puzzles[index].type;
  const parts = value.split('-');

  const validators = {
    digit: (v) => /^\d+$/.test(v),
    direction: (v) => ['L', 'R'].includes(v),
    letter: (v) => /^[А-ЯA-Zа-яa-z]$/.test(v),
    color: (v) => ['R', 'G', 'B', 'W', 'Y'].includes(v),
    shape: (v) => ['T', 'R', 'C', 'S'].includes(v)
  };

  const isValid = parts.every(p => validators[type](p.trim()));

  if (!isValid) {
    alert(`Невалиден отговор за тип "${type}"`);
    return;
  }

  jsonData.puzzles[index].answer = parts.map(p => p.trim());
  displayPuzzles(jsonData.puzzles); // за да се обнови визуализацията
}

function updateType(index, newType) {
  jsonData.puzzles[index].type = newType;
}

function deletePuzzle(index) {
  if (confirm("Сигурен ли си, че искаш да изтриеш тази загадка?")) {
    jsonData.puzzles.splice(index, 1);
    displayPuzzles(jsonData.puzzles);
  }
}

function updateInterfaceText() {
  const l = labels[currentLang];

  document.getElementById('title').textContent = l.title;

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.textContent = l.download;

  const addBtn = document.getElementById('addPuzzleBtn');
  if (addBtn) addBtn.textContent = l.add;
}


document.getElementById('langSelect').addEventListener('change', (e) => {
  currentLang = e.target.value;
  updateInterfaceText(); // ← добавено
  displayPuzzles(jsonData.puzzles);
});
