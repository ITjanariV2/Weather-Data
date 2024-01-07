const searchBar = document.querySelector('#text');
const button = document.querySelector('#button');
const modeBtn = document.querySelectorAll('.btn');
const displayData = document.querySelector('#displayData');

let clickCounter = 0;
let count = 0;

let image, temp, desc, windSpeed, time, container, sortTabel;
let dates = [];
let randomArray = [];
let buttonDayCount = [];

function removeChildEl(p) {
    while (p.lastElementChild) {
        p.removeChild(p.lastElementChild);
    }
}

function fetchData() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchBar.value}&units=metric&appid=ee54c2903e058337bc79c6002aa4f2b3`).then(response => 
    response.json()).then(displayDataNow).catch(err => alert('error'));
}

searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') return compute();
})
button.addEventListener('click', compute);

function compute() {
    clickCounter++;
    if (clickCounter == 2) {
        removeChildEl(displayData);
        clickCounter = 1;
        count = 0;
        dates = [];
        randomArray = [];
        buttonDayCount = [];
        modeBtn.forEach(btn => {
            if (btn.className.includes('btn1')) {
                btn.classList.add('selected');
            }
            else if (!btn.className.includes('btn1')) {
                btn.classList.remove('selected');
            }
        })
        return fetchData();
    }
    else if (clickCounter < 2) {
        return fetchData();
    }
}

const displayDataNow = (w) => {
for (let y = 0; y < w.list.length-8; y++) { // -8 = 1 p2ev v2hem
    
    container = document.createElement('div');
    container.setAttribute('id', `weatherData`);
    container.setAttribute('container', '');

    time = document.createElement('div');
    time.setAttribute('id', 'time');

    image = document.createElement('div');
    image.setAttribute('id', 'img');

    temp = document.createElement('div');
    temp.setAttribute('id', 'temp');

    desc = document.createElement('div');
    desc.setAttribute('id', 'desc');

    windSpeed = document.createElement('div');
    windSpeed.setAttribute('id', 'wind');

    temp.textContent = `${w.list[y].main.temp} °C`;
    desc.textContent = `${w.list[y].weather[0].description}`;
    windSpeed.textContent = `${w.list[y].wind.speed} m/s`;

    let img = new Image();
    img.src = `https://openweathermap.org/img/wn/${w.list[y].weather[0].icon}@2x.png`;
    img.setAttribute('images','');
    image.appendChild(img);

    let dateSplitted = w.list[y].dt_txt.split(' ')[0]; // n2itab kuup2eva
    dates.push(dateSplitted); // liigutab dates arraysse

    let timeSplitted = w.list[y].dt_txt.split(' ')[1];
    time.textContent = timeSplitted;

    container.appendChild(time);
    container.appendChild(image);
    container.appendChild(desc);
    container.appendChild(temp);
    container.appendChild(windSpeed);
    randomArray.push(container);
}

let dayHolder = [];

for (let date = 0; date < dates.length; date++) {
    if (dates[date] == dates[date + 1]) {
        dayHolder.push(randomArray[date]);
    }
    else {
        sortTabel = document.createElement('div');
        sortTabel.setAttribute('id', `eachday${count}`);
        sortTabel.setAttribute('class', 'day');

        if (count === 0) sortTabel.classList.add('show');

        dayHolder.push(randomArray[date]);
        
        dayHolder.map(el => sortTabel.appendChild(el));
        dayHolder = [];
        count++;
        sortTabel.style.position = 'absolute';
        displayData.append(sortTabel);

        buttonDayCount.push(dates[date]); // kuup2ev, pole kordusi
    }
}

// button mode
for (let x = 0; x < modeBtn.length; x++) {
    modeBtn[x].style.display = 'inline';
    modeBtn[x].textContent = buttonDayCount[x].split('-').join('.'); // kuup2ev nuppude sees

    modeBtn[x].addEventListener('click', function() {
        let curBtn = document.querySelector('.selected');
        curBtn.className = curBtn.className.replace(' selected', '');
        this.className += ' selected';

        let showDay = document.querySelectorAll('.day');
        let curDay = document.querySelector('.show');
        curDay.className = curDay.className.replace(' show', '');
        showDay[x].classList.add('show');  
    }); 
}
}

// nav
const navEl = document.querySelectorAll('.navEl');
for (let x = 0; x < navEl.length; x++) {
    navEl[x].addEventListener('click', function() {
        let curEl = document.querySelector('.active');
        curEl.className = curEl.className.replace(' active', '');
        this.className += ' active';
    });
}