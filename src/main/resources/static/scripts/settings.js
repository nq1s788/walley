
function garden() {
    window.location.href = 'garden.html';
}
function toHMin(min) {
    return `${Math.floor(min / 60)}ч. ${min % 60}мин.`
}
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}
function message(text) {
    messageDiv.style.display = 'block';
    messageDiv.textContent = text;
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 1000);
}

const saveButton = document.querySelector("#buttons button:first-child");
const resetButton = document.querySelector("#buttons button:nth-child(2)");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username")
const workInput = document.getElementById("workInput");
const restInput = document.getElementById("restInput");
console.log(restInput)
// userStat = {'totalWorkMinutes': 0, 'totalBreakMinutes': 0};
const userStat = JSON.parse(localStorage.getItem("userStat"));
const totalWork = document.getElementById("totalWorkMinutes");
const totalBreak = document.getElementById("totalBreakMinutes");
totalWork.textContent = toHMin(userStat.totalWorkMinutes);
totalBreak.textContent = toHMin(userStat.totalBreakMinutes);

const messageDiv = document.getElementById('message');
const avatar = document.getElementById('avatar');
let imageInput = document.getElementById('image-input');





window.addEventListener("DOMContentLoaded", () => {
    // userSettings = { 'email': email, 'password': password, 'username': getUsernameFromEmail(email), 'avatarURL':'pic/user1.jpg',  'workDuration': defaultWork, 'breakDuration': defaultBreak };
    const savedData = JSON.parse(localStorage.getItem("userSettings"));
    if (savedData) {
        emailInput.value = savedData.email || "";
        passwordInput.value = savedData.password || "";
        usernameInput.textContent = savedData.username || "";
        avatar.style.backgroundImage = 'url(' + (savedData.avatarURL || '') + ')';
        workInput.value = savedData.workDuration || 20;
        restInput.value = savedData.breakDuration || 5;
    }
});

saveButton.addEventListener("click", () => {
    const data = {
        email: emailInput.value,
        password: passwordInput.value,
        username: usernameInput.textContent,
        avatarURL: (avatar.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/) || [])[1] || '',
        workDuration: parseInt(workInput.value),
        breakDuration: parseInt(restInput.value),
    };
    const users = getUsers();
    users[email] = data.password;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem("userSettings", JSON.stringify(data));
    message('Сохранено!')
});

resetButton.addEventListener("click", () => {
    workInput.value = 20;
    restInput.value = 5;

    const savedData = JSON.parse(localStorage.getItem("userSettings")) || {};
    savedData.workDuration = 20;
    savedData.breakDuration = 5;
    localStorage.setItem("userSettings", JSON.stringify(savedData));
    message('Сброшено!')

});
avatar.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const dataUrl = e.target.result;
        avatar.style.backgroundImage = `url("${dataUrl}")`;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

