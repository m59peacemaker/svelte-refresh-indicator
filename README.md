# svelte-refresh-indicator

Material design refresh indicator.

[View the demo.](https://m59peacemaker.github.io/svelte-refresh-indicator/)

![svelte-refresh-indicator](https://raw.githubusercontent.com/m59peacemaker/svelte-refresh-indicator/master/refresh-indicator.gif "svelte-refresh-indicator")

## install

```sh
$ npm install svelte-refresh-indicator
```

## example

```js
import RefreshIndicator from 'svelte-refresh-indicator'

const indicator = new RefreshIndicator({ target: somewhereOverTheDOMRainbow })

indicator.set({ progressRatio: undefined }) // regular animated spinner
indicator.set({ progressRatio: 0.5 }) // manually controller progress indicator

indicator.set({ size: 1000 }) // absurdly large indicator
// I did test it at this size and it is indeed sweet and ridiculous.
```
