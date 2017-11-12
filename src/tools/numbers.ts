/// <reference path="../../typings/clock/clock.d.ts" />

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

    /**
     * ----------------------------------------------------------------
     * Parses a number string given in one of the formats:
     * 999, 23,000,000, 15c, 2k, 5m, 13.6b
     */
    export interface ParseNumber {
        (numberStr: string): number;
    }
    export var parseNumber: ParseNumber = function(str: string): number {

        if (!str) {
            return Zero;
        }

        var factor = 1;

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

        var result = factor * parseFloat(str);
        
        return result;
    };
}
