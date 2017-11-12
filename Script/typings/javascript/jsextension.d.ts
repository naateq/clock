interface String {
    /** Joins all arguments in a string with the specified delimiter provided as the first argument. */
    join: (delimiter: string, ...args: object[]) => string;

    /** Parses a string representation of a number to the type of number. Also converts suffixes like 'b' for a billion, 'm' for a million, etc. */
    parseNumber: () => number;
}

declare namespace number {
    /**
     * ----------------------------------------------------------------
     * Parses a number string given in one of the formats:
     * 999, 23,000,000, 15c, 2k, 5m, 13.6b
     */
    export interface ParseNumber {
        (numberStr: string): number;
    }
}
