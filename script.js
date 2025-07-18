let currentMonth = document.querySelector('.current-month'),
    calendarDays = document.querySelector('.calendar-days'),
    today = new Date(),
    date = new Date(),
    auxDate;

function changeMonthLang(date = new Date(), lang = 'ptBr') {
    const localeDateConfig = { 
        restDateConfig: { month: 'long', year: 'numeric' },
        langs: {
            enUS: 'en-US',
            ptBr: {
                January: 'Janeiro',
                February: 'Fevereiro',
                March: 'Março',
                April: 'Abril',
                May: 'Maio',
                June: 'Junho',
                July: 'Julho',
                August: 'Agosto',
                September: 'Setembro',
                October: 'Outubro',
                November: 'Novembro',
                December: 'Dezembro'
            } 
        }
    };

    const localeDateMonth = date.toLocaleDateString(localeDateConfig.langs.enUS, localeDateConfig.restDateConfig),
          month = localeDateMonth.split(' ')[0];
    
    auxDate = localeDateMonth;
    
    return localeDateMonth.replace(month, localeDateConfig.langs[lang][month]);
}

function renderCalendar() {
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
          totalMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
          startWeekDay = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
    
    calendarDays.innerHTML = '';

    let totalCalendarDay = 6 * 7;

    for (let i = startWeekDay; i >= 0; i--) {
        if (i <= startWeekDay) {
            totalCalendarDay--;
            // adding previous month days
            calendarDays.innerHTML += `<div class='padding-day'>${prevLastDay - i}</div>`;
        } else break;
    }

    const auxWeekDay = startWeekDay + 1

    for (let i = auxWeekDay; i < totalCalendarDay + auxWeekDay; i++) {
        let day = i - startWeekDay;

        if (i <= (startWeekDay + totalMonthDay)) {
            // adding this month days
            date.setDate(day);
            date.setHours(0, 0, 0, 0);
            
            let dayClass = date.getTime() === today.getTime() ? 'current-day month-day' : 'month-day';
            calendarDays.innerHTML += `<div class='${dayClass}'>${day}</div>`;
        } else {
            // adding next month days
            calendarDays.innerHTML += `<div class='padding-day'>${day - totalMonthDay}</div>`;
        }
    }
}

function persistChosenDay(date, monthDays, sessionDate) {
    const sessionDateArr = sessionDate.split(',');

    for (let monthDay of monthDays) {
        if (
            (date.getFullYear() == sessionDateArr[0]) &&
            (date.getMonth() == sessionDateArr[1]) &&
            (monthDay.textContent == sessionDateArr[2])
        ) monthDay.classList.add('chosen-day');
    }
}

function guaranteeOneChosenDay(monthDays, chosenDay) {
    for (let monthDay of monthDays) {
        if (monthDay.classList.contains('chosen-day') && monthDay !== chosenDay) {
            monthDay.classList.remove('chosen-day');
            break;
        }
    }
}

function updateCalendarListener(date) {
    const monthDays = document.querySelectorAll('.month-day');

    const sessionDate = sessionStorage.getItem('chosenDay');

    if (sessionDate) persistChosenDay(date, monthDays, sessionDate);

    monthDays.forEach((element) => {
        element.addEventListener('click', () => {
            guaranteeOneChosenDay(monthDays, element);

            if (!element.classList.contains('chosen-day')) {
                element.classList.add('chosen-day')
                sessionStorage.setItem('chosenDay', [date.getFullYear(), date.getMonth(), Number(element.textContent)]);
            } else {
                element.classList.remove('chosen-day');
                sessionStorage.removeItem('chosenDay');
            }
        });
    });
}

function browsersCompatibilityDate(date = 'January 2025') {
    // This function is required to maintain compatibility between Chrome and Firefox
    const dateArr = date.split(' '),
            yy = dateArr[1],
            monthKey = dateArr[0];

    const months = {
                January: '01',
                February: '02',
                March: '03',
                April: '04',
                May: '05',
                June: '06',
                July: '07',
                August: '08',
                September: '09',
                October: '10',
                November: '11',
                December: '12'
            } 

    return new Date(`${months[monthKey]}/01/${yy}`);
}

function changeMonth(el) {
    date = new Date(browsersCompatibilityDate(auxDate));
    date.setMonth(date.getMonth() + (el.classList.contains('prev') ? -1 : 1));

    currentMonth.textContent = changeMonthLang(date);

    renderCalendar();
    updateCalendarListener(date);
}

function goToToday() {
    date = new Date();

    currentMonth.textContent = changeMonthLang(date);

    sessionStorage.setItem('chosenDay', `${date.getFullYear()},${date.getMonth()},${date.getDate()}`);

    persistChosenDay(date, document.querySelectorAll('.month-day'), sessionStorage.getItem('chosenDay'));
    renderCalendar();
    updateCalendarListener(date);
}

currentMonth.textContent = changeMonthLang(date);
today.setHours(0, 0, 0, 0);
renderCalendar();
updateCalendarListener(date);

document.querySelectorAll('.btn').forEach((element) => {
	element.addEventListener('click', () => {
        const btnClass = element.classList;

        if (btnClass.contains('today')) {
            goToToday();
            return;
        }

		changeMonth(element);
	});
});