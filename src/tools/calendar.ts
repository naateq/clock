/// <reference path="jsextension.ts" />
/// <reference path="../../Script/typings/clock/calendar.d.ts" />

// ==========================================================================
// Calendar implementation
// ==========================================================================
namespace calendar {

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
    export var YearThresholdForPrecision: number = number.parse('-20,000');

    export var yearSuffix: YearSuffix = {
        YearsAgo: 'ya',
        YA: 'ya'
    };

    export var date = <Dates> {};
    date.Now = new Date();
    date.NewYear = new Date(date.Now.getFullYear(), 0, 1);
    date.NextYear = new Date(1+date.Now.getFullYear(), 0, 1);
    date.Today = new Date(date.Now.getFullYear(), date.Now.getMonth(), date.Now.getDate());
    date.MillisInCurrYear = date.NextYear.getTime() - date.NewYear.getTime();
    date.CurrYearFraction = (date.Today.getTime() - date.NewYear.getTime()) / date.MillisInCurrYear;
    date.FullYearToDate =  date.NewYear.getFullYear() + date.CurrYearFraction;
    
    export var parseYear: ParseYear = function(yearStr: string): number {
        yearStr = yearStr.toLowerCase();
        var result: number = 0;

        if (yearStr.indexOf(hijri.yearSuffix.H) > 0) {
            // First convert to hijri number and then to Gregorian
            result =  hijri.parseYearToGregorian(yearStr);
        }
        else if (yearStr.indexOf(yearSuffix.YA) > 0) {
            // -ya + 2,000
            result = date.FullYearToDate - number.parse( yearStr.replace(yearSuffix.YA, ''));
        }
        else if (yearStr.indexOf(gregorian.yearSuffix.BC) > 0) {
            // -bc + 0
            result = -number.parse( yearStr.replace(gregorian.yearSuffix.BC, ''));
        }
        else {
            // ad + 0
            result = +number.parse(yearStr.replace(gregorian.yearSuffix.AD, ''));
        }

        return result;
    };

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

            if (year >= number.Billion) {
                factorStr = ' bya';
                factor = number.Billion;
            }
            else if (year >= number.Million) {
                factorStr = ' mya';
                factor = number.Million;
            }
            else if (year >= -YearThresholdForPrecision) {
                factorStr = ' kya';
                factor = number.Kilo;
            }
            else if (year >= number.Kilo) {
                factorStr = ' kBC';
                factor = number.Kilo;
            }

            year /= factor;
            return year.toFixed(2) + factorStr;
        }
    };

    export var lunar = <LunarConvertor> {
        // Factor of 1.03068982 or 0.970224 (A diff of 29,776 in 1,000,000 year)
        SolarFactor: 1000000,
        LunarFactor:  970224,

        fromSolar: function(solarYear: number) : number {
            // Going from solar to lunar increases the year by a factor of 1.03068982
            return ((solarYear * this.SolarFactor) / this.LunarFactor);
        },

        toSolar: function(lunarYear: number) : number {
            // Going from lunar to solar decreases the year by a factor of 0.970224
            return ((lunarYear * this.LunarFactor) / this.SolarFactor);
        }
    };
}

// ==========================================================================
// GregorianCalendar implementation
// ==========================================================================
namespace calendar {
        
    export var gregorian: GregorianCalendar = {

        monthName: <MonthName>{
            January: 'Jan',
            February: 'Feb',
            March: 'Mar',
            April: 'Apr',
            May: 'May',
            June: 'Jun',
            July: 'Jul',
            August: 'Aug',
            September: 'Sep',
            October: 'Oct',
            November: 'Nov',
            December: 'Dec'
        },

        monthNameUpper: <MonthName>{
            January: 'JAN',
            February: 'FEB',
            March: 'MAR',
            April: 'APR',
            May: 'MAY',
            June: 'JUN',
            July: 'JUL',
            August: 'AUG',
            September: 'SEP',
            October: 'OCT',
            November: 'NOV',
            December: 'DEC'
        },

        month: [
            gregorian.monthName.January,
            gregorian.monthName.February,
            gregorian.monthName.March,
            gregorian.monthName.April,
            gregorian.monthName.May,
            gregorian.monthName.June,
            gregorian.monthName.July,
            gregorian.monthName.August,
            gregorian.monthName.September,
            gregorian.monthName.October,
            gregorian.monthName.November,
            gregorian.monthName.December,
        ],

        yearSuffix: {
            BC: 'bc',
            AD: 'ad',

            YearsAgo: calendar.yearSuffix.YearsAgo,
            YA: calendar.yearSuffix.YA
        }
    };
}

