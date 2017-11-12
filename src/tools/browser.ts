/// <reference path="../../Script/typings/clock/browser.d.ts" />

namespace browser {

    /** Extracts the query parameter value from the URL and decodes it before returning. */
    export var getQueryParameter: GetQueryParameter = function (paramName: string, url?:string): string {

        if (!url) {
            url = window.location.href;
        }

        paramName = paramName.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + paramName + "(=([^&#]*)|&|#|$)");

        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';

        var paramValue = decodeURIComponent(results[2].replace(/\+/g, " "));
        return paramValue;
    };

    /** Reads the parameters from URL query part and updates document HTML elements of the same ID attributes */
    export var updatePageUsingQueryParameters: UpdatePageUsingQueryParameters = function (paramNames: string[]): void {
        var url = window.location.search;

        if (url) {

            for (var i = 0; i < paramNames.length; i++) {
                var paramName: string = paramNames[i];
                var paramValue = getQueryParameter(paramName, url);

                if (paramValue) {
                    var paramEl: HTMLInputElement = <HTMLInputElement>document.getElementById(paramName);

                    if (paramEl) {
                        paramEl.value = paramValue;
                    }
                    else {
                        console.warn('HTML element with ID="' + paramName + '" not found!');
                    }
                }
            }
        }
    }

    /** Gets the value for the specified document element elementId, or null */
    export var getElementValue: GetElementValue = function (elementId: string): string {
        var el = document.getElementById(elementId);

        if (el) {
            return (<HTMLInputElement>el).value.trim();
        }
        else {
            console.warn('HTML element with ID="' + elementId + '" not found!');
        }

        return null;
    }

    /** Sets the newValue to the specified document element and returns and the old element value */
    export var setElementValue: SetElementValue = function (elementId: string, newValue: string): string {
        var oldValue: string = null;
        var el = document.getElementById(elementId);

        if (el) {
            oldValue = (<HTMLInputElement>el).value.trim();
            (<HTMLInputElement>el).value = newValue;
        }
        else {
            console.warn('HTML element with ID="' + elementId + '" not found!');
        }

        return oldValue;
    }
}
