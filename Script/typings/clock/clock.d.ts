/// <reference path="./cosmictime.d.ts" />

declare namespace clock {

    // Class constructor method for the AnalogClock
    interface AnalogClockConstructor  {
        new (canvas: HTMLCanvasElement): AnalogClock;
    }

    // Instance methods for the AnalogClass
    interface AnalogClock {
        //htmlElement: HTMLCanvasElement;
        //context: CanvasRenderingContext2D;
        //cx: number;
        //cy: number;
        //radius: number;
        //constructor(canvas: HTMLCanvasElement);
        drawClock: (hour: number, minute: number, second: number, is24HourClock: boolean) => void;
        drawFace: (drawBorder?: boolean, fillStyle?: string, borderFillStyle?: string) => void;
        drawBroderType01: (fillStyle: string) => void;
        drawBroderType02: (fillStyle: string) => void;
        renderMarkersOnDial: (hour: number, is24HourClock: boolean, fillStyle?: string, amPmMsg?: string) => void;
        renderHandsOnDial: (hour: number, minute: number, second: number, millis?: number, ignoreMinute?: boolean, ignoreSecond?: boolean) => void;
        renderTextOnRadial: (hour: number, msg?: string, fillStyle?: string) => void;
        //private renderHand: (ctx: number, pos: number, length: number, width: number) => void;
        //private drawCircle: (canvasCtx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, startArc: number, endArc: number, counterClockwise: boolean, fillStyle: string) => void;
    }
}

interface Runner {
    init(): void;
    update(elapsedTime: CosmicTime, currTime: CosmicTime): void;
}

interface AnalogClockRunner extends Runner {
    clockView: clock.AnalogClock;
    totalHours: number;
    cosmicMonthsPerClockUnit: number;
    cosmicMillisPerClockMillis: number;
    currentClockTime: ClockTimeObject; //CosmicTime;

    clock: (canvas: HTMLCanvasElement, clockHours: number) => void;
}

declare var clockRunner: AnalogClockRunner;

declare namespace timemanager {

    export interface Config {
        fromTime: CosmicTime;

        toTime: CosmicTime;
        currTime: CosmicTime;
        elapsedTime: CosmicTime;
        timePaused: boolean;
        
        /** 
         * This is the lag (in millis) between two updates
         */
        timerUpdateInterval: number;

        /** 
         * This factor keeps the clock running at the consistent pace irrespective of cosmic duration.
         * One of the runners sets this factor based on the cosmic duration and the number of hours 
         * (12 or 24) in the clock to run. i.e. (cosmic_duration / clock_duration)
         */
        cosmicMillisPerClockMillis: number;

        /**
         * Amount of clock time to compress per unit of clock time, to make the clock run faster.
         * Setting it to 3600 means, the clock will traverse one hour during a one second period
         * and, as such, complete 24 hours in 24 seconds.
         */
        clockTimeCompressionFactor: number;
    }

    /** Initializes fromTime, toTime, currTime and elapsedTime */
    export interface Init {
        (fromTimeStr: string, toTimeStr: string): void;
    }
    
    /** Moves the time by 1/unitsToJump millis and returns the elapsed time */
    export interface Tick {
        (unitsToJump?: number) : CosmicTime;
    }

    export interface FixTimeFromTotalInMillis {
        (currTime: CosmicTime, preventNegative?: boolean) : CosmicTime;
    }

    /** Converts the time string into individual components - year, month, day, hour, minute, second, millis and totalInMillis. */
    export interface ParseTimeString {
        (timeStr: string, isEndTime: boolean) : CosmicTime;
    }

    /** Returns the date as {yyyy-M-dTH:m:s.f[z]} */
    export interface NowTimeString {
        (utc: boolean) : string;
    }

    /** Returns the elapsed millis to time as years, months, days.. Optionally, dds it to the startTime */
    export interface MillisToTimespan {
        (elapsedMillis: number, startTime?:CosmicTime) : CosmicTime;
    }

    export interface AddRunner {
        (runner: Runner): void;
    }

    /** Calls init on all runners and then starts the timer updating every 100 millis */
    export interface RunTime {
        (): void;
    }

    export interface UpdateTimeIfNoFlag {
        (): void;
    }
}
    
