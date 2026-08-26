const FIRST_TARGET = new Date("2028-01-01T00:00:00");
const SECOND_TARGET = new Date("2032-01-01T00:00:00");

let currentStage = 1;

const elements = {
    years: document.getElementById("years"),
    months: document.getElementById("months"),
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    countdown: document.getElementById("countdown"),
    message: document.getElementById("mysteryMessage"),
    localClock: document.getElementById("localClock")
};
function pad(number) {
    return String(number).padStart(2, "0");
}

function getTimeDifference(targetDate) {
    const now = new Date();

    if (targetDate.getTime() <= now.getTime()) {
        return null;
    }

    let years = targetDate.getFullYear() - now.getFullYear();
    let months = targetDate.getMonth() - now.getMonth();
    let days = targetDate.getDate() - now.getDate();

    let hours = targetDate.getHours() - now.getHours();
    let minutes = targetDate.getMinutes() - now.getMinutes();
    let seconds = targetDate.getSeconds() - now.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }

    if (minutes < 0) {
        minutes += 60;
        hours--;
    }

    if (hours < 0) {
        hours += 24;
        days--;
    }

    if (days < 0) {
        months--;

        const previousMonth = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            0
        );

        days += previousMonth.getDate();
    }

    if (months < 0) {
        months += 12;
        years--;
    }

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds
    };
}

function updateDisplay(time) {
    elements.years.textContent = pad(time.years);
    elements.months.textContent = pad(time.months);
    elements.days.textContent = pad(time.days);
    elements.hours.textContent = pad(time.hours);
    elements.minutes.textContent = pad(time.minutes);
    elements.seconds.textContent = pad(time.seconds);
}

function moveTo2032() {
    if (currentStage !== 1) {
        return;
    }

    currentStage = 2;

    elements.countdown.classList.add("final-moment");

    elements.message.style.opacity = "0";
    elements.message.style.transform = "translateY(8px)";

    setTimeout(() => {
        elements.message.textContent = "زمان ادامه دارد.";

        elements.message.style.opacity = "1";
        elements.message.style.transform = "translateY(0)";

        elements.countdown.classList.remove("final-moment");
    }, 1800);
}

function updateCountdown() {
    const target =
        currentStage === 1
            ? FIRST_TARGET
            : SECOND_TARGET;

    const time = getTimeDifference(target);

    if (!time) {
        moveTo2032();
        return;
    }

    updateDisplay(time);
}

function updateLocalClock() {
    if (!elements.localClock) {
        return;
    }

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    elements.localClock.textContent =
        `${hours}:${minutes}:${seconds}`;
}

updateLocalClock();

setInterval(updateLocalClock, 1000);

updateCountdown();

setInterval(updateCountdown, 1000);

/* =========================
   TIME CINEMATIC INTRO
========================= */

const timeIntro = document.getElementById("timeIntro");

if (timeIntro) {
    timeIntro.addEventListener("animationend", () => {
        timeIntro.remove();
    });
}

/* ثبت Service Worker */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("TIME Service Worker registered.");
            })
            .catch((error) => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}

/* =========================
   TIME NUMBER ANIMATION
========================= */

function animateTimeNumber(element, newValue) {
    if (!element) return;

    const value = String(newValue);

    if (element.textContent === value) {
        return;
    }

    element.classList.remove("number-change");

    // Force browser to restart animation
    void element.offsetWidth;

    element.textContent = value;
    element.classList.add("number-change");
}
