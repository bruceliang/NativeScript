﻿/**
  * Android specific timer functions implementation.
  */
var timeoutHandler;
var timeoutCallbacks = {};

function createHadlerAndGetId() : number {
    if (!timeoutHandler) {
        timeoutHandler = new android.os.Handler(android.os.Looper.getMainLooper());
    }

    return new Date().getUTCMilliseconds();
}

export function setTimeout(callback: Function, milliseconds?: number): number {
    if (typeof (milliseconds) !== "number") {
        milliseconds = 0;
    }

    var id = createHadlerAndGetId();

    var runnable = new java.lang.Runnable({
        run: function () {
            callback();
            timeoutCallbacks[id] = null;
        }
    });

    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = runnable;
    }

    timeoutHandler.postDelayed(runnable, long(milliseconds));

    return id;
}

export function clearTimeout(id: number): void {
    if (timeoutCallbacks[id]) {
        timeoutHandler.removeCallbacks(timeoutCallbacks[id]);
        timeoutCallbacks[id] = null;
    }
}

export function setInterval(callback: Function, milliseconds?: number): number {
    if (typeof (milliseconds) !== "number") {
        milliseconds = 0;
    }

    var id = createHadlerAndGetId();

    var runnable = new java.lang.Runnable({
        run: function () {
            callback();
            timeoutHandler.postDelayed(runnable, long(milliseconds));
        }
    });

    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = runnable;
    }

    timeoutHandler.postDelayed(runnable, long(milliseconds));

    return id;
}
