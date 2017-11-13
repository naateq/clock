/// <reference path="history/historyrunner.ts" />


//window.onload = function() {
function onWindowLoad() {

    browser.updatePageUsingQueryParameters([ 'fromYear', 'toYear', 'speed']);

    var hist_cosmos: History = histories['cosmos'];
    var hist_hijri: History = histories['hijri'];

    //runHistory(hist_cosmos);
    runHistory(hist_hijri);

    /*
    runHistory(<History> {
        title: 'History',
        begins: undefined,
        ends: undefined,
        speed: 1,
        eventList: hist
    });
    */
};
    
function runHistory(ahist: History) {

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
    if (!fromYearText)
        fromYearText = browser.getElementValue('fromYear');

    var toYearText: string = ahist.ends;
    if (!toYearText)
        toYearText = browser.getElementValue('toYear');

    timemanager.init(fromYearText, toYearText);
    debug.logTimers();

    var canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.onclick = function() {
        timemanager.toggleTimePause();
    };

    clockRunner.clock(canvas, 24);

    var contentsEl: HTMLElement = <HTMLInputElement>document.getElementById('contents');
    historyRunner.historyView(contentsEl, ahist);

    timemanager.setSpeed();
    timemanager.runTime();
}
