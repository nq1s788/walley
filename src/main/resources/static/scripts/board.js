let notesJSON =
[
  {
    "id": "4",
    "wallid": "2",
    "NoteClass": "textNote",
    "dataX": "120",
    "dataY": "416",
    "color": "rgb(231, 200, 195)",
    "IsHeadline": "true",
    "Istime": "false",
    "content": "{\"title\":\"Заголовок\",\"main\":\"grdgesdef\\nsgsgedsgedsf\\ngdsgsd\",\"time\":\"00:31 10.06.25\"}"
  },
  {
    "id": "5",
    "wallid": "2",
    "NoteClass": "textNote",
    "dataX": "581",
    "dataY": "492",
    "color": "rgb(243, 239, 201)",
    "IsHeadline": "false",
    "Istime": "true",
    "content": "{\"title\":\"Заголовок\",\"main\":\"lsgjrkgfgndkjgfnrjd,gbfjdg\",\"time\":\"00:31 10.06.25\"}"
  },
  {
    "id": "6",
    "wallid": "2",
    "NoteClass": "toDoNote",
    "dataX": "573",
    "dataY": "130",
    "color": "rgb(197, 219, 179)",
    "IsHeadline": "false",
    "Istime": "false",
    "content": "{\"title\":\"Заголовок\",\"items\":[\"edsgdes\",\"ggrgregf\",\"hrdfgrdgfg\"],\"check\":[false,false,false],\"time\":\"00:31 10.06.25\"}"
  },
  {
    "id": "7",
    "wallid": "2",
    "NoteClass": "textNote",
    "dataX": "196",
    "dataY": "116",
    "color": "rgb(199, 207, 220)",
    "IsHeadline": "true",
    "Istime": "false",
    "content": "{\"title\":\"Заголовок\",\"main\":\"grgesfliedsohfvnd\",\"time\":\"00:32 10.06.25\"}"
  }
];
let threadsJSON =
[
  {
    "noteId1": "4",
    "noteId2": "6",
    "wallid": "2",
    "id": 2
  },
  {
    "noteId1": "5",
    "noteId2": "6",
    "wallid": "2",
    "id": 3
  },
  {
    "noteId1": "7",
    "noteId2": "5",
    "wallid": "2",
    "id": 4
  }
];
let wallJSON =
{
  "wallid": "2",
  "email": 1,
  "user": 1,
  "title": 1,
  "createdAt": 1,
  "background": "rgb(250, 248, 236)",
  "font": "\"Montserrat\"",
  "inPackage": false
};

        window.addEventListener("DOMContentLoaded", () => {
            const idFromUrl = window.location.pathname.split("/").pop();
                    wallid=idFromUrl;

        const form = document.getElementById("formPost");

  form.action = `/board/${idFromUrl}`;
  console.log(form.action);
        });

      let tool = 'move';
      let notes = [];
      let threads = [];
      let selectedNote = null;
      let startNote = null;
      let isPanning = false;
      let startX, startY;
      let boardX = 0, boardY = 0;
      let noteSize = 264
      let wallid;

      let board = document.getElementById('board');
      let canvas = document.getElementById('linesCanvas');

      let ctx = canvas.getContext('2d');
      let isDark = 0;
      let colorDark = '#C1837B'
      let colorLight = '#FBFFED'
      function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas(); // Вызываем сразу, чтобы задать начальный размер

      let lastTouchX = 0, lastTouchY = 0;
      let isTouchPanning = false;

      let colorPalette = document.getElementById("color-palette");
      let boardColorButton = document.querySelector("#board-settings button:first-child");

      let fontPalette = document.getElementById("font-palette");
      let noteFontButton = document.querySelector("#board-settings button:nth-child(2)");

      let noteType = document.getElementById('note-type')
      let noteTypeButton = document.querySelector("#board-settings button:nth-child(2)");

      let selectImage = document.getElementById('select-image');
      let imageInput = document.getElementById('image-input');

      let lastId = notesJSON.length
                     ? Math.max(...notesJSON.map(item => Number(item.id)))
                     : 1;
      let lastThreadId = threadsJSON.length
                           ? Math.max(...threadsJSON.map(item => Number(item.id)))
                           : 1;

      //const boardInf = JSON.parse(localStorage.getItem('boardInf'));
      let boardName = document.getElementById('name-board');

      function folders() {
          window.location.href = 'folders.html';
      }
      function garden() {
          window.location.href = 'garden.html';
      }
      function setTool(newTool) {
          tool = newTool;
          updateActiveTool();
      }

      function updateActiveTool() {
          document.querySelectorAll("#menu button").forEach(btn => btn.classList.remove("active-tool"));
          document.querySelector(`#menu button[data-action="${tool}"]`)?.classList.add("active-tool");
      }

      function typeNoteWrap(type){
          if(type == 1){
              textNote(++lastId);
          }
          if(type == 2){
              listNote(++lastId);
          }
          if(type == 3){
              toDoNote(++lastId);
          }
      }

      function textNote(id) {
          let noteHTML =
              `   <div class="note-block note-title" contenteditable="true">Заголовок</div>
          <div class="note-block note-main" contenteditable="true"><br></div>
          <div class="note-block note-time" contenteditable="true"></div>`;
          let noteType = 'textNote';
          createNote(noteHTML, noteType, id);
      }

      function listNote(id) {
          let noteHTML =
              `   <div class="note-block note-title" contenteditable="true">Заголовок</div>
          <ol class="note-list-items"></ol>
          <div class="add-item">+</div>
          <div class="note-block note-time" contenteditable="true"></div>`;
          let noteType = 'listNote';
          createNote(noteHTML, noteType, id);
      }

      function toDoNote(id) {
          let noteHTML =
              `   <div class="note-block note-title" contenteditable="true">Заголовок</div>
          <ul class="note-list-items"></ul>
          <div class="add-item">+</div>
          <div class="note-block note-time" contenteditable="true"></div>`;
          let noteType = 'toDoNote';
          createNote(noteHTML, noteType, id);
      }

      imageInput.addEventListener('change', () => {
          const file = imageInput.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = function (e) {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.style.display = 'none';
              document.body.appendChild(img);

              img.onload = () => {
                  const note = document.createElement('div');
                  note.tabIndex = 0;
                  note.classList.add('note');
                  note.id = lastId;
                  lastId++;

                  // Устанавливаем фон
                  note.style.background = `url(${e.target.result})`;
                  note.style.backgroundSize = 'cover';
                  note.style.minHeight = 0;

                  // Размеры
                  let finalWidth, finalHeight;
                  if (Math.max(img.width, img.height) < 264) {
                      finalWidth = img.width;
                      finalHeight = img.height;
                  } else if (img.height > img.width) {
                      finalHeight = 264;
                      finalWidth = img.width * (264 / img.height);
                  } else {
                      finalWidth = 264;
                      finalHeight = img.height * (264 / img.width);
                  }

                  note.style.width = finalWidth + 'px';
                  note.style.height = finalHeight + 'px';

                  // Позиция
                  const noteX = canvas.width / 2 - boardX - finalWidth / 2;
                  const noteY = canvas.height / 2 - boardY - finalHeight / 2;

                  note.dataset.x = noteX;
                  note.dataset.y = noteY;

                  updateNotePosition(note);
                  note.onmousedown = (e) => selectNote(e, note);

                  note.addEventListener('focusin', () => {
                      note.classList.add('note-focused');
                      note.querySelector('.note-settings').classList.remove('hidden');
                  });

                  note.addEventListener('focusout', () => {
                      setTimeout(() => {
                          if (!note.contains(document.activeElement)) {
                              note.classList.remove('note-focused');
                              note.querySelector('.note-settings').classList.add('hidden');
                          }
                      }, 100);
                  });
                  note.appendChild(createSettings(3));
                  noteEvent(note);

                  notes.push(note);
                  board.appendChild(note);

                  img.remove(); // Удаляем временно добавленное изображение
              };
          };

          reader.readAsDataURL(file);
      });



      function createSettings(start = 0) {
          const settings = document.createElement('div');
          settings.className = 'note-settings hidden';

          const func = [0, 0, 0, setNoteLower, setNoteUpper, noteDelete].slice(start);
          const icons = ["note-color", "set-title", "set-time", "lower", "upper", "delete"].slice(start);

          icons.forEach((icon, index) => {

              const button = document.createElement('button');
              button.dataset.action = icon; // <--- добавляем data-action
              //button.onclick = func[index];
              const img = document.createElement('img');
              img.src = "/icons/" + icon + ".svg";
              button.appendChild(img);
              if (icon == "note-color") {
                  button.style.position = 'relative';
                  let divColor = document.createElement('div');
                  divColor.classList.add('note-color-palette');
                  divColor.classList.add('hidden');
                  divColor.innerHTML = `
                          <div class="color-option" style="background: #EEEDE9;" onclick="chooseNoteColor('#EEEDE9')"></div>
                          <div class="color-option" style="background: #F3EFC9;" onclick="chooseNoteColor('#F3EFC9')"></div>
                          <div class="color-option selected" style="background: #F4CCA9;" onclick="chooseNoteColor('#F4CCA9')"></div>
                          <div class="color-option" style="background: #E7C8C3;" onclick="chooseNoteColor('#E7C8C3')"></div>
                          <div class="color-option" style="background: #C7CFDC;" onclick="chooseNoteColor('#C7CFDC')"></div>
                          <div class="color-option" style="background: #C5DBB3;" onclick="chooseNoteColor('#C5DBB3')"></div>`;
                  button.appendChild(divColor);
              }
              settings.appendChild(button);
          });


          return settings;
      }

      function chooseNoteColor(color) {
          event.currentTarget.closest('.note').querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
          event.target.classList.add("selected");
          event.currentTarget.closest('.note').style.background = event.target.style.background;

      }

      function setNoteLower(note) {
          const prev = note.previousElementSibling;
          if (prev && prev.id != 'linesCanvas') note.parentNode.insertBefore(note, prev);
      }

      function setNoteUpper(note) {
          const next = note.nextElementSibling;
          if (next && next.id != 'linesCanvas') note.parentNode.insertBefore(next, note);
      }


      function noteDelete(id) {
          notes = notes.filter(note => note.id !== id);
          threads = threads.filter(thread => thread.note1.id !== id && thread.note2.id !== id);
      }

      function createNote(noteHTML, noteType, id) {
          let note = document.createElement('div');
          note.id = id;
          note.setAttribute('data-isH', true);
          note.setAttribute('data-isT', false);
          let noteContent = document.createElement('div');
          noteContent.classList.add('note-content')
          noteContent.innerHTML = noteHTML;
          note.appendChild(createSettings());
          note.appendChild(noteContent);


          note.classList.add('note');
          note.classList.add(noteType);
          note.dataset.x = canvas.width / 2 - boardX - noteSize / 2;
          note.dataset.y = canvas.height / 2 - boardY - noteSize / 2;
          updateNotePosition(note);


          note.onmousedown = (e) => selectNote(e, note);

          note.tabIndex = 0;



          /*
          note.onfocus = (e) => {
            console.log('sgnvjngjsnjdng');
            note.classList.add('note-focused');
            note.querySelector('.note-settings').classList.remove('hidden');
            note.querySelectorAll('.note-block').forEach(block => {
              block.classList.add('note-block-focused');
            });
          }
          note.onblur = (e) =>{
              setTimeout(() => {
              if (!note.contains(document.activeElement)) {
                note.classList.remove('note-focused');
                note.querySelector('.note-settings').classList.add('hidden');
                note.querySelectorAll('.note-block').forEach(block => {
                  block.classList.remove('note-block-focused');
                });
              }
            }, 100);
          }

          /**/
          board.appendChild(note);



          notes.push(note);
          noteEvent(note);
      }

      function updateNotePosition(note) {
          let x = parseFloat(note.dataset.x) + boardX;
          let y = parseFloat(note.dataset.y) + boardY;
          note.style.left = `${x}px`;
          note.style.top = `${y}px`;

      }

      function selectNote(event, note) {
          /*document.querySelectorAll(".note").forEach(note => {
              note.addEventListener("input", function() {
                  this.style.height = "auto"; // Сбрасываем высоту перед расчетом
                  this.style.height = this.scrollHeight + "px"; // Устанавливаем новую высоту
              });
          });*/
          //event.stopPropagation();
          if (tool === 'hand') {
              isPanning = true;
              startX = event.clientX;
              startY = event.clientY;
              return; // Не выделяем заметку
          }
          if (tool === 'move') {

              selectedNote = note;
              let shiftX = event.clientX - parseFloat(note.dataset.x);
              let shiftY = event.clientY - parseFloat(note.dataset.y);

              function moveAt(pageX, pageY) {
                  note.dataset.x = pageX - shiftX;
                  note.dataset.y = pageY - shiftY;
                  updateNotePosition(note);
                  updateThreads();
              }

              function onMouseMove(event) {
                  moveAt(event.pageX, event.pageY);
              }

              document.addEventListener('mousemove', onMouseMove);
              document.onmouseup = function () {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.onmouseup = null;
              };
          } else if (tool === 'thread') {
              if (!startNote) {
                  startNote = note;
              } else {
                  if(startNote.id != note.id) createThread(startNote, note, lastThreadId++);
                  startNote = null;
              }
          }
      }

      function createThread(note1, note2, id) {
          threads.push({ note1, note2, id});
          updateThreads();
      }

      function updateThreads() {
          resizeCanvas();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          threads.forEach(({ note1, note2, id }) => {
              ctx.beginPath();
              //console.log(note1.offsetLeft + note1.offsetWidth / 2, note1.offsetTop + note1.offsetHeight / 2, note2.offsetLeft + note2.offsetWidth / 2, note2.offsetTop + note2.offsetHeight / 2);
              ctx.moveTo(note1.offsetLeft + note1.offsetWidth / 2, note1.offsetTop + note1.offsetHeight / 2);
              ctx.lineTo(note2.offsetLeft + note2.offsetWidth / 2, note2.offsetTop + note2.offsetHeight / 2);
              if (isDark) {
                  ctx.strokeStyle = colorLight
              }
              else {
                  ctx.strokeStyle = colorDark;
              }
              ctx.lineWidth = 4;
              ctx.stroke();
          });
      }

      function selectColor(color, i) {
          document.getElementById('board-container').style.background = color;
          document.getElementById('board-settings').querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
          event.target.classList.add("selected");
      }

      function selectFont(font) {
          document.body.style.fontFamily = font;
          //document.querySelectorAll('.note').forEach(note => { note.style.fontFamily = font;});
          document.querySelectorAll(".font-option").forEach(el => el.classList.remove("selected"));
          event.target.classList.add("selected");
      }

      function positionPalette(palette, num) {
          let menuSettings = document.getElementById("board-settings").getBoundingClientRect();
          let paletteRect = palette.getBoundingClientRect()
          let buttonWidth = menuSettings.width / 4

          palette.style.right = 30 + buttonWidth * (4 - num) + buttonWidth / 2 - paletteRect.width / 2 + 'px'

      }


      board.addEventListener('mousedown', (e) => {

          if (tool === 'hand' && (e.target.classList.contains('note') || e.target === board)) {
              isPanning = true;
              startX = e.clientX;
              startY = e.clientY;
          }
          if (tool === 'thread' && !e.target.closest('.note')) {
              setTool('move');
          }
      });

      board.addEventListener('mousemove', (e) => {
          if (isPanning) {
              boardX += e.clientX - startX;
              boardY += e.clientY - startY;
              startX = e.clientX;
              startY = e.clientY;
              //board.style.transform = `translate(${boardX}px, ${boardY}px)`;
              //canvas.style.transform = `translate(${boardX}px, ${boardY}px)`;
              notes.forEach(updateNotePosition);
              updateThreads();
          }
      });

      board.addEventListener('mouseup', () => {
          isPanning = false;
      });

      board.addEventListener("wheel", (e) => {
          if (e.ctrlKey) return; // Игнорируем зум (если зажат CTRL)

          e.preventDefault(); // Отключаем стандартную прокрутку страницы

          boardX -= e.deltaX; // Смещаем по горизонтали
          boardY -= e.deltaY; // Смещаем по вертикали

          notes.forEach(updateNotePosition); // Обновляем позиции заметок
          updateThreads(); // Перерисовываем линии
      }, { passive: false });


      // Закрытие всплывашки при клике вне её
      document.addEventListener("click", (e) => {
          updateThreads();

          noteType.classList.add("hidden");
          selectImage.classList.add("hidden");

          if (!colorPalette.contains(e.target) && e.target !== boardColorButton) {
              colorPalette.classList.add("hidden");
          }
          if (!fontPalette.contains(e.target) && e.target !== noteFontButton) {
              fontPalette.classList.add("hidden");
          }
          if (!noteType.contains(e.target) && e.target !== noteTypeButton) {
              noteType.classList.add("hidden");
          }

      });


      document.getElementById("menu").addEventListener("click", (e) => {
          const action = e.target.closest("button")?.dataset.action;
          switch (action) {
              case 'createNote':
                  e.stopPropagation();
                  noteType.classList.toggle("hidden");
                  //createNote()
                  break
              case 'img':
                  e.stopPropagation();
                  selectImage.classList.toggle("hidden");
                  break
              case false:
                  break
              default:
                  setTool(action)
          }

      });


      document.getElementById("board-settings").addEventListener("click", (e) => {
          const action = e.target.closest("button")?.dataset.action;
          switch (action) {
              case 'boardColor':
                  e.stopPropagation();
                  colorPalette.classList.toggle("hidden");
                  fontPalette.classList.add("hidden");
                  //positionPalette(colorPalette, 1);
                  break
              case 'boardFont':
                  e.stopPropagation();
                  fontPalette.classList.toggle("hidden");
                  colorPalette.classList.add("hidden");
                  //positionPalette(fontPalette, 2);
                  break
              case 'export':
                  break
              case 'share':
                  break
          }

      });

      selectImage.addEventListener('click', () => {
          imageInput.click(); // Открывает выбор файла
      });

      //-----------------------------------------------------\

      function noteEvent(note) {
          function currentData() {
              const now = new Date();
              const hours = now.getHours().toString().padStart(2, '0');
              const minutes = now.getMinutes().toString().padStart(2, '0');
              const day = now.getDate().toString().padStart(2, '0');
              const month = (now.getMonth() + 1).toString().padStart(2, '0');
              const year = now.getFullYear().toString().slice(-2);
              return `${hours}:${minutes} ${day}.${month}.${year}`;
          }

          let colorButton = note.querySelector('.note-settings').firstChild;
          let titleButton = note.querySelector('.note-settings').children[1];
          let timeButton = note.querySelector('.note-settings').children[2];

          let colorBar = colorButton.lastChild;

          if (note.querySelector('.note-time')) {
              timeButton.firstChild.classList.toggle('off');
              note.querySelector('.note-time').classList.add('hidden');
          }
          note.querySelector('.note-settings').addEventListener("click", (e) => {
              const action = e.target.closest("button")?.dataset.action;
              if (!action) return;

              switch (action) {
                  case 'note-color':
                      colorBar.classList.toggle("hidden");
                      // открытие палитры для этой заметки
                      break;
                  case 'set-title':
                      case 'set-title':

                                      note.dataset.ish = String(!JSON.parse(note.dataset.ish));
                                      if (JSON.parse(note.dataset.ish)) {
                                          titleButton.firstChild.classList.remove('off')
                                          note.querySelector('.note-title').classList.remove('hidden')
                                      } else {
                                          titleButton.firstChild.classList.add('off')
                                          note.querySelector('.note-title').classList.add('hidden')
                                      }


                                      // открыть input для ввода заголовка
                                      break;
                                  case 'set-time':
                                      note.dataset.ist = String(!JSON.parse(note.dataset.ist));
                                      if (JSON.parse(note.dataset.ist)) {
                                          timeButton.firstChild.classList.remove('off')
                                          note.querySelector('.note-time').classList.remove('hidden')
                                      } else {
                                          timeButton.firstChild.classList.add('off')
                                          note.querySelector('.note-time').classList.add('hidden')
                                      }
                      break;
                  case 'lower':
                      setNoteLower(note);
                      // переместить заметку ниже
                      break;
                  case 'upper':
                      setNoteUpper(note);
                      // переместить заметку выше
                      break;
                  case 'delete':
                      noteDelete(note.id);
                      note.remove();
                      // удалить заметку
                      break;
              }
          });

          note.querySelectorAll('.note-time').forEach(t => {
              t.textContent = currentData();
          });

          note.querySelectorAll('.note-block').forEach(el => {
              el.addEventListener('keydown', function (e) {
                  if (e.key === 'Enter') {
                      e.preventDefault();
                      document.execCommand('insertLineBreak');
                  }
              });
          });
          document.querySelectorAll('.note').forEach(note => {
              note.addEventListener('click', (e) => {
                  //console.log(note.querySelector('.note-settings'));
                  if (!note.querySelector('.note-settings').firstChild.contains(e.target))
                      note.querySelector('.note-color-palette')?.classList.add('hidden');
              });
              note.addEventListener('focusin', () => {
                  note.classList.add('note-focused');
                  note.querySelector('.note-settings').classList.remove('hidden');
                  note.querySelectorAll('.note-block').forEach(block => {
                      block.classList.add('note-block-focused');
                  });
              });

              note.addEventListener('focusout', () => {
                  setTimeout(() => {
                      if (!note.contains(document.activeElement)) {
                          note.classList.remove('note-focused');
                          note.querySelector('.note-color-palette')?.classList.add('hidden');
                          note.querySelector('.note-settings').classList.add('hidden');
                          note.querySelectorAll('.note-block').forEach(block => {
                              block.classList.remove('note-block-focused');
                          });
                      }
                  }, 100);
              });
          });
          function addItemList(previous = null, list) {
              const newItem = document.createElement('li');
              newItem.className = 'note-block note-num-item';
              newItem.contentEditable = true;

              if (previous === null) {
                  list.appendChild(newItem);
              } else {
                  // Вставляем новый элемент после предыдущего
                  list.insertBefore(newItem, previous.nextSibling);
              }

              newItem.focus();
          }
          note.querySelectorAll('.listNote .add-item').forEach(button => {
              button.addEventListener('click', (e) => addItemList(null, e.target.previousElementSibling));
          });
          function addItemToDo(previous = null, list) {

              const li = document.createElement('li');
              li.className = 'note-block note-checkbox-item';

              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.className = 'checkbox';

              const span = document.createElement('span');
              span.className = 'checkbox-title';
              span.contentEditable = true;

              checkbox.addEventListener('change', () => {
                  li.classList.toggle('checked', checkbox.checked);
                  span.contentEditable = !checkbox.checked;
                  if (!span.textContent && checkbox.checked) {
                      span.contentEditable = checkbox.checked;
                  }
              });

              li.appendChild(checkbox);
              li.appendChild(span);
              if (previous === null) {
                  list.appendChild(li);
              } else {
                  // Вставляем новый элемент после предыдущего
                  list.insertBefore(li, previous.nextSibling);
              }
              //list.appendChild(li);
              span.focus();
          }
          note.querySelectorAll('.toDoNote .add-item').forEach(button => {
              button.addEventListener('click', (e) => addItemToDo(null, e.target.previousElementSibling));
          });

          /*document.querySelectorAll('.listNote').forEach(note => {
            note.addEventListener('keydown', function (e) {
              const target = e.target;
              if (target.classList.contains('note-num-item')) {
                if (e.key === 'Backspace' && target.textContent.trim() === '') {
                  e.preventDefault();
                  target.remove();
                } else if(e.key === 'Enter'){
                  console.log('enter wtf')
                  addItemList(target, note.querySelector('.note-list-items'));
                }
              }
            });
          });*/
          document.querySelectorAll('.listNote').forEach(note => {
              const list = note.querySelector('.note-list-items');

              note.addEventListener('keydown', function (e) {
                  const target = e.target;

                  if (target.classList.contains('note-num-item')) {
                      if (e.key === 'Backspace' && target.textContent.trim() === '') {
                          e.preventDefault();
                          const prev = target.previousElementSibling;
                          target.remove();
                          if (prev) prev.focus();
                      } else if (e.key === 'Enter') {
                          e.preventDefault(); // не создаём новую строку в элементе
                          addItemList(target, list);
                      }
                  }
              });
          });
          document.querySelectorAll('.toDoNote').forEach(note => {
              const list = note.querySelector('.note-list-items');

              note.addEventListener('keydown', function (e) {
                  const target = e.target;
                  if (target.classList.contains('checkbox-title')) {
                      if (e.key === 'Backspace' && target.textContent.trim() === '') {
                          const li = target.closest('.note-checkbox-item');
                          if (li) {
                              e.preventDefault();
                              li.remove();
                          }
                      } else if (e.key === 'Enter') {
                          e.preventDefault(); // не создаём новую строку в элементе
                          console.log(target.parentNode);
                          addItemToDo(target.parentNode, list);
                      }
                  }
              });
          });
      }

