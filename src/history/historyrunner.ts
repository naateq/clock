/// <reference path="../../typings/clock/history.d.ts" />
/// <reference path="../tools/calendar.ts" />
/// <reference path="../tools/tools.ts" />
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
    while (this.currEventIdx < this.hist.eventList.length && this.hist.eventList[this.currEventIdx].year <= currTime.year) {
        var he: HistoryEvent = this.hist.eventList[this.currEventIdx];
        if (!he.view.rendered && he.render) {

            // First, slow down the speed (if requested)            
            if (he.speed === undefined || he.speed === null) {
                if (this.hist.speed) {
                    timemanager.config.clockTimeCompressionFactor = this.hist.speed;
                }
                else {
                    utils.setSpeed();
                }
            }
            else if (he.speed < 0) {
                utils.setSpeed();
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
    var endHe: HistoryEvent = <HistoryEvent>{
        render: true,
        year: lastHe.year,
        msg: 'END'
    };
    this.hist.eventList.push(endHe);

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