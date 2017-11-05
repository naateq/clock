/// <reference path="clock.d.ts" />

/** Used by viewer by not to be provided by the history files */
interface HistoryEventView {
    /** Has the event been already rendered. */
    rendered: boolean;
    /** The event year in a string format */
    yearText: string;
}

/** An event in history that can be displayed by the history runner (viewer) */
interface HistoryEvent {
    /** Should this event be rendered or skipped. */
    render: boolean;
    /** The event year */
    year: number|string;
    /** A couple of words to show the events as bullets */
    msg: string;
    /** The clock time compression factor - how fast or slow the clock second be moved */
    speed?: number;
    /** The history event detailed page */
    url?: string;
    /** If only an image is sufficient and no detailed page is provided in the url */
    img?: string;

    view?: HistoryEventView;
}

interface HistoryViewConstructor {
    new (contentsEl: HTMLElement): HistoryView;
}

interface HistoryView {
    contents: HTMLElement;
    textAnimationStyle: string;
    render: (historyEvent: HistoryEvent) => void;
    formatHistoryEvent: (he: HistoryEvent) => string;
}

interface History {
    /** The name that should/could-be the same as the filename */
    title: string;
    /** The clock start time */
    begins: string;
    /** The clock end time */
    ends: string;
    /** The default clock run speed - n={1-24*3600} per second aka time compression factor */
    speed?: number;

    /** The list of history events */
    eventList: HistoryEvent[];
}

interface Histories {
    [name:string]: History;
}

/** An array of HistoryEvent object that is provided by external historians in .js files */
declare var hist: HistoryEvent[];
declare var histories: Histories;

interface HistoryRunner extends Runner {
    renderer: HistoryView;
    hist: History;
    currEventIdx: number;
    historyView: (contentsEl: HTMLElement, historyObj: History) => void;
}

declare var historyRunner: HistoryRunner;
