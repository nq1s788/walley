
function garden() {
    window.location.href = 'garden.html';
}

// тут надо загрузить доски пользователя, поля:
let boards = [
    { title: "Доска 4", user: "azalkinmmm", date: "20.03.25", time: "20:01" },
    { title: "Доска 1", user: "anya_mrkv3", date: "16.03.25", time: "10:15" },
    { title: "Доска 2", user: "nq1s788", date: "16.03.25", time: "14:20" },
    { title: "Доска 3", user: "kristina_legaevа", date: "17.03.25", time: "12:23" },
];

const userSettings = JSON.parse(localStorage.getItem("userSettings"));

let sortField = null;
let sortAsc = true;
let boardCounter = 1;

const tbody = document.getElementById("table-body");
const searchInput = document.querySelector(".search-bar");
const addButton = document.querySelector(".add-button");

// --- Инициализация ---

function renderTable() {
    tbody.innerHTML = "";

    const filtered = boards.filter(board =>
        board.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        board.user.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    filtered.forEach((board, index) => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = board.title;

        const userCell = document.createElement("td");
        userCell.textContent = board.user;

        const dateCell = document.createElement("td");
        dateCell.textContent = `${board.time} | ${board.date}`;

        const moreCell = document.createElement("td");
        moreCell.classList.add("more-button");
        moreCell.style.zIndex = 999;
        moreCell.innerHTML = `
            <img src="icons/more.svg" class="more-icon" style="cursor:pointer;">
        `;

        const actions = document.createElement("div");
        actions.classList.add("more-buttons");
        actions.innerHTML = `
            <button class="rename-btn">Изменить</button>
            <button class="delete-btn">Удалить</button>
        `;

        moreCell.appendChild(actions);
        row.appendChild(titleCell);
        row.appendChild(userCell);
        row.appendChild(dateCell);
        row.appendChild(moreCell);

        // События "..."
        moreCell.addEventListener("click", (e) => {
            e.stopPropagation();
            actions.style.display = 'flex';
        });

        actions.querySelector(".delete-btn").addEventListener("click", () => {
            boards.splice(index, 1);
            renderTable();
        });

        actions.querySelector(".rename-btn").addEventListener("click", () => {
            titleCell.contentEditable = true;
            titleCell.focus();

            titleCell.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    board.title = titleCell.textContent.trim();
                    titleCell.removeAttribute("contentEditable");
                }
            });
        });

        row.addEventListener("click", (e) => toBoard(e));
        tbody.appendChild(row);
    });
}

function sortBy(field) {
    sortAsc = sortField === field ? !sortAsc : true;
    sortField = field;

    boards.sort((a, b) => {
        let valA, valB;

        if (field === "date") {
            valA = a.date.split('.').reverse().join('.') + '.' + a.time;
            valB = b.date.split('.').reverse().join('.') + '.' + b.time;
        } else {
            valA = a[field].toLowerCase();
            valB = b[field].toLowerCase();
        }

        if (sortAsc) return valA > valB ? 1 : valA < valB ? -1 : 0;
        else return valA < valB ? 1 : valA > valB ? -1 : 0;
    });

    renderTable();
}

function toBoard(e) {
    const target = e.target;

    if (
        target.closest(".more-button") ||
        target.closest(".more-buttons") ||
        (target.tagName === "TD" && target.hasAttribute("contenteditable"))
    ) {
        return;
    }

    const row = target.closest("tr");
    if (!row) return;

    const name = row.querySelector("td")?.textContent.trim() || "";
    //тут надо передать всю инфу по доске, пока передается тотлько имя
    const boardInf = { name };

    localStorage.setItem("boardInf", JSON.stringify(boardInf));

    setTimeout(() => {
        window.location.href = "board.html";
    }, 0);
}


searchInput.addEventListener("input", renderTable);

addButton.addEventListener("click", () => {
    const now = new Date();
    const date = now.toLocaleDateString("ru-RU").slice(0, 8);
    const time = now.toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' });

    boards.push({
        title: `Новая доска ${boardCounter++}`,
        user: userSettings.username,
        date,
        time
    });

    renderTable();
});

document.addEventListener("click", (e) => {
    if (
        !e.target.classList.contains("more-icon") &&
        !e.target.classList.contains("more-button")
    ) {
        document.querySelectorAll(".more-buttons").forEach(el => {
            el.style.display = "none";
        });
    }
});


renderTable();