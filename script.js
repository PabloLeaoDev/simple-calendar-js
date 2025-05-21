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


currentMonth.textContent = changeMonthLang(date);
today.setHours(0, 0, 0, 0);
renderCalendar();

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
            
            let dayClass = date.getTime() === today.getTime() ? 'current-day' : 'month-day';
            calendarDays.innerHTML += `<div class='${dayClass}'>${day}</div>`;
        } else {
            // adding next month days
            calendarDays.innerHTML += `<div class='padding-day'>${day - totalMonthDay}</div>`;
        }
    }
}

document.querySelectorAll('.month-btn').forEach((element) => {
	element.addEventListener('click', () => {
		date = new Date(auxDate);
        date.setMonth(date.getMonth() + (element.classList.contains('prev') ? -1 : 1));

		currentMonth.textContent = changeMonthLang(date);

		renderCalendar();
	});
});
