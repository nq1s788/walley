
let iFlower = localStorage.getItem('flower');
console.log(iFlower)
const flower = document.getElementById('flower')
flower.innerHTML = `<img src="pic/${iFlower}.png">`


const WORK_DURATION = 20 * 1;
const BREAK_DURATION = 5 * 1;

let isWork = true;
let timeLeft = WORK_DURATION;
let timerInterval = null;
let isRunning = false;

const timeDiv = document.getElementById('time');
const nameDiv = document.getElementById('name');
const circleDiv = document.getElementById('circle');
const startIcon = document.getElementById('start-icon');
const stopIcon = document.getElementById('stop-icon');

function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function changeName(text) {
    const name = document.getElementById('name');
    name.style.opacity = '0';
    setTimeout(() => {
        name.textContent = text;
        name.style.opacity = '1';
    }, 500);
}


function updateDisplay() {
    timeDiv.textContent = formatTime(timeLeft);
    //nameDiv.textContent = isWork ? 'Работа' : 'Отдых';
    circleDiv.style.backgroundColor = isWork ? 'rgba(198, 231, 248, 0.3)' : 'rgba(217, 248, 198, 0.3)';
}

function switchMode() {
    isWork = !isWork;
    timeLeft = isWork ? WORK_DURATION : BREAK_DURATION;
    updateDisplay();
}

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            switchMode();
            changeName(isWork ? 'Работа' : 'Отдых')
            startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
circleDiv.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
        stopIcon.style.display = 'none';
        startIcon.style.display = 'block';
    } else {
        startTimer();
        startIcon.style.display = 'none';
        stopIcon.style.display = 'block';
    }
    isRunning = !isRunning
});


updateDisplay();
stopTimer();
function settings() {
    window.location.href = 'settings.html';
}

function folders() {
    iFlower++;
    if (iFlower > 3) { iFlower = 0; }
    localStorage.setItem("flower", iFlower);

    setTimeout(() => {
        window.location.href = 'folders.html';
    }, 0);
}