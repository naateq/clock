/// <reference path="analogclock.ts" />
/// <reference path="../tools/timemanager.ts" />

var clockRunner: AnalogClockRunner = <AnalogClockRunner>{};

clockRunner.init = function(): void {
    var cosmicDuration: number = timemanager.config.toTime.totalInMillis() - timemanager.config.fromTime.totalInMillis();
    var thisClockDuration: number = clockRunner.totalHours * number.MillisInHour;
    clockRunner.cosmicMillisPerClockMillis =  Math.ceil(cosmicDuration / thisClockDuration) || 1;

    // timemanager won't slow down the clock, it would fast-up the cosmic time (tick) move
    timemanager.config.cosmicMillisPerClockMillis = clockRunner.cosmicMillisPerClockMillis;
    clockRunner.cosmicMonthsPerClockUnit = timemanager.config.cosmicMillisPerClockMillis / number.MillisInMonth;
};

clockRunner.update = function(elapsedTime: CosmicTime, currTime: CosmicTime): void {
    // translate cosmic time into clock time
    clockRunner.currentClockTime = new ClockTime(); //createZeroCosmicTime();
    clockRunner.currentClockTime.addMillis(elapsedTime.totalInMillis() / clockRunner.cosmicMillisPerClockMillis);
    
    var dialFillStyle: string = '#666699';
    var borderFillStyle: string = '#9999ff'; // '#66669f';
    var dialMarkersFillStyle: string = '#ffffff';
    var dialAmPmMarker: string = '';

    var currHour = clockRunner.currentClockTime.hour; // hour() for CosmicTime
    if (currHour == 0 || currHour >= 23) {
        dialAmPmMarker = ' ';
    }
    else if (currHour < 3) {
        dialAmPmMarker = ' ';
    }
    else if (currHour < 6) {
        dialAmPmMarker = 'Dawn';
    }
    else if (currHour < 12) {
        dialAmPmMarker = 'AM';
    }
    else if (currHour < 13) {
        dialAmPmMarker = 'Noon';
    }
    else if (currHour < 19) {
        dialAmPmMarker = 'PM';
    }
    else {
        dialAmPmMarker = 'Night';
    }
    
    if (currHour <= 6 || currHour >= 19) {
        dialFillStyle = '#363666';
        //borderFillStyle = '#66669f';
        dialMarkersFillStyle = '#cecece';
    }

    // update clock handles
    clockRunner.clockView.drawFace(true, dialFillStyle, borderFillStyle);
    clockRunner.clockView.renderMarkersOnDial(currHour, false, dialMarkersFillStyle, dialAmPmMarker);

    var clockTimeCompressionFactor = timemanager.config.clockTimeCompressionFactor;
    clockRunner.clockView.renderHandsOnDial(
        currHour,
        clockRunner.currentClockTime.minute,
        clockRunner.currentClockTime.second,
        clockRunner.currentClockTime.millis,
        clockTimeCompressionFactor >= 3600,
        clockTimeCompressionFactor >= 60);
    
    // display year at 6`o clock
    clockRunner.clockView.renderTextOnRadial(6, calendar.fromParsedYear(currTime.year()), dialMarkersFillStyle);

    if (clockTimeCompressionFactor <= 1800 && clockRunner.cosmicMonthsPerClockUnit <= 1) {
        clockRunner.clockView.renderTextOnRadial(9, '' + (1 + currTime.month()));
    }
};

// Used in main
clockRunner.clock = function(canvas: HTMLCanvasElement, clockHours: number) {
    clockRunner.clockView = new clock.Analog(canvas);
    clockRunner.totalHours = clockHours;
    clockRunner.cosmicMillisPerClockMillis = 1;
    clockRunner.currentClockTime = new ClockTime(); //createZeroCosmicTime();

    timemanager.addRunner(this);
}