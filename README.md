# svelte-refresh-indicator

Material design refresh indicator.

[View the demo.](https://m59peacemaker.github.io/svelte-refresh-indicator/)

![svelte-refresh-indicator](https://raw.githubusercontent.com/m59peacemaker/svelte-refresh-indicator/master/indicator.gif "svelte-refresh-indicator")

```js
import Indicator from 'svelte-refresh-indicator'

const indicator = new Indicator({ target: somewhereOverTheDOMRainbow })

indicator.set({ progressRatio: undefined }) // regular animated spinner
indicator.set({ progressRatio: 0.5 }) // manually controller progress indicator
```
