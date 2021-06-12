function init() {
    scheduler.init('scheduler_here', new Date(), "month");
    scheduler.templates.xml_date = function (value) { return new Date(value); };
    scheduler.load("/api/calendar-data", "json");
    scheduler.config.xml_date="%Y-%m-%d %H:%i";

    var dp = new dataProcessor("/api/calendar-data");
    dp.init(scheduler);
    dp.setTransactionMode("POST", false);
}

init();