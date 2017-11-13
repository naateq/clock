// ==========================================================================
// Calendar interface
// ==========================================================================
declare namespace calendar {

    export var YearThresholdForPrecision: number;

    /**
     * ----------------------------------------------------------------
     * Parses conventional year phrases into a number starting at 0 AD, going negative
     * towards older time, and positive towards the current time
     * Examples formats: '610AD', '570 BC', '13,000 ya', '40 kya'
     * hijri years are also converted, such as 1437H or 250 AH. Spaces don't matter
     * For hijri conversion, years are rounded and may have a year or so off
     *
     * @return returns an absolute number that starts from 0AD and scales positive after
     * AD and scales negative before AD
     */
    export interface ParseYear {
        (yearStr: string): number;
    }

    /**
     * ----------------------------------------------------------------
     * Takes in the year returned by parseYearStr and returns the conventional year phrase
     * @param year the absolute number that scales positive starting 0AD and scales negative before AD
     * @return the year as AD, BC, bya (billion years ago), mya, kya (thousand years ago)
     */
    export interface FromParsedYear {
        (year: number) : string;
    }
    
    export interface Dates {
        Now: Date;
        NewYear: Date;
        NextYear: Date;
        Today: Date;
        MillisInCurrYear: number;
        CurrYearFraction: number;
        FullYearToDate: number;

        nowAsString: (utc?: boolean) => string;
    }

    export interface YearSuffix {
        YearsAgo: string;
        YA: string;
    }

    export interface LunarConvertor {
        SolarFactor: number;
        LunarFactor: number;
        fromSolar: (solarYear: number) => number;
        toSolar: (solarYear: number) => number;
    }
}

// ==========================================================================
// GregorianCalendar interface
// ==========================================================================
declare namespace calendar {

    export interface MonthName {
        January: string;
        February: string;
        March: string;
        April: string;
        May: string;
        June: string;
        July: string;
        August: string;
        September: string;
        October: string;
        November: string;
        December: string;
    }

    export interface GregorianYearSuffix extends YearSuffix {
        BC: string;
        AD: string;
    }

    export interface GregorianCalendar {
        /** Names of the Hijri months and their 3-letters abbreviations */
        monthName: MonthName;
        monthNameUpper: MonthName;

        /** Ordered list of Gregorian calendar months - zero based index map from month number to the name */
        month: string[];

        daysInMonth: number[];

        /** Year suffix used to denatore before or after Christ death */
        yearSuffix: GregorianYearSuffix;
    }
}

// ==========================================================================
// HijriCalendar interface
// ==========================================================================
declare namespace calendar {

    export interface HijriMonthName {
        Muharram: string;
        Safar: string;
        RabialAwwal: string;
        RabialSaani: string;
        JamadaalAwwal: string;
        JamadaalSaani: string;
        Rajab: string;
        Shaban: string;
        Ramadan: string;
        Shawwal: string;
        DhualQadah: string;
        DhualHijjah: string;
    }

    export interface HijriYearSuffix extends YearSuffix {
        BH: string;
        AH: string;
        H: string;
    }

    export interface HijriCalendar {
        /** Names of the Hijri months and their 3-letters abbreviations */
        monthName: HijriMonthName;

        /** Ordered list of Hijri months - zero based index map from month number to the name */
        month: string[];

        /** Year suffix used to denatore before or after Hijri calendar started */
        yearSuffix: HijriYearSuffix;

        /** The number of Gregorian calendar years elapsed since 0 AD, until the beginning of Hijri calendar. */
        readonly GregorianOffset: number;

        /** Converts the Hijri +/- year number to Gregorian +/- year number [See hijri.parseYear] */
        toGregorian: (hijriYear: number) => number;

        /** Converts from the Gregorian +/- year number to Hijri +/- year number */
        fromGregorian: (gregorianYear: number) => number;

        /** Parses a Hijri year (date) string to Hijri +/- year number [See hijri.parseYearToGregorian]  */
        parseYear: (yearStr: string) => number;

        /** Parses a Hijri year (date) string and then converts to Gregorian calendar date */
        parseYearToGregorian: (yearStr: string) => number;

        /** Converts the parsed Gregorian +/ year number to Hijri string using AH/BH, bya, mya, etc. */
        fromParsedYearGregorian: (year: number) => string;
    }
}
