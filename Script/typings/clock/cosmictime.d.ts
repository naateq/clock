interface CosmicTime {
    timestr: string;
    isEndTime: boolean;
    isHijri: boolean;

    //constructor: (timeStr: string, isEndTime?: boolean);
    year(): number;
    month(): number;
    day(): number;
    hour(): number;
    minute(): number;
    second(): number;
    millis(): number;

    yearInMillis(): number;
    monthInMillis(): number;
    dayInMillis(): number;
    hourInMillis(): number;
    minuteInMillis(): number;
    secondInMillis(): number;
    
    totalInMillis(): number;

    addMillis(millisTobeAdded: number): void;
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
