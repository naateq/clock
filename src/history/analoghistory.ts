/// <reference path="../../Script/typings/clock/history.d.ts" />

namespace renderer {

    export function createSimpleHistoryView(ctor: HistoryViewConstructor, contentsEl: HTMLElement): HistoryView {
        return new ctor(contentsEl);
    }
    
    export class SimpleHistoryView implements HistoryView {

        contents: HTMLElement;
        textAnimationStyle: string;

        public constructor(contentsEl: HTMLElement) {
            this.contents = contentsEl;
            this.contents.setAttribute('display', 'table');
            this.textAnimationStyle = "animation-name: highlightfade;animation-duration: 3s; -webkit-animation-name: highlightfade; -webkit-animation-duration: 3s;";
        }

        public render(historyEvent: HistoryEvent) {
            console.log(historyEvent.msg);
            this.contents.innerHTML = this.formatHistoryEvent(historyEvent) + this.contents.innerHTML;
        }

        public formatHistoryEvent(historyEvent: HistoryEvent) {
            var str: string =
                '<span style="font-size:150%">' + historyEvent.view.yearText + '</span> ' +
                historyEvent.msg;
            
            //str = `<div class="arow historymsg"  style="${this.textAnimationStyle}"}><div class="acell"><span>` + str + '</span></div></div>\n';
            str = `<div class="arow historymsg"><div class="acell"><span>${str}</span></div></div>\n`;

            return str;
        }
    }
}