export type ThresholdOptions = {
    range: [number, number];
    handler: (res?: DOMRectReadOnly) => void;
};
export type ResizeWatcherOptions = {
    mode?: 'simple' | 'threshold';
    immediate?: boolean;
    duration?: number;
    handler?: (res?: DOMRectReadOnly) => void;
    threshold?: ThresholdOptions[];
};
export declare class Watcher {
    private el;
    private options;
    constructor(el: HTMLElement, options?: ResizeWatcherOptions);
    static create(el: HTMLElement, options?: ResizeWatcherOptions): Watcher;
    mount(): void;
    unmount(): void;
}
