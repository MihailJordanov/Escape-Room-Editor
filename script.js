let jsonData = null;
let mode = null; // "player" или "admin"
let currentRoom = null;
const ADMIN_PASSWORD = "admin123"; 
let currentLang = 'bg'; 
let currentRoomIndex = null;
let adminSubMode = "start"; // "start" или "editing"
let lastUploadedOldFileName = null;
let lastUploadedNewFileName = null;
let finalRoomsJSONName = null;
let finalRoomsJSONData = null;


const labels = {
  bg: {
    title: "Escape Room",
    langLabel: "Език на интерфейса:",
    download: "Изтегли редактирания JSON",
    add: "Добави нова загадка",
    regime: "Избери режим",
    chooseRoom: "Избери стая",
    enterRoom: "Вход",
    adminPswdPrompt: "Въведи администраторска парола",
    enterAsAdmin: "🛠️ Вход като админ",
    check: "✅ Провери",
    back: "⬅️ Назад",
    logout: "🚪 Излез",
    player: "🎮 Влез като играч",
    roomPasswordInput: "Въведи парола за стаята",
    riddles: "🔜 Активни загадки",
    solved: "✔️ Решени загадки",
    admin: "🛠️ Влез като администратор",
    newJson: "🆕 Създай нов JSON файл",
    chooseFile: "📁 Избери JSON файл",
    noFile: "Няма избран файл",
    type: "Тип ключалка",
    textBg: "Текст (BG)",
    textEn: "Текст (EN)",
    answer: "Отговор",
    delete: "Изтрий",
    puzzle: "Загадка",

    logoutSuccess: "Изход успешен!",
    logoutText: "Върнахте се към началния екран.",
    wrongPassword: "Грешна парола",
    invalidJson: "Невалиден JSON",
    invalidJsonText: "Файлът не може да бъде зареден. Уверете се, че е валиден JSON.",
    deletePuzzleTitle: "Изтриване на загадка",
    deletePuzzleText: "Сигурни ли сте, че искате да изтриете тази загадка?",
    confirmDelete: "Да, изтрий",
    cancel: "Отказ",
    deleted: "Изтрита!",
    deletedText: "Загадката беше премахната.",
    minPuzzles: "Минимум 1 загадка",
    minPuzzlesText: "Не можеш да изтриеш последната загадка. JSON файлът трябва да съдържа поне една.",
    invalidAnswer: "Невалиден отговор",
    emptyAnswer: "Празен отговор",
    emptyAnswerText: "Отговорът не може да е празен.",
    error: "Грешка",
    errorText: "Възникна неочаквана грешка при обработката на отговора.",
    correct: "Правилно!",
    correctText: "Загадката е решена.",
    wrongAnswer: "Грешен отговор",
    wrongAnswerText: "Опитай отново.",
    backSuccess: "Успешно се върнахте!",
    onlyLetters: `Допустими са само букви за тип "word".`,
    someParts: "Някои части не отговарят на типа",
    uploadJSON: "Качи нов JSON файл",
    loadJSON: "Зареди JSON",
    jsonError: "Грешка при четене на JSON файла.",
    noRooms: "Няма стаи за редакция.",
    redactRoom: "Редактиране на стая:",
    addSucccess: "Добавянето успешно!",
    noChosenFile: "Няма избран файл",
    attachFinal: "Прикачи краен JSON файл",
    uploadFinal: "Качи краен JSON файл",
    finalSuccess: "Успешно качихте краен JSON файл!"
  },
  en: {
    title: "Escape Room",
    langLabel: "Interface language:",
    download: "Download Edited JSON",
    add: "Add New Puzzle",
    regime: "Choose regime",
    chooseRoom: "Choose a room",
    enterRoom: "Enter room",
    adminPswdPrompt: "Enter admin's password",
    enterAsAdmin: "🛠️ Enter as an admin",
    check: "✅ Check",
    back: "⬅️ Back",
    logout: "🚪 Logout",
    player: "🎮 Enter as Player",
    roomPasswordInput: "Enter room password",
    riddles: "🔜 Active riddles",
    solved: "✔️ Solved riddles",
    admin: "🛠️ Enter as Admin",
    newJson: "🆕 Create New JSON File",
    chooseFile: "📁 Choose JSON File",
    noFile: "No file selected",
    type: "Lock type",
    textBg: "Text (BG)",
    textEn: "Text (EN)",
    answer: "Answer",
    delete: "Delete",
    puzzle: "Puzzle",

    logoutSuccess: "Logout successful!",
    logoutText: "You have returned to the main screen.",
    wrongPassword: "Wrong password",
    invalidJson: "Invalid JSON",
    invalidJsonText: "The file cannot be loaded. Make sure it is valid JSON.",
    deletePuzzleTitle: "Delete puzzle",
    deletePuzzleText: "Are you sure you want to delete this puzzle?",
    confirmDelete: "Yes, delete",
    cancel: "Cancel",
    deleted: "Deleted!",
    deletedText: "The puzzle has been removed.",
    minPuzzles: "Minimum 1 puzzle",
    minPuzzlesText: "You cannot delete the last puzzle. The JSON file must contain at least one.",
    invalidAnswer: "Invalid answer",
    emptyAnswer: "Empty answer",
    emptyAnswerText: "The answer cannot be empty.",
    error: "Error",
    errorText: "An unexpected error occurred while processing the answer.",
    correct: "Correct!",
    correctText: "The puzzle is solved.",
    wrongAnswer: "Wrong answer",
    wrongAnswerText: "Try again.",
    backSuccess: "Seccessful return!",
    onlyLetters: `Only letters of type "word" are permitted.`,
    someParts: "Some parts don't correspond to the type",
    uploadJSON: "Upload new JSON file",
    loadJSON: "Load JSON",
    jsonError: "An error occured during reading the JSON file.",
    noRooms: "No rooms to redact.",
    redactRoom: "Redacting room:",
    addSucccess: "Successfully added!",
    noChosenFile: "No chosen file",
    attachFinal: "Attach final JSON file",
    uploadFinal: "Upload final JSON file",
    finalSuccess: "Seccessful upload of final JSON file!"
  }
};

