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

const explanationMap = {
  number: "number (0-9), например: 4 или 421",
  direction: "direction (L, R, U, D), например: L-R-R-D или LRRD",
  word: "word (A-Z или А-Я), например:HELLO",
  color: "color (R=🔴, G=🟢, B=🔵, W=⚪, Y=🟡), напр.: R-R-G или RRG",
  shape: "shape (T=🔺, R=⬛, C=⚪, S=⭐), напр.: T-S-R или TSR"
};



document.getElementById('addPuzzleBtn').style.display = 'none';

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
  if (!jsonData || !Array.isArray(jsonData.puzzles)) return;

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

document.getElementById('fileInput').addEventListener('change', (e) => {
  const fileNameSpan = document.getElementById('fileName');
  const file = e.target.files[0];
  fileNameSpan.textContent = file ? file.name : "Няма избран файл";
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
      if (!Array.isArray(jsonData.puzzles)) {
        jsonData.puzzles = [];
      }
      displayPuzzles(jsonData.puzzles);
      document.getElementById('downloadBtn').disabled = false;
      document.getElementById('addPuzzleBtn').style.display = 'block';
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

    const typeOptions = ['number', 'direction', 'word', 'color', 'shape']
      .map(type => `<option value="${type}" ${puzzle.type === type ? 'selected' : ''}>${type}</option>`)
      .join('');

    div.innerHTML = `
      <h3>${l.puzzle} ${index + 1}</h3>

      <label>${l.type}:</label>
      <div>
        <select onchange="updateType(${index}, this.value)">
          ${typeOptions}
        </select>
      </div>
      <div class="type-explanation">${explanationMap[puzzle.type] || ""}</div><br><br>

      <label>${l.textBg}:</label><br>
      <input type="text" value="${puzzle.text.bg}" onchange="updateText(${index}, 'bg', this.value)"><br><br>

      <label>${l.textEn}:</label><br>
      <input type="text" value="${puzzle.text.en}" onchange="updateText(${index}, 'en', this.value)"><br><br>

      <label>${l.answer}:</label><br>
      <div style="margin-top: 5px;">${visualizeAnswer(puzzle)}</div>
      <input type="text" value="${puzzle.answer.join('-')}" onchange="updateAnswer(${index}, this.value)">\
      <div class="delete-btn-wrapper">
        <button class="delete-btn" onclick="deletePuzzle(${index})">🗑️ ${l.delete}</button>
      </div>


    `;
    container.appendChild(div);
  });
}

function visualizeAnswer(puzzle) {
  const symbols = {
    digit: (v) => v,
    direction: (v) => {
      const map = { L: "⬅️", R: "➡️", U: "⬆️", D: "⬇️" };
      return map[v] || v;
    },
    letter: (v) => v,
    color: (v) => {
      const map = { R: "🔴", G: "🟢", B: "🔵", W: "⚪", Y: "🟡" };
      return map[v] || v;
    },
    shape: (v) => {
      const map = { T: "🔺", R: "⬛", C: "⚪", S: "⭐" };
      return map[v] || v;
    }
  };

  return `<div class="answer-visual">${puzzle.answer.map(a => symbols[puzzle.type](a)).join(' ')}</div>`;
}




function updateText(index, lang, value) {
  jsonData.puzzles[index].text[lang] = value;
}

function updateAnswer(index, value) {
  const type = jsonData.puzzles[index].type;

  // Ако има тирета — използваме ги, иначе режем по символ
  let parts = value.includes('-') ? value.split('-') : value.split('');

  const validators = {
    number: (v) => /^\d+$/.test(v),                         // напр. "9", "23"
    direction: (v) => ['L', 'R', 'U', 'D'].includes(v),     // ⬅️ ➡️ ⬆️ ⬇️
    word: (v) => /^[A-Za-zА-Яа-я]+$/.test(v),               // дума на кирилица/латиница
    color: (v) => ['R', 'G', 'B', 'W', 'Y'].includes(v),    // 🔴 🟢 🔵 ⚪ 🟡
    shape: (v) => ['T', 'R', 'C', 'S'].includes(v)          // 🔺 ⬛ ⚪ ⭐
  };

  const isValid = parts.every(p => validators[type](p.trim()));

  if (!isValid) {
    alert(`Невалиден отговор за тип "${type}"`);
    return;
  }

  jsonData.puzzles[index].answer = parts.map(p => p.trim());
  displayPuzzles(jsonData.puzzles); // обновяване
}


function updateType(index, newType) {
  jsonData.puzzles[index].type = newType;

  // Намери селекцията и обяснението вътре в същата загадка
  const puzzleDivs = document.querySelectorAll('.puzzle');
  const currentPuzzle = puzzleDivs[index];

  // Обнови обяснението
  const explanationSpan = currentPuzzle.querySelector('.type-explanation');
  if (explanationSpan) {
    explanationSpan.textContent = explanationMap[newType] || "";
  }

  // Обнови визуализацията на отговора
  const answerDiv = currentPuzzle.querySelector('.answer-visual');
  if (answerDiv) {
    const puzzle = jsonData.puzzles[index];
    const symbols = {
      digit: (v) => v,
      direction: (v) => {
        const map = { L: "⬅️", R: "➡️", U: "⬆️", D: "⬇️" };
        return map[v] || v;
      },
      letter: (v) => v,
      color: (v) => {
        const map = { R: "🔴", G: "🟢", B: "🔵", W: "⚪", Y: "🟡" };
        return map[v] || v;
      },
      shape: (v) => {
        const map = { T: "🔺", R: "⬛", C: "⚪", S: "⭐" };
        return map[v] || v;
      }
    };
    answerDiv.innerHTML = puzzle.answer.map(a => symbols[newType](a)).join(' ');
  }
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
