
export function convertUnixToDateWithoutMinutes(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

//unix timestamp in seconds converted to a date
export function convertUnixToDate(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    // var sec = a.getSeconds();
    var min = "0" + a.getMinutes();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    var timeAlt = date + '.' + a.getMonth() + '.' + year + ' ' + hour + ':' + min.substr(-2);
    return time;
}

// console.log("test time", convertUnixToDate(1568804800))