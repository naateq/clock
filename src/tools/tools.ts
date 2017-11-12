/// <reference path="../../typings/clock/clock.d.ts" />

namespace browser {

    /** UI function to get decoded URL query parameter */
    export function getQueryParameterByName(name: string, url?:string): string {

        if (!url) {
            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /** Reads the parameters from URL query part and sets those on the document elements if they exist */
    export function setParametersFromUrl(parameterNames: string[]): void {
        var url = window.location.search;

        if (url) {

            for (var i = 0; i < parameterNames.length; i++) {
                var parameterName: string = parameterNames[i];
                var parameterValue = getQueryParameterByName(parameterName, url);

                if (parameterValue) {
                    var parameterEl: HTMLInputElement = <HTMLInputElement>document.getElementById(parameterName);

                    if (parameterEl)
                    {
                        parameterEl.value = parameterValue;
                    }
                }
            }
        }
    }

    /** Gets the value for the specified document element name, or null */
    export function getElementValue(name: string): string {
        var el = document.getElementById(name);

        if (el) {
            return (<HTMLInputElement>el).value.trim();
        }

        return null;
    }

    /** Sets the newValue to the specified document element and returns and the old element value */
    export function setElementValue(name: string, newValue: string): string {
        var oldValue: string = null;
        var el = document.getElementById(name);

        if (el) {
            oldValue = (<HTMLInputElement>el).value.trim();
            (<HTMLInputElement>el).value = newValue;
        }

        return oldValue;
    }
}
