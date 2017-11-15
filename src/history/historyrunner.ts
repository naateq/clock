/// <reference path="../../Script/typings/clock/history.d.ts" />
/// <reference path="../clock/clockrunner.ts" />
/// <reference path="analoghistory.ts" />

var historyRunner: HistoryRunner = <HistoryRunner>{};

historyRunner.init = function(): void {
    this.currEventIdx = 0;

    for (var i = 0; i < this.hist.eventList.length; i++) {
        this.hist.eventList[i].view.rendered = false;
    }
};

historyRunner.update = function(elapsedTime: CosmicTime, currTime: CosmicTime): void {

    if (this.currEventIdx >= this.hist.eventList.length) 
        return;
    
    // Render all history that elapsed between the time update
    var currYear = currTime.year();

    while (this.currEventIdx < this.hist.eventList.length && this.hist.eventList[this.currEventIdx].year <= currYear) {
        var he: HistoryEvent = this.hist.eventList[this.currEventIdx];

        // If not rendered yet, and is requested to be rendered by the history, then process
        if (!he.view.rendered && he.render) {

            // First, slow down the speed (if requested)            
            if (he.speed === undefined || he.speed === null) {

                // If there's any default speed set by this history, set that; else use the external default speed
                if (this.hist.speed) {
                    // history default speed
                    timemanager.config.clockTimeCompressionFactor = this.hist.speed;
                }
                else {
                    // external default speed
                    timemanager.setSpeed();
                }
            }
            else if (he.speed < 0) {
                // don't disturb the speed or reset to default?
                //timemanager.setSpeed();
            }
            else {
                timemanager.config.clockTimeCompressionFactor = he.speed;
            }

            // Now, render the history and mark the flag to avoid rendering again
            this.renderer.render(he);
            he.view.rendered = true;
        }

        this.currEventIdx++;
    }
    
};

historyRunner.historyView = function(contentsEl: HTMLElement, historyObj: History) : void {
    this.renderer = renderer.createSimpleHistoryView(renderer.SimpleHistoryView, contentsEl);
    this.hist = historyObj;

    var lastHe: HistoryEvent = this.hist.eventList[this.hist.eventList.length  - 1];
    if (lastHe.msg != 'END') {
        var endHe: HistoryEvent = <HistoryEvent>{
            render: true,
            year: lastHe.year,
            msg: 'END'
        };
        this.hist.eventList.push(endHe);
    }

    for (var i = 0; i < this.hist.eventList.length; i++) {
        var he: HistoryEvent = this.hist.eventList[i];

        he.year = calendar.parseYear(he.year.toString());
        he.view = <HistoryEventView>{
            yearText: calendar.fromParsedYear(he.year),
            rendered: false
        };
    }

    timemanager.addRunner(this);
}