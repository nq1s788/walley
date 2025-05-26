

let tool = 'move';
let notes = [];
let threads = [];
let selectedNote = null;
let startNote = null;
let isPanning = false;
let startX, startY;
let boardX = 0, boardY = 0;
let noteSize = 264

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

let lastId = 1;

const boardInf = JSON.parse(localStorage.getItem('boardInf'));
let boardName = document.getElementById('name-board');
boardName.textContent = boardInf.name;

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

function textNote() {
    let noteHTML =
        `   <div class="note-block note-title" contenteditable="true">Заголовок</div>
    <div class="note-block note-main" contenteditable="true"><br></div>
    <div class="note-block note-time" contenteditable="true"></div>`;
    let noteType = 'textNote';
    createNote(noteHTML, noteType);
}

function listNote() {
    let noteHTML =
        `   <div class="note-block note-title" contenteditable="true">Заголовок</div>
    <ol class="note-list-items"></ol>
    <div class="add-item">+</div>
    <div class="note-block note-time" contenteditable="true"></div>`;
    let noteType = 'listNote';
    createNote(noteHTML, noteType);
}

function toDoNote() {
    let noteHTML =
        `   <div class="note-block note-title" contenteditable="true">Заголовок</div>
    <ul class="note-list-items"></ul>
    <div class="add-item">+</div>
    <div class="note-block note-time" contenteditable="true"></div>`;
    let noteType = 'toDoNote';
    createNote(noteHTML, noteType);
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
        img.src = "icons/" + icon + ".svg";
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

function createNote(noteHTML, noteType) {
    let note = document.createElement('div');
    note.id = lastId;
    lastId++;
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
            createThread(startNote, note);
            startNote = null;
        }
    }
}

function createThread(note1, note2) {
    if (note1.id == note2.id) {
        return;
    }
    threads.push({ note1, note2 });
    updateThreads();
}

function updateThreads() {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    threads.forEach(({ note1, note2 }) => {
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
                titleButton.firstChild.classList.toggle('off')
                note.querySelector('.note-title').classList.toggle('hidden')

                // открыть input для ввода заголовка
                break;
            case 'set-time':
                timeButton.firstChild.classList.toggle('off')

                note.querySelector('.note-time').classList.toggle('hidden')

                // задать/отобразить время
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