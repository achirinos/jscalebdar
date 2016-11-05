function Calendar(config)
{
    var output = config;

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

    var getDateArray = function (startDate, endDate, fn) {

        fn = fn || Date.prototype.addDays;

        var array = [];
        var current = startDate;

        while (current <= endDate) {
            array.push({
                day: current.getDate(),
                month: current.getMonth(),
                year: current.getFullYear(),
                weekday: current.getDay()
            });
            current = fn.call(current, 1);
        }

        return array;

    }

        
    var start = function(month)
    {
        var table = $('<table class="calendar">')
        var weekRow = $("<tr>");        
        weekDays.forEach(function (e, i) {
            weekRow.append('<td>' + e + '</td>');
        });
        var monthRow = $('<tr><td colspan="7">' + getMonthName(month) + '</td></tr>')

        cal = {};

        cal.row = $('<tr>');
        cal.table = table.append(weekRow).append(monthRow);
    }

    var finish = function()
    {       
        cal.row.append(fillEmptyDays(6 - currentWeekDay));
        cal.table.append(cal.row);

        currentMonth = current.month;

        $('[id=' + output + ']').append(cal.table);
    }

    var fillEmptyDays = function (num) {
        var fill = '';
        for (var i = 0; i < num; i++) {
            fill += '<td class="empty"></td>';
        }

        cal.row.append(fill);
    };

    var addDay = function(current)
    {
        if (current.weekday == 0) {
            cal.table.append(cal.row);
            cal.row = $('<tr>');
        }

        currentWeekDay = current.weekday;

        var stringDate = current.year + "-" + ("0" + (current.month + 1)).slice(-2) + "-" + ("0" + current.day).slice(-2);
        var isHoliday = holidays[stringDate];
        
        var dayType = "weekday";
        if ((current.weekday == 0 | current.weekday == 6))
            dayType = "weekend";
        if (isHoliday)
            dayType = "holiday";

        var day = '<td class="' + dayType + '">' + current.day + '</td>';
        cal.row.append(day);
    }
   
    var render = function(array, holi)
    {
        current = array[0];
        currentMonth = current.month;
        currentWeekDay = current.weekday;
        holidays = holi;
                
        start(current.month);        
        fillEmptyDays(current.weekday);
        addDay(current);
        
        for (var i = 1; i < array.length; i++) {
            
            current = array[i];
                        
            if(current.month != currentMonth)
            {
                finish();

                start(current.month);
                fillEmptyDays(current.weekday);
                addDay(current);
            }
            else            
                addDay(current);
        }

        finish();
    }

    this.Draw = function (startDate, numberDays, countryCode) {
        
        $('[id=' + output + ']').html('');

        var start = new Date(startDate.replace(/\-/g, '/'));
        var end = start.addDays(parseInt(numberDays));

        var holidays = {};

        $.get("https://holidayapi.com/v1/holidays?key=1b2c4ca0-d95b-4336-a335-eb1307b4186e&country=US&year=" + start.getFullYear(), function (data, status) {
            if (data)
                holidays = data.holidays;
        }).always(function () {
            var array = getDateArray(start, end);
            render(array, holidays);
        });
    }


}