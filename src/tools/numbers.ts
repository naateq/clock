namespace numbers {
    //
    export var Zero = 0;
    export var Unit = 1;
    export var Ten = 10;
    export var Cent = 100;
    export var Kilo = 1000;
    export var Million = Kilo * Kilo;       // Ten * Lac
    export var Billion = Kilo * Million;    // Arub
    export var Trillion = Kilo * Billion;   // Ten * Kharub

    export var MilliFactor = Kilo;
    export var MicroFactor = Million;
    export var NanoFactor = Billion;

    export var DaysInYear = 365;
    export var HoursInDay = 24;
    export var MinutesInHour = 60;
    export var SecondsInMinute = 60;

    export var MillisInSecond = Kilo;
    export var MillisInMinute = SecondsInMinute * MillisInSecond;
    export var MillisInHour = MinutesInHour * MillisInMinute;
    export var MillisInDay = 86400 * MillisInSecond;
    export var MillisInMonth28 = 28 * MillisInDay;
    export var MillisInMonth29 = 29 * MillisInDay;
    export var MillisInMonth30 = 30 * MillisInDay;
    export var MillisInMonth31 = 31 * MillisInDay;
    export var MillisInMonth = 2628 * 1000 * MillisInSecond;
    export var MillisInYear = 31540 * 1000 * MillisInSecond;
    export var MillisInCentury = 100 * MillisInYear;
    export var MillisInKilo = 10 * MillisInCentury;
    export var MillisInMillion = 1000 * MillisInKilo;
    export var MillisInBillion = 1000 * MillisInMillion;

    var Sifr = Zero;
    var Dus = Ten;
    var Sou = Dus * Ten;
    var Hazaar = Dus * Sou;
    var DusHazaar = Dus * Hazaar;
    var Lac = Sou * Hazaar;     //       1,00,000 =       100,000 == 100 Thousand
    var DusLac = Dus * Lac;     //      10,00,000 =     1,000,000 == Million
    var Crore = Sou * Lac;      //    1,00,00,000 =    10,000,000 == 10 Million
    var DusCrore = Dus * Crore; //   10,00,00,000 =   100,000,000 == 100 Million
    var Arub = Sou * Crore;     // 1,00,00,00,000 = 1,000,000,000 == Billion
    var DusArub = Dus * Arub;   // 10,00,00,00,000 = 10,000,000,000 == 10 Billion
    var Kharub = Sou * Arub;    // 1,00,00,00,00,000 = 100,000,000,000 == 100 Billion
    var DusKharub = Dus * Kharub; // Trillion

    export var GregorianMonths: string[] = [
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
    export var GregorianMonthsUpper: string[] = [
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

    export var HijriMonths: string[] = [
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
    export var YearThresholdForPrecision: number = parseIntStr('-20,000');
    export var GregorianTimeAdjusterNone: number = 0; // 0+ AD
    export var GregorianTimeAdjustorLastYear: number = 2000; //  parseIntStr('2,000'); // 2000 AD
    export var GregorianAdFactor: number = 1;
    export var GregorianBcFactor: number = -1;

    export var HijriInGregorianTime: number = 621.5774;
    export var GregorianToHijriFactorNumerator: number = 1000000;
    export var GregorianToHijriFactorDenominator: number = 970224
    //export var GregorianToHijriFactor: number = GregorianToHijriFactorNumerator / GregorianToHijriFactorDenominator;
    //export var HijriToGregorianFactor: number = GregorianToHijriFactorDenominator / GregorianToHijriFactorNumerator;

    export function hijriToAdBc(h: number): number {
        return ((h * GregorianToHijriFactorDenominator) / GregorianToHijriFactorNumerator) + HijriInGregorianTime;
    }

    /**
     * ----------------------------------------------------------------
     * Parses conventional year phrases into a number starting at 0 AD, going negative
     * towards older time, and positive towards the current time
     * Examples formats: '610AD', '570 BC', '13,000 ya', '40 kya'
     * Hijri years are also converted, such as 1437H or 250 AH. Spaces don't matter
     * For Hijri conversion, years are rounded and may have a year or so off
     *
     * @return returns an absolute number that starts from 0AD and scales positive after
     * AD and scales negative before AD
     */
    export function parseYearStr(yearStr: string): number {
        yearStr = yearStr.toLowerCase();
        var bcAdjuster: number = GregorianTimeAdjustorLastYear; // { BC:0, AD:2000 }
        var result: number = 0;

        if (yearStr.indexOf('bh') > 0) {
            // -((hijri * GregorianToHijriFactorDenominator) / GregorianToHijriFactorNumerator) + HijriInGregorianTime;
            bcAdjuster = HijriInGregorianTime;
            yearStr = yearStr.replace('bh', '');
            result = -((GregorianToHijriFactorDenominator * parseIntStr(yearStr)) / GregorianToHijriFactorNumerator);
        }
        else if (yearStr.indexOf('h') > 0) {
            // ((hijri * GregorianToHijriFactorDenominator) / GregorianToHijriFactorNumerator) + HijriInGregorianTime;
            bcAdjuster = HijriInGregorianTime;
            yearStr = yearStr.replace('ah', '').replace('h', '');
            result = (GregorianToHijriFactorDenominator * parseIntStr(yearStr)) / GregorianToHijriFactorNumerator;
        }
        else if (yearStr.indexOf('bc') > 0) {
            // -bc + 0
            bcAdjuster = GregorianTimeAdjusterNone;
            yearStr = yearStr.replace('bc', '');
            result = GregorianBcFactor * parseIntStr(yearStr);
        }
        else if (yearStr.indexOf('ya') > 0) {
            // -ya + 2,000
            bcAdjuster = GregorianTimeAdjustorLastYear;
            yearStr = yearStr.replace('ya', '');
            result = GregorianBcFactor * parseIntStr(yearStr);
        }
        else {
            // ad + 0
            bcAdjuster = GregorianTimeAdjusterNone;
            yearStr = yearStr.replace('ad', '');
            result = GregorianAdFactor * parseIntStr(yearStr);
        }

        // Apply AD/BC qualifier from now up to 20,000 BC (or 20 kya)
        // Ignore BC before that due to lack of precision
        if (bcAdjuster != GregorianTimeAdjusterNone && result >= YearThresholdForPrecision) {
            result = bcAdjuster + result;
        }

        return Math.round(result);
    }

    /**
     * ----------------------------------------------------------------
     * Takes in the year returned by parseYearStr and returns the conventional year phrase
     * @param year the absolute number that scales positive starting 0AD and scales negative before AD
     * @return the year as AD, BC, bya (billion years ago), mya, kya (thousand years ago)
     */
    export function parsedYearToAdBc(year: number): string {

        if (year == null) {
            return '0 AD';
        }
        else if (year >= 0) {
            return year + ' AD';
        }

        // Negative years
        else if (year >= YearThresholdForPrecision) {
            return -year + ' BC';
        }
        else {
            var factorStr: string = '';
            var factor: number = 1;

            year = -year;

            if (year > Billion) {
                factorStr = ' bya';
                factor = Billion;
            }
            else if (year > Million) {
                factorStr = ' mya';
                factor = Million;
            }
            else if (year > Kilo) {
                factorStr = ' kya';
                factor = Kilo;
            }
            else if (year > Cent) {
                factorStr = ' cya';
                factor = Cent;
            }

            year /= factor;
            var yearStr = '';
            if (factor > 1) {
                return year.toFixed(2) + factorStr;
            }
            else {
                return Math.floor(year).toString();
            }
        }
    }

    /**
     * ----------------------------------------------------------------
     * Takes in the year returned by parseYearStr and returns the conventional year phrase in Hijri.
     * No distinction is made for time before 20kBC
     * @param year the absolute number that scales positive starting 0AD and scales negative before AD
     * @return the year as H or BH, bya (billion years ago), mya, kya (thousand years ago)
     */
    export function parsedYearToHijri(year: number): string {

        if (year == null) {
            year = 0;
        }

        year = year - HijriInGregorianTime;

        if (year >= 0) {
            return Math.round((year * GregorianToHijriFactorNumerator)/GregorianToHijriFactorDenominator) + ' H';
        }

        // Negative years
        else if (year >= YearThresholdForPrecision) {
            return Math.round((-year * GregorianToHijriFactorNumerator) / GregorianToHijriFactorDenominator) + ' BH';
        }
        else {
            var factorStr: string = '';
            var factor: number = 1;
            year = -year;

            if (year > Billion) {
                factorStr = ' bya';
                factor = Billion;
            }
            else if (year > Million) {
                factorStr = ' mya';
                factor = Million;
            }
            else {
                factorStr = ' kya';
                factor = Kilo;
            }

            return (Math.round(year / factor) + factorStr);
        }
    }

    /**
     * ----------------------------------------------------------------
     * Parses a number string given in one of the formats:
     * 999, 23,000,000, 15c, 2k, 5m, 13.6b
     */
    export function parseIntStr(str: string): number {
        if (!str) {
            return Zero;
        }

        var factor = Unit;

        // remove 10^3 separator
        str = str.replace(',', '').toLowerCase();
        let lastDigitIndex = str.length - 1;

        if (str[lastDigitIndex] == 'b') {
            str = str.replace('b', '');
            factor = Billion;
        }
        else if (str[lastDigitIndex] == 'm') {
            str = str.replace('m', '');
            factor = Million;
        }
        else if (str[lastDigitIndex] == 'k') {
            str = str.replace('k', '');
            factor = Kilo;
        }
        else if (str[lastDigitIndex] == 'c') {
            str = str.replace('c', '');
            factor = Cent;
        }

        var result = factor * parseInt(str);
        return result;
    }
}