// ==========================================================================
// HijriCalendar implementation
// ==========================================================================
namespace calendar {
    export var hijri: HijriCalendar = {

        monthName: <HijriMonthName> {
            Muharram: 'Muh',
            Safar: 'Saf',
            RabialAwwal: 'Rba',
            RabialSaani: 'Rbs',
            JamadaalAwwal: 'Jma',
            JamadaalSaani: 'Jms',
            Rajab: 'Raj',
            Shaban: 'Shb',
            Ramadan: 'Ram',
            Shawwal: 'Shw',
            DhualQadah: 'Dqa',
            DhualHijjah: 'Dhj'
        },

        month: [
            hijri.monthName.Muharram,
            hijri.monthName.Safar,
            hijri.monthName.RabialAwwal,
            hijri.monthName.RabialSaani,
            hijri.monthName.JamadaalAwwal,
            hijri.monthName.JamadaalSaani,
            hijri.monthName.Rajab,
            hijri.monthName.Shaban,
            hijri.monthName.Ramadan,
            hijri.monthName.Shawwal,
            hijri.monthName.DhualQadah,
            hijri.monthName.DhualHijjah
        ],

        yearSuffix: {
            BH: 'bh',
            AH: 'ah',
            H: 'h',

            YearsAgo: calendar.yearSuffix.YearsAgo,
            YA: calendar.yearSuffix.YA
        },

        GregorianOffset: 621.5774,
        
        /** -------------------------------------------------------------- */
        toGregorian: function(hijriYear: number) : number {
            return lunar.toSolar(hijriYear) + this.GregorianOffset;
        },

        /** -------------------------------------------------------------- */
        fromGregorian: function(gregorianYear: number) : number {
            return lunar.fromSolar(gregorianYear - this.GregorianOffset);
        },

        /** -------------------------------------------------------------- */
        parseYear: function(yearStr: string) : number {

            if (yearStr.indexOf(hijri.yearSuffix.BH) > 0) {
                // Before Hijri => 621 - bhInSolar
                return -number.parse(yearStr.replace(hijri.yearSuffix.BH, ''));
            }
            else {
                // After Hijri => 621 + ahInSolar
                return number.parse(yearStr.replace(hijri.yearSuffix.AH, '').replace(hijri.yearSuffix.H, ''));
            }
        },

        /** -------------------------------------------------------------- */
        parseYearToGregorian: function(yearStr: string) : number {
            return this.toGregorian(this.parseYear(yearStr));
        },

        /**
         * ----------------------------------------------------------------
         * Takes in the year returned by parseYearStr and returns the conventional year phrase in hijri.
         * No distinction is made for time before 20kBC
         * @param year the absolute number that scales positive starting 0AD and scales negative before AD
         * @return the year as H or BH, bya (billion years ago), mya, kya (thousand years ago)
         */
        fromParsedYearGregorian: function(year: number): string {
    
            if (year == null) {
                year = 0;
            }
    
            var hijriYear = hijri.fromGregorian(year);

            if (hijriYear >= 0) {
                return hijriYear + ' H';
            }
            // BH years
            else {
                hijriYear = -hijriYear;

                var factorStr: string = '';
                var factor: number = 1;

                if (hijriYear >= number.Billion) {
                    return (hijriYear / number.Billion).toFixed(2) + ' bya';
                }
                else if (hijriYear >= number.Million) {
                    return (hijriYear / number.Million).toFixed(2) + ' mya';
                }
                else if (hijriYear >= -YearThresholdForPrecision) {
                    return (hijriYear / number.Kilo).toFixed(2) + ' kya';
                }
                else if (hijriYear >= number.Kilo) {
                    return (hijriYear / number.Kilo).toFixed(2) + ' kBH';
                }
                else {
                    return hijriYear.toFixed(2) + ' BH'
                }
            }
        }
    };
}
    