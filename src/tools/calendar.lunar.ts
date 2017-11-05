/// <reference path="numbers.ts" />

namespace calendar {
    namespace month {
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
    /** -------------------------------------------------------------- */
    export interface LunarYearSuffix {
        BeforeHijri: string,
        BH: string,
        AfterHijri: string,
        AH: string,
        H: string
    }
    export var lunarYearSuffix = <LunarYearSuffix> {
        BH: 'bh',
        AH: 'ah',
        H: 'ah',
    };

    /** -------------------------------------------------------------- */
    export interface Lunar {
        SolarFactor: number;
        LunarFactor: number;
        fromSolar: (solarYear: number) => number;
        toSolar: (solarYear: number) => number;
    }
    export var lunar = <Lunar> {
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

    /** -------------------------------------------------------------- */
    export interface Hijri {
        GregorianOffset: number;
        toGregorian: (hijriYear: number) => number;
        fromGregorian: (gregorianYear: number) => number;
        parseYear: (yearStr: string) => number;

        parseYearToGregorian: (yearStr: string) => number;
        fromParsedYearGregorian: (year: number) => string;
    };
    export var hijri = <Hijri> {

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

            if (yearStr.indexOf(lunarYearSuffix.BH) > 0) {
                // Before Hijri => 621 - bhInSolar
                return -numbers.parseNumber(yearStr.replace(lunarYearSuffix.BH, ''));
            }
            else {
                // After Hijri => 621 + ahInSolar
                return numbers.parseNumber(yearStr.replace(lunarYearSuffix.AH, '').replace(lunarYearSuffix.H, ''));
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
    
            var hijri = this.fromGregorian(year);

            if (hijri >= 0) {
                return hijri + ' H';
            }
            // BC years
            else {
                hijri = -hijri;

                var factorStr: string = '';
                var factor: number = 1;

                if (hijri >= numbers.Billion) {
                    return (hijri / numbers.Billion).toFixed(2) + ' bya';
                }
                else if (hijri >= numbers.Million) {
                    return (hijri / numbers.Million).toFixed(2) + ' mya';
                }
                else if (hijri >= -YearThresholdForPrecision) {
                    return (hijri / numbers.Kilo).toFixed(2) + ' kya';
                }
                else if (hijri >= numbers.Kilo) {
                    return (hijri / numbers.Kilo).toFixed(2) + ' kBH';
                }
                else {
                    return hijri.toFixed(2) + ' BH'
                }
            }
        }
    };
}
