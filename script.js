var running = false;
var pre_pause_milsecs = 0; // Milliseconds from initial start to most recent pause
var minutes = 0; // Since last start
var seconds = 0; // Since last start
var start_time = null; // The most recent start time after a pause, not the initial start time
var stop_time = null;
var update_interval;
var clear_background_interval;
var disabled = false;

// This acts as the start AND the resume function
function start() {
    if (start_time == null) document.querySelector("button").removeAttribute("disabled");
    start_time = new Date();
    running = true;
    var first_update_interval = setInterval(() => {
        updateStopwatch();
        clearInterval(first_update_interval);
        update_interval = setInterval(updateStopwatch, 1000);
    }, 1000 - pre_pause_milsecs % 1000);
    document.querySelector("body").style.backgroundColor = "rgba(0, 255, 0, 0.3)";
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
    document.querySelector("body").style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    clear_background_interval = setInterval(clearBackground, 50);
    pre_pause_milsecs += Date.now() - start_time.getTime();
}

function toggleRun() {
    if (disabled) return;
    disabled = true;
    if (running) pause();
    else start();
    disabled = false;
}

async function reset() {
    if (disabled) return;
    disabled = true;
    await pause();
    if (!(window.confirm("Are you sure you want to reset the stopwatch? This cannot be undone."))) {
        start();
        disabled = false;
        return;
    }
    start_time = stop_time = null;
    pre_pause_milsecs = minutes = seconds = 0;
    if (running) clearInterval(update_interval);
    running = false;
    document.querySelector("h1").textContent = "0:00";
    document.querySelector("button").setAttribute("disabled", "true");
    disabled = false;
}

function updateStopwatch() {
    /*
    if ((minutes < 60 && seconds + 1 == 60) || (minutes >= 60 && seconds == minutes)) {
        minutes += 1;
        seconds = 0;
    } else seconds += 1;
    document.querySelector("h1").textContent = minutes + ":" + (seconds.toString().length == 1 ? "0" + seconds.toString() : seconds);
    */
    let ms = Date.now() - start_time.getTime() + pre_pause_milsecs;
    if (Math.trunc(ms / 60000) <= 60) {
        ms -= ms % 1000;
        minutes = Math.trunc(ms / 60000);
        seconds = (ms - minutes * 60000) / 1000;
    } else if ((60 + Math.trunc(ms / 1000) % 60) < Math.trunc(ms / 60000)) {
        ms -= ms % 1000;
        minutes = Math.trunc(ms / 60000) - 1;
        seconds = (ms - minutes * 60000) / 1000;
    } else {
        ms -= ms % 1000;
        minutes = Math.trunc(ms / 60000);
        seconds = (ms - minutes * 60000) / 1000;
    }
    document.querySelector("h1").textContent =  minutes + ":" + (seconds < 10 ? "0" + seconds.toString() : seconds);
}

window.onload = (e) => {
    document.querySelector("div").style.left = "calc(50% - " + document.querySelector("div").offsetWidth / 2 + "px";
    document.body.addEventListener("click", (e) => {
        if(e.target.tagName !== "BUTTON") toggleRun();
    });
}

/*
function getTimeDiff(time1, time2) {
    let ms_diff = Math.abs(time1.getTime() - time2.getTime());
    let remainder = ms_diff;
    let min_diff = Math.trunc(remainder / 60000);
    remainder -= min_diff * 60000;
    let sec_diff = Math.trunc(remainder / 1000);
    return [min_diff, sec_diff];
    if (hr_diff > 0) return hr_diff + ":" + (min_diff.toString().length == 1 ? "0" + min_diff.toString() : min_diff) + ":" + (sec_diff.toString().length == 1 ? "0" + sec_diff.toString() : sec_diff);
    else return min_diff + ":" + (sec_diff.toString().length == 1 ? "0" + sec_diff.toString() : sec_diff);
}

function styleTime(sec_input) {
    if (sec_input % 60 <= 60) {
        let min = Math.trunc(sec_input / 60);
        let sec = sec_input % 60;
        return min + ":" + (sec.toString().length == 1 ? "0" + sec.toString() : sec);
    }
    /*
    let remainder = sec_input + hr_input * 3600 + min_input * 60;
    let hr = Math.trunc(remainder / 3600);
    remainder -= hr * 3600;
    let min = Math.trunc(remainder / 60);
    remainder -= min * 60;
    let sec = remainder;
    if (hr > 0) return hr + ":" + (min.toString().length == 1 ? "0" + min.toString() : min) + ":" + (sec.toString().length == 1 ? "0" + sec.toString() : sec);
    else return min + ":" + (sec.toString().length == 1 ? "0" + sec.toString() : sec);
    *//*
}
*/