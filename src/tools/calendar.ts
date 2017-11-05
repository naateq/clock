/// <reference path="calendar.lunar.ts" />

namespace calendar {
    namespace month {
        export var Gregorian: string[] = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        export var GregorianUpper: string[] = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC'
        ];

        export var hijri: string[] = [
            'Muh',
            'Saf',
            'Jam-1',
            'Jam-2',
            'Rab-1',
            'Rab-2',
            'Raj',
            'Shab',
            'Rama',
            'Shaw',
            'Qad',
            'Haj'
        ];
    }
}

namespace calendar {
    /** --------------------------------------------------------------- */
    export interface Dates {
        Now: Date;
        NewYear: Date;
        NextYear: Date;
        Today: Date;
        MillisInCurrYear: number;
        CurrYearFraction: number;
        FullYearToDate: number;
    }
    export var date = <Dates> {};
    date.Now = new Date();
    date.NewYear = new Date(date.Now.getFullYear(), 0, 1);
    date.NextYear = new Date(1+date.Now.getFullYear(), 0, 1);
    date.Today = new Date(date.Now.getFullYear(), date.Now.getMonth(), date.Now.getDate());
    date.MillisInCurrYear = date.NextYear.getTime() - date.NewYear.getTime();
    date.CurrYearFraction = (date.Today.getTime() - date.NewYear.getTime()) / date.MillisInCurrYear;
    date.FullYearToDate =  date.NewYear.getFullYear() + date.CurrYearFraction;
    
    /**
     * ----------------------------------------------------------------
     * AD/BC: conventional meaning
     *
     *    ya: years ago
     *    kya: kilo (thousand) years ago
     *    h | ah: hijri or after hijrah
     *    bh: before hijrah
     *
     * NOTE: The scale for years before 20 kBC or 20 kya is the same, i.e. we don't
     * differentiate between BC or ya
     */
    export var YearThresholdForPrecision: number = numbers.parseNumber('-20,000');

    /** --------------------------------------------------------------- */
    export interface YearSuffix extends LunarYearSuffix{
        BC: string,
        AD: string,
    
        YearsAgo: string,
        YA: string
    }
    export var yearSuffix = <YearSuffix>{
        BC: 'bc',
        AD: 'ad',

        YearsAgo: 'ya',
        YA: 'ya'
    };
    yearSuffix.BH = lunarYearSuffix.BH;
    yearSuffix.AH = lunarYearSuffix.AH;
    yearSuffix.H = lunarYearSuffix.H;

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
    export var parseYear: ParseYear = function(yearStr: string): number {
        yearStr = yearStr.toLowerCase();
        var result: number = 0;

        if (yearStr.indexOf(yearSuffix.H) > 0) {
            // First convert to hijri number and then to Gregorian
            result =  hijri.parseYearToGregorian(yearStr);
        }
        else if (yearStr.indexOf(yearSuffix.YA) > 0) {
            // -ya + 2,000
            result = date.FullYearToDate - numbers.parseNumber( yearStr.replace(yearSuffix.YA, ''));
        }
        else if (yearStr.indexOf(yearSuffix.BC) > 0) {
            // -bc + 0
            result = -numbers.parseNumber( yearStr.replace(yearSuffix.BC, ''));
        }
        else {
            // ad + 0
            result = +numbers.parseNumber(yearStr.replace(yearSuffix.AD, ''));
        }

        return result;
    };

    /**
     * ----------------------------------------------------------------
     * Takes in the year returned by parseYearStr and returns the conventional year phrase
     * @param year the absolute number that scales positive starting 0AD and scales negative before AD
     * @return the year as AD, BC, bya (billion years ago), mya, kya (thousand years ago)
     */
    export interface FromParsedYear {
        (year: number) : string;
    }
    export var fromParsedYear: FromParsedYear = function(year: number): string {

        if (year == null) {
            return '0 AD';
        }
        else if (year >= 0) {
            return year + ' AD';
        }
        else {
            // Negative years
            year = -year;

            var factorStr: string = ' BC';
            var factor: number = 1;

            if (year >= numbers.Billion) {
                factorStr = ' bya';
                factor = numbers.Billion;
            }
            else if (year >= numbers.Million) {
                factorStr = ' mya';
                factor = numbers.Million;
            }
            else if (year >= -YearThresholdForPrecision) {
                factorStr = ' kya';
                factor = numbers.Kilo;
            }
            else if (year >= numbers.Kilo) {
                factorStr = ' kBC';
                factor = numbers.Kilo;
            }

            year /= factor;
            return year.toFixed(2) + factorStr;
        }
    };
}