const explanationMap = {
  number: "number (0-9), например/example: 4 или 421",
  direction: "direction (L, R, U, D), например/example: L-R-R-D",
  word: "word (A-Z или/or А-Я), например/example:HELLO",
  color: "color (R=🔴, G=🟢, B=🔵, W=⚪, Y=🟡), напр./ex.: R-R-G",
  shape: "shape (T=🔺, R=⬛, C=⚪, S=⭐), напр./ex.: T-S-R"
};

document.getElementById('addPuzzleBtn').style.display = 'none';

document.querySelectorAll('.lang-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentLang = button.dataset.lang;
    updateInterfaceText();
    
  if (mode === 'admin') {
    if (adminSubMode === 'editing' && currentRoomIndex !== null) {
      enterRoomEditingMode(currentRoomIndex);
      const fileNameSpan = document.getElementById("fileName");
      document.getElementById("oldFormatFileInput").style.display = "none";
      if (fileNameSpan && lastUploadedOldFileName) {
      fileNameSpan.textContent = lastUploadedOldFileName;
      }
    } else if (jsonData) {
      enterAdminMode(false); 
      showRoomsSelection();  
    }
    } else if (mode === 'player') {
      if (currentRoom) {
        displayPlayerMode(currentRoom.puzzles);
        document.getElementById("adminRoomsCardsContainer").style.display = "none"; 
        document.querySelector(".upload-controls").style.display = "none";
      }
    }

    updateActiveLangButton(); 
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

document.getElementById('fileInput').addEventListener('change', (e) => {
  const l = labels[currentLang];
  const fileNameSpan = document.getElementById('fileName');
  const file = e.target.files[0];
  fileNameSpan.textContent = file ? file.name : `${l.noFile}`;
});

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const l = labels[currentLang];
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      jsonData = JSON.parse(e.target.result);
      if (!Array.isArray(jsonData.rooms[currentRoomIndex].puzzles)) {
        jsonData.rooms[currentRoomIndex].puzzles = [];
      }
      displayPuzzles(jsonData.rooms[currentRoomIndex].puzzles);
      document.getElementById('downloadBtn').disabled = false;
      document.getElementById('addPuzzleBtn').style.display = 'block';
      document.getElementById('downloadBtn').style.display = 'inline-block';

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: `${l.invalidJson}`,
        text: `${l.invalidJsonText}`,
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
  jsonData.rooms[currentRoomIndex].puzzles[index].text[lang] = value;
}

