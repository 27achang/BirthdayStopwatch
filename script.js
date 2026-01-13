var running = false;
var minutes = 59;
var seconds = 58;
var original_start_time = null;
var start_time = null;
var stop_time = null;
var reset_hold = false;
var update_interval;
var clear_background_interval;

function start() {
    if (reset_hold) {
        reset_hold = false;
        return;
    }
    if (start_time == null) {
        original_start_time = new Date();
        document.querySelector("button").removeAttribute("disabled");
    }
    start_time = new Date();
    running = true;
    update_interval = setInterval(updateStopwatch, 250);
    document.querySelector("body").style.backgroundColor = "lime";
    clear_background_interval = setInterval(clearBackground, 50);
}

function clearBackground() {
    document.querySelector("body").style.backgroundColor = "white";
    clearInterval(clear_background_interval);
}

function pause() {
    running = false;
    stop_time = new Date();
    clearInterval(update_interval);
    document.querySelector("body").style.backgroundColor = "red";
    clear_background_interval = setInterval(clearBackground, 50);
    /*
    let diff = getTimeDiff(new Date(), start_time);
    hours += diff[0];
    minutes += diff[1];
    seconds += diff[2];
    */
}

function toggleRun() {
    if (running) pause();
    else start();
}

function reset() {
    reset_hold = true;
    original_start_time = start_time = stop_time = null;
    hours = minutes = seconds = 0;
    if (running) {
        console.log("stopping");
        clearInterval(update_interval);
    }
    running = false;
    document.querySelector("h1").textContent = "0:00";
    document.querySelector("button").setAttribute("disabled", "true");
}

function updateStopwatch() {
    if ((minutes < 60 && seconds + 1 == 60) || (minutes >= 60 && seconds == minutes)) {
        minutes += 1;
        seconds = 0;
    } else seconds += 1;
    document.querySelector("h1").textContent = minutes + ":" + (seconds.toString().length == 1 ? "0" + seconds.toString() : seconds);
    /*
    let diff = getTimeDiff(new Date(), start_time);
    document.querySelector("h1").textContent = styleTime(diff[0], diff[1], diff[2] + hours * 3600 + minutes * 60 + seconds);
    
    */
    // console.log("Hours: " + hours + "\nMinutes: " + minutes + "\nSeconds: " + seconds);
    console.log("Minutes: " + minutes + "\nSeconds: " + seconds);
}

window.onload = (e) => {
    document.querySelector("div").style.left = "calc(50% - " + document.querySelector("div").offsetWidth / 2 + "px";
}

function getTimeDiff(time1, time2) {
    let ms_diff = Math.abs(time1.getTime() - time2.getTime());
    let remainder = ms_diff;
    let hr_diff = Math.trunc(ms_diff / 3600000);
    remainder -= hr_diff * 3600000;
    let min_diff = Math.trunc(remainder / 60000);
    remainder -= min_diff * 60000;
    let sec_diff = Math.trunc(remainder / 1000);
    return [hr_diff, min_diff, sec_diff];
    if (hr_diff > 0) return hr_diff + ":" + (min_diff.toString().length == 1 ? "0" + min_diff.toString() : min_diff) + ":" + (sec_diff.toString().length == 1 ? "0" + sec_diff.toString() : sec_diff);
    else return min_diff + ":" + (sec_diff.toString().length == 1 ? "0" + sec_diff.toString() : sec_diff);
}

function styleTime(hr_input, min_input, sec_input) {
    let remainder = sec_input + hr_input * 3600 + min_input * 60;
    let hr = Math.trunc(remainder / 3600);
    remainder -= hr * 3600;
    let min = Math.trunc(remainder / 60);
    remainder -= min * 60;
    let sec = remainder;
    if (hr > 0) return hr + ":" + (min.toString().length == 1 ? "0" + min.toString() : min) + ":" + (sec.toString().length == 1 ? "0" + sec.toString() : sec);
    else return min + ":" + (sec.toString().length == 1 ? "0" + sec.toString() : sec);
}