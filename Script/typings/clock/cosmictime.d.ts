interface CosmicTime {
    timestr: string;

    isEndTime: boolean;
    isHijri: boolean;

    //constructor: (timeStr: string, isEndTime?: boolean);

    yearInMillis(): number;
    monthInMillis(): number;
    dayInMillis(): number;
    hourInMillis(): number;
    minuteInMillis(): number;
    secondInMillis(): number;
    millis: number;

    totalInMillis(): number;
    lazyAddTotalMillis(millisTobeAdded: number): void;
}

interface CosmicTimeConstructor {
    new (timeStr: string, isEndTime?: boolean): CosmicTime;
}

interface CosmicTimeEmptyConstructor {
    new (): CosmicTime;
}

interface Timespan {
    year: number;
    month: number;
    day: number;

    hour: number;
    minute: number;
    second: number;
    millis: number;
}
