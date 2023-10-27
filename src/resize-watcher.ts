import { useDebounceFn } from './util'
import ResizeObserverPolyfill from 'resize-observer-polyfill'

export type ResizeWatcherOptions = {
  immediate?: boolean
  duration?: number
  handler?: (res?: DOMRectReadOnly) => void
}

const defaultResizeWatcherOptions: ResizeWatcherOptions = {
  immediate: false,
  duration: 300,
  handler: undefined
}

const elMap = new WeakMap<HTMLElement, ResizeObserver>()

const R = ResizeObserver ?? ResizeObserverPolyfill

class ResizeWatcher {
  private el: HTMLElement
  private options: ResizeWatcherOptions
  constructor(el: HTMLElement, options?: ResizeWatcherOptions) {
    this.el = el

    const _options = { ...defaultResizeWatcherOptions, ...options }

    this.options = _options
  }
  static create(el: HTMLElement, options: ResizeWatcherOptions) {
    return new ResizeWatcher(el, options)
  }
  mount() {
    let firstTrigger = true
    const { options, el } = this
    const { immediate, duration, handler } = options
    const debounceFn = handler && useDebounceFn(handler, duration!)
    const resizeObserver = new R((entries) => {
      entries.forEach((item) => {
        if (immediate && firstTrigger) {
          handler && handler(item.contentRect)
        }
        if (!firstTrigger) {
          debounceFn?.(item.contentRect)
        }
        if (!immediate && firstTrigger) {
          firstTrigger = false
        }
      })
    })
    resizeObserver.observe(el)
    elMap.set(el, resizeObserver)
  }
  unmount() {
    const { el } = this
    const resizeObserver = elMap.get(el)
    resizeObserver?.unobserve(el)
    elMap.delete(el)
  }
}

export { ResizeWatcher }
