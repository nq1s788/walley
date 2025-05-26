// Константы по умолчанию
const userTimer = parseInt(localStorage.getItem('userTimer'))
const userSettings = parseInt(localStorage.getItem('userSettings'))

const DEFAULT_WORK = userSettings.workDuration || 20;
const DEFAULT_BREAK = userSettings.breakDuration || 5;

// Получить текущие параметры из localStorage
function getTimerState() {
    return {
        isRunning: localStorage.getItem('isRunning') === 'true',
        isWork: localStorage.getItem('isWork') === 'true',
        timerStart: parseInt(localStorage.getItem('timerStart')) || Date.now(),
        duration: parseInt(localStorage.getItem('duration')) || DEFAULT_WORK * 60
    };
}

// Установить новое состояние
function setTimerState({ isRunning, isWork, timerStart, duration }) {
    localStorage.setItem('isRunning', isRunning);
    localStorage.setItem('isWork', isWork);
    localStorage.setItem('timerStart', timerStart);
    localStorage.setItem('duration', duration);
}

// Вычислить, сколько осталось
function getTimeLeft() {
    const { timerStart, duration } = getTimerState();
    const elapsed = Math.floor((Date.now() - timerStart) / 1000);
    return Math.max(duration - elapsed, 0);
}

// Переключить фазу
function switchPhase() {
    const state = getTimerState();
    const newIsWork = !state.isWork;
    const newDuration = (newIsWork ? DEFAULT_WORK : DEFAULT_BREAK) * 60;

    setTimerState({
        isRunning: true,
        isWork: newIsWork,
        timerStart: Date.now(),
        duration: newDuration
    });

    // Также обнови интерфейс, если нужно (например, надпись Работа/Отдых)
    updateDisplay();
}

// Обновить визуализацию
function updateDisplay() {
    const timeLeft = getTimeLeft();
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    const { isWork } = getTimerState();

    const timeDiv = document.getElementById('time');
    const nameDiv = document.getElementById('name');

    if (timeDiv) timeDiv.textContent = `${mins}:${secs}`;
    if (nameDiv) nameDiv.textContent = isWork ? 'Работа' : 'Отдых';

    // Фаза закончилась
    if (timeLeft <= 0) {
        switchPhase();
    }
}

// Запустить таймер
function startTimer() {
    const { isRunning } = getTimerState();
    if (!isRunning) {
        const { isWork } = getTimerState();
        const duration = (isWork ? DEFAULT_WORK : DEFAULT_BREAK) * 60;
        setTimerState({
            isRunning: true,
            isWork,
            timerStart: Date.now(),
            duration
        });
    }
}

// Остановить
function stopTimer() {
    setTimerState({
        ...getTimerState(),
        isRunning: false
    });
}

// Автообновление каждые 1 сек
setInterval(() => {
    if (getTimerState().isRunning) {
        updateDisplay();
    }
}, 1000);

// Сразу отрисовать
updateDisplay();
