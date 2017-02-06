/*---------- Global Variables ----------*/


/*---------- State Management ----------*/

function getData() {
    $.getJSON("https://www.thinkful.com/pysplash/api/open_sessions", function() {
            console.log("success");
        })
        .done(function(data) {
            console.log("second success");
            showResults(data.open_sessions);
        })
        .fail(function() {
            console.log("error");
            alert("Must be logged in to Thinkful to access Q&A sessions");
        })
        .always(function() {
            console.log("complete");
        });
}

function createDate(string) {
    if (!string) {
        return moment().format("MM DD YYYY");
    } else {
        return moment(string).format("MM DD YYYY");
    }
}

function createTime(string, duration) {
    if (string && duration) {
        return moment(string).add(duration, 'minutes').format('hh:mm A');
    } else if (!duration) {
        return moment(string).format('hh:mm A');
    } else {
        return moment().format('hh:mm A');
    }
}

/*---------- DOM Manipulation ----------*/

function changeButton(value, isAfter, isBefore) {
	// future fix: http://momentjs.com/guides/#/warnings/js-date/
    if (isAfter == true && isBefore == true) {
        return '<a href = "' + value.session_room_url + '">Now: Click to Join</a>';
    } else {
        return '<a href = "' + value.detail_page_url + '">Session Details</a>';
    }
}

function showResults(results) {
    var i = 0;
    var currentTime = createTime();
    $.each(results, function(data, value) {
        var todaysDate = createDate();
        var sessionDate = createDate(value.start_dt_utc);
        if (sessionDate == todaysDate) {
            i++;
            var sessionStart = createTime(value.start_dt_utc);
            var sessionFinish = createTime(value.start_dt_utc, value.duration_minutes);
            var isAfter = moment(currentTime).isAfter(moment(sessionStart));
            var isBefore = moment(currentTime).isBefore(moment(sessionFinish));
            var sessionButton = changeButton(value, isAfter, isBefore);
            $('ul').append('<li id="session' + i + '">');
            $('#session' + i).append('<div class="avatar-wrapper" id="avatar-wrapper' + i + '">');
            $('#avatar-wrapper' + i).append('<img src="' + value.host.image_url + '"><span>' + value.host.name + '</span></div>');
            $('#session' + i).append('<h3>' + value.title + '</h3><p>' + sessionStart + ' - ' + sessionFinish + '</p></li>');
            $('#session' + i).append('<button>' + sessionButton + '</button>');
        }
    });
    if (i == 0) {
        $('.dropdown').append('<img src="images/semicolon.jpg"><p>No more sessions for today.</p>');
    }
};

/*---------- Event Listeners ----------*/

$('body').on('click', 'a', function() {
    chrome.tabs.create({ url: $(this).attr('href') });
    return false;
});

/*---------- Main Function ----------*/

$(function() {
    console.log("ready!");
    getData();
});