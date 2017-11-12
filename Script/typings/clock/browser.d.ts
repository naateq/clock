declare namespace browser {
    
    /** Extracts the query parameter value from the URL and decodes it before returning. */
    export interface GetQueryParameter {
        (paramName: string, url?:string): string;
    }

    /** Reads the parameters from URL query part and updates document HTML elements of the same ID attributes */
    export interface UpdatePageUsingQueryParameters {
        (paramNames: string[]): void;
    }

    /** Gets the value for the specified document element elementId, or null */
    export interface GetElementValue {
        (elementId: string): string;
    }

    /** Sets the newValue to the specified document element and returns and the old element value */
    export interface SetElementValue {
        (elementId: string, newValue: string): string;
    }
}
