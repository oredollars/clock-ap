function getTimePartsInZone(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const parts = formatter.formatToParts(date);
    return {
        hours: Number(parts.find((p) => p.type === "hour").value),
        minutes: Number(parts.find((p) => p.type === "minute").value),
        seconds: Number(parts.find((p) => p.type === "second").value)
    };
}

function format12Hour(hours, minutes, seconds) {
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const formattedTime =
        String(displayHours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    return { formattedTime, ampm };
}

function updateAnalogHands(hours, minutes, seconds, hourId, minuteId, secondId) {
    const hourRotation = (hours % 12) * 30 + minutes * 0.5;
    const minuteRotation = minutes * 6 + seconds * 0.1;
    const secondRotation = seconds * 6;

    document.getElementById(hourId).style.transform =
        `translateX(-50%) rotate(${hourRotation}deg)`;
    document.getElementById(minuteId).style.transform =
        `translateX(-50%) rotate(${minuteRotation}deg)`;
    document.getElementById(secondId).style.transform =
        `translateX(-50%) rotate(${secondRotation}deg)`;
}

function updateClock() {
    const now = new Date();

    // 1. Local / existing clock
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const local12 = format12Hour(hours, minutes, seconds);
    document.getElementById("digitalTime").textContent = local12.formattedTime;
    document.getElementById("ampm").textContent = local12.ampm;

    const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-US", dateOptions);

    updateAnalogHands(hours, minutes, seconds, "hourHand", "minuteHand", "secondHand");

    // 2. Ghana Time (GMT / Africa/Accra)
    const ghanaZone = "Africa/Accra";
    const ghana = getTimePartsInZone(now, ghanaZone);
    const ghana12 = format12Hour(ghana.hours, ghana.minutes, ghana.seconds);

    const ghanaDigitalEl = document.getElementById("ghanaDigitalTime");
    const ghanaAmpmEl = document.getElementById("ghanaAmpm");
    const ghanaDateEl = document.getElementById("ghanaDate");

    if (ghanaDigitalEl) ghanaDigitalEl.textContent = ghana12.formattedTime;
    if (ghanaAmpmEl) ghanaAmpmEl.textContent = ghana12.ampm;
    if (ghanaDateEl) {
        ghanaDateEl.textContent = now.toLocaleDateString("en-US", {
            ...dateOptions,
            timeZone: ghanaZone
        });
    }

    // Optional: update a second analog clock if you add hands for Ghana
    if (document.getElementById("ghanaHourHand")) {
        updateAnalogHands(
            ghana.hours,
            ghana.minutes,
            ghana.seconds,
            "ghanaHourHand",
            "ghanaMinuteHand",
            "ghanaSecondHand"
        );
    }
}

updateClock();
setInterval(updateClock, 1000);
