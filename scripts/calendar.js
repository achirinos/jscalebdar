function Calendar(config)
{
    var cal = {};
    var current = {};
    var currentMonth = 0;
    var currentWeekDay = 0;
    var holidays = {};

    var weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var getMonthName = function (v) {
        var n = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return n[v]
    }
    
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf())
        date.setDate(date.getDate() + days);
        return date;
    }

    
}