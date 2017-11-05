/// <reference path="../../typings/clock/clock.d.ts" />
/// <reference path="calendar.ts" />

namespace timemanager {
        export var config = <Config> {
            // unit of time is millis in this namespace
            fromTime: <CosmicTime>null,
            toTime: <CosmicTime>null,
            currTime: <CosmicTime>null,
            elapsedTime: <CosmicTime>null,
            timePaused: <boolean>false,
            
            /** 
             * This is the lag (in millis) between two updates
             */
            timerUpdateInterval: <number>100,
        
            /** 
             * This factor keeps the clock running at the consistent pace irrespective of cosmic duration.
             * One of the runners sets this factor based on the cosmic duration and the number of hours 
             * (12 or 24) in the clock to run. i.e. (cosmic_duration / clock_duration)
             */
            cosmicMillisPerClockMillis: <number>1,
        
            /**
             * Amount of clock time to compress per unit of clock time, to make the clock run faster.
             * Setting it to 3600 means, the clock will traverse one hour during a one second period
             * and, as such, complete 24 hours in 24 seconds.
             */
            clockTimeCompressionFactor: <number>1
        };

        /** Initializes fromTime, toTime, currTime and elapsedTime */
        export var init: Init = function(fromTimeStr: string, toTimeStr: string): void {
            config.fromTime = <CosmicTime>parseTimeString(fromTimeStr, false);
            config.toTime = <CosmicTime>parseTimeString(toTimeStr, true);
            config.currTime = <CosmicTime>config.fromTime;
    
            config.elapsedTime = <CosmicTime>{ totalInMillis: 0 };
            config.elapsedTime = <CosmicTime>fixTimeFromTotalInMillis(config.elapsedTime, false);
        };
    
        /** Moves the time by 1/unitsToJump millis and returns the elapsed time */
        export var tick: Tick = function(unitsToJump?: number) : CosmicTime {
            if (!unitsToJump)
                unitsToJump = 1;
            
                config.elapsedTime.totalInMillis += unitsToJump;
                config.elapsedTime = fixTimeFromTotalInMillis(config.elapsedTime, false);
    
                config.currTime.totalInMillis += unitsToJump;
                config.currTime = fixTimeFromTotalInMillis(config.currTime, false);
    
            return config.elapsedTime;
        };
    
        export var fixTimeFromTotalInMillis: FixTimeFromTotalInMillis = function(currTime: CosmicTime, preventNegative?: boolean) : CosmicTime {
            var remainingMillis: number = currTime.totalInMillis;
            var bceSign: number = +1;
            if (remainingMillis < 0) {
                bceSign = -1;
                remainingMillis = -remainingMillis;
            }
    
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
            currTime.year = Math.floor(remainingMillis / numbers.MillisInYear);
            currTime.yearInMillis = currTime.year * numbers.MillisInYear;
    
            remainingMillis -= currTime.yearInMillis;
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
            currTime.month = Math.floor(remainingMillis / numbers.MillisInMonth);
            currTime.monthInMillis = currTime.month * numbers.MillisInMonth;
            // currTime.month += 1; // if not 0-based moth
    
            remainingMillis -= currTime.monthInMillis;
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
            currTime.day = Math.floor(remainingMillis / numbers.MillisInDay);
            currTime.dayInMillis = currTime.day * numbers.MillisInDay;
            // currTime.day += 1; // if not 0-based days
    
            remainingMillis -= currTime.dayInMillis;
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
            currTime.hour = Math.floor(remainingMillis / numbers.MillisInHour);
            currTime.hourInMillis = currTime.hour * numbers.MillisInHour;
    
            remainingMillis -= currTime.hourInMillis;
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
            currTime.minute = Math.floor(remainingMillis / numbers.MillisInMinute);
            currTime.minuteInMillis = currTime.minute * numbers.MillisInMinute;
    
            remainingMillis -= currTime.minuteInMillis;
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;   //console.log('remaing millis: ' + remainingMillis);
            currTime.second = Math.floor(remainingMillis / numbers.MillisInSecond);
            currTime.secondInMillis = currTime.second * numbers.MillisInSecond;
    
            remainingMillis -= currTime.secondInMillis;
            remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
            remainingMillis = remainingMillis > 999 ? 999 : remainingMillis;
            currTime.millis = remainingMillis;
    
            currTime.year *= bceSign;
    
            return currTime;
        };
    
