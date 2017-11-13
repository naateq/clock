/// <reference path="history/historyrunner.ts" />


/** A function to run when the browser window is loaded. Else, use Run button to run time-range clock */
function onWindowLoad() {

    // If time range is provided in the URL query part, set it to UI text inputs
    // This would work only if no history argument is provided to the runHistory method
    // If history argument is provided, this time range is ignored
    browser.updatePageUsingQueryParameters([ 'fromYear', 'toYear', 'speed']);

    var hist_cosmos: History = histories['cosmos'];
    var hist_hijri: History = histories['hijri'];

    /* * / runHistory(hist_cosmos); /* */
    /* */ runHistory(hist_hijri); /* */
};

/** Runs the specified history or the time-range from the UI text inputs */
function runHistory(ahist: History) {

    // If history argument is not provided, run the clock from UI input elements - hover over 'Cosmic Clock' for text inputs
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

    // Initialize clock canvas, and add callbacks/listeners
    var canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.onclick = function() {
        timemanager.toggleTimePause();
    };

    // Prepare the clock for the canvas area
    clockRunner.clock(canvas, 24);

    // Prepare the history for the contents area
    var contentsEl: HTMLElement = <HTMLInputElement>document.getElementById('contents');
    historyRunner.historyView(contentsEl, ahist);

    // Run the timer with a default speed -- inits the runners before running
    timemanager.setSpeed();
    timemanager.runTime();
}
