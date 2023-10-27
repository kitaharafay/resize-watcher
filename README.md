# [Resize-Watcher](https://github.com/kitaharafay/resize-watcher.git)

## Getting Started

### Package manager

Using npm:

```sh
npm install resize-watcher
```

Once the package is installed, you can import the library using `import` approach:

```javascript
import { Watcher } from 'resize-watcher'
```

## Example

```javascript
import { Watcher } from 'resize-watcher'
// DOM
const targetEl = document.getElementById('box')

// create instance
const watcher = Watcher.create(targetEl)

// start watch
watcher.mount()

// end watch
watcher.unmount()
```

## API

Watcher(el[, options])

Watcher.create(el[, options])

## Options

```typescript
type ResizeWatcherOptions = {
    // default: false
    immediate?: boolean;

    // default: 300ms
    duration?: number;

    // default: undefined
    handler?: (res?: DOMRectReadOnly) => void;
};
```
