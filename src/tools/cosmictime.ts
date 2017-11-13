/// <reference path="../../Script/typings/clock/cosmictime.d.ts" />
/// <reference path="./calendar.ts" />

/** var t1: CosmicTime = createCosmicTimeAlternative(CosmicTimeImpl, timeStr, isEndTime); */
function createCosmicTimeAlternative(ctor: CosmicTimeConstructor, timeStr: string, isEndTime?: boolean): CosmicTime {
    return new ctor(timeStr, isEndTime);
}

function createCosmicTime(timeStr: string, isEndTime?: boolean): CosmicTime {
    return new CosmicTimeImpl(timeStr, isEndTime);
}

function createZeroCosmicTime(): CosmicTime {
    return createCosmicTime("0", false);
}

class CosmicTimeImpl implements CosmicTime {

    timestr: string;
    isEndTime: boolean;
    isHijri: boolean;
    _isYearOnlyDate: boolean;
    
    _isDirty: boolean;
    _lazyMillisToAdd: number;
    _totalInMillis: number;
    
    _year: number;
    _month: number;
    _day: number;

    _hour: number;
    _minute: number;
    _second: number;

    _yearInMillis: number;
    _monthInMillis: number;
    _dayInMillis: number;

    _hourInMillis: number;
    _minuteInMillis: number;
    _secondInMillis: number;
    millis: number;


    constructor (timeStr: string, isEndTime?: boolean) {
        this._isDirty = true;
        this._lazyMillisToAdd = 0;
        this.timestr = timeStr || calendar.date.nowAsString(false);
        this.isEndTime = isEndTime || false;

        this.parse();
    }

    private parseYear (): void {
        this.isHijri = false;

        if (this.timestr.indexOf('h') >= 0) {
            this.isHijri = true;
        }

        var idx = this.timestr.indexOf('-');
        idx = idx > 0 ? idx : this.timestr.indexOf('/');
        var yearPart = this.timestr;

        if (idx <= 0) {
            this._isYearOnlyDate = true;
            idx = this.timestr.length;
            yearPart = this.timestr.substr(0, idx) + (this.isHijri ? 'h' : '');
        }

        this._year = calendar.parseYear(yearPart);
    }

    private parse (): void {
        this.parseYear();

        if (!this._isYearOnlyDate) {
            // Extract _month and date
            var timeParts: string[] = this.timestr.split('-', 3);

            if (timeParts.length > 1) {
                this._month = number.parse(timeParts[1]);

                if (timeParts.length > 2) {
                    this._day = number.parse(timeParts[2]);
                }
            }
        }
            
        // If _month and _day are sepcified, ignore isEndTime flag
        this._month = (this._month !== undefined ? this._month : 
            this.isEndTime ? 12 : 1)
            - 1;
        this._day = (this._day !== undefined ? this._day :
            !this.isEndTime ? 1 :
                this.isHijri ? 30 : calendar.gregorian.daysInMonth[this._month])
            - 1;

        // Set default _hour, _minute, _second and millis (ignore if provided as input for now)
        this._hour = 0;
        this._minute = 0;
        this._second = 0;
        this.millis = 0;

        if (this.isEndTime) {
            this._hour = 23;
            this._minute = 59;
            this._second = 59;
            this.millis = 999;
        }
    }

    yearInMillis (): number {
        this.ensureNotDirty();
        if (this._yearInMillis === undefined || this._isDirty) {
            this._yearInMillis = Math.abs(this._year) * number.MillisInYear;
        }

        return this._yearInMillis;
    }

    monthInMillis (): number {
        this.ensureNotDirty();
        if (this._monthInMillis === undefined || this._isDirty) {
            this._monthInMillis = this._month * number.MillisInMonth;
        }

        return this._monthInMillis;
    }

    dayInMillis (): number {
        this.ensureNotDirty();
        if (this._dayInMillis === undefined || this._isDirty) {
            this._dayInMillis = this._day * number.MillisInDay;
        }

        return this._dayInMillis;
    }

    hourInMillis (): number {
        this.ensureNotDirty();
        if (this._hourInMillis === undefined || this._isDirty) {
            this._hourInMillis = this._hour * number.MillisInHour;
        }

        return this._hourInMillis;
    }

    minuteInMillis (): number {
        this.ensureNotDirty();
        if (this._minuteInMillis === undefined || this._isDirty) {
            this._minuteInMillis = this._minute * number.MillisInMinute;
        }

        return this._minuteInMillis;
    }

    secondInMillis (): number {
        this.ensureNotDirty();
        if (this._secondInMillis === undefined || this._isDirty) {
            this._secondInMillis = this._second * number.MillisInSecond;
        }

        return this._secondInMillis;
    }

    totalInMillis(): number {

        if (this._totalInMillis === undefined) {
            this._totalInMillis = this.yearInMillis() +
                this.monthInMillis() +
                this.dayInMillis() +
                // short-circuit the following as they are set by default
                this._hourInMillis + //this.hourInMillis() +
                this._minuteInMillis + //this.minuteInMillis() +
                this._secondInMillis + // this.secondInMillis() +
                this.millis;

            this._isDirty = false;
        }

        return (this._totalInMillis + this._lazyMillisToAdd);
    }

    lazyAddTotalMillis(millisTobeAdded: number): void {
        this._lazyMillisToAdd += millisTobeAdded;
    }

    private ensureNotDirty(): void {
        if (!this._lazyMillisToAdd) {
            return;
        }

        this._isDirty = true;
        var remainingMillis: number = this._totalInMillis + this._lazyMillisToAdd;
        this._lazyMillisToAdd = 0;
        this._totalInMillis = undefined;

        var bceSign: number = +1;

        if (remainingMillis < 0) {
            bceSign = -1;
            remainingMillis = -remainingMillis;
        }

        //remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
        this._year = bceSign * Math.floor(remainingMillis / number.MillisInYear);
        remainingMillis -= this.yearInMillis();
        remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;

        this._month = Math.floor(remainingMillis / number.MillisInMonth);
        remainingMillis -= this.monthInMillis();
        remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;

        this._day = Math.floor(remainingMillis / number.MillisInDay);
        remainingMillis -= this.dayInMillis();
        remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;

        this._hour = Math.floor(remainingMillis / number.MillisInHour);
        remainingMillis -= this.hourInMillis();
        remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;

        this._minute = Math.floor(remainingMillis / number.MillisInMinute);
        remainingMillis -= this.minuteInMillis();
        remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;

        this._second = Math.floor(remainingMillis / number.MillisInSecond);
        remainingMillis -= this.secondInMillis();
        remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;

        this.millis =  remainingMillis > 999 ? 999 : remainingMillis;
    }
}
