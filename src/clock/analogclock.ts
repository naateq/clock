/// <reference path="../../Script/typings/clock/clock.d.ts" />

namespace clock {

    export function createAnalog(ctor: AnalogClockConstructor, canvas: HTMLCanvasElement): AnalogClock {
        return new ctor(canvas);
    }

    /** Fundamental logic copied from online resources */
    export class Analog implements AnalogClock {

        /** Canvas HTML element for rendering analog clock */
        private htmlElement: HTMLCanvasElement;

        /** Canvas context */
        private context: CanvasRenderingContext2D;

        /** Clock dial center x co-ordinate */
        private cx: number;

        /** Clock dial center y co-ordinate */
        private cy: number;

        /** Clock dial radius */
        private radius: number;

        /** -----------------------------------------------------------------
         * Ctor for the Analog clock
         * @param canvas HTML canvas element for clock rendering
         */
        constructor(canvas: HTMLCanvasElement) {
            // compute center of the canvas square
            // Set the canvas starting point to the center of the square
            this.cx = canvas.height / 2;
            this.cy = this.cx;

            this.htmlElement = canvas;
            this.context = canvas.getContext("2d");
            this.context.translate(this.cx, this.cy);

            // Decide on the clock radius inside the square
            // Every second, update the clock needles
            this.radius = 0.90 * canvas.height / 2;

        }

        /** -----------------------------------------------------------------
         * Draws a 12 or 24 hour clock and sets the handles to specified time
         * For 12 hours clock, AM/PM is used to distinguish AM/PM; for 24 hr
         * clock, dial numbers change to 12 - 23 for evening hours
         */
        public drawClock(hour: number, minute: number, second: number, is24HourClock: boolean): void {
            this.drawFace();
            this.renderMarkersOnDial(hour, is24HourClock);
            this.renderHandsOnDial(hour, minute, second);
        }

        /** -----------------------------------------------------------------
         * Draws an empty circular face of the analog clock
         */
        public drawFace(drawBorder?: boolean, fillStyle?: string, borderFillStyle?: string): void {
            if (!fillStyle) {
                fillStyle = '#ffffff';
            }

            if (!borderFillStyle) {
                borderFillStyle = '#ffffff';
            }

            var ctx = this.context;
            var radius = this.radius;

            var grad: CanvasGradient;

            // Cleanup the clock area
            /* Arc with center at (x=0, y=0, r=radius) of specified radius, which starts at 0 radians on an XY-axis and
                and goes all the way to 2PI radians (360 degrees); clockwise arc drawing is the default; use true for
                counter clockwise. (start radians=0, end radians=2PI) */
            this.drawCircle(ctx, 0, 0, radius, 0, 2 * Math.PI, false, fillStyle || '#ffffff');

            /* Draw an arc with a gradient (thick) stroke to create the clock border. The border (stroke width) starts
                with a dark colored line, gradually grades to white halfway, and then grades back to dark grey by the end
                of stroke width. The arc starts with center and stroke at (x=0, y=0, r=95%), and with stroke up to r=105%.
                */
            if (drawBorder) {
                this.drawBroderType01(borderFillStyle);
            }
            else {
                this.drawBroderType02(borderFillStyle);
            }
        }

        /** ----------------------------------------------------------------- */
        public drawBroderType01(fillStyle: string) {
            var grad = this.context.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
            grad.addColorStop(0, '#333333');
            grad.addColorStop(0.7, fillStyle || 'white');
            grad.addColorStop(1, '#dddddd');

            this.context.strokeStyle = grad;
            this.context.lineWidth = this.radius * 0.08;
            this.context.stroke();
        }

        /** ----------------------------------------------------------------- */
        public drawBroderType02(fillStyle: string) {
            // Inner circle (dot for the handles)
            this.context.beginPath();
            this.context.lineWidth = 15;
            this.context.shadowColor = '#ddddff'; //'#9e6969';
            this.context.strokeStyle = "rgba(128,24,24, 0.05)";
            this.context.shadowBlur = 5;
            this.context.shadowOffsetX = 1;
            this.context.shadowOffsetY = 1;

            this.context.arc(0, 0, this.radius*0.10, 0, 2 * Math.PI, false);
            this.context.fill();
            //this.context.stroke();

            this.context.lineWidth = 5;
            this.context.shadowColor = '#666699'; // '#333366'; //'#9e6969';
            this.context.strokeStyle = "rgba(64,64,128, 0.05)";
            this.context.shadowBlur = 10;
            this.context.shadowOffsetX = 1;
            this.context.shadowOffsetY = 1;

            this.context.arc(0, 0, this.radius*1.01, 0, 2 * Math.PI, false);
            this.context.stroke();

        }

