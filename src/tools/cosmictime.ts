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
    _totalInMillis: number;
    
    _year: number;
    _month: number;
    _day: number;
    _hour: number;
    _minute: number;
    _second: number;
    _millis: number;
    
    _yearInMillis: number;
    _monthInMillis: number;
    _dayInMillis: number;
    _hourInMillis: number;
    _minuteInMillis: number;
    _secondInMillis: number;

    constructor (timeStr: string, isEndTime?: boolean) {
        this._isDirty = true;
        this.isHijri = false;
        this._isYearOnlyDate = false;

        this._totalInMillis = 0;
        this._year = 0;
        this._month = 0;
        this._day = 0;
        this._hour = 0;
        this._minute = 0;
        this._second = 0;
        this._millis = 0;

        this.timestr = timeStr || calendar.date.nowAsString(false);
        this.isEndTime = isEndTime || false;

        this.parse();
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
            this.isEndTime ? 12 : 1);
        this._month = !this._month ? 0 : this._month - 1;
        
        this._day = (this._day !== undefined ? this._day :
            !this.isEndTime ? 1 :
                this.isHijri ? 30 : calendar.gregorian.daysInMonth[this._month]);
        this._day = !this._day ? 0 : this._day - 1;

        // Set default _hour, _minute, _second and millis (ignore if provided as input for now)
        this._hour = 0;
        this._minute = 0;
        this._second = 0;
        this._millis = 0;

        if (this.isEndTime) {
            this._hour = 23;
            this._minute = 59;
            this._second = 59;
            this._millis = 999;
        }

        this._isDirty = false;
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

    year (): number {
        this.ensureNotDirty();
        return this._year;        
    }

    month (): number {
        this.ensureNotDirty();
        return this._month;        
    }

    day (): number {
        this.ensureNotDirty();
        return this._day;        
    }

    hour (): number {
        this.ensureNotDirty();
        return this._hour;        
    }

    minute (): number {
        this.ensureNotDirty();
        return this._minute;        
    }

    second (): number {
        this.ensureNotDirty();
        return this._second;        
    }

    millis (): number {
        this.ensureNotDirty();
        return this._millis;
    }

    yearInMillis (): number {
        return this.year() * number.MillisInYear;
    }

    monthInMillis (): number {
        return this.month() * number.MillisInMonth;
    }

    dayInMillis (): number {
        return this.day() * number.MillisInDay;
    }

    hourInMillis (): number {
        return this.hour() * number.MillisInHour;
    }

    minuteInMillis (): number {
        return this.minute() * number.MillisInMinute;
    }

    secondInMillis (): number {
        return this.second() * number.MillisInSecond;
    }

    totalInMillis(): number {
        // calculate only once - the first time. 
        // Afterwards, the only time the value will change is when addMillis() is called, and that method
        // will update this value. hence no need for anyting here 
        if (!this._totalInMillis) {
            this._totalInMillis = 
                this.yearInMillis() +
                this.monthInMillis() +
                this.dayInMillis() +
                this.hourInMillis() +
                this.minuteInMillis() +
                this.secondInMillis() +
                this.millis();
        }

        return this._totalInMillis;
    }

    addMillis(millisTobeAdded: number): void {
        this._totalInMillis = this.totalInMillis() + millisTobeAdded;
        this._isDirty = true;
    }

    /** 
     * Returns with no-op if time hasn't changed. Else, updates all time fields.
     */
    private ensureNotDirty(): void {

        if (!this._isDirty) {
            return;
        }

        var remainingMillis: number = this.totalInMillis();
        var bceSign: number = +1;

        if (remainingMillis < 0) {
            bceSign = -1;
            remainingMillis = -remainingMillis;
        }

        //remainingMillis = remainingMillis <= 0 ? 0 : remainingMillis;
        this._year = bceSign * Math.floor(remainingMillis / number.MillisInYear);
        remainingMillis = remainingMillis % number.MillisInYear

        this._month = Math.floor(remainingMillis / number.MillisInMonth);
        remainingMillis = remainingMillis % number.MillisInMonth;

        this._day = Math.floor(remainingMillis / number.MillisInDay);
        remainingMillis = remainingMillis % number.MillisInDay

        this._hour = Math.floor(remainingMillis / number.MillisInHour);
        remainingMillis = remainingMillis % number.MillisInHour;

        this._minute = Math.floor(remainingMillis / number.MillisInMinute);
        remainingMillis = remainingMillis % number.MillisInMinute;

        this._second = Math.floor(remainingMillis / number.MillisInSecond);
        remainingMillis = remainingMillis % number.MillisInSecond;

        this._millis =  remainingMillis > 999 ? 999 : remainingMillis;
        this._isDirty = false;
    }
}
