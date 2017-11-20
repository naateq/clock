/// <reference path="history/historyrunner.ts" />


/** A function to run when the browser window is loaded. Else, use Run button to run time-range clock */
function onWindowLoad() {

    // If time range is provided in the URL query part, set it to UI text inputs
    // This would work only if no history argument is provided to the runHistory method
    // If history argument is provided, this time range is ignored
    // index.html?runWhat=hijri&clockHours=12&speed=1800&fromYear=2017&toYear=2016&reflectDayNightOnDial=true
    browser.updatePageUsingQueryParameters([ 'runWhat', 'clockHours', 'speed', 'fromYear', 'toYear', 'reflectDayNightOnDial' ]);

    // Initialize clock canvas, and add callbacks/listeners
    var canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.onclick = function() {
        timemanager.toggleTimePause();
    };

    // Prepare the clock for the canvas area
    var clockHours: HTMLSelectElement = <HTMLSelectElement>document.getElementById("clockHours");
    clockRunner.clock(canvas, clockHours.value.parseNumber() || 24);
    
    runHistory();
};

/** Runs the specified history or the time-range from the UI text inputs */
function runHistory() {
    timemanager.clearTimer();
    var ahist: History = undefined;
    var runWhat: HTMLSelectElement = <HTMLSelectElement>document.getElementById("runWhat");

    if (runWhat) {
        var option = runWhat.value;
        if (histories[option]) {
            ahist = histories[option];
        }
    }

    if (!ahist) {
        ahist = <History> {
            title: 'History',
            begins: undefined,
            ends: undefined,
            speed: 1,
            eventList: []
        };    
    }

    var fromYearText: string = ahist.begins;
    if (!fromYearText) {
        fromYearText = browser.getElementValue('fromYear');
    }

    var toYearText: string = ahist.ends;
    if (!toYearText) {
        toYearText = browser.getElementValue('toYear');
    }

    timemanager.init(fromYearText, toYearText);
    debug.logTimers();

    var contentsEl: HTMLElement = <HTMLInputElement>document.getElementById('contents');
    contentsEl.innerHTML = '';
    
    // Prepare the history for the contents area
    if (ahist.eventList.length > 0) {
        historyRunner.historyView(contentsEl, ahist);
    }

    // Run the timer with a default speed -- inits the runners before running
    timemanager.setSpeed();
    timemanager.runTime();
}
