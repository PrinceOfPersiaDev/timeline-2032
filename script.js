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
    let difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
        return null;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);

    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);

    const hours = totalHours % 24;
    const totalDays = Math.floor(totalHours / 24);

    /*
     * برای سال و ماه، از تاریخ واقعی استفاده می‌کنیم
     * تا تعداد روزهای ماه و سال کبیسه درست محاسبه شود.
     */
    const now = new Date();

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

    /*
     * اگر زمان امروز از زمان هدف در همان روز جلوتر باشد،
     * محاسبه سال/ماه/روز را یک مرحله اصلاح می‌کنیم.
     */
    const candidate = new Date(
        now.getFullYear() + years,
        now.getMonth() + months,
        now.getDate() + days,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
    );

    if (candidate > targetDate) {
        days--;

        if (days < 0) {
            months--;

            const previousMonth = new Date(
                targetDate.getFullYear(),
                targetDate.getMonth(),
                0
            );

            days = previousMonth.getDate() + days;
        }

        if (months < 0) {
            years--;
            months += 12;
        }
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
