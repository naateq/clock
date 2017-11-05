/// <reference path="../../typings/clock/clock.d.ts" />

namespace utils {
    
        /** Joins all arguments in a string with the specified delimiter provided as the first argument. */
        export function join(delimiter: string, ...args: object[]) : string {
            if (!arguments || arguments.length < 2)
                throw 'join(delimiter, argumentsToJoin)';
            
            var str = arguments[1];
    
            for (var i = 2; i < arguments.length; i++) {
                str += delimiter + arguments[i];
            }
    
            return str;
        }
    
        /** Converts a CosmicTime object to a string and optional logs it to console */
        export function cosmicTimeToString(ts: CosmicTime, log?: boolean): string {
            var str: string = '';
            str += ts.year !== undefined ? ts.year : 'xx';
            str += '-' + (ts.month !== undefined ? ts.month : 'xx');
            str += '-' + (ts.day !== undefined || ts.day == null ? ts.day : 'xx');
    
            str += ' ' + (ts.hour !== undefined ? ts.hour : 'xx');
            str += ':' + (ts.minute !== undefined ? ts.minute : 'xx');
            str += ':' + (ts.second !== undefined ? ts.second : 'xx');
    
            str += ' (' + (ts.isHijri ? 'AH/BH ' : 'AD/BC ') + ts.totalInMillis + ')';
    
            if (log) {
                console.log(str);
            }
            
            return str; 
        }
    
        export function getQueryParameterByName(name: string, url:string): string {
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
    
        export function getElementValue(name: string): string {
            var el = document.getElementById(name);
            if (el) {
                return (<HTMLInputElement>el).value.trim();
            }
    
            return null;
        }
    
        export function setElementValue(name: string, newValue: string): string {
            var oldValue: string = null;
            var el = document.getElementById(name);
            if (el) {
                oldValue = (<HTMLInputElement>el).value.trim();
                (<HTMLInputElement>el).value = newValue;
            }
    
            return oldValue;
        }
    
        export function logTimers(): void {
            console.log('from: ' + cosmicTimeToString(timemanager.config.fromTime));
            console.log('to: ' + cosmicTimeToString(timemanager.config.toTime));
            console.log('elapsed: ' + cosmicTimeToString(timemanager.config.elapsedTime));
            //console.log('cosmicMillisPerClockMillis: ' + timemanager.cosmicMillisPerClockMillis);
        }
    
        export function setSpeed(speed?: number): boolean {
            if (speed === undefined || speed === null) {
                speed = 1;
    
                var speedParameterValue = utils.getElementValue('speed');
                if (speedParameterValue)
                    speed = parseInt(speedParameterValue) || speed;
            }
    
            timemanager.config.clockTimeCompressionFactor = speed;
            return false;
        }
    
        export function toggleTimePause(): boolean {
            timemanager.config.timePaused = !timemanager.config.timePaused;
            if (!timemanager.config.timePaused) {
                setSpeed();
            }
    
            return false;
        }
    }
    