let jsonData = null;

let currentLang = 'bg';

const labels = {
  bg: {
    title: "Escape Room JSON Редактор",
    langLabel: "Език на интерфейса:",
    download: "Изтегли редактирания JSON",
    add: "Добави нова загадка",
    newJson: "🆕 Създай нов JSON файл",
    chooseFile: "📁 Избери JSON файл",
    noFile: "Няма избран файл",
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
    newJson: "🆕 Create New JSON File",
    chooseFile: "📁 Choose JSON File",
    noFile: "No file selected",
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
  direction: "direction (L, R, U, D), например: L-R-R-D",
  word: "word (A-Z или А-Я), например:HELLO",
  color: "color (R=🔴, G=🟢, B=🔵, W=⚪, Y=🟡), напр.: R-R-G",
  shape: "shape (T=🔺, R=⬛, C=⚪, S=⭐), напр.: T-S-R"
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
    type: "number",
    answer: ["1"],
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
      document.getElementById('downloadBtn').style.display = 'inline-block';

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Невалиден JSON',
        text: 'Файлът не може да бъде зареден. Уверете се, че е валиден JSON.',
      });
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
    number: (v) => v,
    digit: (v) => v, // за съвместимост
    direction: (v) => {
      const map = { L: "⬅️", R: "➡️", U: "⬆️", D: "⬇️" };
      return map[v] || v;
    },
    letter: (v) => v,
    word: (v) => v, // също да показва просто текста
    color: (v) => {
      const map = { R: "🔴", G: "🟢", B: "🔵", W: "⚪", Y: "🟡" };
      return map[v] || v;
    },
    shape: (v) => {
      const map = { T: "🔺", R: "⬛", C: "⚪", S: "⭐" };
      return map[v] || v;
    }
  };

  const visualize = symbols[puzzle.type];
  if (!visualize) return `<div class="answer-visual">(${puzzle.answer.join(' ')})</div>`;

  return `<div class="answer-visual">${puzzle.answer.map(a => visualize(a)).join(' ')}</div>`;
}




function updateText(index, lang, value) {
  jsonData.puzzles[index].text[lang] = value;
}

function updateAnswer(index, value) {
  console.log("updateAnswer called with value:", value);

  try {
    const type = jsonData.puzzles[index].type;
    let parts;

    const validators = {
      number: (v) => /^\d+$/.test(v),
      direction: (v) => ['L', 'R', 'U', 'D'].includes(v),
      word: (v) => /^[A-Za-zА-Яа-я]+$/.test(v),
      color: (v) => ['R', 'G', 'B', 'W', 'Y'].includes(v),
      shape: (v) => ['T', 'R', 'C', 'S'].includes(v)
    };

    if (type === "word") {
      if (!validators.word(value.trim())) {
        Swal.fire({
          icon: 'error',
          title: 'Невалиден отговор',
          text: `Допустими са само букви за тип "word".`,
        });
        return;
      }
      parts = [value.trim()];
    } else {
      parts = value.split('-').map(p => p.trim()).filter(p => p !== '');

      const isValid = parts.every(p => validators[type](p));
      if (!isValid) {
        Swal.fire({
          icon: 'error',
          title: 'Невалиден отговор',
          text: `Някои части не отговарят на типа "${type}".`,
        });
        return;
      }
    }

    if (parts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Празен отговор',
        text: 'Отговорът не може да е празен.',
      });
      return;
    }

    jsonData.puzzles[index].answer = parts;
    displayPuzzles(jsonData.puzzles);
  } catch (err) {
    console.error("❌ Грешка в updateAnswer:", err);
    Swal.fire({
      icon: 'error',
      title: 'Грешка',
      text: 'Възникна неочаквана грешка при обработката на отговора.'
    });
  }
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
      number: (v) => v,
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
  if (jsonData.puzzles.length <= 1) {
    Swal.fire({
      icon: 'info',
      title: 'Минимум 1 загадка',
      text: 'Не можеш да изтриеш последната загадка. JSON файлът трябва да съдържа поне една.',
    });
    return;
  }

  Swal.fire({
    title: 'Изтриване на загадка',
    text: 'Сигурни ли сте, че искате да изтриете тази загадка?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Да, изтрий',
    cancelButtonText: 'Отказ',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      jsonData.puzzles.splice(index, 1);
      displayPuzzles(jsonData.puzzles);

      Swal.fire({
        icon: 'success',
        title: 'Изтрита!',
        text: 'Загадката беше премахната.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}



function updateInterfaceText() {
  const l = labels[currentLang];

  document.getElementById('title').textContent = l.title;

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    if (jsonData) {
      downloadBtn.textContent = l.download;
      downloadBtn.style.display = 'inline-block';
    } else {
      downloadBtn.style.display = 'none';
    }
  }


  const addBtn = document.getElementById('addPuzzleBtn');
  if (addBtn) addBtn.textContent = l.add;

  const newJsonBtn = document.getElementById('newJsonBtn');
  if (newJsonBtn) newJsonBtn.textContent = l.newJson;

  const fileLabel = document.querySelector('.file-label');
  if (fileLabel) fileLabel.textContent = l.chooseFile;

  const fileNameSpan = document.getElementById('fileName');
  if (fileNameSpan && !jsonData) fileNameSpan.textContent = l.noFile;
}


document.getElementById('newJsonBtn').addEventListener('click', () => {
  const newPuzzle = {
    id: Date.now(),
    type: "number",   // <-- правилно
    answer: ["1"],    // <-- правилен отговор
    text: {
      bg: "Текст на нова загадка",
      en: "New puzzle text"
    }
  };

  jsonData = {
    puzzles: [newPuzzle]
  };

  displayPuzzles(jsonData.puzzles);
  document.getElementById("fileName").textContent = "Нов JSON документ";
  document.getElementById("downloadBtn").disabled = false;
  document.getElementById("addPuzzleBtn").style.display = 'block';
  document.getElementById('downloadBtn').style.display = 'inline-block';
});


function loadJsonData(data) {
  // Изчисти текущия контейнер
  const container = document.getElementById('puzzleContainer');
  container.innerHTML = '';

  data.puzzles.forEach(puzzle => {
    renderPuzzle(puzzle);
  });

  // Запазваме текущите данни (ако имате глобална променлива за това)
  jsonData = data;
}

function removePuzzleFromView(index) {
  Swal.fire({
    title: 'Премахване на пъзел',
    text: 'Сигурни ли сте, че искате да премахнете този пъзел? Промените няма да се запазят.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Да, премахни',
    cancelButtonText: 'Отказ',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const container = document.getElementById('puzzleContainer');
      const puzzleDivs = container.querySelectorAll('.puzzle');
      if (puzzleDivs[index]) {
        puzzleDivs[index].remove();

        Swal.fire({
          icon: 'info',
          title: 'Премахнато от изгледа',
          text: 'Пъзелът беше премахнат само визуално.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  });
}