function updateAnswer(index, value) {
  console.log("updateAnswer called with value:", value);
  const l = labels[currentLang];

  try {
    const type = jsonData.rooms[currentRoomIndex].puzzles[index].type;
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
          title: `${l.invalidAnswer}`,
          text: `${l.onlyLetters}`,
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
          title: `${l.invalidAnswer}`,
          text: `${l.someParts} "${type}".`,
        });
        return;
      }
    }

    if (parts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: `${l.emptyAnswer}`,
        text: `${l.emptyAnswerText}`,
      });
      return;
    }

    jsonData.rooms[currentRoomIndex].puzzles[index].answer = parts;
    displayPuzzles(jsonData.rooms[currentRoomIndex].puzzles);
  } catch (err) {
    console.error("❌ Грешка в updateAnswer:", err);
    Swal.fire({
      icon: 'error',
      title: `${l.error}`,
      text: `${l.errorText}`
    });
  }
}

function updateType(index, newType) {
  jsonData.rooms[currentRoomIndex].puzzles[index].type = newType;

  const puzzleDivs = document.querySelectorAll('.puzzle');
  const currentPuzzle = puzzleDivs[index];

  const explanationSpan = currentPuzzle.querySelector('.type-explanation');
  if (explanationSpan) {
    explanationSpan.textContent = explanationMap[newType] || "";
  }

  const answerDiv = currentPuzzle.querySelector('.answer-visual');
  if (answerDiv) {
    const puzzle = jsonData.rooms[currentRoomIndex].puzzles[index];
    const symbols = {
      number: (v) => v,
      direction: (v) => {
        const map = { L: "⬅️", R: "➡️", U: "⬆️", D: "⬇️" };
        return map[v] || v;
      },
      word: (v) => v,
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
  const l = labels[currentLang];

  if (jsonData.rooms[currentRoomIndex].puzzles.length <= 1) {
    Swal.fire({
      icon: 'info',
      title: `${l.minPuzzles}`,
      text: `${l.minPuzzlesText}`,
    });
    return;
  }

  Swal.fire({
    title: `${l.deletePuzzleTitle}`,
    text: `${l.deletePuzzleText}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `${l.confirmDelete}`,
    cancelButtonText: `${l.cancel}`,
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      jsonData.rooms[currentRoomIndex].puzzles.splice(index, 1);
      displayPuzzles(jsonData.rooms[currentRoomIndex].puzzles);

      Swal.fire({
        icon: 'success',
        title: `${l.deleted}`,
        text: `${l.deletedText}`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

function updateRoomListLanguage() {
  
  const roomList = document.getElementById('roomList');
  const options = roomList.querySelectorAll('option');
  
  options.forEach(option => {
    const roomId = option.value;
    const roomData = jsonData.rooms?.[roomId];

    if (!roomData) {
      console.warn(`No data for roomId: ${roomId}`);
      return; 
    }
    
    if (currentLang === 'bg') {
      option.textContent = roomData.name;
    } else {
      option.textContent = roomData.nameEn;
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

  const regimeText = document.getElementById('regime');
  if (regimeText) regimeText.textContent = l.regime;

  const playerBtn = document.getElementById('playModeBtn');
  if (playerBtn) playerBtn.textContent = l.player;

  const chooseRoomText = document.getElementById('chooseRoom');
  if (chooseRoomText) chooseRoomText.textContent = l.chooseRoom;

  const playerInputPswd = document.getElementById('roomPasswordInput');
  if (playerInputPswd) playerInputPswd.placeholder = l.roomPasswordInput;

  const enterRoomBtn = document.getElementById('enterRoomBtn');
  if (enterRoomBtn) enterRoomBtn.textContent = l.enterRoom;

  const adminBtn = document.getElementById('adminModeBtn');
  if (adminBtn) adminBtn.textContent = l.admin;

  const adminPswdText = document.getElementById('adminPswd');
  if (adminPswdText) adminPswdText.textContent = l.adminPswdPrompt;

  const enterAsAdminBtn = document.getElementById('adminEnterBtn');
  if (enterAsAdminBtn) enterAsAdminBtn.textContent = l.enterAsAdmin;

  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.textContent = l.back;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.textContent = l.logout;
   
  const addBtn = document.getElementById('addPuzzleBtn');
  if (addBtn) addBtn.textContent = l.add;

  const newJsonBtn = document.getElementById('newJsonBtn');
  if (newJsonBtn) newJsonBtn.textContent = l.newJson;

  const fileLabel = document.querySelector('.file-label');
  if (fileLabel) fileLabel.textContent = l.chooseFile;

  const fileNameSpan = document.getElementById('fileName');
  if (fileNameSpan && !jsonData) fileNameSpan.textContent = l.noFile;

  const loadNewFormatBtn = document.getElementById('loadNewFormatBtn');
  if (loadNewFormatBtn) loadNewFormatBtn.textContent = l.loadJSON;

  updateRoomListLanguage();

  const activeRiddles = document.getElementById('activeRiddles');
  if (activeRiddles) activeRiddles.textContent = l.riddles;

  const uploadNewJSON = document.getElementById('uploadNewJSON');
  if (uploadNewJSON) uploadNewJSON.textContent = l.uploadJSON;

  if (mode === 'admin' && adminSubMode === 'start') {
    showRoomsSelection();
  }


  const fileName = document.getElementById('fileName');
  if (fileName) fileName.textContent = l.noChosenFile;
}


document.getElementById('newJsonBtn').addEventListener('click', () => {
  const newPuzzle = {
    id: Date.now(),
    type: "number",  
    answer: ["1"],   
    text: {
      bg: "Текст на нова загадка",
      en: "New puzzle text"
    }
  };

  jsonData = {
    puzzles: [newPuzzle]
  };

  displayPuzzles(jsonData.rooms[currentRoomIndex].puzzles);
  document.getElementById("fileName").textContent = "Нов JSON документ";
  document.getElementById("downloadBtn").disabled = false;
  document.getElementById("addPuzzleBtn").style.display = 'block';
  document.getElementById('downloadBtn').style.display = 'inline-block';
});


function loadJsonData(data) {
  const container = document.getElementById('puzzleContainer');
  container.innerHTML = '';

  data.puzzles.forEach(puzzle => {
    renderPuzzle(puzzle);
  });

  jsonData = data;
}

function removePuzzleFromView(index) {
  const l = labels[currentLang];

  Swal.fire({
    title: `${l.deletePuzzleTitle}`,
    text: `${l.deletePuzzleText}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: `${l.confirmDelete}`,
    cancelButtonText: `${l.cancel}`,
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const container = document.getElementById('puzzleContainer');
      const puzzleDivs = container.querySelectorAll('.puzzle');
      if (puzzleDivs[index]) {
        puzzleDivs[index].remove();

        Swal.fire({
          icon: 'info',
          title: `${l.deleted}`,
          text: `${l.deletedText}`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  });
}

document.getElementById("playModeBtn").addEventListener("click", async () => {
  mode = "player";

  try {
    const res = await fetch("get_rooms.php");
    const rooms = await res.json();

    // Записваме данните, за да ги използваме при избор
    jsonData = { rooms };

    document.getElementById("modeSelector").style.display = "none";
    document.getElementById("roomSelector").style.display = "block";
    showBackButton();

    const select = document.getElementById("roomList");
    select.innerHTML = "";

    // Добави опции
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = currentLang === "bg" ? "Избери стая" : "Choose a room";
    select.appendChild(defaultOption);

    rooms.forEach((room, index) => {
      const option = document.createElement("option");
      option.value = room.id;
      option.textContent = currentLang === "bg" ? room.name_bg : room.name_en;
      select.appendChild(option);
    });

    // Зареждане на изображение
    document.getElementById("roomList").addEventListener("change", function () {
      const selectedRoomId = parseInt(this.value);
      const room = rooms.find(r => r.id == selectedRoomId);
      const image = document.getElementById("roomImage");
      if (room && room.image_url) {
        image.src = room.image_url;
        image.style.display = "block";
      } else {
        image.style.display = "none";
      }
    });

    console.log("✅ Заредени стаи от базата в player mode:", rooms);
  } catch (err) {
    console.error("❌ Грешка при зареждане на стаи:", err);
    Swal.fire("Грешка", "Не можа да се зареди списък със стаи", "error");
  }
});



document.getElementById("adminModeBtn").addEventListener("click", () => {
  mode = "admin";
  document.getElementById("modeSelector").style.display = "none";
  document.getElementById("adminLogin").style.display = "block";
  showBackButton();
});

document.getElementById("adminEnterBtn").addEventListener("click", () => {
  const pass = document.getElementById("adminPasswordInput").value;
  const l = labels[currentLang];

  if (pass === ADMIN_PASSWORD) {
    enterAdminMode();
  } else {
    Swal.fire(l.wrongPassword, "", "error");
  }
});


function enterAdminMode(reset = true) {
  adminSubMode = "start";
  showAdminStartScreen();
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("adminLogin").style.display = "none";
  showLogoutButton();

  document.querySelector(".file-controls").style.display = "none";

  document.getElementById("puzzleContainer").style.display = "none";
  document.getElementById("addPuzzleBtn").style.display = "none";

  if (reset) {
    jsonData = { rooms: [] };
    currentRoomIndex = null;
  }
}


function showAdminStartScreen() {
  const l = labels[currentLang];
  let container = document.getElementById("adminStartScreen");

  if (!container) {
    container = document.createElement("div");
    container.id = "adminStartScreen";
    document.body.appendChild(container);
  }

  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.height = "100%";
  container.style.gap = "20px";

  container.innerHTML = `
    <div class="upload-controls">
      <h2 id="uploadNewJSON">${l.uploadJSON}</h2>
      <input type="file" id="newFormatFileInput" accept=".json" hidden/>
      <button id="customUploadBtn">${l.uploadJSON}</button>
      <span id="newFileName">${lastUploadedNewFileName ? lastUploadedNewFileName : l.noFile}</span>
      <button id="loadNewFormatBtn">${l.loadJSON}</button>
    </div>
    <div id="adminRoomsCardsContainer" class="rooms-cards-container"></div>
  `;

  document.getElementById("customUploadBtn").addEventListener("click", () => {
    document.getElementById("newFormatFileInput").click();
  });

  document.getElementById("loadNewFormatBtn").onclick = () => {
    const fileInput = document.getElementById("newFormatFileInput");

    if (fileInput.files.length === 0) {
      Swal.fire(`${l.invalidJsonText}`, "", "warning");
      return;
    }

    lastUploadedNewFileName = fileInput.files[0].name;
    document.getElementById("newFileName").textContent = lastUploadedNewFileName;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.rooms) {
          Swal.fire(`${l.invalidJson}`, "", "error");
          return;
        }
        jsonData = parsed;
        currentRoomIndex = null;
        container.style.display = "none";

        showRoomsSelection();
      } catch (err) {
        Swal.fire(`${l.jsonError}`, "", "error");
      }
    };
    reader.readAsText(file);
  };
}


function showRoomsSelection() {
  const l = labels[currentLang];
  const container = document.getElementById("adminRoomsCardsContainer");
  container.innerHTML = ""; 

  if (!jsonData.rooms || jsonData.rooms.length === 0) {
    container.innerHTML = `<p>${l.noRooms}</p>`;
    return;
  }

  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.gap = "20px";
  container.style.justifyContent = "center";
  container.style.padding = "10px";

  const screen = document.getElementById("adminStartScreen");
  screen.style.display = "flex";
  screen.style.flexDirection = "column";
  screen.style.alignItems = "center";
  screen.style.justifyContent = "flex-start";
  screen.style.gap = "20px";


  jsonData.rooms.forEach((room, idx) => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.dataset.index = idx;

    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.width = "150px";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="${room.image || 'assets/images/default-room.jpg'}" alt="${currentLang == "bg" ? room.name : room.nameEn || 'Стая'}" />
      <div>${currentLang == "bg" ? room.name : room.nameEn || `Стая ${idx + 1}`}</div>
    `;

    const img = card.querySelector("img");
    card.style.width = "200px";

    img.style.width = "100%"; 
    img.style.height = "200px"; 
    img.style.borderRadius = "8px";
    img.style.objectFit = "cover";
    img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

    const labelDiv = card.querySelector("div");
    labelDiv.style.marginTop = "8px";
    labelDiv.style.textAlign = "center";
    labelDiv.style.fontWeight = "600";
    labelDiv.style.fontSize = "1rem";
    labelDiv.style.color = "#333";
    labelDiv.style.userSelect = "none";

    card.addEventListener("click", () => {
      currentRoomIndex = idx;
      enterRoomEditingMode(idx);
    });

    container.appendChild(card);
  });
}

function enterRoomEditingMode(roomIndex) {
  adminSubMode = "editing";
  currentRoomIndex = roomIndex;
  const l = labels[currentLang];
  const room = jsonData.rooms[roomIndex];
  if (!room) return;

  document.getElementById("adminStartScreen").style.display = "none";
  document.getElementById("title").textContent = `${l.redactRoom} ${currentLang == "bg" ? room.name : room.nameEn}`;
  document.getElementById("puzzleContainer").style.display = "block";
  document.getElementById("addPuzzleBtn").style.display = "inline-block";
  
  displayPuzzles(room.puzzles);

  document.querySelector('.file-controls').style.display = 'block'; 

  downloadBtn.style.display = "block";
  const addPuzzleBtn = document.getElementById('addPuzzleBtn');
  const newBtn = addPuzzleBtn.cloneNode(true);
  addPuzzleBtn.replaceWith(newBtn);

  newBtn.addEventListener('click', () => {
    if (!jsonData || !Array.isArray(jsonData.rooms[roomIndex].puzzles)) return;

    const newPuzzle = {
      id: Date.now(),
      type: "number",
      answer: ["1"],
      text: {
        en: "New puzzle text",
        bg: "Текст на нова загадка"
      },
      solved: false
    };

    jsonData.rooms[roomIndex].puzzles.push(newPuzzle);
    displayPuzzles(jsonData.rooms[roomIndex].puzzles);
  });

  const oldDownloadBtn = document.getElementById("downloadBtn");
  const newDownloadBtn = oldDownloadBtn.cloneNode(true);
  oldDownloadBtn.replaceWith(newDownloadBtn);


newDownloadBtn.addEventListener('click', async () => {
  // ⬇️ Изтегляне на локален JSON файл (оригинален)
  const localDataStr = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([localDataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "edited_escape_room.json";
  a.click();
  URL.revokeObjectURL(url);

  // ⬆️ Подготовка за ъпдейт към базата
  try {
    const sanitizedData = JSON.parse(JSON.stringify(jsonData)); // deep copy

    // normalize puzzle types
    sanitizedData.rooms.forEach((room, i) => {
      if (!room.id) {
        room.id = i + 1;
      }
      if (room.puzzles && Array.isArray(room.puzzles)) {
        room.puzzles.forEach(p => {
          if (p.type === "digit") p.type = "number";
          if (p.type === "letter") p.type = "word"; 
          p.solved = p.solved === true;
        });
      }
    });






    const uploadDataStr = JSON.stringify(sanitizedData, null, 2);

    console.log("➡️ Изпращам към update_from_json.php:");
    console.log(uploadDataStr);
    const res = await fetch("update_from_json.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: uploadDataStr
    });

    const result = await res.json();
    if (result.success) {
      Swal.fire("✅ Успех", "Базата данни беше обновена", "success");
    } else {
      throw new Error(result.error || "Неуспешно обновяване");
    }
  } catch (err) {
    console.error("❌ Грешка при запис в базата:", err);
    Swal.fire("Грешка", "Базата не можа да бъде обновена", "error");
  }
});

  setupOldFormatUpload(room);

  document.getElementById("backBtn").style.display = "inline-block";
  document.getElementById("backBtn").onclick = () => {
  adminSubMode = "start";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("oldFormatFileInput").style.display = "none";
  showRoomsSelection();
  document.getElementById("puzzleContainer").style.display = "none";
  document.getElementById("addPuzzleBtn").style.display = "none";
  document.getElementById("title").textContent = "Escape Room";
  document.getElementById("modeSelector").style.display = "none";
};
}

function setupOldFormatUpload(room) {
  const l = labels[currentLang];

  const oldFormatLabel = document.getElementById("oldFormatLabel");

  let oldJsonInput = document.getElementById("oldFormatFileInput");

  if (!oldJsonInput) {
    oldJsonInput = document.createElement("input");
    oldJsonInput.type = "file";
    oldJsonInput.id = "oldFormatFileInput";
    oldJsonInput.accept = ".json";

    oldJsonInput.style.display = "none";

    oldFormatLabel.insertAdjacentElement('afterend', oldJsonInput);
  } else {
    oldJsonInput.style.display = "block";
  }

  const fileNameSpan = document.getElementById("fileName");

  oldJsonInput.onchange = () => {
    if (oldJsonInput.files.length > 0) {
    lastUploadedOldFileName = oldJsonInput.files[0].name;
    fileNameSpan.textContent = oldJsonInput.files[0].name;
  } else {
    fileNameSpan.textContent = "Няма избран файл";
  }

    const file = oldJsonInput.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const oldFormatData = JSON.parse(e.target.result);
        if (!Array.isArray(oldFormatData.puzzles)) {
          Swal.fire(`${l.invalidJson}`, "", "error");
          return;
        }

        const existingIds = new Set(room.puzzles.map(p => p.id));

        const newPuzzles = oldFormatData.puzzles.map(puzzle => {
          let newId = puzzle.id;
          while (existingIds.has(newId)) {
            newId = Date.now() + Math.floor(Math.random() * 10000);
          }
          puzzle.id = newId;
          existingIds.add(newId);
          return puzzle;
        });

        room.puzzles = room.puzzles.concat(newPuzzles);

        displayPuzzles(room.puzzles);

        Swal.fire(`${l.addSucccess}`, "", "success");

        oldJsonInput.value = ""; 
      } catch {
        Swal.fire(`${l.jsonError}`, "", "error");
      }
    };
    reader.readAsText(file);
  };
}

function showRoomSelector() {
  document.getElementById("modeSelector").style.display = "none";
  document.getElementById("roomSelector").style.display = "block";
  showBackButton()

  const l = labels[currentLang];
  const select = document.getElementById("roomList");
  select.innerHTML = "";

  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.textContent = l.chooseRoom;
  firstOption.disabled = true; 
  firstOption.selected = true; 
  select.appendChild(firstOption);

  if (!finalRoomsJSONData){
    fetch("sample.json") 
      .then(response => response.json())
      .then(data => {
        jsonData = data;
        data.rooms.forEach((room, i) => {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = currentLang === 'bg' ? room.name : room.nameEn;
          select.appendChild(option);
        });
      });
  } else {
    finalRoomsJSONData.rooms.forEach((room, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = currentLang === 'bg' ? room.name : room.nameEn;
      select.appendChild(option);
  });

  
    jsonData = finalRoomsJSONData;
    updateInterfaceText();

  }
}


document.getElementById("enterRoomBtn").addEventListener("click", async () => {
  const l = labels[currentLang];
  const roomId = parseInt(document.getElementById("roomList").value);
  const pass = document.getElementById("roomPasswordInput").value;

  const room = jsonData.rooms.find(r => r.id === roomId);
  if (!room) {
    Swal.fire("Моля, избери стая", "", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("id", roomId);
  formData.append("password", pass);

  try {
    const response = await fetch("check_password.php", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Сървърът върна грешка");

    const result = await response.text();

    if (result.trim() === "1") {
      console.log("Парола е вярна. Зареждам пъзелите...");

      const puzzlesRes = await fetch(`get_puzzles.php?room_id=${roomId}`);
      const puzzles = await puzzlesRes.json();

      const transformedPuzzles = puzzles.map(p => ({
        ...p,
        text: {
          bg: p.text_bg,
          en: p.text_en
        },
        answer: (p.answer || "").split("-")
      }));

      currentRoom = { ...room, puzzles: transformedPuzzles };
      displayPlayerMode(transformedPuzzles);

    } else {
      Swal.fire(`${l.wrongPassword}`, "", "error");
    }
  } catch (err) {
    console.error("Грешка при проверка на парола:", err);
    Swal.fire("Грешка", "Проблем при връзка със сървъра", "error");
    console.log("🎯 Изпращам към check_password.php:");
    console.log("roomId:", roomId);
    console.log("password:", pass);

  }
});


function displayPlayerMode(puzzles) {
  
  document.getElementById("backBtn").style.display = "none";
  showLogoutButton();

  // Скриване на admin елементи, ако съществуват
  const adminCards = document.getElementById("adminRoomsCardsContainer");
  if (adminCards) adminCards.style.display = "none";

  const uploadControls = document.querySelector(".upload-controls");
  if (uploadControls) uploadControls.style.display = "none";

  const l = labels[currentLang];

  const active = puzzles.filter(p => !p.solved);
  const solved = puzzles.filter(p => p.solved);

  document.getElementById("roomSelector").style.display = "none";
  document.getElementById("puzzleContainer").style.display = "block";

  const container = document.getElementById("puzzleContainer");
  container.innerHTML = `<h2 style="text-align: center;">${l.riddles}</h2>`;

  active.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "puzzle";
    div.innerHTML = `
      <div>${p.text[currentLang]}</div>
      <input type="text" id="ans-${i}" />
      <button onclick="checkAnswer(${i})">${l.check}</button>
    `;
    container.appendChild(div);
  });

  if (solved.length > 0) {
    const solvedSection = document.createElement("div");
    solvedSection.innerHTML = `<h3 style="text-align: center;">${l.solved}</h3>`;
    solved.forEach(p => {
      const div = document.createElement("div");
      div.className = "puzzle";
      div.innerHTML = `<div>${p.text[currentLang]} - ${p.answer.join("-").toUpperCase()}✅ </div>`;
      solvedSection.appendChild(div);
    });
    container.appendChild(solvedSection);
  }
}

function checkAnswer(index) {
  const l = labels[currentLang];

  console.log("Check answer was called");
  const input = document.getElementById(`ans-${index}`).value.trim();
  const puzzle = currentRoom.puzzles.filter(p => !p.solved)[index];
  const correct = puzzle.answer.join("-").toLowerCase() === input.toLowerCase();

  if (correct) {
    puzzle.solved = true;
    Swal.fire(`${l.correct}`, `${l.correctText}`, "success").then(() => {
      displayPlayerMode(currentRoom.puzzles);
    });
  } else {
    Swal.fire(`${l.wrongAnswer}`, `${l.wrongAnswerText}`, "warning");
  }
}

document.getElementById('logoutBtn').addEventListener('click', function() {

    document.getElementById('logoutBtn').style.display = 'none';
    mode = null;
    document.getElementById('modeSelector').style.display = 'block';
    lastUploadedNewFileName = null;
    lastUploadedOldFileName = null;
    currentRoom = null;
    currentRoomIndex = null;

    document.getElementById('roomSelector').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'none';
    document.querySelector('.file-controls').style.display = 'none';
    document.getElementById('puzzleContainer').innerHTML = '';
    document.getElementById('addPuzzleBtn').style.display = 'none';
    document.getElementById("adminStartScreen").style.display = "none";
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("newFormatFileInput").style.display = "none";
    jsonData = null;
    
  
    
    document.getElementById('roomPasswordInput').value = '';
    document.getElementById('adminPasswordInput').value = '';
    
    const l = labels[currentLang];
    Swal.fire({
      title: l.logoutSuccess,
      text: l.logoutText,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
});

document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('modeSelector').style.display = 'block';
    
    document.getElementById('roomSelector').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'none';
    document.querySelector('.file-controls').style.display = 'none';
    document.getElementById('puzzleContainer').innerHTML = '';
    document.getElementById('addPuzzleBtn').style.display = 'none';
    
    document.getElementById('backBtn').style.display = 'none';
    
    document.getElementById('roomPasswordInput').value = '';
    document.getElementById('adminPasswordInput').value = '';
    
    const l = labels[currentLang];
    Swal.fire({
      title: l.backSuccess,
      text: l.logoutText,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
});

function showLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');

  if (!logoutBtn) return;

  if (mode === 'admin' || mode === 'player') {
    logoutBtn.style.display = 'block';
  } else {
    logoutBtn.style.display = 'none';
  }
}


function showBackButton() {
    const backBtn = document.getElementById('backBtn');
    
    if (backBtn) {
        backBtn.style.display = 'block';
    } else {
        console.error('Back button not found in DOM');
    }
}

function updateRoomImage(roomId) {
  const roomImage = document.getElementById('roomImage');
  
  if (!roomId || !jsonData.rooms[roomId]) {
    roomImage.style.display = 'none';
    return;
  }

  const roomData = jsonData.rooms[roomId];
  roomImage.src = roomData.image;
  roomImage.alt = currentLang === 'bg' ? roomData.name : roomData.nameEn;
  roomImage.style.display = 'block';
}

document.getElementById('roomList').addEventListener('change', function() {
  const selectedRoom = this.value;
  updateRoomImage(selectedRoom);
});


window.addEventListener("DOMContentLoaded", () => {
  fetch("updated_final.json")
    .then(res => res.json())
    .then(data => {
      finalRoomsJSONData = data;
      console.log("✅ updated_final.json е зареден по подразбиране");
    })
    .catch(err => {
      console.warn("⚠️ Не можа да се зареди updated_final.json:", err);
    });
});


















