export type ResizeWatcherOptions = {
    immediate?: boolean;
    duration?: number;
    handler?: (res?: DOMRectReadOnly) => void;
};
export declare class Watcher {
    private el;
    private options;
    constructor(el: HTMLElement, options?: ResizeWatcherOptions);
    static create(el: HTMLElement, options?: ResizeWatcherOptions): Watcher;
    mount(): void;
    unmount(): void;
}
