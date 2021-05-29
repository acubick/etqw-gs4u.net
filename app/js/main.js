// ==UserScript==
// @name     ETQW-gs4u.net
// @version  1.0
// @include  https://www.gs4u.net/ru/s/*
// @grant    none
// @author acubick
// @description The script modifies the players table on the ETQW GS4U.NET page 
// @namespace https://greasyfork.org/users/776468
// ==/UserScript==

let refreshbtn = document.querySelector('.refreshbtn');


// Конфигурация observer (за какими изменениями наблюдать)
const config = {
    attributes: true,
    childList: true,
    subtree: true
};

// Колбэк-функция при срабатывании мутации
const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        } else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
            location.reload();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
};

// Создаём экземпляр наблюдателя с указанной функцией колбэка
const observer = new MutationObserver(callback);

// Начинаем наблюдение за настроенными изменениями целевого элемента
observer.observe(refreshbtn, config);

// Позже можно остановить наблюдение
// observer.disconnect();


//'data-original-title="Нажмите, чтобы скопировать"><i class="fas fa-copy"></i></a>'

let tablesorter = document.querySelectorAll('.tablesorter');


if (!tablesorter.length) {
    console.log('На странице нет таблицы с игроками:>>');
} else {

    let killAvg = 0,
        deathAvg = 0,
        kdAvg = 0,
        pingAvg = 0,
        botAvg = 0,
        countPlayers = 0,
        xpAvg = 0,
        totalString = '';
    let tbody = document.querySelectorAll("tbody");


    // Метод создает верхнюю строку со средними значениями
    function createRow(killAvg, deathAvg, kdAvg, pingAvg, botAvg, xpAvg, count) {

        let tableRow = document.createElement('tr'); // создаем tr-ку

        for (let j = 0; j < 7; j++) {
            let tableTd = document.createElement('td'); // создаем td-шку
            tableTd.setAttribute('style', `text-align:left;color:#6fde7b;font-size: 16px;background-color: #303c39;`);
            switch (j) {
                case 0:
                    tableTd.innerText = "average count";
                    tableTd.setAttribute('class', 'average average_text');
                    break;
                case 1:
                    tableTd.setAttribute('class', 'average average_kill');
                    tableTd.innerText = killAvg;
                    break;
                case 2:
                    tableTd.setAttribute('class', 'average average_deaths');
                    tableTd.innerText = deathAvg;
                    break;
                case 3:
                    tableTd.setAttribute('class', 'average average_kd');
                    tableTd.innerText = kdAvg;
                    break;
                case 4:
                    tableTd.setAttribute('class', 'average average_ping');
                    tableTd.innerText = pingAvg;
                    break;
                case 5:
                    tableTd.setAttribute('class', 'average average_bot');
                    tableTd.innerText = botAvg;
                    break;
                case 6:
                    tableTd.setAttribute('class', 'average average_xp');
                    tableTd.innerText = xpAvg.toFixed(0);
                    break;

                default:
                    tableTd.innerText = "0";
                    tableTd.setAttribute('class', 'average');
                    break;
            }

            tableRow.appendChild(tableTd); // добавляем созданную td-шку в tr-ку
        }
        if (count > 1) {
            return 1;
        } else {
            tbody[count].insertAdjacentElement('beforebegin', tableRow); // добавляем созданную tr-ку в начало таблицы
        }
    }

    function createTotalRow(totalKills, totalDeaths, count) {
        let name = '';
        if (count === 0) {
            name = 'GDF';
        }
        if (count === 1) {
            name = 'Strogg';
        }

        let tableRow = document.createElement('tr'); // создаем tr-ку

        for (let j = 0; j < 3; j++) {
            let tableTd = document.createElement('td'); // создаем td-шку
            tableTd.setAttribute('style', `text-align:left;color:#de7f6f;font-size: 16px;background-color: #3c3030;`);
            switch (j) {
                case 0:
                    tableTd.innerText = name + ': ';
                    tableTd.setAttribute('class', 'total total_name');

                    break;
                case 1:
                    tableTd.setAttribute('class', 'total total_kill');
                    tableTd.innerText = totalKills;

                    break;
                case 2:
                    tableTd.setAttribute('class', 'total total_deaths');
                    tableTd.innerText = totalDeaths;

                    break;


                default:
                    tableTd.innerText = "0";
                    tableTd.setAttribute('class', 'average');
                    break;
            }

            tableRow.appendChild(tableTd); // добавляем созданную td-шку в tr-ку
        }
        if (count > 1) {
            return 1;
        } else {
            tbody[count].insertAdjacentElement('beforebegin', tableRow); // добавляем созданную tr-ку в начало таблицы
        }
    }

    function getTotalData() {
        let total = document.querySelectorAll('.total');
        let totalStr = '';
        for (let i = 0; i < total.length; i++) {
            totalStr += total[i].innerText;
            if (i === 0 || i === 3) {
                totalStr += " ";
            }
            if (i === 2) {
                totalStr += " | ";
            }
            if (i === 1 || i === 4) {
                totalStr += "/";
            }
        }
        return totalStr;
    }

    //Добавляем поля с KD
    function addFieldKD() {
        //Получаем все поля со смертями
        let deaths = document.querySelectorAll('.deaths');

        // После полей со смертями добавляем поля с кд
        for (let i = 0; i < deaths.length; i++) {

            if (deaths[i].className.split(' ').indexOf('players_table_header') > -1) {
                let tableTh = document.createElement('th'); // создаем th-шку
                tableTh.innerText = 'K/D'; // пишем в нее текст
                tableTh.setAttribute('class', 'players_table_header trhead average_kd header');
                deaths[i].insertAdjacentElement('afterEnd', tableTh);
            } else {
                let tableTd = document.createElement('td'); // создаем td-шку
                tableTd.innerText = 1; // пишем в нее текст
                tableTd.setAttribute('class', 'kd');
                deaths[i].insertAdjacentElement('afterEnd', tableTd);
            }
        }
    }
    //Заполняем КД игроков
    function countKD() {
        let count = 0;
        for (let y = 0; y < tbody.length - 1; y++) {
            let tagNameTr = tbody[y].getElementsByTagName('tr');
            let tbodyLength = tbody[y].childElementCount;
            for (let i = 0; i < tbodyLength; i++) {
                let kd = 0,
                    kill = 0,
                    deaths = 0,
                    bot = 0;
                for (let j = 0; j < tagNameTr[i].childElementCount; j++) {
                    if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('score') > -1) {
                        kill = Number.parseInt(tagNameTr[i].childNodes[j].innerText);
                        killAvg += kill;
                    }
                    if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('deaths') > -1) {
                        deaths = Number.parseInt(tagNameTr[i].childNodes[j].innerText);
                        deathAvg += deaths;
                    }
                    //K/D
                    if (kill === 0 && deaths === 0) {
                        if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('kd') > -1) {
                            tagNameTr[i].childNodes[j].innerText = 0;
                            kd = 0,
                                kill = 0,
                                deaths = 0;
                        }
                    } else
                    if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('kd') > -1) {
                        if (kill > 0 && deaths === 0) {
                            kd = Number.parseFloat(kill / 1);
                            kdAvg += +kd;
                        } else if (kill === 0 && deaths > 0) {
                            kd = Number.parseFloat((1 / deaths) / 2);
                            kdAvg += +kd;
                        } else {
                            kd = Number.parseFloat(kill / deaths);
                            kdAvg += +kd;
                        }

                        tagNameTr[i].childNodes[j].innerText = kd.toFixed(1);
                        if (kd >= 3) {
                            tagNameTr[i].childNodes[j].setAttribute('style', `color:#00ffcf;`);
                        } else
                        if (kd > 1.2 && kd < 3) {
                            tagNameTr[i].childNodes[j].setAttribute('style', `color:#44e644;`);
                        } else
                        if (kd <= 1.2 && kd >= 0.8) {
                            tagNameTr[i].childNodes[j].setAttribute('style', `color:#f1f147;`);
                        } else
                        if (kd <= 0.8 && kd >= 0.3) {
                            tagNameTr[i].childNodes[j].setAttribute('style', `color:#fd8383;`);
                        } else
                        if (kd < 0.3 && kd > 0) {
                            tagNameTr[i].childNodes[j].setAttribute('style', `color:#e44d4d;`);
                        } else
                        if (kd < 0) {
                            tagNameTr[i].childNodes[j].setAttribute('style', `color:#ffffff;`);
                        }
                        kd = 0,
                            kill = 0,
                            deaths = 0;

                    }
                    //  ping
                    if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('ping') > -1) {
                        let ping = Number.parseInt(tagNameTr[i].childNodes[j].innerText);
                        if (Number.isNaN(ping)) {
                            continue;
                        } else {
                            pingAvg += ping;
                        }
                    }
                    if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('bot') > -1) {
                        let bot = Number.parseInt(tagNameTr[i].childNodes[j].innerText);
                        if (Number.isNaN(bot)) {
                            countPlayers += 1;
                            continue;
                        } else {
                            botAvg += bot;
                        }
                    }
                    if (tagNameTr[i].childNodes[j].className.split(' ').indexOf('xp') > -1) {
                        let xp = Number.parseInt(tagNameTr[i].childNodes[j].innerText);
                        if (Number.isNaN(xp)) {
                            continue;
                        } else {
                            xpAvg += xp;
                        }
                    }
                }

            }

            let totalKills = killAvg;
            let totalDeaths = deathAvg;



            killAvg = (killAvg / tbodyLength).toFixed(1);
            deathAvg = (deathAvg / tbodyLength).toFixed(1);
            kdAvg = Number.parseFloat((kdAvg / tbodyLength).toFixed(1));
            if (pingAvg === 0) {
                pingAvg = 0;
            } else if (Number.isNaN(Number.parseInt(pingAvg / countPlayers))) {
                pingAvg = 0;
            } else {
                pingAvg = Number.parseInt(pingAvg / countPlayers);
            }
            xpAvg = xpAvg / tbodyLength;
            count = y;
            createTotalRow(totalKills, totalDeaths, count);
            createRow(killAvg, deathAvg, kdAvg, pingAvg, botAvg, xpAvg, count);
            killAvg = 0;
            deathAvg = 0;
            kdAvg = 0;
            pingAvg = 0;
            countPlayers = 0;
            botAvg = 0;
            xpAvg = 0;

        }

    }
    addFieldKD();
    countKD();



    function copyText(e) {
        let textTotal = 'total K/D :' + getTotalData();

        navigator.clipboard.writeText(textTotal)
            .then(() => {
                console.log("Copied the text: " + textTotal);
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    }

    let totalBlok = document.querySelector('.total_deaths');

    let copyLink = document.createElement('a');
    copyLink.setAttribute('title', 'Copy data');
    copyLink.setAttribute('style', `text-align:center;position:relative;color:pink;`);
    copyLink.setAttribute('id', 'copy_data');
    let copyIcon = document.createElement('i');
    copyIcon.setAttribute('class', 'fas fa-copy');
    copyLink.setAttribute('style', `font-size:24px;cursor:pointer;position:relative;top:5px;left:10px;background:transparent;`);
    copyLink.appendChild(copyIcon);
    totalBlok.insertAdjacentElement('afterend', copyLink);
    let copyDate = document.querySelector('#copy_data');
    copyDate.addEventListener("click", copyText, false);

}