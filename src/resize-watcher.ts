import { useDebounceFn } from './util'

export type ThresholdOptions = {
  range: [number, number]
  handler: (res?: DOMRectReadOnly) => void
}

export type ResizeWatcherOptions = {
  mode?: 'simple' | 'threshold'
  immediate?: boolean
  duration?: number
  handler?: (res?: DOMRectReadOnly) => void
  threshold?: ThresholdOptions[]
}

const defaultResizeWatcherOptions: ResizeWatcherOptions = {
  immediate: false,
  duration: 300,
  handler: undefined,
  mode: 'simple',
  threshold: []
}

const elMap = new WeakMap<HTMLElement, ResizeObserver>()

const R = ResizeObserver

export class Watcher {
  private el: HTMLElement
  private options: ResizeWatcherOptions
  constructor(el: HTMLElement, options?: ResizeWatcherOptions) {
    this.el = el

    const _options = { ...defaultResizeWatcherOptions, ...options }

    this.options = _options
  }
  static create(el: HTMLElement, options?: ResizeWatcherOptions) {
    return new Watcher(el, options)
  }

  mount() {
    let firstTrigger = true
    const { options, el } = this
    const { immediate, duration, handler, mode, threshold } = options

    let debounceFn: ((res?: DOMRectReadOnly | undefined) => void) | undefined
    if (duration && duration > 0) {
      debounceFn = handler && useDebounceFn(handler, duration!)
    } else {
      debounceFn = handler
    }

    let _threshold: ThresholdOptions[] | undefined
    if (mode === 'threshold') {
      _threshold = threshold?.map((item) => {
        const min = Math.min(item.range[0], item.range[1])
        const max = Math.max(item.range[0], item.range[1])
        const _handler = item.handler && useDebounceFn(item.handler, duration!)
        return {
          range: [min, max],
          handler: _handler
        }
      })
    }
    const resizeObserver = new R((entries) => {
      entries.forEach((item) => {
        if (immediate && firstTrigger) {
          if (mode === 'simple') {
            handler && handler(item.contentRect)
          } else {
            handleThreshold(threshold, item.contentRect)
          }
        }
        if (!firstTrigger) {
          if (mode === 'simple') {
            debounceFn?.(item.contentRect)
          } else {
            handleThreshold(_threshold, item.contentRect)
          }
        } else {
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

function handleThreshold(threshold: ThresholdOptions[] | undefined, rect: DOMRectReadOnly) {
  threshold?.forEach((thr) => {
    const { range, handler } = thr
    const { width } = rect

    if (range[0] <= width && width <= range[1]) {
      handler && handler(rect)
    }
  })
}
