/// <reference path="./cosmictime.ts" />
/// <reference path="browser.ts" />
///// <reference path="../../Script/typings/clock/clock.d.ts" />

namespace timemanager {

    export var config = <Config> {
        // unit of time is millis in this namespace

        // Cosmic start time - static
        fromTime: <CosmicTime>null,

        // Cosmic end time - static
        toTime: <CosmicTime>null,

        // Cosmic current time as the clock is running - dynamic state
        currTime: <CosmicTime>null,

        // Cosmic elapsed time so far as the clock is running - dynamic state
        elapsedTime: <CosmicTime>null,

        // A flag to indicate if the clock is paused (not running) at the moment
        timePaused: <boolean>false,
        
        /** 
         * This is the lag (in millis) between updates. The clock is updated after this (system time) interval has elapsed
         */
        timerUpdateInterval: <number> 75,
    
        /** 
         * Indicates how many cosmic time should elapse for each millisecond of the clock cycle - 12h or 24h.
         * This factor keeps the clock running at the consistent pace irrespective of cosmic duration.
         * One of the runners sets this factor based on the cosmic duration and the number of hours 
         * (12 or 24) in the clock to run. i.e. (cosmic_duration / clock_duration)
         */
        cosmicMillisPerClockMillis: <number> 1,
    
        /**
         * Runs the clock faster based on the time compression factor.
         * Setting it to 3600 means, the clock will traverse one hour during a one second period
         * and, as such, complete 24 hours in 24 seconds.
         */
        clockTimeCompressionFactor: <number> 1
    };

    /** Initializes fromTime, toTime, currTime and elapsedTime */
    export var init: Init = function(fromTimeStr: string, toTimeStr: string): void {
        config.currTime = config.fromTime = createCosmicTime(fromTimeStr, false);
        config.toTime = createCosmicTime(toTimeStr, true);
        config.elapsedTime = createZeroCosmicTime();
    };

    /** Moves the time by 1/unitsToJump millis and returns the elapsed time */
    export var tick: Tick = function(unitsToJump?: number) : CosmicTime {

        if (!unitsToJump) {
            unitsToJump = 1;
        }

        config.currTime.addMillis(unitsToJump);
        config.elapsedTime.addMillis(unitsToJump);
        return config.elapsedTime;
    };

    /** Returns the elapsed millis to time as years, months, days.. Optionally, adds it to the startTime */
    export var millisToTimespan: MillisToTimespan = function(elapsedMillis: number, startTime?:CosmicTime) : CosmicTime {
        
        if (startTime) {
            elapsedMillis += startTime.totalInMillis();
        }

        var currTime:CosmicTime = createZeroCosmicTime();
        currTime.addMillis(elapsedMillis);
        return currTime;
    };

    // ---------------------------------------------------------------------------
    var jsIntervalIdx: number;
    var runners: Runner[] = [];

    export var clearTimer: Function = function(): void {
        if (jsIntervalIdx) {
            clearInterval(jsIntervalIdx);
            jsIntervalIdx = 0;
        }
    }

    export var addRunner: AddRunner = function(runner: Runner) {
        if (runners.indexOf(runner) < 0) {
            runners.push(runner);
        }
    };

    /** Calls init on all runners and then starts the timer updating every 100 millis */
    export var runTime: RunTime = function() {
        
        for (var i = 0; i < runners.length; i++) {
            runners[i].init();
        }

        // call updateTime every 100 ms
        jsIntervalIdx = setInterval(
            updateTimeIfNoFlag,
            config.timerUpdateInterval);
    };

    export var updateTimeIfNoFlag: UpdateTimeIfNoFlag = function() {
        // Wait for the external flag for pausing the clock to be cleared
        if (!config.timePaused) {
            // move timer considering:
            // 1. lag in update interval (timerUpdateInterval instead of one millsecond)
            // 2. duration to run (don't slow down the clock, fast-up the cosmic time move)
            // 3. how fast you want to move the clock so that 24 hours is done in 120 seconds
            var jumpUnits = config.timerUpdateInterval * config.cosmicMillisPerClockMillis * config.clockTimeCompressionFactor;
            var elapsed: CosmicTime = tick(jumpUnits);

            if (config.currTime.totalInMillis() >= config.toTime.totalInMillis()) {
                clearTimer();
                config.currTime = config.toTime;
            }

            for (var i = 0; i < runners.length; i++) {
                runners[i].update(elapsed, config.currTime);
            }
        }
    };

    /** Clock time compression factor
     * Use the specified speed for the clock, or if not provided, try to read the speed value from the 
     * document element named 'speed'. If that is nto found either, then use a default value of 1 for
     * speed
     */
    export function setSpeed(speed?: number): boolean {
        // If speed is not specified, try to get it from the document element named, 'speed'
        if (speed === undefined || speed === null) {
            speed = 1;

            var speedParameterValue = browser.getElementValue('speed');

            if (speedParameterValue) {
                speed = parseInt(speedParameterValue) || speed;
            }
        }

        timemanager.config.clockTimeCompressionFactor = speed;
        return false;
    }

    /** Click toggles the clock run. TODO: setSpeed should use cached speed */
    export function toggleTimePause(): boolean {
        timemanager.config.timePaused = !timemanager.config.timePaused;

        if (!timemanager.config.timePaused) {
            // whatever the current speed, if paused, restart with the speed set in UI or default one
            setSpeed();
        }

        return false;
    }
}

namespace debug {

    // DEBUG
    export function logTimers(): void {
        console.log('from: ' + cosmicTimeToString(timemanager.config.fromTime));
        console.log('to: ' + cosmicTimeToString(timemanager.config.toTime));
        console.log('elapsed: ' + cosmicTimeToString(timemanager.config.elapsedTime));
        //console.log('cosmicMillisPerClockMillis: ' + timemanager.cosmicMillisPerClockMillis);
    }

    // DEBUG:
    /** Converts a CosmicTime object to a string and optionally logs it to console */
    export function cosmicTimeToString(ts: CosmicTime, log?: boolean): string {
        var str: string = '';
        str += (<any>ts)._year !== undefined ? (<any>ts)._year : 'xx';
        str += '-' + ((<any>ts)._month !== undefined ? (<any>ts)._month : 'xx');
        str += '-' + ((<any>ts)._day   !== undefined ? (<any>ts)._day : 'xx');

        str += ' ' + ((<any>ts)._hour !== undefined ? (<any>ts)._hour : 'xx');
        str += ':' + ((<any>ts)._minute !== undefined ? (<any>ts)._minute : 'xx');
        str += ':' + ((<any>ts)._second !== undefined ? (<any>ts)._second : 'xx');

        str += ' (' + (ts.isHijri ? 'AH/BH ' : 'AD/BC ') + ts.totalInMillis() + ')';

        if (log) {
            console.log(str);
        }
        
        return str; 
    }
}