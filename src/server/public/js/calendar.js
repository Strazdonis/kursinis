const Calendar = tui.Calendar;
const buttons = {
    prev: document.getElementById("button-prev"),
    today: document.getElementById("button-today"),
    next: document.getElementById("button-next"),
};


// register templates
const templates = {
    popupIsAllDay: function () {
        return 'All Day';
    },
    popupStateFree: function () {
        return 'Free';
    },
    popupStateBusy: function () {
        return 'Busy';
    },
    titlePlaceholder: function () {
        return 'Subject';
    },
    locationPlaceholder: function () {
        return 'Location';
    },
    startDatePlaceholder: function () {
        return 'Start date';
    },
    endDatePlaceholder: function () {
        return 'End date';
    },
    popupSave: function () {
        return 'Save';
    },
    popupUpdate: function () {
        return 'Update';
    },
    popupDetailDate: function (isAllDay, start, end) {
        var isSameDate = moment(start).isSame(end);
        var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

        if (isAllDay) {
            return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
        }

        return (moment(start).format('YYYY.MM.DD hh:mm a') + ' - ' + moment(end).format(endFormat));
    },
    popupDetailLocation: function (schedule) {
        return 'Location : ' + schedule.location;
    },
    popupDetailUser: function (schedule) {
        return 'User : ' + (schedule.attendees || []).join(', ');
    },
    popupDetailState: function (schedule) {
        return 'State : ' + schedule.state || 'Busy';
    },
    popupDetailRepeat: function (schedule) {
        return 'Repeat : ' + schedule.recurrenceRule;
    },
    popupDetailBody: function (schedule) {
        return 'Body : ' + schedule.body;
    },
    popupEdit: function () {
        return 'Edit';
    },
    popupDelete: function () {
        return 'Delete';
    }
};

const calendar = new tui.Calendar('#calendar', {
    defaultView: 'week',
    template: templates,
    useCreationPopup: true,
    useDetailPopup: true,
    taskView: ['task'],
    month: {
        moreLayerSize: {
            height: 'auto'
        },
        grid: {
            header: {
                header: 34
            },
            footer: {
                height: 10
            }
        },
        narrowWeekend: true,
        startDayOfWeek: 1, // monday
        visibleWeeksCount: 3,
        visibleScheduleCount: 4
    },
    week: {
        narrowWeekend: true,
        startDayOfWeek: 1 // monday
    }
});

calendar.on('clickSchedule', function (event) {
    var schedule = event.schedule;

    // focus the schedule
    if (lastClickSchedule) {
        calendar.updateSchedule(lastClickSchedule.id, lastClickSchedule.calendarId, {
            isFocused: false
        });
    }
    calendar.updateSchedule(schedule.id, schedule.calendarId, {
        isFocused: true
    });

    lastClickSchedule = schedule;

    // open detail view
});

for (let time in buttons) {
    console.log(time);
    const btn = buttons[time];
    btn.addEventListener('click', e => {
        calendar[time]();
        setRenderRangeText();
    });
}

calendar.on('clickDayname', function (event) {
    if (calendar.getViewName() === 'week') {
        calendar.setDate(new Date(event.date));
        calendar.changeView('day', true);
    }
});


calendar.on('clickSchedule', function (event) {
    var schedule = event.schedule;

    if (lastClickSchedule) {
        calendar.updateSchedule(lastClickSchedule.id, lastClickSchedule.calendarId, {
            isFocused: false
        });
    }
    calendar.updateSchedule(schedule.id, schedule.calendarId, {
        isFocused: true
    });

    lastClickSchedule = schedule;
    // open detail view
});

format = function date2str(x, y) {
    x = new Date(x);
    var z = {
        M: x.getMonth() + 1,
        D: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|D+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return y.replace(/(Y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}

function setRenderRangeText() {
    var renderRange = document.getElementById('renderRange');
    var options = calendar.getOptions();
    var viewName = calendar.getViewName();
    var html = [];
    if (viewName === 'day') {
        html.push(format(calendar.getDate().getTime(), "YYYY.MM.DD"));
    } else if (viewName === 'month' &&
        (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
        html.push(format(calendar.getDate().getTime(), "YYYY.MM"));
    } else {
        html.push(format(calendar.getDateRangeStart().getTime(), "YYYY.MM.DD"));
        html.push(' ~ ');
        html.push(format(calendar.getDateRangeEnd().getTime(), "MM.DD"));
    }
    renderRange.innerHTML = html.join('');
}

setRenderRangeText();

calendar.on('beforeCreateSchedule', function (event) {
    console.log(event);
    var startTime = event.start;
    var endTime = event.end;
    var isAllDay = event.isAllDay;
    var guide = event.guide;
    var triggerEventName = event.triggerEventName;
    console.log(isAllDay, guide);
    var schedule = {
        id: '2',
        calendarId: '1',
        title: event.title,
        category: 'time',
        dueDateClass: '',
        start: startTime,
        end: endTime,
    };

    if (triggerEventName === 'click') {
        // open writing simple schedule popup
        //schedule = {...};
    } else if (triggerEventName === 'dblclick') {
        // open writing detail schedule popup
        //schedule = {...};
    }

    console.log(schedule);

    calendar.createSchedules([schedule]);
});