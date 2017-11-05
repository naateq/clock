/// <reference path="analogclock.ts" />
/// <reference path="../tools/calendar.ts" />

var clockRunner = <AnalogClockRunner>{};

clockRunner.init = function(): void {
    var cosmicDuration: number = tmanager.toTime.totalInMillis - tmanager.fromTime.totalInMillis;
    var thisClockDuration: number = this.totalHours * numbers.MillisInHour;
    this.cosmicMillisPerClockMillis =  Math.ceil(cosmicDuration / thisClockDuration) || 1;

    // tmanager won't slow down the clock, it would fast-up the cosmic time (tick) move
    tmanager.cosmicMillisPerClockMillis = this.cosmicMillisPerClockMillis;
    this.cosmicMonthsPerClockUnit = tmanager.cosmicMillisPerClockMillis / numbers.MillisInMonth;
};

clockRunner.update = function(elapsedTime: CosmicTime, currTime: CosmicTime): void {
    // translate cosmic time into clock time
    this.currentClockTime.totalInMillis = elapsedTime.totalInMillis / this.cosmicMillisPerClockMillis;
    this.currentClockTime = tmanager.fixTimeFromTotalInMillis(this.currentClockTime, false);
    
    var dialFillStyle: string = '#666699';
    var borderFillStyle: string = '#9999ff'; // '#66669f';
    var dialMarkersFillStyle: string = '#ffffff';
    var dialAmPmMarker: string = '';

    if (this.currentClockTime.hour == 0) {
        dialAmPmMarker = '00';
    }
    else if (this.currentClockTime.hour < 12) {
        dialAmPmMarker = 'AM';
    }
    else if (this.currentClockTime.hour < 13) {
        dialAmPmMarker = 'Noon';
    }
    else {
        dialAmPmMarker = 'PM';
    }
    
    if (this.currentClockTime.hour <= 5 ||this.currentClockTime.hour >= 19) {
        dialFillStyle = '#363666';
        //borderFillStyle = '#66669f';
        dialMarkersFillStyle = '#cecece';
    }

    // update clock handles
    this.clockView.drawFace(true, dialFillStyle, borderFillStyle);
    this.clockView.renderMarkersOnDial(this.currentClockTime.hour, false, dialMarkersFillStyle, dialAmPmMarker);
    this.clockView.renderHandsOnDial(
        this.currentClockTime.hour,
        this.currentClockTime.minute,
        this.currentClockTime.second,
        tmanager.clockTimeCompressionFactor >= 3600,
        tmanager.clockTimeCompressionFactor >= 60);
    
    // display year at 6`o clock
    this.clockView.renderTextOnRadial(6, calendar.fromParsedYear(tmanager.currTime.year), dialMarkersFillStyle);

    if (tmanager.clockTimeCompressionFactor < 1800 && this.cosmicMonthsPerClockUnit <= 1) {
        this.clockView.renderTextOnRadial(9, (1 + tmanager.currTime.month));
    }
};

clockRunner.clock = function(canvas: HTMLCanvasElement, clockHours: number) {
    this.clockView = new clock.Analog(canvas);
    this.totalHours = clockHours;
    this.cosmicMillisPerClockMillis = 1;
    this.currentClockTime = <CosmicTime>{ totalInMillis: 0 };

    tmanager.addRunner(this);
}