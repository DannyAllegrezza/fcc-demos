let pomodoroTimer = (function () {
    let _timer;
    let _alarm = document.querySelector("#beep");
    let _timeLeftEl = document.querySelector("#start_stop");
    let _sessionLength = document.querySelector("#session-length");
    let _breakLength = document.querySelector("#break-length");
    let _timerLabel = document.querySelector("#timer-label");

    let _state = {
        secondsRemaining: 0,
        pomodorosCompleted: 0,
        breaksCompleted: 0,
        isRunning: false,
        breakLength: 5 * 60,
        sessionLength: 25 * 60,
        currentType: "SESSION"
    };

    let incrementCounter = function (typeEl, type) {
        if (_state.isRunning) { return; }

        let currentSession = Number(typeEl.innerText);
        if (currentSession >= 60) {
            return;
        }

        currentSession = currentSession + 1;
        typeEl.innerText = currentSession;

        if (_state.currentType === "SESSION" && type === "SESSION") {
            displayTimeLeft(currentSession * 60);
        } else if (_state.currentType === "BREAK" && type === "BREAK") {
            displayTimeLeft(currentSession * 60);
        }
    };

    let decrementCounter = function (typeEl, type) {
        if (_state.isRunning) { return; }

        let currentSession = Number(typeEl.innerText);
        if (currentSession <= 1) {
            return;
        }

        currentSession = currentSession - 1;
        typeEl.innerText = currentSession;

        if (_state.currentType === "SESSION" && type === "SESSION") {
            displayTimeLeft(currentSession * 60);
        } else if (_state.currentType === "BREAK" && type === "BREAK") {
            displayTimeLeft(currentSession * 60);
        }
    };

    let playAlertSound = function (currentType) {
        console.log("beep beep beep!")
        _alarm.play();
    };

    let getCurrentTime = function () {
        if (_state.secondsRemaining == 0) {
            console.log("Timer hasn't been started");
        } else {
            console.log(_state.secondsRemaining);
        }
    };

    let displayTimeLeft = function (secondsLeft) {
        const minutes = Math.floor(secondsLeft / 60);
        const remainderSeconds = secondsLeft % 60;
        const display = `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;

        document.title = display;
        //document.querySelector("#time-left").textContent = display;
        document.querySelector("#minutes").textContent = `${minutes < 10 ? "0" : ""}${minutes}`;
        document.querySelector("#seconds").textContent = `${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
        // TODO: Update this method to return either min, seconds, or display, or all three.. need to update the proper elements
    };

    // Starts the timer interval for n-number of seconds
    let start = function (seconds) {
        if (!_state.isRunning) {
            _state.isRunning = true;

            let now = Date.now();
            let then = now + seconds * 1000; // adjust for ms

            _timer = setInterval(function countDown() {
                _state.secondsRemaining = Math.round((then - Date.now()) / 1000);

                if (_state.secondsRemaining < 0) {
                    clearInterval(_timer);
                    playAlertSound(_state.currentType);
                    if (_state.currentType === "SESSION") {
                        _state.currentType = "BREAK";
                        _timerLabel.innerText = "Your break has started. Enjoy!";
                        let seconds = Number(_breakLength.innerText) * 60;

                        now = Date.now();
                        then = now + seconds * 1000;
                        _state.secondsRemaining = Math.round((then - Date.now()) / 1000);
                        _timer = setInterval(countDown, 1000);
                    } else if (_state.currentType === "BREAK") {
                        _state.currentType = "SESSION";
                        _timerLabel.innerText = "Your session has started. Try and focus.";
                        let seconds = Number(_sessionLength.innerText) * 60;

                        now = Date.now();
                        then = now + seconds * 1000;
                        _state.secondsRemaining = Math.round((then - Date.now()) / 1000);
                        _timer = setInterval(countDown, 1000);
                    }
                }

                displayTimeLeft(_state.secondsRemaining);
            }, 1000);
        } else {
            // Pause/Stop
            console.log("start() - pause or stop was clicked");
            _state.isRunning = false;
            clearInterval(_timer);
        }
    };

    let reset = function () {
        // Reset everything, rewind audio
        console.log("Reset button clicked");
        clearInterval(_timer);
        _state.isRunning = false;
        _state.currentType = "SESSION";
        _timerLabel.innerText = "Session";
        document.querySelector("#break-length").innerText = 5;
        document.querySelector("#session-length").innerText = 25;
        document.querySelector("#minutes").textContent = "25";
        document.querySelector("#seconds").textContent = "00";
        document.title = `25:00`;
        _alarm.pause();
        _alarm.currentTime = 0;
    };

    return {
        getCurrentTime: getCurrentTime,
        reset: reset,
        start: start,
        test: function (numOfSeconds) {
            start(numOfSeconds);
        },
        incrementCounter: incrementCounter,
        decrementCounter: decrementCounter,
    };
})();


document.querySelector("#start_stop").addEventListener("click", function () {
    let min = Number(document.querySelector("#minutes").innerText);
    let seconds = Number(document.querySelector("#seconds").innerText);

    if (min > 0) {
        pomodoroTimer.start(min * 60 + seconds);
    } else {
        pomodoroTimer.start(seconds);
    }
});

document.querySelector("#reset").addEventListener("click", function () {
    pomodoroTimer.reset();
});

document.querySelector("#break-decrement").addEventListener("click", function () {
    pomodoroTimer.decrementCounter(document.querySelector("#break-length"), "BREAK");
});

document.querySelector("#break-increment").addEventListener("click", function () {
    pomodoroTimer.incrementCounter(document.querySelector("#break-length"), "BREAK");
});

document.querySelector("#session-decrement").addEventListener("click", function () {
    pomodoroTimer.decrementCounter(document.querySelector("#session-length"), "SESSION");
});

document.querySelector("#session-increment").addEventListener("click", function () {
    pomodoroTimer.incrementCounter(document.querySelector("#session-length"), "SESSION");
});


pomodoroTimer.start(2);