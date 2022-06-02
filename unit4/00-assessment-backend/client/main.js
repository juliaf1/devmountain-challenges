const API_BASE_URL = 'http://localhost:4000/api/';

const complimentBtn = document.getElementById('complimentButton');
const fortuneBtn = document.getElementById('fortuneButton');
const drinkBtn = document.getElementById('drinkBotButton');

const sweetAlertContainer = document.querySelector('.sweet-alert-container');
const sweetAlertText = sweetAlertContainer.querySelector('.alert-text');
const sweetAlertIcon = sweetAlertContainer.querySelector('.alert-icon');

const toDoInput = document.querySelector('#toDoInput');
const toDoForm = document.querySelector('form');
const toDoBtn = document.querySelector('#toDoButton');
const toDoListContainer = document.querySelector('#toDoListContainer');
const toDoItems = document.querySelectorAll('.to-do-item');

const getCompliment = () => {
    axios.get(API_BASE_URL + 'compliment')
        .then(res => {
            const data = res.data;
            alert(data);
    });
};

const getFortune = () => {
    axios.get(API_BASE_URL + 'fortune')
        .then(res => {
            const data = res.data;
            alert(data);
    });
};

const getDrinkBotAnswer = () => {
    axios.get(API_BASE_URL + 'drink_allowed')
        .then(res => {
            const data = res.data;
            sweetAlertContainer.classList.remove('d-none');
            sweetAlertText.innerText = data.text;
            sweetAlertIcon.innerText = data.emoji;
            setTimeout(function() {
                sweetAlertContainer.classList.add('d-none');
            }, 1800);
    });
};

const getToDoList = () => {
    axios.get(API_BASE_URL + 'todo')
        .then(res => {
            const data = res.data;
            displayToDoList(data);
    });
 };

const displayToDoList = list => {
    toDoListContainer.innerHTML = '';
    list.forEach(item => {
        const { id, title, completed } = item;
        const toDoItem = document.createElement('div');
        toDoItem.classList.add('to-do-item');
        toDoItem.id = id;
        toDoItem.innerHTML = `<span class="to-do-check">${completed ? '✔️' : ''}</span>
        <p class="to-do-text">${title}</p>`;
        toDoListContainer.appendChild(toDoItem);
    });
};

const addToDoList = event => {
    event.preventDefault();
    let item = toDoInput.value;
    toDoInput.value = '';
    axios.post(API_BASE_URL + 'todo', { title: item })
        .then(res => {
            const data = res.data;
            displayToDoList(data);
    });
};

complimentBtn.addEventListener('click', getCompliment);
fortuneBtn.addEventListener('click', getFortune);
drinkBtn.addEventListener('click', getDrinkBotAnswer);
toDoForm.addEventListener('submit', addToDoList);

getToDoList();