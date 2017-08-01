const Indicator = require('./src/Indicator.html')

const makeIndicator = () => {
  const div = document.createElement('div')
  div.style.margin = '30px 50px'
  div.style.display = 'inline-block'
  document.body.appendChild(div)
  return new Indicator({ target: div })
}

const demoStep = (indicator, ratio, resetFn) => {
  if (ratio > 1.4) { return resetFn() }
  window.requestAnimationFrame(() => {
    indicator.set({ progressRatio: ratio + 0.01 })
    demoStep(indicator, ratio + 0.01, resetFn)
  })
}

{
  const indicator = makeIndicator()
  const resetFn = () => setTimeout(() => demoStep(indicator, 0, resetFn), 1000)
  demoStep(indicator, 0, resetFn)
}

makeIndicator()

{
  const indicator = makeIndicator()
  const resetFn = () => {
    setTimeout(() => indicator.set({ progressRatio: undefined }), 100)
    setTimeout(() => demoStep(indicator, 0, resetFn), 2500)
  }
  demoStep(indicator, 0, resetFn)
}