        /** -----------------------------------------------------------------
         * Renders dial numbers on the clock's circular face based on
         * the current time (hour)
         * @param hour The current time hour
         */
        public renderMarkersOnDial(hour: number, is24HourClock: boolean, fillStyle?: string, amPmMsg?: string): void {
            if (!fillStyle) {
                fillStyle = '#fefefe';
            }

            var ctx = this.context;
            var radius = this.radius;

            ctx.font = radius * 0.15 + "px arial black";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = fillStyle;

            var startingHour: number = 0;
            var terminalHour: number = 12;

            if (is24HourClock) {
                if (hour >= 12) {
                    startingHour = 12;
                    terminalHour = 24;
                }
            }
            else {
                // Render AM/PM for 12 hours clock
                if (!amPmMsg) {
                    amPmMsg = hour < 12 ? 'AM' : 'PM';
                }
                
                this.renderTextOnRadial(3, amPmMsg);
            }

            // Render all 12 hour numbers on the dial
            for (hour = startingHour; hour < terminalHour; hour++) {
                this.renderTextOnRadial((hour == 0 && !is24HourClock ? 12 : hour));
            }
        }

        /** ----------------------------------------------------------------- */
        hourArc: number = Math.PI / 6; // 2 PI / 12
        minutePerHourArc: number =  Math.PI / (6 * 60);
        secondPerHourArc: number = Math.PI / (6 * 60 * 60);

        minuteArc: number = Math.PI / 30; // 2 PI / 60
        secondPerMinuteArc: number =  Math.PI / (30 * 60);

        secondArc: number = Math.PI / 30; // minute and second both have 60 parts in an hour
        millisPerSecondArc: number = Math.PI / (30 * 1000);

        public renderHandsOnDial(hour: number, minute: number, second: number, millis?: number, ignoreMinute?: boolean, ignoreSecond?: boolean): void {
            var ctx = this.context;
            var radius = this.radius;

            //hour
            hour = hour % 12;
            // Arc for each hour: 2 PI / 12 or PI/6; arc for each minute: 60th of an hour; ...
            hour = (hour * this.hourArc) +
                (minute * this.minutePerHourArc) +
                (second * this.secondPerHourArc);

            ctx.fillStyle = "blue";
            this.renderHand(ctx, hour, radius * 0.5, radius * 0.07);
            ctx.strokeStyle = '#33dd33';
            ctx.stroke();

            //minute
            if (!ignoreMinute) {
                minute = (minute * this.minuteArc) + 
                    (second * this.secondPerMinuteArc);
                this.renderHand(ctx, minute, radius * 0.8, radius * 0.07);
                ctx.strokeStyle = '#cc3333';
                ctx.stroke();

                // second
                if (!ignoreSecond) {
                    ctx.fillStyle = "teal";
                    second = (second * this.secondArc) +
                        (millis * this.millisPerSecondArc);
                    this.renderHand(ctx, second, radius * 0.9, radius * 0.02);
                    ctx.strokeStyle = '#dd3333';
                    ctx.stroke();
                }
            }
        }

        /** ----------------------------------------------------------------- */
        private renderHand(ctx: CanvasRenderingContext2D, pos: number, length: number, width: number): void {

            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.moveTo(0, 0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
        }

        /** ----------------------------------------------------------------- */
        private drawCircle(canvasCtx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, startArc: number, endArc: number, counterClockwise: boolean, fillStyle: string) {
            canvasCtx.beginPath();
            canvasCtx.arc(centerX, centerY, radius, startArc, endArc, counterClockwise);

            if (fillStyle) {
                canvasCtx.fillStyle = fillStyle;
            }

            canvasCtx.fill();
        }

        /** -----------------------------------------------------------------
         * Renders the specified hour (or message) at the hour position
         */
        public renderTextOnRadial(hour: number, msg?: string, fillStyle?: string) {
            if (!fillStyle) {
                fillStyle = '#ffffff';
            }

            var ctx = this.context;
            var msgDistance = this.radius * 0.50;

            if (!msg) {
                msg = hour.toString();
                msgDistance = this.radius * 0.85;
            }

            // Rotate the canvas to an angle where the hour number is to be written
            // Hour locations angles in a single quadrant = {0, PI/6, PI/3, PI/2}  => angle = n * PI/6
            var angleForHour = hour * Math.PI / 6;
            ctx.rotate(angleForHour);

            // Get to the location of the number, and
            ctx.translate(0, -msgDistance);

            // Re-orient for typing the number straight (counter clockwise) and rotate back
            ctx.rotate(-angleForHour);
            ctx.fillStyle = fillStyle;
            ctx.fillText(msg, 0, 0);
            ctx.rotate(angleForHour);

            // Get back to starting location (circle center) and fix canvas rotation to original orientation
            ctx.translate(0, msgDistance);
            ctx.rotate(-angleForHour);
        }
    }
}
