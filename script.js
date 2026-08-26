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
    message: document.getElementById("mysteryMessage")
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
        years--;
        months += 12;
    }

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

function transitionToNextStage() {
    if (currentStage === 1) {
        currentStage = 2;

        elements.countdown.classList.add("final-moment");

        elements.message.style.opacity = "0";
        elements.message.style.transform = "translateY(8px)";

        setTimeout(() => {
            elements.countdown.classList.remove("final-moment");

            elements.message.textContent = "زمان ادامه دارد.";

            elements.message.style.opacity = "1";
            elements.message.style.transform = "translateY(0)";
        }, 1800);
    }
}

function updateCountdown() {
    const target =
        currentStage === 1
            ? FIRST_TARGET
            : SECOND_TARGET;

    const time = getTimeDifference(target);

    if (!time) {
        transitionToNextStage();
        return;
    }

    updateDisplay(time);
}

updateCountdown();

setInterval(updateCountdown, 1000);
