# svelte-refresh-indicator

```js
import Indicator from 'svelte-refresh-indicator'

const indicator = new Indicator({ target: somewhereOverTheDOMRainbow })

indicator.set({ progressRatio: undefined }) // regular animated spinner
indicator.set({ progressRatio: 0.5 }) // manually controller progress indicator
```
