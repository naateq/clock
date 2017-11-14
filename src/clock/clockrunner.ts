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
    clockRunner.currentClockTime = createZeroCosmicTime();
    clockRunner.currentClockTime.addMillis(elapsedTime.totalInMillis() / clockRunner.cosmicMillisPerClockMillis);
    
    var dialFillStyle: string = '#666699';
    var borderFillStyle: string = '#9999ff'; // '#66669f';
    var dialMarkersFillStyle: string = '#ffffff';
    var dialAmPmMarker: string = '';

    var currHour = clockRunner.currentClockTime.hour();
    if (currHour == 0) {
        dialAmPmMarker = '00';
    }
    else if (currHour < 12) {
        dialAmPmMarker = 'AM';
    }
    else if (currHour < 13) {
        dialAmPmMarker = 'Noon';
    }
    else {
        dialAmPmMarker = 'PM';
    }
    
    if (currHour <= 5 || currHour >= 19) {
        dialFillStyle = '#363666';
        //borderFillStyle = '#66669f';
        dialMarkersFillStyle = '#cecece';
    }

    // update clock handles
    clockRunner.clockView.drawFace(true, dialFillStyle, borderFillStyle);

    clockRunner.clockView.renderMarkersOnDial(currHour, false, dialMarkersFillStyle, dialAmPmMarker);
    clockRunner.clockView.renderHandsOnDial(
        currHour,
        clockRunner.currentClockTime.minuteInMillis() / number.MillisInMinute,
        clockRunner.currentClockTime.secondInMillis() / number.MillisInSecond,
        timemanager.config.clockTimeCompressionFactor >= 3600,
        timemanager.config.clockTimeCompressionFactor >= 60);
    
    // display year at 6`o clock
    clockRunner.clockView.renderTextOnRadial(6, calendar.fromParsedYear(timemanager.config.currTime.year()), dialMarkersFillStyle);

    if (timemanager.config.clockTimeCompressionFactor < 1800 && clockRunner.cosmicMonthsPerClockUnit <= 1) {
        clockRunner.clockView.renderTextOnRadial(9, ''+(1 + timemanager.config.currTime.month()));
    }
};

clockRunner.clock = function(canvas: HTMLCanvasElement, clockHours: number) {
    clockRunner.clockView = new clock.Analog(canvas);
    clockRunner.totalHours = clockHours;
    clockRunner.cosmicMillisPerClockMillis = 1;
    clockRunner.currentClockTime = createZeroCosmicTime();

    timemanager.addRunner(this);
}