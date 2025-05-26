
const errorBox = document.getElementById('errorBox');
const registerButton = document.getElementById('register')
const loginButton = document.getElementById('login')


function showError(message) {
    errorBox.textContent = message;
    errorBox.style.display = 'flex';
}

function clearError() {
    errorBox.style.display = 'none';
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
    //users - {'login1': 'password1', 'login2': 'password2'}
}

function getUsernameFromEmail(email) {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.slice(0, atIndex);
    }
    return email;
}


function saveUser(email, password) {
    const users = getUsers();
    users[email] = password;
    localStorage.setItem('users', JSON.stringify(users));
    const defaultWork = 20;
    const defaultBreak = 5;
    let userSettings = { 'email': email, 'password': password, 'username': getUsernameFromEmail(email), 'avatarURL': "pic/user1.jpg", 'workDuration': defaultWork, 'breakDuration': defaultBreak };
    let userStat = { 'totalWorkMinutes': 0, 'totalBreakMinutes': 0 };
    let userTimer = { 'isRunning': false, 'isWork': true, 'duration': defaultWork * 60, 'timerStart': Date.now() };

    //сохраняем настройки для нового пользователя
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    localStorage.setItem('userStat', JSON.stringify(userStat));
    localStorage.setItem('userTimer', JSON.stringify(userTimer));

    //про цветы это заглушка для показа цветок как распускается
    localStorage.setItem("flower", 0);
}

function getUserSet(){

}

function login() {
    loginButton.classList.add('active');
    registerButton.classList.remove('active');

    clearError();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const users = getUsers();

    if (!users[email]) {
        showError('Почта не найдена');
        return;
    }
    if (users[email] !== password) {
        showError('Неверный пароль');
        return;
    }

    //здесь надо дернуть настройки для пользователя из бд с полями как:
    // userSettings = { 'email': email, 'password': password, 'username': getUsernameFromEmail(email), 'avatarURL': "pic/user1.jpg", 'workDuration': defaultWork, 'breakDuration': defaultBreak };
    // userStat = { 'totalWorkMinutes': 0, 'totalBreakMinutes': 0 };
    // userTimer = { 'isRunning': false, 'isWork': true, 'duration': defaultWork * 60, 'timerStart': Date.now() };

    getUserSet()


    window.location.href = 'garden.html';
}

function register() {
    registerButton.classList.add('active');
    loginButton.classList.remove('active');

    clearError();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Введите почту и пароль');
        return;
    }

    const users = getUsers();

    if (users[email]) {
        showError('Пользователь уже существует');
        return;
    }

    saveUser(email, password);
    window.location.href = 'garden.html';
}