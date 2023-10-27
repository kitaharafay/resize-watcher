export function useDebounceFn<K extends any[]>(fn: (...args: K) => void, duration: number) {
  let timer: number | null = null
  return function (...args: K) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => fn(...args), duration)
  }
}