function parseContent(note, type) {
    if (type == 'textNote') {
        const content = {
            title: note.querySelector('.note-title')?.textContent ?? '',
            main: note.querySelector('.note-main')?.textContent ?? '',
            time: note.querySelector('.note-time')?.textContent ?? ''
        };
        return content
    }
    if (type == 'listNote') {
        const content = {
            title: note.querySelector('.note-title')?.textContent.trim() ?? '',
            items: Array.from(note.querySelectorAll('.note-num-item'))
                .map(li => li.textContent.trim()),
            time: note.querySelector('.note-time')?.textContent.trim() ?? ''
        };
        return content

    }
    if (type == 'toDoNote') {
        const items = [];
        const check = [];

        note.querySelectorAll('.note-checkbox-item').forEach(li => {
            const span = li.querySelector('.checkbox-title');
            const text = span?.textContent.trim();

            items.push(text);
            check.push(li.classList.contains('checked'));
        });

        const content = {
            title: note.querySelector('.note-title')?.textContent.trim() ?? '',
            items,
            check,
            time: note.querySelector('.note-time')?.textContent.trim() ?? ''
        };
        return content
    }
    return note.querySelector('.note-content').innerHTML;
}

function postWallJSONs() {
    console.log("Действие выполнено:", new Date());
    //{id: , wallid:, NoteClass, dataX:, dataY:, color:, IsHeadline:, Istime:, content: }
    const notesJSON = Array.from(notes).map(note => ({
        id: note.id,
        wallid: wallid,
        NoteClass: note.classList[1],
        dataX: note.dataset.x,
        dataY: note.dataset.y,
        color: getComputedStyle(note).background,
        IsHeadline: note.dataset.ish,
        Istime: note.dataset.ist,
        content: JSON.stringify(parseContent(note, note.classList[1])),
    }));
    const threadsJSON = Array.from(threads).map(pair => ({
        noteId1: pair.note1.id,
        noteId2: pair.note2.id,
        wallid: wallid,
        id: pair.id
    }));;

    const wallJSON_new = {
        wallid: wallid,
        email: wallJSON.email,
        user: wallJSON.user,
        title: boardName.textContent,
        createdAt: wallJSON.createdAt,
        background: getComputedStyle(document.getElementById('board-container')).background,
        font: getComputedStyle(document.body).fontFamily,
        inPackage: false
    };


    console.log(JSON.stringify(notesJSON, null, 2));
        console.log(JSON.stringify(threadsJSON, null, 2));

    console.log(JSON.stringify(wallJSON_new, null, 2));



    // fetch('/')
}
// post
setInterval(postWallJSONs, 30000);