        /** Converts the time string into individual components - year, month, day, hour, minute, second, millis and totalInMillis. */
        export var parseTimeString: ParseTimeString = function(timeStr: string, isEndTime: boolean) : CosmicTime {
            var cosmicTime = <CosmicTime>{};
            cosmicTime.timestr = timeStr || nowTimeString(false);
    
            if (timeStr.indexOf('h') >= 0) {
                cosmicTime.isHijri = true;
            }
    
            var timeParts: string[] = timeStr.split('-', 3);
            cosmicTime.year = calendar.parseYear(timeParts[0]) || 2017;
    
            if (timeParts.length > 1) {
                cosmicTime.month = numbers.parseNumber(timeParts[1]);
    
                if (timeParts.length > 2) {
                    cosmicTime.day = numbers.parseNumber(timeParts[2]);
                }
            }
            
            if (!cosmicTime.month) {
                cosmicTime.month = isEndTime ? 12 : 1;
            }
            cosmicTime.month -= 1;
    
            if (!cosmicTime.day) {
                cosmicTime.day = isEndTime ? 31 : 1;
            }
            cosmicTime.day -= 1;
    
            cosmicTime.hour = isEndTime ? 23 : 0;
            cosmicTime.minute = isEndTime ? 59 : 0;
            cosmicTime.second = isEndTime ? 59 : 0;
    
            cosmicTime.millis = isEndTime ? 999 : 0;
    
            cosmicTime.yearInMillis = cosmicTime.year * numbers.MillisInYear;
            cosmicTime.monthInMillis = cosmicTime.month * numbers.MillisInMonth;
            cosmicTime.dayInMillis = cosmicTime.day * numbers.MillisInDay;
            cosmicTime.hourInMillis = cosmicTime.hour * numbers.MillisInHour;
            cosmicTime.minuteInMillis = cosmicTime.minute * numbers.MillisInMinute;
            cosmicTime.secondInMillis = cosmicTime.second * numbers.MillisInSecond;
    
            cosmicTime.totalInMillis = cosmicTime.yearInMillis +
                cosmicTime.monthInMillis +
                cosmicTime.dayInMillis +
                cosmicTime.hourInMillis +
                cosmicTime.minuteInMillis +
                cosmicTime.secondInMillis +
                cosmicTime.millis;
    
            // cosmicTime = fixTimeFromTotalInMillis(cosmicTime);
            
            return cosmicTime;
        };
    
        /** Returns the date as {yyyy-M-dTH:m:s.f[z]} */
        export var nowTimeString: NowTimeString = function(utc: boolean) : string {
            var d = new Date();
            var dateStr: string;
    
            if (utc) {
                dateStr = d.toISOString(); // "2017-03-18T04:20:42.842Z" (UTC)
            }
            else { 
                // format: 2017-1-5T3:20:4.234
                dateStr = d.getFullYear() +
                    '-' + (d.getMonth() + 1) +
                    '-' + d.getDate() +
                    'T' + d.getHours() +
                    ':' + d.getMinutes() +
                    ':' + d.getSeconds() +
                    '.' + d.getMilliseconds(); 
                
                /* For now, don't set the timezone offset * /
                var offsetMinutes = d.getTimezoneOffset();
                str += (offsetMinutes < 0 ? '-' : '+') + offsetMinutes;
                /* */
            }
    
            return dateStr;
        };
    
        /** Returns the elapsed millis to time as years, months, days.. Optionally, dds it to the startTime */
        export var millisToTimespan: MillisToTimespan = function(elapsedMillis: number, startTime?:CosmicTime) : CosmicTime {
            var currTime:CosmicTime = <CosmicTime>{ totalInMillis: 0 };
            if (startTime) {
                currTime.totalInMillis += startTime.totalInMillis;
            }
    
            currTime.totalInMillis += elapsedMillis;
            currTime = fixTimeFromTotalInMillis(currTime, false);
    
            return currTime;
        };
    
        // ---------------------------------------------------------------------------
        var jsIntervalIdx: number;
        var runners: Runner[] = [];
    
        export var addRunner: AddRunner = function(runner: Runner) {
            runners[runners.length] = runner;
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
    
                if (config.currTime.totalInMillis >= config.toTime.totalInMillis) {
                    clearInterval(jsIntervalIdx);
                    config.currTime = config.toTime;
                }
    
                for (var i = 0; i < runners.length; i++) {
                    runners[i].update(elapsed, config.currTime);
                }
            }
        };
    }
    