// get
/*let wallJSON=[[${wall}]];
let notesJSON=[[${notes}]];
let threadsJSON =[[${threads}]];*/

function addContent(noteJSON) {
        noteContParse = JSON.parse(noteJSON.content);

    if (noteJSON.NoteClass == 'textNote') {
        textNote(noteJSON.id);
        console.log(noteJSON.id);
        let note = notes[notes.length - 1];
        note.querySelector('.note-main').textContent = noteContParse.main;

    }
    if (noteJSON.NoteClass == 'listNote') {
        listNote(noteJSON.id)
        let note = notes[notes.length - 1];
        let list = note.querySelector('.note-list-items')
        noteContParse.items.forEach(i => {
            const newItem = document.createElement('li');
            newItem.className = 'note-block note-num-item';
            newItem.textContent = i;
            newItem.contentEditable = true;
            list.appendChild(newItem);
        })
    }
    if (noteJSON.NoteClass == 'toDoNote') {
        toDoNote(noteJSON.id)
        let note = notes[notes.length - 1];
        let list = note.querySelector('.note-list-items')
        noteContParse.items.forEach((itemText, index) => {
            const checked = noteContParse.check[index];

            const li = document.createElement('li');
            li.className = 'note-block note-checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';

            const span = document.createElement('span');
            span.className = 'checkbox-title';
            span.contentEditable = true;
            span.textContent = itemText;
            if (checked) {
                li.classList.add('checked');
                checkbox.classList.add('checked')
            }

            checkbox.addEventListener('change', () => {
                li.classList.toggle('checked', checkbox.checked);
                span.contentEditable = !checkbox.checked;
                if (!span.textContent && checkbox.checked) {
                    span.contentEditable = checkbox.checked;
                }
            });

            li.appendChild(checkbox);
            li.appendChild(span);

            list.appendChild(li);

        })
    }
}
if (wallJSON){
    document.getElementById('board-container').style.background = wallJSON.background;
    document.body.fontFamily = wallJSON.font;
    boardName.textContent = wallJSON.title;

}
if (notesJSON) {
    notesJSON.forEach(noteCont => {
        noteContParse = JSON.parse(noteCont.content);
        console.log(noteContParse);
        addContent(noteCont);

        let note = notes[notes.length - 1];


        note.dataset.x = noteCont.dataX;
        note.dataset.y = noteCont.dataY;
        note.style.background = noteCont.color;
        note.dataset.ish = noteCont.IsHeadline;
        note.dataset.ist = noteCont.Istime;
        let titleButton = note.querySelector('.note-settings').children[1];
        let timeButton = note.querySelector('.note-settings').children[2];


        if (JSON.parse(note.dataset.ish)) {
            titleButton.firstChild.classList.remove('off')
            note.querySelector('.note-title').classList.remove('hidden')
        } else {
            titleButton.firstChild.classList.add('off')
            note.querySelector('.note-title').classList.add('hidden')
        }
        if (JSON.parse(note.dataset.ist)) {
            timeButton.firstChild.classList.remove('off')
            note.querySelector('.note-time').classList.remove('hidden')
        } else {
            timeButton.firstChild.classList.add('off')
            note.querySelector('.note-time').classList.add('hidden')
        }


        note.querySelector('.note-title').textContent = noteContParse.title;
        note.querySelector('.note-time').textContent = noteContParse.time;
        updateNotePosition(note);

    });
}
if (threadsJSON) {
    threadsJSON.forEach(thread => {
        createThread(document.getElementById(thread.noteId1), document.getElementById(thread.noteId2), thread.id);
        console.log('нитка', thread);
    });

    updateThreads();
}